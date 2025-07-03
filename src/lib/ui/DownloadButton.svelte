<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  let { record } = $props();
</script>

{#if page.data.session?.roles?.includes("file-download") || record.downloadable}
  <a
    href={`/archive/record/${record.id}/download`}
    class="flex gap-3 bg-green-400 p-3 text-gray-800 shadow-md hover:shadow-xl
    transition-all"
  >
    <Icon icon="solar:cloud-download-broken" width="24" height="24" />
    Download Full Version
  </a>
{/if}
