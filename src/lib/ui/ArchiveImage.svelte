<script lang="ts">
  import Icon from "@iconify/svelte";
  import { fade } from "svelte/transition";

  let {
    record,
    crop = false,
    size = 500,
    grow = true,
    lightbox = true,
  } = $props();

  let isOpen = $state(false);

  // Helper function to build image URL
  function buildImageUrl(
    hash: string,
    prefix = "w",
    imgSize = size,
    useCrop = crop,
  ) {
    const imgproxyurl = `https://boxes.dartmoortrust.org/insecure/rs:${useCrop ? "fill" : "fit"}:${imgSize}:${imgSize}/plain/`;
    const recordUrl = encodeURIComponent(
      `https://dartmoor.blob.core.windows.net/public/${hash.slice(0, 2)}/${prefix}-${hash}`,
    );
    return `${imgproxyurl}${recordUrl}`;
  }

  // Computed source URL
  const src = $derived(
    record.medium === "audio"
      ? "/images/speaker.png"
      : buildImageUrl(record.sha1_hash),
  );

  const lightboxSrc = $derived(
    buildImageUrl(record.sha1_hash, "w", 1500, true),
  );

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
    src={buildImageUrl(record.sha1_hash, "s")}
    class={grow ? "w-full" : ""}
    alt={record.title || "An image from the Dartmoor Trust Archive"}
  />
{:else if record.medium === "audio"}
  <Icon
    icon="solar:headphones-round-sound-bold"
    class="h-full w-[200px] bg-white p-8"
  />
{:else}
  <button
    onclick={toggleLightbox}
    class="h-full w-full"
    class:hover:cursor-pointer={lightbox}
    disabled={!lightbox}
    aria-label={lightbox ? "Open image in lightbox" : undefined}
  >
    <img
      {src}
      class={grow ? "w-full" : ""}
      alt={record.title || "An image from the Dartmoor Trust Archive"}
      loading="lazy"
    />
  </button>
{/if}

{#if isOpen}
  <div
    class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
    onclick={toggleLightbox}
    onkeydown={(e) => e.key === "Enter" && toggleLightbox()}
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
      <Icon icon="mdi:close" class="h-6 w-6" />
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
