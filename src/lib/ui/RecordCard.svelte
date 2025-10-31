<script lang="ts">
  import ArchiveImage from "./ArchiveImage.svelte";
  let { record } = $props();
</script>

{#if record.mime_type.startsWith("video") || record.mime_type.startsWith("audio")}
  <a
    href={`/archive/record/${record.id}`}
    aria-label="Link to archive record"
    class="relative shadow-lg block"
  >
    <ArchiveImage {record} size={200} crop={true} />

    {#if record.title}
      <span
        class="absolute text-white inset-0 bg-black flex items-center justify-center p-2 text-center hover:opacity-30 opacity-75 transition-opacity duration-300"
        >{record.title}</span
      >
    {/if}
  </a>
{:else}
  <a
    href={`/archive/record/${record.id}`}
    aria-label="Link to archive record"
    class="relative shadow-lg block"
  >
    <ArchiveImage {record} size={200} crop={true} />

    {#if record.title}
      <span
        class="absolute text-white inset-0 bg-black flex items-center justify-center p-2 text-center opacity-0 hover:opacity-75 transition-opacity duration-300"
        >{record.title}</span
      >
    {/if}
  </a>
{/if}
