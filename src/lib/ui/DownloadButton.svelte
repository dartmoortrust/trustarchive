<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  let { record } = $props();
</script>

{#if page.data.session?.roles?.includes("file-download") || record.downloadable}
  <a
    href={`/archive/record/${record.id}/download`}
    class="flex items-center gap-2 bg-green-400 p-2 text-gray-800 shadow-md transition-all
    hover:shadow-xl"
  >
    <Icon icon="solar:cloud-download-broken" width="20" height="20" />
    Download Full Version
  </a>
{/if}
