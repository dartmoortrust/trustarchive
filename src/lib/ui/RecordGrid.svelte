<script>
  import RecordCard from "./RecordCard.svelte";
  let { records = [] } = $props();
</script>

<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
  {#each records as record (record.id)}
    <RecordCard {record} />
  {/each}
</div>
