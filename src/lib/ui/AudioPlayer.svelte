<script lang="ts">
  let { record } = $props();
  const src = $derived(
    `https://dartmoor.blob.core.windows.net/public/${record.sha1_hash?.slice(0, 2)}/w-${record.sha1_hash}`,
  );
</script>

<video
  poster="https://dartmoortrust.org/images/speaker.png"
  id="videoplayer"
  crossorigin="anonymous"
  class="w-full h-20"
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
