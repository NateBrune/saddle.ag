export const ssr = false;
import type { BigNumber } from 'ethers';
import { Sync, Trigger } from 'ether-state';
import { IERC20, IMulticall, IveSaddleVault, IretroactiveVesting, IveSDL } from '$lib/state/contracts';
import { sdlBalanceOnBlock, vaultBalance, claimableRewards, vestedRewards, vaultRewards, vaultTotalSupply, aggVeSDL, totalVeSDL, vaultAllowance } from "$lib/stores/state";
import { NETWORKS } from '$lib/config';
import { networkProviders, walletAddress } from '$lib/stores/provider';

walletAddress.subscribe( addy => {
  console.log("syncing blockchain...")
  console.log(`user address: ${addy}`)
  // Mainnet Syncs
  let sdlBalance = {
    trigger: Trigger.BLOCK,
    input: () => [addy],
    output: (value: [BigNumber]) => value ?  sdlBalanceOnBlock.set(value[0]) : null,
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

  let vaultBal = {
    trigger: Trigger.BLOCK,
    input: () => [addy],
    output: (value: [BigNumber]) => vaultBalance.set(value[0]),
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
  // vault stats
  let vaultClaimable = {
    trigger: Trigger.BLOCK,
    input: () => [NETWORKS[0].vault],
    output: (value: [BigNumber]) => vaultRewards.set(value[0]),
    call: {
      target: () => NETWORKS[0].slp,
      interface: IERC20,
      selector: 'balanceOf'
    }
  }

  let setVaultTotalSupply = {
    trigger: Trigger.BLOCK,
    input: () => [],
    output: (value: [BigNumber]) => vaultTotalSupply.set(value[0]),
    call: {
      target: () => NETWORKS[0].vault,
      interface: IERC20,
      selector: 'totalSupply'
    }
  }

  let setAggveSDL = {
    trigger: Trigger.BLOCK,
    input: () => [NETWORKS[0].vault],
    output: (value: [BigNumber]) => aggVeSDL.set(value[0]),
    call: {
      target: () => NETWORKS[0].veSDL,
      interface: IERC20,
      selector: 'balanceOf'
    }
  }

  let setTotalveSDL = {
    trigger: Trigger.BLOCK,
    input: () => [],
    output: (value: [BigNumber]) => totalVeSDL.set(value[0]),
    call: {
      target: () => NETWORKS[0].veSDL,
      interface: IERC20,
      selector: 'totalSupply'
    }
  }

  let setVaultAllowance = {
    trigger: Trigger.BLOCK,
    input: () => [addy, NETWORKS[0].vault],
    output: (value: [BigNumber]) => vaultAllowance.set(value[0]),
    call: {
      target: () => NETWORKS[0].sdlAddress,
      interface: IERC20,
      selector: 'allowance'
    }
  }
  

  new Sync([
    sdlBalance,
    vestedBalance,
    //saddle guages claimable sdl
    vaultBal,
    gaugeClaimable,

    // vault stats
    vaultClaimable,
    setVaultTotalSupply,
    setAggveSDL,
    setTotalveSDL,

    // random
    setVaultAllowance
    
  ], networkProviders[String(NETWORKS[0].chainId)])
})

