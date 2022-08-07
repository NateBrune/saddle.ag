import { BigNumber } from 'ethers';
import { Sync, Trigger } from 'ether-state';
import { IERC20, IyVault } from '$lib/state/contracts';
import { NETWORKS } from '$lib/config';
import { networkProviders, walletAddress } from '$lib/stores/provider';
import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import vaults from '$lib/state/vaults';


export const vaultFraxBPBal = writable<BigNumber>(BigNumber.from(0))
export const fraxBPAssets = writable<BigNumber>(BigNumber.from(0))
export const fraxBPPPS = writable<BigNumber>(BigNumber.from(0))
export const activeSync = writable<Sync>(undefined)


type writeableVaults = { id: string, vaultBal: BigNumber, vaultPPS: Writable<BigNumber>, vaultTvl: Writable<BigNumber>, sync: Writable<Sync> }
export var syncMatrix: Writable<writeableVaults[]>


walletAddress.subscribe( addy => {
  vaults.forEach(vault => {
    let v: undefined | writeableVaults
    let bal: Writable<BigNumber>
    let pps: Writable<BigNumber>
    let tvl: Writable<BigNumber>

    if(get(syncMatrix) !== undefined){
      v = get(syncMatrix).find(curVault => {
        return curVault.id === vault.vault
      })
    }
    if (v !== undefined) {
      //bal = v.vaultBal
      //pps = v.vaultPPS
      //tvl = v.vaultTvl
      console.log('v !== undefined')
    } else {
      let bal = BigNumber.from(1000)
      let pps = writable<BigNumber>(BigNumber.from(0))
      let tvl = writable<BigNumber>(BigNumber.from(0))
      //syncMatrix.push(v)

      // Mainnet Syncs
      let setVaultBal = {
        trigger: Trigger.BLOCK,
        input: () => ['0x986b4AFF588a109c09B50A03f42E4110E29D353F'],
        output: (value: [BigNumber]) => value ?  bal = value[0]: null,
        call: {
          target: () => vault.vault,
          interface: IERC20,
          selector: 'balanceOf'
        }
      }

      console.log("creating new sync")
      let newSync = new Sync([
        setVaultBal,
        //setVaultPPS,
        //setVaultTvl
        ], networkProviders[String(NETWORKS[0].chainId)])
      let writeableSync = writable<Sync>(newSync)
      let newVault: writeableVaults = {
        id: vault.vault,
        vaultBal: bal,
        vaultPPS: pps,
        vaultTvl: tvl,
        sync: writeableSync
      }
      if(get(syncMatrix) !== undefined){
        syncMatrix.update( val => [...val, newVault])
      } else {
        syncMatrix = writable<writeableVaults[]>([newVault])
      }
    }

    /*
    let setVaultPPS = {
      trigger: Trigger.BLOCK,
      input: () => [],
      output: (value: [BigNumber]) => value ?  v.vaultPPS.set(value[0]) : null,
      call: {
        target: () => vault.vault,
        interface: IyVault,
        selector: 'pricePerShare'
      }
    }

    let setVaultTvl = {
      trigger: Trigger.BLOCK,
      input: () => [],
      output: (value: [BigNumber]) => value ?  (value) => {
        console.log("TVL")
        let aum = value[0].mul(get(v.vaultPPS))
        console.log("tvl: ")
        console.log(aum.toString())
        v.vaultTvl.set(aum)
      }: null,
      call: {
        target: () => vault.vault,
        interface: IyVault,
        selector: 'totalAssets'
      }
    }
    */
  });
})


  




  // vault_boost()  {
  //   return (this.agg_vecrv / this.vault_supply) * (this.crv_price / this.yvecrv_price)
  // },