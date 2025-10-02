<script lang="ts">
  let { record } = $props();
  let src = `https://dartmoor.blob.core.windows.net/web/w-${record.file_id}`;
</script>

{#if record.file_mime.startsWith("video")}
  <video controls class="w-full max-h-[80vh] bg-black">
    <source
      {src}
      type="video/mp4"
    />
    <track kind="captions" src="" srclang="en" label="English captions" default>
    Your browser does not support the video tag.
  </video>
{/if}
