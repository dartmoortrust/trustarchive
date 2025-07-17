<script lang="ts">
  import { onMount } from "svelte";
  import { algoliasearch } from "algoliasearch";
  import {
    PUBLIC_ALGOLIA_API_KEY,
    PUBLIC_ALGOLIA_APP_ID,
  } from "$env/static/public";

  import Container from "$lib/ui/Container.svelte";
  import ArchiveImage from "$lib/ui/ArchiveImage.svelte";
  import Icon from "@iconify/svelte";

  let query = $state("");
  let results: any[] = $state([]);
  let isLoading = $state(false);
  let client: any;
  onMount(() => {
    client = algoliasearch(PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_API_KEY);
  });
  const search = async () => {
    const response = await client.search({
      requests: [
        {
          indexName: "records",
          query: query,
          hitsPerPage: 50,
        },
      ],
    });
    results = response.results[0].hits;
    console.log(response);
  };
</script>

<Container>
  <div class="flex gap-3 items-center p-2 border-1 bg-blue-200/50">
    <Icon icon={"solar:info-circle-bold"} />
    <p>This page is for testing, if you have found it, congratulations!</p>
  </div>
  <h1 class="text-xl font-bold mb-4">Test Search</h1>
  <input bind:value={query} class="w-full border-2 p-2" />
  <button onclick={() => search()}>Search</button>
  <div id="hits" class="grid grid-cols-5 gap-5">
    {#each results as hit}
      <a
        href={`/archive/record/${hit.id}`}
        class="border-2 flex flex-col border-gray-400"
      >
        <ArchiveImage record={hit} size={300} crop lightbox={false} />
        <p class="p-3 grow">{hit.title}</p>
      </a>
    {/each}
  </div>
</Container>
