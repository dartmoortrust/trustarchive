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

<label class="flex flex-col items-center gap-2 cursor-pointer align-top">
   {#if label}
    <Label {label} {name} />
  {/if}
  <input
    type="checkbox"
    {name}
    bind:checked
    {required}
    {disabled}
    class="rounded-lg p-2 bg-white border-gray-200 border-2 w-8 h-8"
  />
 
</label>
