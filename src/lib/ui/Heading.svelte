<script>
  let { text, subtitle = null, level = 1, light = false } = $props();
</script>

{#if text}
  {#if level === 3}
    <h3 class="text-gray-800 text-xl">{text}</h3>
  {:else if level === 2}
    <h2 class={`text-gray-800 text-3xl font-bold ${light ? "text-white" : ""}`}>
      {text}
    </h2>
  {:else}
    <h1
      class={`text-gray-800 mb-3 text-4xl md:text-5xl ${light ? "text-white" : ""}`}
    >
      {text}
    </h1>
  {/if}
  {#if subtitle}
    <p class="text-lg">{subtitle}</p>
  {/if}
{/if}
