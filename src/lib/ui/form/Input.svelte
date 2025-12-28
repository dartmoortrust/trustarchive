<!-- DateSelect.svelte -->
<script>
  import Label from "./Label.svelte";

  let {
    label = "",
    maxLength = null,
    issues = [],
    ...others
  } = $props();

  let length = $state()
</script>

<div class="flex flex-col gap-2">
  {#if label}
    <Label name={others.name} {label} />
  {/if}
  <input {...others} class="rounded-lg p-2 bg-white border-gray-200 border-2" bind:value={length} />
  {#if maxLength}
    <div class="text-right text-sm text-gray-500">
      {length?.length || 0} / {maxLength} characters
    </div>
  {/if}
  {#each issues as issue}
    <p class="issue border-l-2 border-red-800 bg-red-300 pl-4 py-2">
      {issue.message}
    </p>
  {/each}
</div>
