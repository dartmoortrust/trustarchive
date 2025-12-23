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
  import Markdown from "$lib/ui/Markdown.svelte";
  import Link from "$lib/ui/Link.svelte";
  import Icon from "@iconify/svelte";
  import { getRecord } from "../../../data.remote";
  import SEO from "$lib/ui/SEO.svelte";
  import { getRecordImageWebUrl } from "$lib/image";
  let { params } = $props();
  const record = $derived(await getRecord(params.id));
</script>

{#if record.public === false}
  <div>This record is not public</div>
{:else}
  <SEO
    title={record.title || "A record from the Dartmoor Trust Archive"}
    description={record.detail ||
      "Historical information from a record depicting life and times on Dartmoor"}
    keywords={record.title + "dartmoor history photographs heritage"}
    canonical="https://example.com/products/item"
    ogType="website"
    ogImage={record.title || "A record from the Dartmoor Trust Archive"}
    ogImageAlt="Archive Photograph"
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Website",
      name: `${record.title || "A record from the Dartmoor Trust Archive"}`,
      description:
        record.detail ||
        "Historical information from a record depicting life and times on Dartmoor",
      image: getRecordImageWebUrl(record, 500, false),
    }}
  />
  <div class="md:hidden">
    <ArchiveImage {record} size={300} crop={true} />
  </div>
  <Container>
    <Flex>
      <Heading text={record.title} />
      <Grid cols={2}>
        <Flex>
          <div class="bg-white p-2 shadow">
            <div class="flex items-center gap-2">
              <Icon icon="solar:box-broken" />Collection:
              <Link
                href={`/archive/collection/${record.colslug}`}
                text={record.colname + " Collection"}
              />
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="solar:calendar-broken" />Date: {`${record.date_day || "?"}/${record.date_month || "?"}/${record.date_year || "?"} ${record.date_estimated ? "(circa)" : ""}`}
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="solar:pen-outline" />Caption (front): {record.caption_front ||
                "?"}
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="solar:pen-outline" />Caption (rear): {record.caption_rear ||
                "?"}
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="solar:point-on-map-bold-duotone" />Location Name: {record.location_name ||
                "?"}
            </div>
          </div>
          <div class="flex gap-2">
            <DownloadButton {record} />
            <EditButton {record} />
          </div>
          <Markdown md={record.detail || ""} />
        </Flex>
        <Flex>
          {#if record.mime_type.startsWith("audio")}
            <AudioPlayer {record} />
          {:else if record.mime_type.startsWith("video")}
            <VideoPlayer {record} />
          {:else}
            <MobileHidden>
              <ArchiveImage {record} size={500} crop={false} />
            </MobileHidden>
          {/if}
          <Map geojson={record.geom} estimated={record.location_estimated} />
        </Flex>
      </Grid>
    </Flex>
  </Container>
{/if}
