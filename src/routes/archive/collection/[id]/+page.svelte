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

  // Reactive URL parameters
  const currentPage = $derived(Number(page.url.searchParams.get("page")) || 1);
  const currentLimit = $derived(
    Number(page.url.searchParams.get("limit")) || 25,
  );

  // New Svelte 5 Async Deriveds
  // These will re-run automatically when params.id, currentPage, or currentLimit change
  const collection = $derived(await getCollectionById(params.id));

  const searchData = $derived(
    collection
      ? await searchRecords({
          q: "",
          collection_id: collection.id,
          page: currentPage,
          limit: currentLimit,
        })
      : null,
  );

  // Destructure for cleaner template use
  const records = $derived(searchData?.records ?? []);
  const pagination = $derived(searchData?.pagination);
</script>

{#if collection}
  <Seo
    title={`The ${collection.title} Collection from the Dartmoor Trust Archive`}
    description={`The ${collection.title} Collection from the Dartmoor Trust Archive`}
  />

  <Container>
    <div class="flex flex-cols gap-5">
      <div class="basis-1/3">
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
              <a href={collection.copyright_url}>
                {collection.copyright}
              </a>
            </span>
          {/if}
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex gap-3">
            <Icon
              icon="solar:layers-minimalistic-outline"
              width="24"
              height="24"
            />
            {pagination?.full_count
              ? `${pagination.full_count} results`
              : "Loading..."}
          </div>

          {#if pagination}
            <Pagination {pagination} />
          {/if}
        </div>
      </div>

      <div class="basis-2/3">
        {#if records.length > 0}
          <RecordGrid {records} />
        {:else}
          <p>Loading records...</p>
        {/if}
      </div>
    </div>
  </Container>
{/if}
