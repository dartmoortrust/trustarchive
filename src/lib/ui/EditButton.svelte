<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";

  let { record } = $props();
</script>

{#if page.data.session?.roles?.includes("record-edit")}
  <a
    href={`/archive/record/${record.id}/edit`}
    class="flex items-center gap-2 bg-green-400 p-2 text-gray-800 shadow-md transition-all
    hover:shadow-xl"
    data-sveltekit-preload-data="off"
  >
    <Icon icon="solar:clapperboard-edit-outline" width="20" height="20" />
    Edit Record
  </a>
{/if}
