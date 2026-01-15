<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import RecordGrid from "$lib/ui/RecordGrid.svelte";
  import Seo from "$lib/ui/SEO.svelte";
  import Icon from "@iconify/svelte";
  import Pagination from "$lib/ui/Pagination.svelte";
  import { searchRecords } from "../../data.remote.js";
  import Container from "$lib/ui/Container.svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  // Reactive URL parameters
  const currentPage = $derived(Number(page.url.searchParams.get("page")) || 1);
  const urlQuery = $derived(page.url.searchParams.get("q") || "");
  const currentLimit = $derived(
    Number(page.url.searchParams.get("limit")) || 25,
  );

  // Local search input state
  let searchInput = $state(urlQuery);
  let isLoading = $state(false);

  // Sync input with URL query
  $effect(() => {
    searchInput = urlQuery;
  });

  // Reactive search - refetches when dependencies change
  let searchData = $state(null);

  $effect(() => {
    isLoading = true;
    // This effect runs whenever currentPage, urlQuery, or currentLimit changes
    searchRecords({
      q: urlQuery,
      page: currentPage,
      limit: currentLimit,
    })
      .then((data) => {
        searchData = data;
        isLoading = false;
      })
      .catch((error) => {
        console.error("Search failed:", error);
        isLoading = false;
      });
  });

  // Handle search submission
  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams(page.url.searchParams);
    params.set("q", searchInput);
    params.set("page", "1");
    goto(`?${params.toString()}`);
  }

  // Handle limit change
  function handleLimitChange(e) {
    const params = new URLSearchParams(page.url.searchParams);
    params.set("limit", e.target.value);
    params.set("page", "1"); // Reset to first page when changing limit
    goto(`?${params.toString()}`);
  }

  // Destructure for cleaner template use
  const records = $derived(searchData?.records ?? []);
  const pagination = $derived(searchData?.pagination);

  const limitOptions = [
    { value: 25, label: "25 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];
</script>

<Seo
  title={urlQuery
    ? `Search results for "${urlQuery}" - Dartmoor Trust Archive`
    : "Search - Dartmoor Trust Archive"}
  description={urlQuery
    ? `Search results for "${urlQuery}" from the Dartmoor Trust Archive`
    : "Search the Dartmoor Trust Archive"}
/>

<Container>
  <div class="flex flex-col lg:flex-row gap-5">
    <div class="basis-full lg:basis-1/3">
      <Heading text="Search Results" />

      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <Icon
            icon="solar:layers-minimalistic-outline"
            width="24"
            height="24"
            class="flex-shrink-0"
          />
          <span>
            {#if isLoading}
              Loading...
            {:else if pagination?.full_count !== undefined}
              {pagination.full_count}
              {pagination.full_count === 1 ? "result" : "results"}
            {:else}
              No results
            {/if}
          </span>
        </div>

        <form onsubmit={handleSearch} class="flex flex-col gap-3">
          <input
            type="text"
            class="rounded-lg p-2 bg-white border-gray-200 border-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
            bind:value={searchInput}
            placeholder="Search the archive..."
            disabled={isLoading}
          />

          <select
            class="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            value={currentLimit}
            onchange={handleLimitChange}
            disabled={isLoading}
            aria-label="Results per page"
          >
            {#each limitOptions as option}
              <option value={option.value}>
                {option.label}
              </option>
            {/each}
          </select>

          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || searchInput === urlQuery}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {#if pagination && !isLoading}
          <Pagination {pagination} />
        {/if}
      </div>
    </div>

    <div class="basis-full lg:basis-2/3">
      {#if isLoading}
        <div class="flex items-center justify-center py-12">
          <p class="text-gray-500">Loading records...</p>
        </div>
      {:else if records.length > 0}
        <RecordGrid {records} />
      {:else if urlQuery}
        <div
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <Icon
            icon="solar:magnifer-outline"
            width="48"
            height="48"
            class="text-gray-400 mb-4"
          />
          <p class="text-gray-600 text-lg">No results found for "{urlQuery}"</p>
          <p class="text-gray-500 mt-2">Try adjusting your search terms</p>
        </div>
      {:else}
        <div
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <Icon
            icon="solar:magnifer-outline"
            width="48"
            height="48"
            class="text-gray-400 mb-4"
          />
          <p class="text-gray-600 text-lg">Enter a search term to begin</p>
        </div>
      {/if}
    </div>
  </div>
</Container>
