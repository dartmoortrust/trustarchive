<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import RecordGrid from "$lib/ui/RecordGrid.svelte";
  import Seo from "$lib/ui/SEO.svelte";
  import Icon from "@iconify/svelte";
  import Container from "$lib/ui/Container.svelte";
  import Pagination from "$lib/ui/Pagination.svelte";
  import { goto } from "$app/navigation";
  let { data } = $props();
</script>

<Seo
  title={`The ${data.collection.name} Collection from the Dartmoor Trust Archive`}
  description={`The ${data.collection.name} Collection from the Dartmoor Trust Archive`}
  image={`https://dartmoorweb.s3.eu-west-1.amazonaws.com/w-${data.records[0]?.file_id}`}
/>
<div
  class="container flex flex-col mx-auto md:grid grid-cols-6 p-5 md:px-0 gap-5"
>
  <div class="flex flex-col md:col-span-2 gap-5">
    <Heading text={data.collection.title + " Collection"} />
    <div class="flex-rows gap-4 text-gray-800 space-y-3">
      {#if data.collection.description}
        <div class="flex flex-col gap-3">
          {@html data.collection.description}
        </div>
      {/if}
      {#if data.collection.copyright}
        <span class="flex gap-3">
          <Icon icon="solar:copyright-outline" width="24" height="24" />
          <a href={data.collection.copyright_url}>
            {data.collection.copyright}
          </a>
        </span>
      {/if}
      <div class="flex gap-3">
        <Icon icon="solar:layers-minimalistic-outline" width="24" height="24" />
        {data.pagination?.total_count + " results" || "No results"}
      </div>
      <div class="flex gap-3">
        <Icon
          icon="solar:notebook-minimalistic-linear"
          width="24"
          height="24"
        />
        <span
          >Page {data.pagination?.page + " of " + data.pagination?.page_count}
        </span>
      </div>
    </div>
    <Pagination
      currentPage={data.pagination.page}
      totalPages={data.pagination.page_count}
      onPageChange={(page) => {
        goto(
          `/archive/collection/${data.collection.code}?page=${page}&per_page=${data.pagination.per_page}`,
        );
      }}
    />
  </div>
  <div class="col-span-4">
    {#if data.records.length}
      <RecordGrid records={data.records} />
    {:else}
      <p>There are no public records - check back another time.</p>
    {/if}
  </div>
</div>
