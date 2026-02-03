<script lang="ts">
  import Icon from "@iconify/svelte";
  let { href, text, icon = true } = $props();
</script>

<a {href}>
  {#if icon}
    <Icon icon="solar:link-bold" />
  {/if}
  {text}
</a>

<style>
  a {
    display: flex;
    gap: 0.5em;
    align-items: center;
  }
  a:hover {
    color: rgb(60, 100, 60);
    transition: all;
  }
</style>
