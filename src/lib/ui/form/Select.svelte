<!-- DateSelect.svelte -->
<script>
  import Label from "./Label.svelte";
  let {
    // value = $bindable(),
    label = "",
    placeholder = "",
    items,
    ...others
  } = $props();
</script>

<div class="flex flex-col gap-2">
  {#if label}
    <Label name={others.name} {label} />
  {/if}
  <select
    class="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    {...others}
  >
    {#each items as item}
      <option value={item.value} selected={item.value === others.value}
        >{item.label}</option
      >
    {/each}
  </select>
</div>
