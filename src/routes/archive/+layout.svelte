<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "@iconify/svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="container mx-auto py-4">
  <a
    class="inline-flex items-center gap-2 bg-white p-2 shadow transition-all hover:shadow-md"
    href="/archive"
  >
    <Icon icon={"solar:inbox-outline"} />
    All Collections
  </a>
  <a
    class="inline-flex items-center gap-2 bg-white p-2 shadow transition-all hover:shadow-md"
    href="/archive/search"
  >
    <Icon icon={"solar:magnifer-linear"} />
    Search Page
  </a>
</div>
{@render children()}
