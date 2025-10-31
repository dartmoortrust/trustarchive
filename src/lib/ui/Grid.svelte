<script lang="ts">
  let { children, cols = 1, gap = 10 } = $props();
  const gridcols = $derived(`md:grid-cols-${cols}`);
  const gridgap = $derived(`gap-${gap} md:gap-${gap}`);
</script>

<div class={`grid ${gridcols} ${gridgap}`}>
  {@render children?.()}
</div>
