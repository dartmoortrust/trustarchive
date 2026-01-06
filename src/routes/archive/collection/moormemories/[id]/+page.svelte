<script>
  import { onMount } from "svelte";
  import Container from "$lib/ui/Container.svelte";
  import Heading from "$lib/ui/Heading.svelte";

  let currentTime = $state(0);
  let allCues = $state([]);
  let audioTag = $state();

  let activeIndex = $derived(
    allCues.findIndex(
      (cue) => currentTime >= cue.start && currentTime <= cue.end,
    ),
  );

  function parseVttTime(timeString) {
    const parts = timeString.split(":");
    const seconds = parseFloat(parts[2].replace(",", "."));
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + seconds;
  }

  function parseVtt(vttText) {
    const regex =
      /(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})\n([\s\S]*?)(?=\n\n|\n$|$)/g;
    const cues = [];
    let match;
    while ((match = regex.exec(vttText)) !== null) {
      cues.push({
        start: parseVttTime(match[1]),
        end: parseVttTime(match[2]),
        text: match[3].replace(/\n/g, " ").trim(),
      });
    }
    return cues;
  }

  function seekTo(seconds) {
    if (audioTag) {
      audioTag.currentTime = seconds;
      // We don't manually set currentTime here to avoid state fighting with the hardware
      audioTag.play().catch(() => {});
    }
  }

  onMount(async () => {
    const response = await fetch("/test/dat02.vtt");
    const text = await response.text();
    allCues = parseVtt(text);
  });
</script>

<Container>
  <article class="transcript-section">
    <Heading text="Ted Dixon" />
    <div class="transcript-body">
      {#each allCues as cue, i}
        <button
          class="cue-word"
          class:active={i === activeIndex}
          onclick={() => seekTo(cue.start)}
        >
          {cue.text}
        </button>
        {" "}
      {/each}
    </div>
  </article>

  <footer class="player-dock">
    <div class="player-container">
      <div class="active-cue-display">
        {#if activeIndex !== -1}
          <p class="active-text">“{allCues[activeIndex].text}”</p>
        {:else}
          <p class="placeholder-text">Click a sentence to begin listening</p>
        {/if}
      </div>

      <div class="audio-wrapper">
        <audio
          bind:this={audioTag}
          src="/test/dat02.mp3"
          bind:currentTime
          controls
          class="w-full"
        ></audio>
      </div>
    </div>
  </footer>
</Container>

<style>
  :global(body) {
    background-color: #fafafb;
    margin: 0;
    color: #1a1a1b;
  }

  .transcript-section {
    max-width: 720px;
    margin: 0 0 12rem; /* Large bottom margin so player doesn't hide text */
    padding: 0 1rem;
  }

  .transcript-body {
    font-family: "Georgia", serif;
    font-size: 1.2rem;
    line-height: 1.4rem;
    color: #334155;
    text-align: left;
  }

  /* Interactive Span Styling */
  .cue-word {
    all: unset;
    cursor: pointer;
    display: inline;
    padding: 0 2px;
    border-radius: 4px;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }

  .cue-word:hover {
    background-color: #f1f5f9;
    color: #000;
  }

  .cue-word.active {
    background-color: #fef08a; /* Soft highlighter yellow */
    color: #1a1a1b;
    box-shadow: 0 0 0 2px #fef08a;
  }

  /* Docked Player UI */
  .player-dock {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid #e2e8f0;
    padding: 1.5rem 1rem;
    z-index: 1000;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.03);
  }

  .player-container {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .active-cue-display {
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .active-text {
    font-size: 0.95rem;
    font-weight: 600;
    color: #eab308;
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
  }

  .placeholder-text {
    font-size: 0.9rem;
    color: #94a3b8;
    margin: 0;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .audio-wrapper audio {
    height: 40px;
  }

  /* Custom Audio Colors (Chrome-only mostly) */
  audio::-webkit-media-controls-panel {
    background-color: #ffffff;
  }
</style>
