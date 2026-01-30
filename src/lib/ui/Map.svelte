<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { decodeBase32 } from "geohashing";
  import MarkerInfo from "./MarkerInfo.svelte";
  import { DefaultMarker, MapLibre } from "svelte-maplibre";

  let { geohash, estimated = false } = $props();

  let coords = $derived.by(() => {
    if (!geohash) return null;
    try {
      return decodeBase32(geohash);
    } catch (e) {
      console.error("Invalid geohash:", geohash);
      return null;
    }
  });
</script>

{#if geohash}
  <MapLibre
    center={coords ? [coords.lng, coords.lat] : [-3.65, 50.65]}
    zoom={coords ? 15 : 8}
    class="w-full relative h-[30rem] z-0"
    style={`https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${env.PUBLIC_OS_KEY}`}
  >
    {#if coords}
      <MarkerInfo lat={coords.lat} lng={coords.lng} {estimated} />
      <DefaultMarker lngLat={[coords.lng, coords.lat]} />
    {/if}
  </MapLibre>
{/if}
