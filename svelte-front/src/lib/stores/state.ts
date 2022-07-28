export const ssr = false;
//import { BigNumber } from "ethers";
import { writable } from "svelte/store";
import '$lib/globalState';

import { BigNumber, ethers } from 'ethers';
import { networkProviders, walletAddress } from '$lib/stores/provider';
import { NETWORKS } from '$lib/config';

export const sdlBalanceOnBlock = writable<BigNumber>(BigNumber.from(0));
export const vestedRewards = writable<BigNumber>(BigNumber.from(0));
export const vaultBalance = writable<BigNumber>(BigNumber.from(0));
export const claimableRewards = writable<BigNumber>(BigNumber.from(0));

// vault stats
export const vaultRewards = writable<BigNumber>(BigNumber.from(0));
export const vaultTotalSupply = writable<BigNumber>(BigNumber.from(0));
export const aggVeSDL = writable<BigNumber>(BigNumber.from(0));
export const totalVeSDL = writable<BigNumber>(BigNumber.from(0));
export const vaultAllowance = writable<BigNumber>(BigNumber.from(0));

export const approvedVault = writable<Boolean>(false);