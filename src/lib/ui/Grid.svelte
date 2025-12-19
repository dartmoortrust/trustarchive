<script lang="ts">
  let { children, cols = 1, gap = 10 } = $props();
</script>

<div class="grid md:grid-cols-2 gap-10">
  {@render children?.()}
</div>
