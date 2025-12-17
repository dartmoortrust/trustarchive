<script lang="ts">
  let { record } = $props();
  const src = $derived(
    `https://dartmoor.blob.core.windows.net/public/${record.file_id?.slice(0, 2)}/w-${record.file_id}`,
  );
</script>

<video
  poster="https://dartmoortrust.org/images/speaker.png"
  id="videoplayer"
  crossorigin="anonymous"
  class="w-full"
  controls
  {src}
>
  <track
    id="subtitleTrack"
    default
    srclang="en"
    kind="captions"
    src={`https://dartmoorweb.s3.eu-west-1.amazonaws.com/vtt-${record.file_id}`}
  />
</video>

<style>
  video::cue {
    font-size: 1.5rem;
    background-image: black;
    color: white;
  }
  ::cue(u) {
    color: red;
  }
</style>
