<script lang="ts">
  let { children, dir = "col", space = 8 } = $props();

  // FIX: Use $derived so these update when 'dir' or 'space' change
  let flexdir = $derived(`flex-${dir}`);
  let flexgap = $derived(`gap-${space / 2} md:gap-${space}`);
</script>

<div class={`flex ${flexdir} ${flexgap}`}>
  {@render children?.()}
</div>
