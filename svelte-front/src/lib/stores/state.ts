export const ssr = false;
import { BigNumber } from "ethers";
import { writable } from "svelte/store";
import '$lib/globalState';

export const sdlBalanceOnBlock = writable<BigNumber>(BigNumber.from(0));
export const vestedRewards = writable<BigNumber>(BigNumber.from(0));
export const veBalanceOnBlock = writable<BigNumber>(BigNumber.from(0));
export const claimableRewards = writable<BigNumber>(BigNumber.from(0));
