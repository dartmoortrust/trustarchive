<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import RecordGrid from "$lib/ui/RecordGrid.svelte";
  import Seo from "$lib/ui/SEO.svelte";
  import Icon from "@iconify/svelte";
  import Pagination from "$lib/ui/Pagination.svelte";
  import { getCollectionById, searchRecords } from "../../../data.remote.js";
  import Container from "$lib/ui/Container.svelte";
  import { page } from "$app/state";

  let { params } = $props();

  // 1. Move URL params into $derived so they update on navigation
  const currentPage = $derived(Number(page.url.searchParams.get("page")) || 1);
  const currentLimit = $derived(
    Number(page.url.searchParams.get("limit")) || 25,
  );

  // 2. Derive the collection based on the route params
  const collection = $derived.by(async () => {
    return await getCollectionById(params.id);
  });

  // 3. Derive search results based on both the collection and the URL params
  // We use $derived.by for cleaner async handling with multiple dependencies
  const searchData = $derived.by(async () => {
    // We must await the collection first since searchRecords needs its ID
    const col = await collection;
    return await searchRecords({
      q: "",
      collection_id: col.id,
      page: currentPage,
      limit: currentLimit,
    });
  });

  // 4. Helper derivations for cleaner template access
  const records = $derived.by(() => {
    // Use optional chaining or provide defaults to handle the async pending state
    return searchData?.then((res) => res.records) || [];
  });
</script>

{#await collection then col}
  <Seo
    title={`The ${col.title} Collection from the Dartmoor Trust Archive`}
    description={`The ${col.title} Collection from the Dartmoor Trust Archive`}
  />

  <Container>
    <div class="flex flex-cols gap-5">
      <div class="basis-1/3">
        <Heading text={col.title + " Collection"} />
        <div class="flex-rows gap-4 text-gray-800 space-y-3">
          {#if col.description}
            <div class="flex flex-col gap-3">
              {@html col.description}
            </div>
          {/if}
          {#if col.copyright}
            <span class="flex gap-3">
              <Icon icon="solar:copyright-outline" width="24" height="24" />
              <a href={col.copyright_url}>
                {col.copyright}
              </a>
            </span>
          {/if}
        </div>

        {#await searchData then data}
          <div class="flex flex-col gap-3">
            <div class="flex gap-3">
              <Icon
                icon="solar:layers-minimalistic-outline"
                width="24"
                height="24"
              />
              {data.pagination?.full_count + " results" || "No results"}
            </div>
            <Pagination pagination={data.pagination} />
          </div>
        {/await}
      </div>

      <div class="basis-2/3">
        {#await searchData}
          <p>Loading records...</p>
        {:then data}
          <RecordGrid records={data.records} />
        {/await}
      </div>
    </div>
  </Container>
{/await}
