<script>
  let { text, subtitle = null, level = 1, light = false } = $props();
</script>

{#if text}
  {#if level === 3}
    <h3>{text}</h3>
  {:else if level === 2}
    <h2>
      {text}
    </h2>
  {:else}
    <h1>
      {text}
    </h1>
  {/if}
  {#if subtitle}
    <p class="subtitle">{subtitle}</p>
  {/if}
{/if}

<style>
  h1 {
    font-size: 3em;
    font-weight: 900;
    color: rgb(31, 31, 31);
  }
  h2 {
    font-size: 2em;
    font-weight: 900;
    color: rgb(31, 31, 31);
  }
  h3 {
    font-size: 1em;
    font-weight: 900;
    color: rgb(31, 31, 31);
  }
  .subtitle {
    font-size: 1em;
  }
</style>
