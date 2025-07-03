<script lang="ts">
  import Icon from "@iconify/svelte";
  import Heading from "./Heading.svelte";

  let { history } = $props();
  if (typeof history !== "undefined") {
    history.sort((a, b) => b.timestamp - a.timestamp);
  } else {
    history = false;
  }
</script>

{#if history}
  <div class="md:flex flex-col gap-3 bg-gray-50 hidden">
    <Heading text="Your search history" level={3} />
    <div>
      {#each history.slice(0, 10) as hist}
        <a href={`/archive/search?q=${hist.q}`} class="flex gap-2 items-center"
          ><Icon icon="quill:link-out" />{hist.q} | {new Date(
            hist.timestamp,
          ).toLocaleString()}</a
        >
      {/each}
    </div>

    <span class="text-sm"
      >Note: this information is stored on your computer and is not visible to
      anyone else.</span
    >
    <!-- <button
      onclick={() => {
        document.cookie =
          "search_history=; path=/archive/search; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      }}>Clear History</button
    > -->
  </div>
{/if}
