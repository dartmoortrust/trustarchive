<script lang="ts">
  import ArchiveImage from "$lib/ui/ArchiveImage.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Map from "$lib/ui/Map.svelte";
  import Seo from "$lib/ui/SEO.svelte";
  import DownloadButton from "$lib/ui/DownloadButton.svelte";
  import EditButton from "$lib/ui/EditButton.svelte";
  import Grid from "$lib/ui/Grid.svelte";
  import Flex from "$lib/ui/Flex.svelte";
  import AudioPlayer from "$lib/ui/AudioPlayer.svelte";
  import MobileHidden from "$lib/ui/MobileHidden.svelte";
  import VideoPlayer from "$lib/ui/VideoPlayer.svelte";
  import Container from "$lib/ui/Container.svelte";
  import { Archive, Clock, Info } from "phosphor-svelte";
  import Markdown from "$lib/ui/Markdown.svelte";
  import Link from "$lib/ui/Link.svelte";
  import { getRecord } from "../../../data.remote";
  let { params } = $props();
  const record = $derived(await getRecord(params.id));
</script>

{#if record.public == false}
  <div>This record is not public</div>
{:else}
  <Seo
    title={record?.title || "Dartmoor Trust Archive"}
    description={record?.title || "Dartmoor Trust Archive"}
  />
  <div class="md:hidden">
    <ArchiveImage {record} grow={true} />
  </div>
  <Container>
    <Flex>
      <Heading text={record.title} />
      <Grid cols={2}>
        <Flex>
          <div class="bg-white p-2 shadow">
            <div class="flex items-center gap-2">
              <Archive />Collection:
              <Link
                href={`/archive/collection/${record.colslug}`}
                text={record.colname + " Collection"}
              />
            </div>
            <div class="flex items-center gap-2">
              <Clock />Date: {`${record.date_day || "?"}/${record.date_month || "?"}/${record.date_year || "?"}`}
            </div>
            <div class="flex items-center gap-2">
              <Info />Caption (front): {record.caption_front || "?"}
            </div>
            <div class="flex items-center gap-2">
              <Info />Caption (rear): {record.caption_rear || "?"}
            </div>
          </div>
          <div class="flex gap-2">
            <DownloadButton {record} />
            <EditButton {record} />
          </div>

          <Markdown md={record.detail || ""} />
        </Flex>
        <Flex>
          {#if record.file_mime.startsWith("audio")}
            <AudioPlayer {record} />
          {:else if record.file_mime.startsWith("video")}
            <VideoPlayer {record} />
          {:else}
            <MobileHidden>
              <ArchiveImage {record} crop={false} />
            </MobileHidden>
          {/if}
          <Map geojson={record.geojson} estimated={record.location_estimated} />
        </Flex>
      </Grid>
    </Flex>
  </Container>
{/if}
