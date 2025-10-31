<script lang="ts">
  import Icon from "@iconify/svelte";
  let { label, icon, href = null } = $props();
</script>

<a
  {href}
  class={`flex gap-3 bg-white shadow-md p-2 text-gray-800 ${href && "hover:shadow-xl transition-all"} items-center`}
  data-sveltekit-preload-data="false"
>
  {#if icon}
    <Icon {icon} width="24" height="24" />
    <i class={icon}></i>
  {/if}
  {label}
</a>
