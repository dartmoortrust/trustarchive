<!-- DateSelect.svelte -->
<script>
  import Label from "./Label.svelte";

  let {
    // name = "date",
    label = "",
    // value = $bindable(""),
    // placeholder = "",
    // required = false,
    // disabled = false,
    issues = [],
    ...others
  } = $props();
</script>

<div class="flex flex-col gap-2">
  {#if label}
    <Label name={others.name} {label} />
  {/if}
  <input {...others} class="rounded-lg p-2 bg-white border-gray-200 border-2" />
  {#each issues as issue}
    <p class="issue border-l-2 border-red-800 bg-red-300 pl-4 py-2">
      {issue.message}
    </p>
  {/each}
</div>
