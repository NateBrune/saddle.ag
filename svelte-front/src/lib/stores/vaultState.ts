import { BigNumber } from 'ethers';
import { Sync, Trigger } from 'ether-state';
import { IERC20, IyVault } from '$lib/state/contracts';
import { NETWORKS } from '$lib/config';
import { networkProviders, walletAddress } from '$lib/stores/provider';
import { get, writable } from 'svelte/store';

export const vaultFraxBPBal = writable<BigNumber>(BigNumber.from(0));
export const fraxBPAssets = writable<BigNumber>(BigNumber.from(0));
export const fraxBPPPS = writable<BigNumber>(BigNumber.from(0));
export const activeSync = writable<Sync>(null);

walletAddress.subscribe( addy => {
  // Mainnet Syncs
  let setFraxBPBal = {
    trigger: Trigger.BLOCK,
    input: () => [addy],
    output: (value: [BigNumber]) => value ?  vaultFraxBPBal.set(value[0]) : null,
    call: {
      target: () => NETWORKS[0].fraxBP,
      interface: IERC20,
      selector: 'balanceOf'
    }
  }

  let setFraxBPPPS = {
    trigger: Trigger.BLOCK,
    input: () => [],
    output: (value: [BigNumber]) => value ?  fraxBPPPS.set(value[0]) : null,
    call: {
      target: () => NETWORKS[0].fraxBP,
      interface: IyVault,
      selector: 'pricePerShare'
    }
  }

  let setFraxBPAssets = {
    trigger: Trigger.BLOCK,
    input: () => [],
    output: (value: [BigNumber]) => value ?  (value) => {
      let aum = value[0].mul(get(fraxBPPPS))
      console.log(aum.toString())
      fraxBPAssets.set(aum)
    }: null,
    call: {
      target: () => NETWORKS[0].fraxBP,
      interface: IyVault,
      selector: 'totalAssets'
    }
  }
  
  if(get(activeSync) !== null ){
    let _sync = get(activeSync)
    _sync.destroy()
  }
  let sync = new Sync([
    setFraxBPBal,
    setFraxBPPPS,
    setFraxBPAssets
    ], networkProviders[String(NETWORKS[0].chainId)])
  activeSync.set(sync)
})


  




  // vault_boost()  {
  //   return (this.agg_vecrv / this.vault_supply) * (this.crv_price / this.yvecrv_price)
  // },