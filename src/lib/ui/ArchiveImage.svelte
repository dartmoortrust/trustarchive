<script>
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
  const imgproxyurl = `https://boxes.dartmoortrust.org/insecure/rs:${crop ? "fill" : "fit"}:${size}:${size}/plain/`;
  const recordUrl = encodeURIComponent(
    `https://dartmoor.blob.core.windows.net/public/${record?.sha1_hash.slice(0, 2)}/w-${record?.sha1_hash}`,
  );

  const src =
    record.medium === "audio"
      ? "/images/speaker.png"
      : `${imgproxyurl}${recordUrl}
    `;
</script>

{#if record.medium === "video"}
  <img
    src={`${imgproxyurl}${encodeURIComponent(`https://dartmoor.blob.core.windows.net/public/${record?.sha1_hash.slice(0, 2)}/s-${record?.sha1_hash}`)}`}
    class={grow ? "w-full" : ""}
    alt={record.title || "An image from the Dartmoor Trust Archive"}
  />
{:else if record.medium === "audio"}
  <Icon
    icon="solar:headphones-round-sound-bold"
    class="w-[200px] h-full p-8 bg-white"
  />
{:else}
  <button
    onclick={() => (lightbox ? (isOpen = !isOpen) : null)}
    class="w-full h-full hover:cursor-pointer"
  >
    <img
      {src}
      class={grow ? "w-full" : ""}
      alt={record.title || "An image from the Dartmoor Trust Archive"}
    />
  </button>
{/if}
{#if isOpen}
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    onclick={() => (isOpen = !isOpen)}
    onkeydown={(e) => e.key === "Enter" && (isOpen = !isOpen)}
    role="button"
    tabindex="0"
    transition:fade
  >
    <div
      class="relative flex items-center justify-center max-w-full max-h-full p-4"
    >
      <img
        src={src.replace(`rs:fit:${size}:${size}`, "rs:fill:1500:1500")}
        alt=""
        class="max-w-full max-h-[90vh] rounded-lg"
      />
    </div>
  </div>
{/if}
