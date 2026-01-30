<script lang="ts">
  import { latLng2OSGB } from "$lib/os";
  import Icon from "@iconify/svelte";
  let { lat, lng, estimated = false } = $props();
  let osgr = $derived(latLng2OSGB(lng, lat));
</script>

<div
  class="flex items-middle absolute left-1 bg-white p-2 top-1 items-center gap-2 z-10"
>
  <Icon icon="solar:point-on-map-bold-duotone" width="24" height="24" />
  {#if lat & lng}
    {osgr} {estimated ? "(estimated)" : ""}
  {:else}
    No Marker
  {/if}
</div>
