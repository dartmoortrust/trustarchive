<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  import { getDownloadUrl } from "../../routes/data.remote";
  
  let { record } = $props();
  let error = $state<string | null>(null);

  async function handleDownload() {
    error = null;
    
    try {
      const res = await getDownloadUrl(record.id);
      
      if (res?.signedUrl) {
        window.location.href = res.signedUrl;
      } else {
        error = "Download URL not available";
      }
    } catch (err) {
      error = "Failed to get download URL";
      console.error("Download error:", err);
    } 
  }
</script>

{#if page.data.session?.roles?.includes("file-download") || record.downloadable}
  <div class="flex flex-col gap-1">
    <button
      onclick={handleDownload}
      class="flex items-center gap-2 bg-green-400 p-2 text-gray-800 shadow-md transition-all
        hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
      aria-label="Download full version of {record.name || 'file'}"
    >
      
      <Icon icon="solar:cloud-download-broken" width="20" height="20" />
      Download Full Version
    </button>
    
    {#if error}
      <p class="text-sm text-red-600" role="alert">
        {error}
      </p>
    {/if}
  </div>
{/if}