<script lang="ts">
  import ArchiveImage from "$lib/ui/ArchiveImage.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Map from "$lib/ui/Map.svelte";
  import type { PageData } from "./$types";
  import Seo from "$lib/ui/SEO.svelte";
  import DownloadButton from "$lib/ui/DownloadButton.svelte";
  import EditButton from "$lib/ui/EditButton.svelte";
  import RecordInfo from "$lib/ui/RecordInfo.svelte";
  import Grid from "$lib/ui/Grid.svelte";
  import Flex from "$lib/ui/Flex.svelte";
  import AudioPlayer from "$lib/ui/AudioPlayer.svelte";
  import MobileHidden from "$lib/ui/MobileHidden.svelte";
  import VideoPlayer from "$lib/ui/VideoPlayer.svelte";
  let { data }: { data: PageData } = $props();
  console.log(data.record);
</script>

{#if data.record.public == false}
  <div>This record is not public</div>
{:else}
  <Seo
    title={data.record?.title || "Dartmoor Trust Archive"}
    description={data.record?.title || "Dartmoor Trust Archive"}
    image={`https://dartmoorpublic.lon1.digitaloceanspaces.com/w-${data.record?.file_id || ""}`}
  />
  <div class="md:hidden">
    <ArchiveImage record={data.record} grow={true} />
  </div>
  <div class="flex md:grid grid-cols-2 p-5 md:px-0 md:gap-5 container mx-auto">
    <Flex>
      <Heading text={data.record.title} />
      <Grid cols={2} gap={6}>
        <RecordInfo
          label={data.record.colname + " Collection"}
          icon={"solar:inbox-outline"}
          href={`/archive/collection/${data.record.colslug}`}
        />
        <!-- <RecordInfo
          label="Tell us more"
          icon={"solar:lightbulb-minimalistic-linear"}
          href={`/archive/record/${data.record.id}/feedback`}
        /> -->
        {#if data.record.date_day || data.record.date_month || data.record.date_year}
          <RecordInfo
            label={`${data.record.date_day || "?"}/${data.record.date_month || "?"}/${data.record.date_year || "?"}`}
            icon={"solar:calendar-outline"}
          />
        {/if}
        <DownloadButton record={data.record} />
        <EditButton record={data.record} />
        <!-- <FaveButton fave /> -->
      </Grid>
      <div class="text-lg space-y-3">
        {data.record.detail ||
          "We do not have any further information on this record - if you know something, please let us know. You can use the button above or email secretary@dartmoortrust.org"}
      </div>
    </Flex>
    <div>
      {#if data.record.file_mime.startsWith("audio")}
        <AudioPlayer record={data.record} />
      {:else if data.record.file_mime.startsWith("video")}
        <VideoPlayer record={data.record} />
      {:else}
        <MobileHidden>
          <ArchiveImage record={data.record} crop={false} />
        </MobileHidden>
      {/if}
      <Map
        geojson={data.record.geojson}
        estimated={data.record.location_estimated}
      />
    </div>
  </div>
{/if}
