<script lang="ts">
	import {
		accountChainId,
		connected,
		connectMetamask,
		connectWalletConnect,
		disconnect,
		walletAddress
	} from '$lib/stores/provider';
	import { sdlBalanceOnBlock, veBalanceOnBlock, vestedRewards, claimableRewards } from '$lib/stores/state';
	import { formatEther } from 'ethers/lib/utils';
	import Header from '$lib/Header.svelte'
</script>

<Header></Header>

<main class="grid grid-cols-2 py-6 p-10 max-w-full max-h-fit w-screen h-screen items-center gap-5 font-serif h-14 bg-gradient-to-r from-pinkish to-blueish">
	<div class="block container py-3 px-6 max-w-2xl mx-auto flex flex-col p-10 items-start gap-1 border-0 rounded-2xl h-14 shadow-lg bg-white/60">
		<p class="text-2xl text-black font-bold content-center">👩‍💻 User</p>
		<p class="text-xl text-black font-medium">Saddle Balance: {formatEther($sdlBalanceOnBlock)} SDL</p>
		<p class="text-xl text-black font-medium py-1">Vested Saddle: {$veBalanceOnBlock}</p>
		<p class="text-xl text-black font-medium py-1">Retroactive Vested Saddle: {formatEther($vestedRewards)}</p>
		<p class="text-xl text-black font-medium py-1">Claimable SLP: {$claimableRewards}</p>
		
	</div>
	<div class="block container py-3 px-6 max-w-2xl mx-auto flex flex-col p-10 items-start gap-1 border-0 rounded-2xl h-14 shadow-lg bg-white/60">
		<p class="text-2xl text-black font-bold content-center">🤖 Vault</p>
		<p class="text-xl text-black font-medium py-1">Some vault info... </p>
	</div>
	<div class="block container col-span-2 py-3 px-6 max-w-fit mx-auto flex flex-col p-10 items-start gap-1 border-0 rounded-2xl h-14 shadow-lg bg-white/60">
		<p class="text-2xl text-black font-bold content-center">🔒 Actions</p>
		<p class="text-xl text-black font-medium py-1">Some actions... </p>
		<p class="text-xl text-black font-medium py-1">Wallet Address: {$walletAddress}</p>
	</div>
</main>
