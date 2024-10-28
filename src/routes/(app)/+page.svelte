<script lang="ts">
  // Props
  const { data } = $props();
  const { user, total } = $derived(data);
</script>

<svelte:head>
  <title>Ffi</title>
</svelte:head>

<p>The total of the numbers is {total}.</p>

{#if user}
  <p>You are currently logged in as {user.email}.</p>
{:else}
  <p>Create a new account or login to get started.</p>
{/if}
