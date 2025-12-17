<script lang="ts">
  let { alt, imagesrc, size = 300, crop = false, grow = false } = $props();

  const src = $derived(
    `https://boxes.dartmoortrust.org/insecure/rs:${crop ? "fill" : "fit"}:${size}:${size}/plain/${encodeURIComponent(imagesrc)}`,
  );
</script>

<img {src} {alt} class={grow ? "w-full" : ""} />
