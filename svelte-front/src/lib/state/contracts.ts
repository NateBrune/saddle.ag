import { Interface } from 'ethers/lib/utils';
import multicallABI from '$lib/abis/Multicall2.json';
import ERC20ABI from '$lib/abis/IERC20.json';
import veSaddleVault from '$lib/abis/IveSaddleVault.json';
import yVault from '$lib/abis/IyVault.json';
import retroactiveVesting from '$lib/abis/retroactiveVesting.json';
import veSDL from '$lib/abis/veSDL.json';
import feeDistributor from '$lib/abis/feeDistributor.json';
import gauge from '$lib/abis/Igauge.json';

export { multicallABI, ERC20ABI }

export const IMulticall = new Interface(multicallABI);
export const IERC20 = new Interface(ERC20ABI);
export const IveSaddleVault = new Interface(veSaddleVault);
export const IretroactiveVesting = new Interface(retroactiveVesting);
export const IveSDL = new Interface(veSDL);
export const IfeeDistributor = new Interface(feeDistributor);
export const IyVault = new Interface(yVault);
export const Igauge = new Interface(gauge);

