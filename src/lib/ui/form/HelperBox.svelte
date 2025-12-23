<script lang="ts">
  let { children } = $props();
</script>

<div class="bg-gray-100 p-3 border-l-2 border-gray-800 text-gray-800 p-4">
  {@render children?.()}
</div>
