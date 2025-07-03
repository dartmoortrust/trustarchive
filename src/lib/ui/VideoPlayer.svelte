<script lang="ts">
  let { record } = $props();
</script>

{#if record.file_mime.startsWith("video")}
  <video controls>
    <source
      src={`https://dartmoorpublic.lon1.cdn.digitaloceanspaces.com/w-${record.file_id}`}
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
{/if}
