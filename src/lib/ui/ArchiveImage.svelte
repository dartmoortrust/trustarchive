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
  
  function toggleLightbox(e: Event) {
    if (lightbox) {
      e.preventDefault();
      e.stopPropagation();
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
{:else if lightbox}
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

{#if isOpen}
  <div
    class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
    onclick={toggleLightbox}
    onkeydown={(e) => e.key === "Enter" && toggleLightbox(e)}
    role="button"
    tabindex="0"
    transition:fade
    aria-label="Close lightbox"
  >
    <button
      class="bg-opacity-20 hover:bg-opacity-30 absolute top-4 right-4 z-10 rounded-full bg-white p-2 text-white"
      onclick={(e) => {
        e.stopPropagation();
        isOpen = false;
      }}
      aria-label="Close"
    >
      <Icon icon="mdi:close" class="h-6 w-6 text-black" />
    </button>

    <div
      class="relative flex max-h-full max-w-full items-center justify-center p-4"
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <img
        src={lightboxSrc}
        alt={record.title || "An image from the Dartmoor Trust Archive"}
        class="max-h-[90vh] max-w-full rounded-lg"
      />
    </div>
  </div>
{/if}