export const ssr = false;
import { BigNumber, ethers } from 'ethers';
import { Sync, Trigger } from 'ether-state';
import { IERC20, Igauge, IyVault } from '$lib/state/contracts';
import { NETWORKS } from '$lib/config';
import { networkProviders, walletAddress, accountProvider, selectedNetworkIndex } from '$lib/stores/provider';
import { get, writable, type Writable } from 'svelte/store';
import vaults from '$lib/state/vaults.json'

export let vaultMatrix: Writable<Vault[]> = writable([])

let balanceOf = function(_input, _output, _target) {
  this.trigger = Trigger.BLOCK,
  this.input = _input,
  this.output = _output,
  this.call = {
    target: _target,
    interface: IERC20,
    selector: 'balanceOf'
  }
}

let allowance = function(_input, _output, _target) {
  this.trigger = Trigger.BLOCK,
  this.input = _input,
  this.output = _output,
  this.call = {
    target: _target,
    interface: IERC20,
    selector: 'allowance'
  }
}

let pricePerShare = function(_input, _output, _target) {
  this.trigger = Trigger.BLOCK,
  this.input = _input,
  this.output = _output,
  this.call = {
    target: _target,
    interface: IyVault,
    selector: 'pricePerShare'
  }
}

let totalAssets = function(_input, _output, _target) {
  this.trigger = Trigger.BLOCK,
  this.input = _input,
  this.output = _output,
  this.call = {
    target: _target,
    interface: IyVault,
    selector: 'totalAssets'
  }
}

let workingBalance = function(_input, _output, _target) {
  this.trigger = Trigger.BLOCK,
  this.input = _input,
  this.output = _output,
  this.call = {
    target: _target,
    interface: Igauge,
    selector: 'working_balances'
  }
}


// let setVaultPPS = {
//   trigger: Trigger.BLOCK,
//   input: () => [],
//   output: (value: [BigNumber]) => value ?  v.vaultPPS.set(value[0]) : null,
//   call: {
//     target: () => vault.vault,
//     interface: IyVault,
//     selector: 'pricePerShare'
//   }
// }

// let setVaultTvl = {
//   trigger: Trigger.BLOCK,
//   input: () => [],
//   output: (value: [BigNumber]) => value ?  (value) => {
//     console.log("TVL")
//     let aum = value[0].mul(get(v.vaultPPS))
//     console.log("tvl: ")
//     console.log(aum.toString())
//     v.vaultTvl.set(aum)
//   }: null,
//   call: {
//     target: () => vault.vault,
//     interface: IyVault,
//     selector: 'totalAssets'
//   }
// }

interface Vault {
  address: string,
  name: string,
  vaultBalance: Writable<BigNumber>,
  poolBalance: Writable<BigNumber>,
  vaultAllowance: Writable<BigNumber>,
  pricePerShare: Writable<BigNumber>,
  totalAssets: Writable<BigNumber>,
  gaugeBalance: Writable<BigNumber>,
  gaugeWorkingBalance: Writable<BigNumber>,
  sync: Sync
}

function Obj(vaultAddress, vaultName, userAddress){
  this.address = vaultAddress,
  this.name = vaultName,
  this.vaultBalance = writable<BigNumber>(BigNumber.from(0))
  this.poolBalance = writable<BigNumber>(BigNumber.from(0))
  this.vaultAllowance = writable<BigNumber>(BigNumber.from(0))
  this.pricePerShare = writable<BigNumber>(BigNumber.from(0))
  this.totalAssets = writable<BigNumber>(BigNumber.from(0))
  this.gaugeBalance = writable<BigNumber>(BigNumber.from(0))
  this.gaugeWorkingBalance = writable<BigNumber>(BigNumber.from(0))

  let vaultIndex = get(vaultMatrix).length

  let initSetVaultBalance = new balanceOf(() => [userAddress], (value: [BigNumber]) => this.vaultBalance.set(value[0]), () => vaultAddress)
  let initSetPoolBalance = new balanceOf(() => [userAddress], (value: [BigNumber]) => this.poolBalance.set(value[0]), () => vaults[vaultIndex].want)
  let initSetVaultAllowance = new allowance(() => [vaultAddress, userAddress], (value: [BigNumber]) => this.vaultAllowance.set(value[0]), () => vaultAddress)
  let initSetVaultPricePerShare = new pricePerShare(() => [], (value: [BigNumber]) => this.pricePerShare.set(value[0]), () => vaultAddress)
  let initSetTotalAssets = new totalAssets(() => [], (value: [BigNumber]) => {
    let result: BigNumber = value[0]
    let wantBal = result.mul(get(this.pricePerShare))
    wantBal = wantBal.div(ethers.constants.WeiPerEther)
    this.totalAssets.set(wantBal)
  }, () => vaultAddress)
  let initSetGaugeBalance = new balanceOf(() => [NETWORKS[get(selectedNetworkIndex)].proxy], (value: [BigNumber]) => this.gaugeBalance.set(value[0]), () => vaults[vaultIndex].gauge)
  let initSetGaugeWorkingBalance = new workingBalance(() => [NETWORKS[get(selectedNetworkIndex)].proxy], (value: [BigNumber]) => this.gaugeWorkingBalance.set(value[0]), () => vaults[vaultIndex].gauge)

  this.sync = new Sync([
    initSetVaultBalance,
    initSetPoolBalance,
    initSetVaultAllowance,
    initSetVaultPricePerShare,
    initSetTotalAssets,
    initSetGaugeBalance,
    initSetGaugeWorkingBalance
  ], networkProviders[String(NETWORKS[get(selectedNetworkIndex)].chainId)])
}

vaults.forEach(vault => {
  let newVault: Vault = new Obj(vault.address, vault.name, get(walletAddress))
  vaultMatrix.update( (matrix) => {
    matrix.push(newVault)
    return matrix
  })
});

walletAddress.subscribe( addr => {
  vaults.forEach(vault => {
    let vaultIndex = get(vaultMatrix).findIndex( (obj) =>{return obj.address === vault.address})

    if(get(vaultMatrix)[vaultIndex] !== undefined && get(vaultMatrix)[vaultIndex].sync !== undefined){
      get(vaultMatrix)[vaultIndex].sync.destroy()

      let setVaultBalance = new balanceOf(() => [addr], (value: [BigNumber]) => get(vaultMatrix)[vaultIndex].vaultBalance.set(value[0]), () => vault.address)
      let setPoolBalance = new balanceOf(() => [addr], (value: [BigNumber]) => get(vaultMatrix)[vaultIndex].poolBalance.set(value[0]),  () => vaults[vaultIndex].want)
      let setVaultAllowance = new allowance(() => [addr, vault.address ], (value: [BigNumber]) => get(vaultMatrix)[vaultIndex].vaultAllowance.set(value[0]),  () => NETWORKS[get(selectedNetworkIndex)].sdlAddress)
      let setVaultPricePerShare = new pricePerShare(() => [], (value: [BigNumber]) => get(vaultMatrix)[vaultIndex].pricePerShare.set(value[0]), () => vault.address)
      let setTotalAssets = new totalAssets(() => [], (value: [BigNumber]) => {
        let result: BigNumber = value[0]
        let wantBal = result.mul(get(get(vaultMatrix)[vaultIndex].pricePerShare))
        wantBal = wantBal.div(ethers.constants.WeiPerEther)
        get(vaultMatrix)[vaultIndex].totalAssets.set(wantBal)
      }, () => vault.address)
      let setGaugeBalance = new balanceOf(() => [NETWORKS[get(selectedNetworkIndex)].proxy], (value: [BigNumber]) => get(vaultMatrix)[vaultIndex].gaugeBalance.set(value[0]), () => vaults[vaultIndex].gauge)
      let setGaugeWorkingBalance = new workingBalance(() => [NETWORKS[get(selectedNetworkIndex)].proxy], (value: [BigNumber]) => get(vaultMatrix)[vaultIndex].gaugeWorkingBalance.set(value[0]), () => vaults[vaultIndex].gauge)

      get(vaultMatrix)[vaultIndex].sync = new Sync([
        setVaultBalance,
        setPoolBalance,
        setVaultAllowance,
        setVaultPricePerShare,
        setTotalAssets,
        setGaugeBalance,
        setGaugeWorkingBalance
      ], networkProviders[String(NETWORKS[get(selectedNetworkIndex)].chainId)])
    } else {
      console.log("ERROR: vaultMatrix uninitialized")
      
    }
  });
})




