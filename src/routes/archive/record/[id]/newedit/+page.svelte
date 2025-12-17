<script>
  import Container from "$lib/ui/Container.svelte";
  import Flex from "$lib/ui/Flex.svelte";
  import Grid from "$lib/ui/Grid.svelte";
  import { getRecord, updateRecord } from "../../../../data.remote";
  import ArchiveImage from "$lib/ui/ArchiveImage.svelte";
  import Heading from "$lib/ui/Heading.svelte";

  let { params } = $props();
  let record = $derived(await getRecord(params.id));
  $effect(() => {
    if (record) {
      updateRecord.fields.set(record);
    }
  });
</script>

<Container>
  <Heading text="Edit Page" level={1} />
  <Grid cols={2}>
    <Flex>
      <form {...updateRecord} class="flex flex-col gap-10">
        <input {...updateRecord.fields.id.as("text")} value={record?.id} />
        <label>
          <h2>Title</h2>
          <input
            {...updateRecord.fields.title.as("text")}
            class="w-full border-1"
          />
          {#each updateRecord.fields.title.issues() as issue}
            <p class="issue">{issue.message}</p>
          {/each}
        </label>
        <label>
          <h2>Caption Front</h2>
          <input
            {...updateRecord.fields.caption_front.as("text")}
            class="w-full border-1"
          />
          {#each updateRecord.fields.caption_front.issues() as issue}
            <p class="issue">{issue.message}</p>
          {/each}
        </label>
        <button>Save</button>
        <!-- rest of form -->
      </form>
    </Flex>
    <Flex>
      {#await record then data}
        <ArchiveImage record={data} />
      {/await}
    </Flex>
  </Grid>
</Container>
