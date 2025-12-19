<script lang="ts">
  let { children, py = false } = $props();
  let css = $derived(`container mx-auto px-5 md:px-0 ${py && "py-10"}`);
</script>

<div class={css}>
  {@render children?.()}
</div>
