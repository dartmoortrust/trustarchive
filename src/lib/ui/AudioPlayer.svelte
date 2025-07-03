<script lang="ts">
  let { record } = $props();
</script>

<video
  poster="https://dartmoortrust.org/images/speaker.png"
  id="videoplayer"
  crossorigin="anonymous"
  controls
  src={`https://dartmoorweb.s3.eu-west-1.amazonaws.com/w-${record.file_id}`}
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
