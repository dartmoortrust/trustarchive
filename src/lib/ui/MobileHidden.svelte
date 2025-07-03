<script lang="ts">
  let { children } = $props();
</script>

<div class="hidden md:block">
  {@render children?.()}
</div>
