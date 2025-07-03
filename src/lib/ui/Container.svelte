<script lang="ts">
  let { children, verticalpad = 10 } = $props();
  const verticalpadding = `py-${verticalpad}`;
</script>

<div class={`container md:mx-auto ${verticalpadding}`}>
  {@render children?.()}
</div>
