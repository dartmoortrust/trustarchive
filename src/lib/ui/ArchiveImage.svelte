<script lang="ts">
  import Icon from "@iconify/svelte";
  import { fade } from "svelte/transition";

  let {
    record,
    crop = false,
    size = 500,
    grow = true,
    lightbox = false,
  } = $props();

  let isOpen = $state(false);
  let src = $derived(`/api/image?url=${encodeURIComponent(
      `https://dartmoor.blob.core.windows.net/public/${record.sha1_hash.slice(0, 2)}/w-${record.sha1_hash}`,
  )}&s=${size}&q=75&c=${crop}`)
  let lightboxSrc = $derived(`/api/image?url=${encodeURIComponent(
      `https://dartmoor.blob.core.windows.net/public/${record.sha1_hash.slice(0, 2)}/w-${record.sha1_hash}`,
  )}&s=1500&q=75&c=${crop}`)
  // Keyboard handler for accessibility
  function handleKeydown(e: any) {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
    }
  }
  function toggleLightbox() {
    if (lightbox) {
      isOpen = !isOpen;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />
{#if record.medium === "video"}
  <img
    src={src.replace('w-','s-')}
    class={grow ? "w-full" : ""}
    alt={record.title || "An image from the Dartmoor Trust Archive"}
  />
{:else if record.medium === "audio"}
  <Icon
    icon="solar:headphones-round-sound-bold"
    class="h-full w-[200px] bg-white p-8"
  />
{:else}
  {#if lightbox}
    <button
      onclick={toggleLightbox}
      class="h-full w-full hover:cursor-pointer"
      aria-label="Open image in lightbox"
    >
      <img
        {src}
        class={grow ? "w-full" : ""}
        alt={record.title || "An image from the Dartmoor Trust Archive"}
        loading="lazy"
      />
    </button>
  {:else}
    <img
      {src}
      class={grow ? "w-full" : ""}
      alt={record.title || "An image from the Dartmoor Trust Archive"}
      loading="lazy"
    />
  {/if}
{/if}