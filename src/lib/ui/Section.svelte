<script lang="ts">
  let { children, background = "" } = $props();
</script>

<div class={`flex flex-col  gap-3 p-5 bg-${background} md:p-10`}>
  {@render children?.()}
</div>
