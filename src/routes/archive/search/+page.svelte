<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import RecordGrid from "$lib/ui/RecordGrid.svelte";
  import type { PageData } from "./$types";
  import Seo from "$lib/ui/SEO.svelte";
  import Icon from "@iconify/svelte";
  let { data }: { data: PageData } = $props();
</script>

<Seo
  title={`Search results from the Dartmoor Trust Archive`}
  description={`Search results from the Dartmoor Trust Archive`}
/>
<div class="container mx-auto grid py-5 md:grid-cols-6 md:gap-10">
  <!-- Sidebar with search and pagination -->
  <div class="space-y-5 md:col-span-2">
    <Heading text="Search the Archive" />
    {#if data.pagination}
      <div class="flex-rows space-y-3 bg-gray-50 p-3 text-gray-800">
        <span class="flex gap-3">
          <Icon
            icon="solar:layers-minimalistic-outline"
            width="24"
            height="24"
          />
          {data.pagination?.total_count ?? "No"} results
        </span>
        <span class="flex gap-3">
          <Icon
            icon="solar:notebook-minimalistic-linear"
            width="24"
            height="24"
          />
          Page {data.pagination?.page ?? 1} of {data.pagination?.page_count ??
            1}
        </span>
      </div>

      {#if data.pagination.page_count > 1}
        <div class="hidden gap-2 md:flex md:flex-wrap">
          {#each Array.from( { length: data.pagination.page_count }, ) as _, pageIndex}
            <a
              href={`/archive/search?q=${data.pagination.q}&page=${pageIndex + 1}&per_page=${data.pagination.per_page}`}
              class="bg-gray-200 px-2 py-1 text-center
                  {pageIndex + 1 === data.pagination.page
                ? 'bg-gray-800 text-white shadow-lg'
                : 'hover:bg-gray-300'}"
            >
              {pageIndex + 1}
            </a>
          {/each}
        </div>
      {/if}
    {/if}

    <form class="space-y-3">
      <input
        name="q"
        value={data.pagination?.q ?? ""}
        class="w-full border-2 p-3"
        placeholder="Search records..."
        aria-label="Search for records"
      />
      <select
        name="per_page"
        value={data.pagination?.per_page ?? 25}
        class="w-full border-2 p-3"
        aria-label="Results per page"
      >
        <option value={25}>25 results per page</option>
        <option value={50}>50 results per page</option>
        <option value={100}>100 results per page</option>
      </select>
      <button class="bg-green-800 p-2 text-white" type="submit">Search</button>
    </form>
  </div>

  <!-- Search results -->
  <div class="col-span-4 space-y-5">
    {#if data.results?.length > 0}
      <div class="border-1 border-slate-300 p-2">
        Results are shown with the most relevant records appearing first.
      </div>
      <RecordGrid records={data.results} />
    {:else}
      <Heading level={2} text="Search Tips" />
      <p>You can control your search with the following approaches:</p>
      <p>
        <strong>"Snow Train"</strong> will search for both <b>snow</b> and
        <b>train</b>.
      </p>
      <p>
        <strong>"Snow -Train"</strong> will search for records with
        <b>snow</b>
        but <i>not</i> <b>train</b>.
      </p>
      <p>
        Use an asterisk <strong>Christ*</strong> as a wildcard (e.g.,
        <i>Christow</i>, <i>Christmas</i>, <i>Christian</i>).
      </p>
    {/if}
  </div>
</div>
