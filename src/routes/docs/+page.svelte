<script lang="ts">
  // Import markdown conversion library
  import { marked } from "marked";
  import markdownString from "./index.md?raw";
  import Container from "$lib/ui/Container.svelte";
</script>

<Container>
  <article class="prose prose-lg max-w-none font-sans">
    {@html marked(markdownString)}
  </article>
</Container>
