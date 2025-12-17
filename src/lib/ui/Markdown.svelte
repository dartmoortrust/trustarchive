<script lang="ts">
  import { marked } from "marked";
  let { md } = $props();

  let content = $derived(marked(md));
</script>

{@html content}
