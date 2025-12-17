<script lang="ts">
  let { children, py = false } = $props();
  let css = $derived(`container mx-auto ${py && "py-10"}`);
</script>

<div class={css}>
  {@render children?.()}
</div>
