// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.12;
//pragma experimental ABIEncoderV2;

// These are the core Yearn libraries
import {
    BaseStrategy,
    StrategyParams
} from "@yearnvaults/contracts/BaseStrategy.sol";
import {
    SafeERC20,
    IERC20,
    Address
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Part: IERC20Metadata

interface IERC20Metadata {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}

// Part: IVoterProxy

interface IVoterProxy {
    function proxy() external returns (address);
    function balanceOf(address _gauge) external view returns (uint256);
    function deposit(address _gauge, address _token) external;
    function withdraw(
        address _gauge,
        address _token,
        uint256 _amount
    ) external returns (uint256);
    function withdrawAll(address _gauge, address _token) external returns (uint256);
    function harvest(address _gauge) external;
    function lock() external;
    function approveStrategy(address) external;
    function revokeStrategy(address) external;
    function claimRewards(address _gauge, address _token) external;
}

// Part: Math

/**
 * @dev Standard math utilities missing in the Solidity language.
 */
library Math {
    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow, so we distribute
        return (a / 2) + (b / 2) + ((a % 2 + b % 2) / 2);
    }
}


// Part: CurveVoterProxy

abstract contract SaddleVoterProxy is BaseStrategy {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    address public constant voter = address(0xF147b8125d2ef93FB6965Db97D6746952a133934);

    address public constant sdl = address(0xf1Dc500FdE233A4055e25e5BbF516372BC4F6871);
    address public constant frax = address(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    address public constant usdc = address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    address public constant usdt = address(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    address public constant weth = address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
    address public constant wbtc = address(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);

    address public constant uniswap = address(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    address public constant sushiswap = address(0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F);

    uint256 public constant DENOMINATOR = 10000;

    address public proxy;
    address public dex;
    address public saddle;
    address public gauge;
    uint256 public keepSDL;

    constructor(address _vault) BaseStrategy(_vault) {
        minReportDelay = 6 hours;
        maxReportDelay = 2 days;
        profitFactor = 1000;
        debtThreshold = 1e24;
        proxy = address(0x9a165622a744C20E3B2CB443AeD98110a33a231b); // strategyProxy
    }

    function setProxy(address _proxy) external onlyGovernance {
        proxy = _proxy;
    }

    function setKeepSDL(uint256 _keepSDL) external onlyAuthorized {
        keepSDL = _keepSDL;
    }

    function switchDex(bool isUniswap) external onlyAuthorized {
        if (isUniswap) dex = uniswap;
        else dex = sushiswap;
    }

    function name() external view override returns (string memory) {
        return string(abi.encodePacked("Curve", IERC20Metadata(address(want)).symbol(), "VoterProxy"));
    }

    function balanceOfWant() public view returns (uint256) {
        return want.balanceOf(address(this));
    }

    function balanceOfPool() public view returns (uint256) {
        return IVoterProxy(proxy).balanceOf(gauge);
    }

    function estimatedTotalAssets() public view override returns (uint256) {
        return balanceOfWant().add(balanceOfPool());
    }

    function adjustPosition(uint256 _debtOutstanding) internal override {
        uint256 _want = want.balanceOf(address(this));
        if (_want > 0) {
            want.safeTransfer(proxy, _want);
            IVoterProxy(proxy).deposit(gauge, address(want));
        }
    }

    function _withdrawSome(uint256 _amount) internal returns (uint256) {
        _amount = Math.min(_amount, balanceOfPool());
        return IVoterProxy(proxy).withdraw(gauge, address(want), _amount);
    }

    function liquidatePosition(uint256 _amountNeeded)
        internal
        override
        returns (uint256 _liquidatedAmount, uint256 _loss)
    {
        uint256 _balance = want.balanceOf(address(this));
        if (_balance < _amountNeeded) {
            _liquidatedAmount = _withdrawSome(_amountNeeded.sub(_balance));
            _liquidatedAmount = _liquidatedAmount.add(_balance);
            _loss = _amountNeeded.sub(_liquidatedAmount); // this should be 0. o/w there must be an error
        }
        else {
            _liquidatedAmount = _amountNeeded;
        }
    }
    function liquidateAllPositions() internal override virtual returns (uint256 _amountFreed){
        require(false, "unimplemented");
        return 0;
    }

    function prepareMigration(address _newStrategy) internal override {
        IVoterProxy(proxy).withdrawAll(gauge, address(want));
    }

    function _adjustSDL(uint256 _sdl) internal returns (uint256) {
        uint256 _keepSDL = _sdl.mul(keepSDL).div(DENOMINATOR);
        IERC20(sdl).safeTransfer(voter, _keepSDL);
        return _sdl.sub(_keepSDL);
    }
    function ethToWant(uint256 _amtInWei) public override view virtual returns (uint256){
        return _amtInWei;
    }
}