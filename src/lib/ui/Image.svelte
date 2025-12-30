<script lang="ts">
  let { alt, imagesrc, size = 300, crop = false, grow = false } = $props();

  const src = $derived(
    `/api/image?url=${encodeURIComponent(imagesrc)}&s=${size}`,
  );
</script>

<img {src} {alt} class={grow ? "w-full" : ""} />
