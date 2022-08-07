<script lang="ts">

  import { ezFormatEth } from '$lib/Common.svelte'
  import { walletAddress } from '$lib/stores/provider'
  import { vaultMatrix } from '$lib/stores/vaultStatev2'
import { BigNumber } from 'ethers';
  import { get } from 'svelte/store';
import { vaultBalance } from './lockerState';
  import VaultButtons from './vaultButtons.svelte';
  
  export let vault;

  let v = $vaultMatrix.find(curVault => {
    return curVault.address === vault
  })
  //let bal = v.vaultBalance
  let name = v.name
  let bal = v.vaultBalance
  let poolBal = v.poolBalance
  let vaultAllowance = v.vaultAllowance
  let vaultTotalAssets = v.totalAssets
  let vaultPricePerShare = v.pricePerShare
  let vaultGaugeBalanace = v.gaugeBalance
  let vaultWorkingBalance = v.gaugeWorkingBalance
  console.log(get(vaultTotalAssets))
  let boost = BigNumber.from(0);
  vaultWorkingBalance.subscribe((value) => {
    if(value > get(vaultWorkingBalance)){
      boost = get(vaultGaugeBalanace).div(value)
    }
  })

  
</script>
<div class="grid grid-cols-2 block container rounded-2xl max-w-full py-1 gap-0 px-6 shadow-lg bg-gray-dark/30">
  <h1 class="text-center text-4xl font-bold text-white font-sans subpixel-antialiased whitespace-nowrap col-span-2">{name}</h1>
  <h1 class="text-center text-2xl font-bold text-white font-sans subpixel-antialiased whitespace-nowrap col-span-2">tvl: ${ezFormatEth($vaultTotalAssets,2)}</h1> <!--{ezFormatEth($fraxBPAssets,2)}-->
  <span>
    <p class="text-xl text-white font-medium whitespace-nowrap py-1">pool balance: ${ezFormatEth($poolBal, 2)}</p>
    <p class="text-xl text-white font-medium whitespace-nowrap py-1">vault balance: ${ezFormatEth($bal,2)}</p> <!--${ezFormatEth(syncMatrix[vault][0],2)}-->
  </span>
    <section class="inline-flex text-right">
    <div class="block align-middle container bg-black/60 px-1 rounded-2xl shadow-lg max-w-fit ml-auto whitespace-nowrap py-1">
      <div class="grid align-middle grid-cols-3 py-2 gap-1">
        <p class="text-md align-middle text-white font-xl whitespace-nowrap max-w-fit col-span-2">Lifetime Return </p><p class="text-md text-green font-bold whitespace-nowrap max-w-fit" >{ezFormatEth($vaultPricePerShare.mul(100),2)}%</p>
        <p class="text-md align-middle text-white font-xl whitespace-nowrap max-w-fit col-span-2">boost </p><p class="text-md text-green font-bold whitespace-nowrap max-w-fit" >{boost}</p>
      </div>
    </div>
  </section>
  <VaultButtons vault={v}></VaultButtons>
</div>