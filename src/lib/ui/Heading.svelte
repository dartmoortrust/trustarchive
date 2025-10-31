<script lang="ts">
  import { getRandomGradient } from "$lib/tools";
  let { text, level = 1 } = $props();
  let borderCss = getRandomGradient();
</script>

{#if text}
  {#if level === 3}
    <h3 class="text-xl">{text}</h3>
  {:else if level === 2}
    <h2 class="pt-3 pb-3 font-serif text-3xl first:pt-0">{text}</h2>
  {:else if level === 1}
    <h1
      class={`text-ellipsis mb-3 pt-5  font-serif text-4xl first-of-type:pt-0`}
    >
      {text}
    </h1>
    <div class={`${borderCss} h-1`}></div>
  {/if}
{/if}
