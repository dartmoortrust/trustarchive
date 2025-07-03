<script lang="ts">
  let { items } = $props();
</script>

<div class="flex">
  {#each items as item}
    <a href={item.url}>{item.title}</a>
  {/each}
</div>
