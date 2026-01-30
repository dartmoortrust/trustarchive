<script>
  import { env } from "$env/dynamic/public";
  import { geohashToLatLng, latLngToGeohash } from "../tools";
  import { DefaultMarker, MapLibre } from "svelte-maplibre";
  import MarkerInfo from "./MarkerInfo.svelte";
  let { updateRecord } = $props();
  let coords = $derived(geohashToLatLng(updateRecord.fields.geohash.value()));
  $inspect(coords);
</script>

<MapLibre
  center={coords ? [coords.lng, coords.lat] : [-3.65, 50.65]}
  zoom={coords ? 15 : 8}
  class="w-full relative h-[30rem] z-0"
  style={`https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${env.PUBLIC_OS_KEY}`}
  onclick={(e) => {
    console.log(e.lngLat);
    let geohash = latLngToGeohash(e.lngLat.lat, e.lngLat.lng);
    updateRecord.fields.geohash.set(geohash);
  }}
>
  {#if coords}
    <MarkerInfo lat={coords.lat} lng={coords.lng} />
    <DefaultMarker lngLat={[coords.lng, coords.lat]} />
  {/if}
</MapLibre>
