<script>
  import { env } from "$env/static/public";
  import maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { onDestroy, onMount } from "svelte";
  let mapstate = $state();
  let mapContainer;
  let lng, lat;

  lng = -4;
  lat = 50;
  let zoom = $state(9);

  let initialState = { lng, lat, zoom };
  onMount(() => {
    let map = new maplibregl.Map({
      container: "map",
      // accessToken: "YOUR_MAPBOX_ACCESS_TOKEN",
      center: [initialState.lng, initialState.lat],
      zoom,
      style:
        "https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=" +
        env.PUBLIC_OS_KEY,
      maxBounds: [
        [-10.76418, 49.528423],
        [1.9134116, 61.331151],
      ],
    });
    map.on("moveend", (e) => (mapstate = e.target));
  });

  // onDestroy(() => {
  //   map.des();
  // });
</script>

<div id="map" class="map h-96 w-full" bind:this={map}></div>
{mapstate}
