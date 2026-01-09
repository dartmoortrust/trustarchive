<script>
  import { onMount } from "svelte";
  import Container from "$lib/ui/Container.svelte";
  import Heading from "$lib/ui/Heading.svelte";

  let currentTime = $state(0);
  let allCues = $state([]);
  let chapters = $state([]); // New state for chapters
  let audioTag = $state();

  // --- DERIVED ---
  let activeIndex = $derived(
    allCues.findIndex(
      (cue) => currentTime >= cue.start && currentTime <= cue.end,
    ),
  );

  // Find which chapter we are currently in
  let activeChapterIndex = $derived(
    chapters.findIndex(
      (ch) => currentTime >= ch.start && currentTime <= ch.end,
    ),
  );

  // --- PARSERS (Reuse your existing logic) ---
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
      audioTag.play().catch(() => {});
    }
  }

  onMount(async () => {
    // Fetch Transcript
    const transcriptRes = await fetch(
      "https://dartmoor.blob.core.windows.net/assets/dat02.vtt",
    );
    const transcriptText = await transcriptRes.text();
    allCues = parseVtt(transcriptText);

    // Fetch Chapters
    try {
      const chaptersRes = await fetch(
        "https://dartmoor.blob.core.windows.net/assets/dat02chapters.vtt",
      );
      const chaptersText = await chaptersRes.text();
      chapters = parseVtt(chaptersText);
    } catch (e) {
      console.warn("No chapters file found");
    }
  });
</script>

<Container>
  <div class="layout-grid">
    <aside class="chapters-nav">
      <h3 class="nav-title">Chapters</h3>
      <div class="chapters-list">
        {#each chapters as chapter, i}
          <button
            class="chapter-link"
            class:active={i === activeChapterIndex}
            onclick={() => seekTo(chapter.start)}
          >
            <span class="chapter-time"
              >{Math.floor(chapter.start / 60)}:{Math.floor(chapter.start % 60)
                .toString()
                .padStart(2, "0")}</span
            >
            <span class="chapter-label">{chapter.text}</span>
          </button>
        {/each}
      </div>
    </aside>

    <article class="transcript-section">
      <header class="header">
        <Heading text="Ted Dixon" />
      </header>

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
  </div>

  <footer class="player-dock">
    <div class="player-container">
      <div class="active-cue-display">
        {#if activeIndex !== -1}
          <p class="active-text">“{allCues[activeIndex].text}”</p>
        {/if}
      </div>
      <audio
        bind:this={audioTag}
        src="https://dartmoor.blob.core.windows.net/assets/dat02.mp3"
        bind:currentTime
        controls
        class="w-full"
      ></audio>
    </div>
  </footer>
</Container>

<style>
  .layout-grid {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 3rem;
    max-width: 1100px;
    margin: 4rem auto 12rem;
    padding: 0 1rem;
  }

  /* CHAPTERS STYLING */
  .chapters-nav {
    position: sticky;
    top: 2rem;
    height: fit-content;
  }

  .nav-title {
    text-transform: uppercase;
    font-size: 1.75rem;
    letter-spacing: 0.1em;
    color: #4b4b4b;
    margin-bottom: 1rem;
  }

  .chapters-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .chapter-link {
    all: unset;
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 8px;
    background: #fff;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    transition: all 0.2s;
  }

  .chapter-link:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }

  .chapter-link.active {
    border-color: #eab308;
    background: #fffbeb;
  }

  .chapter-time {
    font-size: 0.7rem;
    font-family: monospace;
    color: #64748b;
  }

  .chapter-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
  }

  /* (Keep your existing transcript and player CSS here) */
  .transcript-body {
    font-family: "Georgia", serif;
    font-size: 1.25rem;
    line-height: 2;
  }
  .cue-word {
    all: unset;
    cursor: pointer;
    display: inline;
    border-radius: 4px;
  }
  .cue-word.active {
    background-color: #fef08a;
  }
  .player-dock {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 1.5rem;
  }
  .player-container {
    max-width: 600px;
    margin: 0 auto;
  }
</style>
