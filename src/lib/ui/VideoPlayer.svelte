<script lang="ts">
  let { record } = $props();
  const src = $derived(
    `https://dartmoor.blob.core.windows.net/public/${record?.sha1_hash?.slice(0, 2)}/w-${record?.sha1_hash}`,
  );
</script>

{#if record.mime_type.startsWith("video")}
  <video controls class="max-h-[80vh] w-full bg-black">
    <source {src} type="video/webm" />
    <track
      kind="captions"
      src=""
      srclang="en"
      label="English captions"
      default
    />
    Your browser does not support the video tag.
  </video>
{/if}
