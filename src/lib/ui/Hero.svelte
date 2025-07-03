<script lang="ts">
  let { children = null, bgimage } = $props();
</script>

<div
  class="bg-cover bg-center bg-no-repeat h-[50vh]"
  style="background-image: url({bgimage})"
>
  {#if children}
    {@render children?.()}
  {/if}
</div>
