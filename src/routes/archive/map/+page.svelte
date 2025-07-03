<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { MapLibre, GeoJSON, CircleLayer, MapEvents } from "svelte-maplibre";
  import ArchiveImage from "$lib/ui/ArchiveImage.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Button from "$lib/ui/Button.svelte";
  import Icon from "@iconify/svelte";
  import { fly } from "svelte/transition";
  let { data } = $props();
  let marker = $state();
  let mapCenter = $state();
  let sideBar = $state(false);
</script>

<div class="">
  {#if sideBar}
    <div
      class="absolute flex flex-col gap-10 p-10 top-0 left-0 w-1/2 bg-white z-20 h-full"
      transition:fly={{ x: -100, duration: 500 }}
    >
      {#if marker}
        <Heading text={marker?.title} level={2} />
        {#key marker.id}
          <ArchiveImage record={marker} size={350} />
        {/key}
        <Button href={`/archive/record/${marker.id}`} text="View Record" />
      {:else}
        <h2>Select a Marker</h2>
      {/if}
    </div>
  {/if}
  <MapLibre
    center={[-3.7, 50.55]}
    class="relative h-[90vh] w-full sm:aspect-video sm:max-h-full"
    zoom={9}
    style={`https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${env.PUBLIC_OS_KEY}`}
  >
    <MapEvents
      onmoveend={(e) => {
        let newCenter = e.target.getCenter();
        mapCenter = newCenter.lat.toFixed(3) + ", " + newCenter.lng.toFixed(3);
      }}
      onclick={(e) => {
        sideBar = false;
      }}
    />

    <GeoJSON id="states" data={data.records} promoteId="STATEFP">
      <CircleLayer
        id="earthquakes-circle"
        source="states"
        minzoom={7}
        onclick={(e) => {
          marker = e.features[0].properties;
          sideBar = true;
        }}
        paint={{
          "circle-radius": 7,
          "circle-color": " #006666",
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
        }}
      />
    </GeoJSON>
    <div class="absolute right-5 top-5 z-50 bg-white rounded-lg p-3">
      <div class="flex items-center gap-2">
        <Icon icon="bi:map-marker" class="" /> Map Center {mapCenter}
      </div>
    </div>
  </MapLibre>
</div>
