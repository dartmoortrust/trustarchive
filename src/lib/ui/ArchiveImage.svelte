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
  const imgproxyurl = "/api/image";
  const recordUrl = `https://dartmoorpublic.lon1.cdn.digitaloceanspaces.com/w-${record.file_id}`;

  const getTransforms = () => {
    if (!record.image_transform) {
      return;
    }
    let transforms = "";
    Object.entries(record.image_transform).forEach((entry) => {
      const [key, value] = entry;
      transforms += `${key}_${value},`;
    });
    return transforms;
  };

  const src = record.file_mime?.startsWith("audio")
    ? "/images/speaker.png"
    : `${imgproxyurl}?url=${encodeURIComponent(recordUrl)}&size=${size}&crop=${crop}`;
</script>

{#if record.file_mime?.startsWith("video")}
  <Icon icon="solar:videocamera-outline" class="w-full h-full p-8 bg-white" />
{:else if record.file_mime?.startsWith("audio")}
  <Icon
    icon="solar:headphones-round-sound-bold"
    class="w-full h-full p-8 bg-white"
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
        src={`${imgproxyurl}?url=${encodeURIComponent(recordUrl)}&size=1500&crop=false`}
        alt=""
        class="max-w-full max-h-[90vh] rounded-lg"
      />
    </div>
  </div>
{/if}
