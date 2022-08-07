<script lang="ts">
	import {
    walletAddress,
		connected,
    selectedNetworkIndex
	} from '$lib/stores/provider';
	import { 
    sdlBalanceOnBlock, 
    vestedRewards, 
    vaultBalance, 
    claimableRewards, 
    vaultRewards, 
    vaultTotalSupply, 
    aggVeSDL, 
    totalVeSDL, 
    vaultAllowance,
    veApr,
    vaultApr, agBoost} from '$lib/lockerState';
  import { NETWORKS } from '$lib/config';
	import Header from '$lib/Header.svelte'
  import {
    approveVault,
    depositAllinVault,
    claimRewards,
    ezFormatEth
  } from '$lib/Common.svelte';
  import SaddleSVG from '$lib/SaddleSVG.svelte';
</script>

<main>
  <div class="min-h-screen">
    <Header></Header>
    <br>
    <div class="grid py-6 grid-cols-2 items-center gap-6 font-serif">
      <div class="block container col-span-2 py-3 px-6 max-w-fit mx-auto flex flex-col p-10 items-start gap-1 rounded-2xl h-14 shadow-lg bg-gray-dark/50 justify-center items-center">
        <p class="text-2xl text-white font-bold content-center justify-center">📖 about</p>
        <p class="text-lg text-white font-medium content-center justify-center"> this vault accepts sdl in exchange for perpetual claim on saddle dao admin fees across all aggregator products.<br>
        since it locks sdl in saddle voting escrow for 4 years and regularly prolongs the lock, this vault doesn't have withdrawal functionality.</p>
      </div>

      <div class="block container py-3 px-6 max-w-fit mx-auto flex flex-col p-10 items-start gap-1 rounded-2xl h-14 shadow-lg bg-gray-dark/30">
        <p class="text-2xl text-white font-bold content-center">👩‍💻 user info</p>
        <div class="flex items-center">
          <p class="text-xl text-white font-medium text-justify">wallet balance: {ezFormatEth($sdlBalanceOnBlock, 2)}</p>
          <SaddleSVG/>
        </div>
        <div class="flex items-center">
          <p class="text-xl text-white font-medium">unclaimed vested sdl: {ezFormatEth($vestedRewards, 2)}</p>
          <SaddleSVG/>
        </div>
        <p class="text-xl text-white font-medium">vault balance: {ezFormatEth($vaultBalance, 2)} 🤖</p>
        <p class="text-xl text-white font-medium">claimable eth/sdl lp: {ezFormatEth($claimableRewards, 6)} 🍣</p>
        
      </div>
      <div class="block container py-3 gap-3 px-6 max-w-fit mx-auto flex flex-col p-10 items-start gap-1 rounded-2xl h-14 shadow-lg bg-gray-dark/30">
        <p class="text-2xl text-white font-bold content-center">🤖 vault info </p>
        <div class="grid grid-cols-3">
          <div class="col-span-2">
            <p class="text-md py-1 text-white font-medium">rewards in vault: {ezFormatEth($vaultRewards, 0)} 🍣</p>
            <p class="text-md py-1 text-white font-medium">vault total supply: {ezFormatEth($vaultTotalSupply, 0) } 🤖</p>
            
            <div class="flex items-center">
              <p class="text-md py-1 text-white font-medium">aggregator vesdl: {ezFormatEth($aggVeSDL, 0)} </p>
              <SaddleSVG/>
            </div>

            <div class="flex items-center">
              <p class="text-md py-1 text-white font-medium">total vesdl: {ezFormatEth($totalVeSDL, 2)}</p>
              <SaddleSVG/>
            </div>
          </div>
          <div class="flex items-center">
            <div class="block container bg-black/60 py-1 px-1 rounded-2xl shadow-lg ">
              <div class="grid grid-cols-3">
                <p class="text-md text-white font-medium max-w-fit col-span-2">saddle apr </p>
                <p class="text-md text-green font-bold whitespace-nowrap text-center max-w-fit" >{($veApr.toFixed(4) * 100).toFixed(2)}%</p>
                <p class="text-md text-white font-medium whitespace-nowrap max-w-fit col-span-2">vault apr </p><p class="text-md text-green font-bold whitespace-nowrap max-w-fit" >{($vaultApr.toFixed(4) * 100).toFixed(2)}%</p>
                <p class="text-md text-white font-medium whitespace-nowrap max-w-fit col-span-2">boost </p><p class="text-md text-green font-bold whitespace-nowrap max-w-fit" >{$agBoost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="block container col-span-2 py-3 px-6 max-w-fit mx-auto flex flex-col p-10 items-start gap-1 rounded-2xl h-14 shadow-lg bg-gray-dark/30">
        <p class="text-2xl text-white font-bold content-center">🔒 actions</p>
        <p class="text-xl text-white font-medium">Wallet Address: {$walletAddress}</p>
        {#if Number($vaultAllowance.toString()) === 0 && $connected}
        
        <div class="flex w-full items-center justify-center">
          <button
          on:click={approveVault(NETWORKS[$selectedNetworkIndex].vault)} 
          class="p-3 rounded-xl text-md bg-black text-white font-semibold hover:scale-[1.05] transition transition-200">Approve Vault</button>
        </div>
          <p class="text-xl text-white font-medium">You must approve vault before depositing. </p>
        {:else if $connected }
          <div class="gap-6 flex w-full items-center justify-center">
            <button
            on:click={depositAllinVault}
            class="p-3 rounded-xl text-md bg-black text-white font-semibold hover:scale-[1.05] transition transition-200">
              <div class="flex items-center">
                Deposit {ezFormatEth($sdlBalanceOnBlock, 2)}
                <SaddleSVG/>
              </div>
            </button>
            <button
            on:click={claimRewards}
            class="p-3 rounded-xl text-md bg-black text-white font-semibold hover:scale-[1.05] transition transition-200">
              <div class="flex items-center">
                Claim {ezFormatEth($claimableRewards, 6)} 🍣
              </div>
            </button>
          </div>
          <p class="text-xl text-white font-medium">Deposit into the vault to earn rewards in perpetuity. </p>
        {:else}
        <p class="text-xl text-white font-medium">Connect wallet to get started!</p>
        {/if}
      </div>
    </div>
  </div>
</main>
