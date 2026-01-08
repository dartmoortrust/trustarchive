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

  const currentPage = $derived(Number(page.url.searchParams.get("page")) || 1);
  const currentLimit = $derived(
    Number(page.url.searchParams.get("limit")) || 25,
  );

  /**
   * FIX: We use ONE $derived block to initiate both fetches.
   * By calling the functions and THEN awaiting them, we ensure
   * the network requests fire in parallel.
   */
  const data = $derived.by(async () => {
    // 1. Kick off both requests immediately (Parallel)
    const cPromise = getCollectionById(params.id);
    const sPromise = searchRecords({
      q: "",
      collection_id: params.id,
      page: currentPage,
      limit: currentLimit,
    });

    // 2. Wait for them to finish
    return {
      collection: await cPromise,
      searchData: await sPromise,
    };
  });

  // Helper getters to keep your template clean
  // These use optional chaining because 'data' is a Promise while pending
  const collection = $derived(await data.then((d) => d.collection));
  const searchData = $derived(await data.then((d) => d.searchData));

  const records = $derived(searchData?.records ?? []);
  const pagination = $derived(searchData?.pagination);
</script>

{#if collection}
  <Seo
    title={`The ${collection.title} Collection from the Dartmoor Trust Archive`}
    description={`The ${collection.title} Collection from the Dartmoor Trust Archive`}
  />
{/if}

<Container>
  <div class="flex flex-cols gap-5">
    <div class="basis-1/3">
      {#if collection}
        <Heading text={collection.title + " Collection"} />
        <div class="flex-rows gap-4 text-gray-800 space-y-3">
          {#if collection.description}
            <div class="flex flex-col gap-3">
              {@html collection.description}
            </div>
          {/if}
          {#if collection.copyright}
            <span class="flex gap-3">
              <Icon icon="solar:copyright-outline" width="24" height="24" />
              <a href={collection.copyright_url}>{collection.copyright}</a>
            </span>
          {/if}
        </div>
      {:else}
        <div class="animate-pulse bg-gray-200 h-8 w-3/4 mb-4 rounded"></div>
      {/if}

      <div class="flex flex-col gap-3 mt-6">
        <div class="flex gap-3">
          <Icon
            icon="solar:layers-minimalistic-outline"
            width="24"
            height="24"
          />
          {#if searchData}
            {pagination?.full_count ?? 0} results
          {:else}
            Loading results...
          {/if}
        </div>

        {#if pagination}
          <Pagination {pagination} />
        {/if}
      </div>
    </div>

    <div class="basis-2/3">
      {#if searchData}
        <RecordGrid {records} />
      {:else}
        <div class="grid grid-cols-2 gap-4">
          <div class="animate-pulse bg-gray-100 h-64 rounded"></div>
          <div class="animate-pulse bg-gray-100 h-64 rounded"></div>
        </div>
      {/if}
    </div>
  </div>
</Container>
