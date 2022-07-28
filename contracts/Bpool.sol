// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.12;

import "./SaddleVoterProxy.sol";

// Part: Uni

interface Uni {
    function swapExactTokensForTokens(
        uint256,
        uint256,
        address[] calldata,
        address,
        uint256
    ) external;
}

// Part: ISwap
interface ISwap {
    // pool data view functions
    function getA() external view returns (uint256);

    function getAPrecise() external view returns (uint256);

    //function getAllowlist() external view returns (IAllowlist);
    function getAllowlist() external view returns (address);

    function getToken(uint8 index) external view returns (IERC20);

    function getTokenIndex(address tokenAddress) external view returns (uint8);

    function getTokenBalance(uint8 index) external view returns (uint256);

    function getVirtualPrice() external view returns (uint256);

    function owner() external view returns (address);

    function isGuarded() external view returns (bool);

    function paused() external view returns (bool);

    function swapStorage()
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            address
        );

    // min return calculation functions
    function calculateSwap(
        uint8 tokenIndexFrom,
        uint8 tokenIndexTo,
        uint256 dx
    ) external view returns (uint256);

    function calculateTokenAmount(uint256[] calldata amounts, bool deposit)
        external
        view
        returns (uint256);

    function calculateRemoveLiquidity(uint256 amount)
        external
        view
        returns (uint256[] memory);

    function calculateRemoveLiquidityOneToken(
        uint256 tokenAmount,
        uint8 tokenIndex
    ) external view returns (uint256 availableTokenAmount);

    // state modifying functions
    function initialize(
        IERC20[] memory pooledTokens,
        uint8[] memory decimals,
        string memory lpTokenName,
        string memory lpTokenSymbol,
        uint256 a,
        uint256 fee,
        uint256 adminFee,
        address lpTokenTargetAddress
    ) external;

    function swap(
        uint8 tokenIndexFrom,
        uint8 tokenIndexTo,
        uint256 dx,
        uint256 minDy,
        uint256 deadline
    ) external returns (uint256);

    function addLiquidity(
        uint256[] calldata amounts,
        uint256 minToMint,
        uint256 deadline
    ) external returns (uint256);

    function removeLiquidity(
        uint256 amount,
        uint256[] calldata minAmounts,
        uint256 deadline
    ) external returns (uint256[] memory);

    function removeLiquidityOneToken(
        uint256 tokenAmount,
        uint8 tokenIndex,
        uint256 minAmount,
        uint256 deadline
    ) external returns (uint256);

    function removeLiquidityImbalance(
        uint256[] calldata amounts,
        uint256 maxBurnAmount,
        uint256 deadline
    ) external returns (uint256);
}

// File: 3pool.sol
contract Strategy is SaddleVoterProxy {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    address[] public path;

    constructor(address _vault) SaddleVoterProxy(_vault) {
        dex = sushiswap;
        saddle = address(0x13Cc34Aa8037f722405285AD2C82FE570bfa2bdc);
        gauge = address(0xB2Ac3382dA625eb41Fc803b57743f941a484e2a6); // saddleFraxBP Gauge Deposit
        keepSDL = 1000;

        path = new address[](3);
        path[0] = sdl;
        path[1] = weth;
        _setPath(0);
    }

    function _setPath(uint _id) internal {
        if (_id == 0) path[2] = usdc;
        else path[2] = frax;
    }

    function setPath(uint _id) external onlyAuthorized {
        _setPath(_id);
    }

    function prepareReturn(uint256 _debtOutstanding)
        internal
        override
        returns (
            uint256 _profit,
            uint256 _loss,
            uint256 _debtPayment
        )
    {
        uint before = want.balanceOf(address(this));
        IVoterProxy(proxy).harvest(gauge);
        uint256 _sdl = IERC20(sdl).balanceOf(address(this));
        if (_sdl > 0) {
            _sdl = _adjustSDL(_sdl);

            IERC20(sdl).safeApprove(dex, 0);
            IERC20(sdl).safeApprove(dex, _sdl);

            Uni(dex).swapExactTokensForTokens(_sdl, uint256(0), path, address(this), block.timestamp);
        }

        uint256 _usdc = IERC20(usdc).balanceOf(address(this));
        uint256 _frax = IERC20(frax).balanceOf(address(this));
        if (_usdc > 0 || _frax > 0) {
            _add_liquidity(_usdc, _frax);
        }
        _profit = want.balanceOf(address(this)).sub(before);

        uint _total = estimatedTotalAssets();
        uint _debt = vault.strategies(address(this)).totalDebt;
        if(_total < _debt) {
            _loss = _debt - _total;
            _profit = 0;
        }

        if (_debtOutstanding > 0) {
            _withdrawSome(_debtOutstanding);
            _debtPayment = Math.min(_debtOutstanding, balanceOfWant().sub(_profit));
        }
    }

    function _add_liquidity(uint256 _usdc, uint256 _frax) internal {
        if (_usdc > 0) {
            IERC20(usdc).safeApprove(saddle, 0);
            IERC20(usdc).safeApprove(saddle, _usdc);
        }

        if (_frax > 0) {
            IERC20(frax).safeApprove(saddle, 0);
            IERC20(frax).safeApprove(saddle, _frax);
        }

        //uint256[] amounts = [_usdc, _frax];
        uint256[] memory _value = new uint256[](2);
        _value[0] = _usdc;
        _value[2] = _frax;
        ISwap(saddle).addLiquidity(_value, 0, block.timestamp);
    }

    // NOTE: Can override `tendTrigger` and `harvestTrigger` if necessary

    function protectedTokens()
        internal
        view
        override
        returns (address[] memory)
    {
        address[] memory protected = new address[](1);
        protected[0] = sdl;
        return protected;
    }
}