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
  import Markdown from "$lib/ui/Markdown.svelte";
  import Container from "$lib/ui/Container.svelte";
  let { data }: { data: PageData } = $props();
</script>

{#if data.record.public == false}
  <div>This record is not public</div>
{:else}
  <Seo
    title={data.record?.title || "Dartmoor Trust Archive"}
    description={data.record?.title || "Dartmoor Trust Archive"}
  />
  <div class="md:hidden">
    <ArchiveImage record={data.record} grow={true} />
  </div>
  <Container>
    <div class="flex md:grid grid-cols-2 md:px-0 md:gap-20 container mx-auto">
      <Flex>
        <Heading text={data.record.title} />
        <Grid cols={2} gap={10}>
          <RecordInfo
            label={data.record.colname + " Collection"}
            icon={"solar:inbox-outline"}
            href={`/archive/collection/${data.record.colslug}`}
          />

          {#if data.record.date_day || data.record.date_month || data.record.date_year}
            <RecordInfo
              label={`${data.record.date_day || "?"}/${data.record.date_month || "?"}/${data.record.date_year || "?"}`}
              icon={"solar:calendar-outline"}
            />
          {/if}
          <DownloadButton record={data.record} />
          <EditButton record={data.record} />
        </Grid>
        <div class="flex flex-col text-lg gap-10 py-5 space-y-5">
          {#if data.record.detail}
            {@html data.record.detail}
          {/if}
          {#if data.record.ai_markdown}
            <Markdown md={data.record.ai_markdown} />
          {/if}
        </div>
      </Flex>
      <div>
        {#if data.record.mime_type.startsWith("audio")}
          <AudioPlayer record={data.record} />
        {:else if data.record.mime_type.startsWith("video")}
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
  </Container>
{/if}
