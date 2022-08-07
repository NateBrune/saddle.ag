export const ssr = false;
//import type {  } from 'ethers';
import { BigNumber } from 'ethers';
import { Sync, Trigger } from 'ether-state';
import { IERC20, IMulticall, IveSaddleVault, IretroactiveVesting, IveSDL, IfeeDistributor } from '$lib/state/contracts';
// import { sdlBalanceOnBlock, vaultBalance, 
//   claimableRewards, vestedRewards, 
//   vaultRewards, vaultTotalSupply, 
//   aggVeSDL, totalVeSDL, 
//   veApr, agBoost,
//   vaultApr, vaultAllowance,
//   sdlPrice } from "$lib/stores/state";
import { NETWORKS } from '$lib/config';
import { networkProviders, walletAddress } from '$lib/stores/provider';
import { get, writable } from 'svelte/store';

export const sdlBalanceOnBlock = writable<BigNumber>(BigNumber.from(0));
export const vestedRewards = writable<BigNumber>(BigNumber.from(0));
export const vaultBalance = writable<BigNumber>(BigNumber.from(0));
export const claimableRewards = writable<BigNumber>(BigNumber.from(0));

// vault stats
export const vaultRewards = writable<BigNumber>(BigNumber.from(0));
export const vaultTotalSupply = writable<BigNumber>(BigNumber.from(0));
export const aggVeSDL = writable<BigNumber>(BigNumber.from(0));
export const totalVeSDL = writable<BigNumber>(BigNumber.from(0));
export const veApr = writable<number>(0);
export const vaultApr = writable<number>(0);
export const vaultAllowance = writable<BigNumber>(BigNumber.from(0));

export const approvedVault = writable<Boolean>(false);
export const sdlPrice = writable<number>(1.54);
export const agveSdlPrice = writable<number>(2.3);
export const agBoost = writable<number>(1);

export const activeSync = writable<Sync>(null);



aggVeSDL.subscribe( veSdl => {
  let vested = parseInt(veSdl.toString())
  let supply = parseInt(get(vaultTotalSupply).toString())
  let boost = vested/supply
  agBoost.set(boost) // * (this.crv_price / this.yvecrv_price) // TODO calculate price into boost
  vaultApr.set(boost*get(veApr))
})


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
    input: () => [NETWORKS[0].proxy],
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
  let week = 7 * 86400
  //let epoch = 
  let setVeApr = {
    trigger: Trigger.BLOCK,
    input: () => [Math.floor(Date.now() / 1000 / week) * week - week], // epochs 
    output: (value: [BigNumber]) => {
      //const week = 7 * 86400
      //const epoch = Math.floor(Date.now() / 1000 / week) * week - week
      const tokens_per_week = parseInt(value[0].toString()) / 1e18
      const totalvested = parseInt(get(totalVeSDL).toString()) / 1e18
      const virtual_price = 1.021810
      //const apr = 1//tokens_per_week.mul(virtual_price).mul(52).div( get(totalVeSDL).mul(get(sdlPrice)) )
      //let one = value[0].sub(value[0]).add(1)
      let apr = (tokens_per_week * virtual_price * 52) / ( totalvested * get(sdlPrice))
      veApr.set(apr)
    },
    call: {
      target: () => NETWORKS[0].feeDistributor,
      interface: IfeeDistributor,
      selector: 'tokens_per_week'
    }
  }

    // copied vault apy
  // vault_apy() {
  //   const week = 7 * 86400
  //   const epoch = Math.floor(Date.now() / 1000 / week) * week - week
  //   const tokens_per_week = this.call('CurveRewardDistribution', 'tokens_per_week', [epoch]) / 1e18
  //   const virtual_price = this.call('3CRV', 'get_virtual_price', []) / 1e18
  //   return (tokens_per_week * virtual_price * 52) / (this.total_vesdl / 1e18 * this.crv_price)
  // }



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
  


  if(get(activeSync) !== null ){
    let _sync = get(activeSync)
    _sync.destroy()
  }
  let sync = new Sync([
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
    setVeApr,

    // random
    setVaultAllowance
    
  ], networkProviders[String(NETWORKS[0].chainId)])
  activeSync.set(sync)
})

  // vault_boost()  {
  //   return (this.agg_vecrv / this.vault_supply) * (this.crv_price / this.yvecrv_price)
  // },