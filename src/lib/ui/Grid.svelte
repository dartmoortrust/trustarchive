<script lang="ts">
  let { children, cols = 1, gap = 10 } = $props();
  const gridcols = `md:grid-cols-${cols}`;
  const gridgap = `gap-${gap / 2} md:gap-${gap}`;
</script>

<div class={`grid ${gridcols} ${gridgap}`}>
  {@render children?.()}
</div>
