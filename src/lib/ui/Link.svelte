<script lang="ts">
  import Icon from "@iconify/svelte";
  let { href, text } = $props();
</script>

<a class="flex items-center gap-1 text-green-800" {href}
  ><Icon icon="solar:link-bold" />{text}</a
>
