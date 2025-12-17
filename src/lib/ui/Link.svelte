<script lang="ts">
  import { LinkSimple } from "phosphor-svelte";

  let { href, text } = $props();
</script>

<a class="flex items-center gap-1 text-green-800" {href}><LinkSimple />{text}</a
>
