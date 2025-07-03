<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";

  let { record } = $props();
</script>

{#if page.data.session?.roles?.includes("record-edit")}
  <a
    href={`/archive/record/${record.id}/edit`}
    class="flex gap-3 shadow-md bg-green-400 p-3 text-gray-800 hover:shadow-xl transition-all items-center"
  >
    <Icon icon="solar:clapperboard-edit-outline" width="24" height="24" />
    Edit Record
  </a>
{/if}
