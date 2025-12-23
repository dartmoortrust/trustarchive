<!-- Textarea.svelte -->
<script>
  import Label from "./Label.svelte";

  let { label, rows = 4, maxLength, resize = true, ...other } = $props();
</script>

<div class="flex flex-col gap-2">
  {#if label}
    <Label {label} name={other.name} />
  {/if}
  <textarea
    rows="15"
    {...other}
    class="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed {resize
      ? 'resize-y'
      : 'resize-none'}"
  ></textarea>
</div>
