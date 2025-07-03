<script lang="ts">
  let { children, dir = "col", space = 8 } = $props();
  const flexdir = `flex-${dir}`;
  const flexgap = `gap-${space / 2} md:gap-${space}`;
</script>

<div class={`flex ${flexdir} ${flexgap}`}>
  {@render children?.()}
</div>
