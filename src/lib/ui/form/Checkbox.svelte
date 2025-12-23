<!-- Checkbox.svelte -->
<script>
  import Label from "./Label.svelte";

  let {
    name = "checkbox",
    label = "",
    checked = $bindable(false),
    required = false,
    disabled = false,
  } = $props();
</script>

<label class="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    {name}
    bind:checked
    {required}
    {disabled}
    class="w-5 h-5 border-2 border-gray-300 rounded bg-gray-50 text-blue-500 focus:ring-2 focus:ring-gray-400 focus:ring-offset-0 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  />
  {#if label}
    <Label {label} {name} />
  {/if}
</label>
