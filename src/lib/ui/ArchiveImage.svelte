<script lang="ts">
  import type { Record } from "$lib/schema";
  import { getRecordImageWebUrl } from "$lib/image";
  import { fade } from "svelte/transition";
  import Icon from "@iconify/svelte";
  let {
    record,
    size = 200,
    crop = false,
  }: { record: Record; size: number; crop: boolean } = $props();
  let src = $derived(getRecordImageWebUrl(record, size, crop));
  let lightboxSrc = $derived(getRecordImageWebUrl(record, 1500, false));
  const toggleLightbox = () => {
    isOpen = !isOpen;
  };
  function handleKeydown(e: any) {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
    }
  }
  let isOpen = $state(false);
</script>

<button onclick={() => toggleLightbox()} class="hover:cursor-pointer w-full">
  <img {src} width={size} alt={record.title || "unknown"} class="w-full" />
</button>
<svelte:window onkeydown={handleKeydown} />
{#if isOpen}
  <div
    class="bg-opacity-75 fixed inset-0 z-10 flex items-center justify-center bg-black"
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
