<script lang="ts">
  import { marked } from "marked";
  import RobotIcon from "./icons/RobotIcon.svelte";
  let { md } = $props();
  const html = marked.parse(md);
</script>

<div class="w-full bg-white border-2 border-gray-300 rounded-md p-5">
  <div class="mb-2 flex items-center gap-4 border-b-1 pb-2">
    <RobotIcon />AI Summary
  </div>
  <div class="prose prose-sm">
    {@html html}
  </div>
</div>
