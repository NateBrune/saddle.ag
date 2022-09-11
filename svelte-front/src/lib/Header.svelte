<script lang="ts">
	import {
		accountChainId,
		connected,
		connectMetamask,
		connectWalletConnect,
		disconnect,
		walletAddress
	} from '$lib/stores/provider';
</script>

<div class="relative bg-white">
    <div class="max-w-full mx-auto px-0 sm:px-0">
      <div class="flex justify-between items-center shadow-gray-dark shadow-lg py-1 md:justify-start  px-4 md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1 gap-4">
          <!--<a href="/"><button class="p-3 rounded-xl text-md bg-black text-white font-semibold hover:scale-[1.05] transition transition-200">🔒 locker</button></a> -->
          <!--<a href="/vaults"><button class="p-3 rounded-xl text-md bg-black text-white font-semibold hover:scale-[1.05] transition transition-200">🏦 vaults</button></a> NO PEEKING!-->
        </div>
        <center><p class="text-5xl text-black font-medium">L2DAO Saddle Optimizer Vault</p></center>
        <div class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {#if !$connected }
            <button
                on:click={connectMetamask}
                class="p-3 rounded-xl text-md bg-black text-white font-semibold hover:scale-[1.05] transition transition-200"
                >Connect Wallet</button
            >
            <!--
            <button
                on:click={connectWalletConnect}
                class="p-1 rounded-xl text-md bg-black text-white font-semibold hover:scale-[1.05] transition transition-200"
                >Connect via WalletConnect</button
            >
            -->
            {:else }
            <button
                on:click={disconnect}
                class="p-3 rounded-xl text-md bg-black text-white font-semibold hover:scale-[1.05] transition transition-200"
                >disconnect</button
            >
            {/if}
        </div>
      </div>
    </div>
  </div>