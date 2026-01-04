<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import RecordGrid from "$lib/ui/RecordGrid.svelte";
  import Seo from "$lib/ui/SEO.svelte";
  import { searchRecords } from "../../data.remote";
  import { page } from "$app/state";
  import Container from "$lib/ui/Container.svelte";
  import { changeUrl } from "$lib/tools";

  let query = $derived({
    q: String(page.url.searchParams.get("q")) || "",
    page: Number(page.url.searchParams.get("page")) || 1,
    limit: Number(page.url.searchParams.get("limit")) || 25,
  });

  // Store the promise
  let searchPromise = $derived(searchRecords(query));

  const handleLimitChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    if (target.value) {
      changeUrl({
        limit: target.value,
        page: "1",
      });
    }
  };
</script>

<Seo
  title={`Search results from the Dartmoor Trust Archive`}
  description={`Search results from the Dartmoor Trust Archive`}
/>

{#await searchPromise}
  <Container>
    <p>Loading...</p>
  </Container>
{:then { records, pagination }}
  <Container>
    <div class="flex gap-5">
      <div>
        <Heading text="Search The Archive" />
        <div class="flex flex-col gap-3">
          <form class="flex flex-col gap-3">
            <input
              id="searchQuery"
              name="q"
              class="p-2 border-2 w-full"
              value={pagination?.q || ""}
            />
            <select
              name="limit"
              id="searchLimit"
              class="w-full border-2 p-3"
              value={pagination?.limit || 25}
              aria-label="Results per page"
              onchange={handleLimitChange}
            >
              <option value={25}>25 results per page</option>
              <option value={50}>50 results per page</option>
              <option value={100}>100 results per page</option>
            </select>
            <button
              class="bg-green-800 text-white py-2 hover:cursor-pointer"
              type="submit">Search</button
            >
          </form>
        </div>
      </div>
      <div>
        <RecordGrid {records} />
      </div>
    </div>
  </Container>
{:catch error}
  <Container>
    <p>Error loading search results: {error.message}</p>
  </Container>
{/await}
