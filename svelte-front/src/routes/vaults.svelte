<script lang="ts">
  //import { vaultFraxBPBal, fraxBPAssets } from '$lib/stores/vaultState'
  import Header from '$lib/Header.svelte'
  //import VaultButtons from '$lib/vaultButtons.svelte'
  import VaultCard from '$lib/vaultCard.svelte'
  //import { ezFormatEth } from '$lib/Common.svelte'
  import vaults from "$lib/state/vaults.json"
</script>

<main>
  <div class="min-h-screen">
    <Header></Header>
    <br>
    <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 py-6 px-4 flex justify-center gap-6">
      {#each vaults as vault}
      <VaultCard vault="{vault.address}"></VaultCard>
      {/each}
    </div>
  </div>
</main>
