<script lang="ts">
  import { env } from "$env/dynamic/public";
  import MarkerInfo from "./MarkerInfo.svelte";
  import { DefaultMarker, MapLibre } from "svelte-maplibre";
  let { geojson = $bindable(), estimated = false, edit = false } = $props();
</script>

{#if geojson[0] !== null || edit}
  <MapLibre
    center={geojson[0] !== null ? geojson : [-3.75, 50.6]}
    zoom={geojson[0] !== null ? 15 : 9}
    class="w-full relative h-[30rem] z-0 "
    style={`https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${env.PUBLIC_OS_KEY}`}
    onclick={(e) => (geojson = [e.lngLat.lng, e.lngLat.lat])}
  >
    {#if geojson[0] !== null}
      <MarkerInfo lat={geojson[0]} lng={geojson[1]} {estimated} />
      <DefaultMarker
        lngLat={geojson}
        draggable={edit}
        ondragend={(e) =>
          (geojson = [e.marker._lngLat.lng, e.marker._lngLat.lat])}
      />
    {/if}
  </MapLibre>
{/if}
