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
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

{#if data.record.public == false}
  <div>This record is not public</div>
{:else}
  <Seo
    title={data.record.title || "Dartmoor Trust Archive"}
    description={data.record.title || "Dartmoor Trust Archive"}
  />
  <div class="md:hidden">
    <ArchiveImage record={data.record} grow={true} />
  </div>
  <Container>
    <Flex>
      <Heading text={data.record.title} />
      <Grid cols={2}>
        <Flex>
          <div class="bg-white p-2 shadow">
            <div class="flex items-center gap-2">
              <Icon icon="solar:box-broken" />Collection:
              <Link
                href={`/archive/collection/${data.record.colslug}`}
                text={data.record.colname + " Collection"}
              />
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="solar:calendar-broken" />Date: {`${data.record.date_day || "?"}/${data.record.date_month || "?"}/${data.record.date_year || "?"}`}
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="solar:pen-outline" />Caption (front): {data.record.caption_front ||
                "?"}
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="solar:pen-outline" />Caption (rear): {data.record.caption_rear ||
                "?"}
            </div>
          </div>
          <div class="flex gap-2">
            <DownloadButton record={data.record} />
            <EditButton record={data.record} />
          </div>

          <Markdown md={data.record.detail || ""} />
        </Flex>
        <Flex>
          {#if data.record.file_mime.startsWith("audio")}
            <AudioPlayer record={data.record} />
          {:else if data.record.file_mime.startsWith("video")}
            <VideoPlayer record={data.record} />
          {:else}
            <MobileHidden>
              <ArchiveImage record={data.record} crop={false} />
            </MobileHidden>
          {/if}
          <Map geojson={data.record.geojson} estimated={data.record.location_estimated} />
        </Flex>
      </Grid>
    </Flex>
  </Container>
{/if}
