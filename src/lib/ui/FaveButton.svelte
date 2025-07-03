<script>
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  const toggleFave = async () => {
    const res = await fetch("/api/favourite", {
      method: "POST",
      body: JSON.stringify({
        record_id: 1,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const { fave } = $props();
</script>

{#if page.data.session}
  <Icon
    onclick={toggleFave}
    icon="tabler:heart-filled"
    class={`text-4xl ${fave ? "text-red-600" : ""} `}
  />
{/if}
