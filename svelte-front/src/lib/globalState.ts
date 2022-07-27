export const ssr = false;
import type { BigNumber } from 'ethers';
import { Sync, Trigger } from 'ether-state';
import { IERC20, IMulticall, IveSaddleVault, IretroactiveVesting } from '$lib/state/contracts';
import { sdlBalanceOnBlock, veBalanceOnBlock, claimableRewards, vestedRewards } from "$lib/stores/state";
import { NETWORKS } from '$lib/config';
import { networkProviders, walletAddress } from '$lib/stores/provider';

walletAddress.subscribe( addy => {
  // Mainnet Syncs
  let sdlBalance = {
    trigger: Trigger.BLOCK,
    input: () => [addy],
    output: (value: [BigNumber]) => sdlBalanceOnBlock.set(value[0]),
    call: {
      target: () => NETWORKS[0].sdlAddress,
      interface: IERC20,
      selector: 'balanceOf'
    }
  }

  let vestedBalance = {
    trigger: Trigger.BLOCK,
    input: () => [addy],
    output: (value: [Boolean, BigNumber, BigNumber]) => vestedRewards.set(value[1].sub(value[2])),
    call: {
      target: () => NETWORKS[0].retroVesting,
      interface: IretroactiveVesting,
      selector: 'vestings'
    }
  }

  let veBalance = {
    trigger: Trigger.BLOCK,
    input: () => [addy],
    output: (value: [BigNumber]) => veBalanceOnBlock.set(value[0]),
    call: {
      target: () => NETWORKS[0].vault,
      interface: IERC20,
      selector: 'balanceOf'
    }
  }

  let gaugeClaimable = {
    trigger: Trigger.BLOCK,
    input: () => [addy],
    output: (value: [BigNumber]) => claimableRewards.set(value[0]),
    call: {
      target: () => NETWORKS[0].vault,
      interface: IveSaddleVault,
      selector: 'claimable'
    }
  }

  new Sync([
    sdlBalance,
    veBalance,
    gaugeClaimable,
    vestedBalance
  ], networkProviders[String(NETWORKS[0].chainId)])
})

