<script lang="ts">
  import ArchiveImage from "./ArchiveImage.svelte";
  let { record } = $props();
</script>

<a
  href={`/archive/record/${record.id}`}
  aria-label={record.title || "Link to archive record"}
  class="relative shadow-lg block"
>
  <ArchiveImage {record} size={150} crop={true} />
  {#if record.title}
    <span
      class="absolute text-white inset-0 bg-black flex items-center justify-center p-2 text-center opacity-0 hover:opacity-75 transition-opacity duration-300"
    >
      {record.title}
    </span>
  {/if}
</a>