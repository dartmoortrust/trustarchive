<script lang="ts">
  let { children, cols = 1, gap = 10 } = $props();
</script>

<div
  class="grid md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
  style:--cols={cols}
  style:--gap="{gap}px"
  style:gap="calc(var(--gap) / 2)"
  class:md:gap-[var(--gap)]={true}
>
  {@render children?.()}
</div>
