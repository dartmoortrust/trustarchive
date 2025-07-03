<script lang="ts">
  import { env } from "$env/dynamic/public";
  import MarkerInfo from "./MarkerInfo.svelte";
  import { DefaultMarker, MapLibre } from "svelte-maplibre";
  let { geojson, estimated } = $props();
</script>

{#if geojson}
  <MapLibre
    center={geojson?.coordinates}
    zoom={15}
    class="w-full relative h-[30rem] "
    style={`https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${env.PUBLIC_OS_KEY}`}
  >
    <MarkerInfo
      lat={geojson?.coordinates[0]}
      lng={geojson?.coordinates[1]}
      {estimated}
    />
    <DefaultMarker lngLat={geojson.coordinates} />
  </MapLibre>
{/if}
