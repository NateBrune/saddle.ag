<script lang="ts">
  import { ezFormatEth, vaultDeposit, vaultWithdraw } from '$lib/Common.svelte'
  import {walletAddress, connected} from '$lib/stores/provider'
  import { approveVault } from '$lib/Common.svelte';
  export let vault;

  let bal = vault.vaultBalance
  let poolBal = vault.poolBalance
  let vaultAllowance = vault.vaultAllowance
  let depositValue=undefined
  let withdrawValue=undefined
</script>
{#if Number($vaultAllowance.toString()) !== 0 && $connected}
  <button class="col-span-2
    text-white
    px-2 py-2 rounded-md
    transition-all duration-75
    focus:!outline-none active:!outline-none ring-none
    group
    bg-black hover:scale-[1.05] active:bg-royal-black
    disabled:bg-gray-300
    max-w-full -mb-0.5 !py-[0.5625rem] false mt-[1.625rem]" on:click={approveVault(vault.address)}>
    approve vault
  </button>
{:else if $connected}
<div class="col-span-2 grid grid-cols-4 gap-4">
  <!-- Deposits -->
  <div class="inline-block w-full col-span-3">
    <div class="pb-1">
      <span class="text-white">deposit</span>
      <a class="hover:underline group">
        <small class="inline-block float-right mt-1 text-white  group-hover:underline cursor-pointer">Max: 
          <span class="text-gray-800 dark:text-gray-400 font-medium " on:click={() => {depositValue = ezFormatEth($poolBal,12)}}>{ezFormatEth($poolBal,12)}</span>
        </small>
      </a>
    </div>
    <input class="
        block w-full
        border border-gray-300 hover:border-gray-400
        rounded-md pl-4 py-2
        focus:outline-none
        focus:ring-blueish focus:border-blueish
      " placeholder="0.0" bind:value={depositValue}>
  </div>
  <button class="
    text-white
    px-2 py-2 rounded-md
    transition-all duration-75
    focus:!outline-none active:!outline-none ring-none
    group
    bg-black hover:scale-[1.05] active:bg-royal-black
    disabled:bg-gray-300
    w-full max-w-content -mb-0.5 !py-[0.5625rem] false mt-[1.625rem] " on:click={vaultDeposit(vault.address, Number(depositValue)*1e12)}>
      <span>deposit</span>
  </button>

  <!-- Withdrawls -->
  <div class="inline-block w-full col-span-3">
    <div class="pb-1">
      <span class="text-white">withdraw</span>
      <a class="hover:underline group">
        <small class="inline-block float-right mt-1 text-white  group-hover:underline cursor-pointer">Max: 
          <span class="text-gray-800 dark:text-gray-400 font-medium" on:click={() => {withdrawValue = ezFormatEth($bal,12)}}> {ezFormatEth($bal,12)} </span>
        </small>
      </a>
    </div>
    <input class="
        block w-full
        border border-gray-300 hover:border-gray-400
        rounded-md pl-4 py-2
        focus:outline-none
        focus:ring-blueish focus:border-blueish" placeholder="0.0" bind:value={withdrawValue}>
  </div>
  <button class="
    text-white
    px-2 py-2 rounded-md
    transition-all duration-75
    focus:!outline-none active:!outline-none ring-none
    group
    bg-black hover:scale-[1.05] active:bg-royal-black
    disabled:bg-gray-300
    w-full max-w-content -mb-0.5 !py-[0.5625rem] false mt-[1.625rem]" on:click={vaultWithdraw(vault.address, Number(withdrawValue)*1e12)}>
      <span>withdraw</span>
  </button>
</div>
{:else}
<span class="text-white">connect wallet to deposit</span>
{/if}