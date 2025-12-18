<script lang="ts">
  import { marked } from "marked";
  import markdownString from "./index.md?raw";
  import Container from "$lib/ui/Container.svelte";

  // const toc: { depth: number; text: string; slug: string }[] = [];

  // const renderer = {
  //   // In newer versions, 'text' is often the token array
  //   heading(tokens, depth, raw) {
  //     // 1. Use the 'raw' string for the slug to avoid HTML tags in IDs
  //     const slug = raw
  //       .toLowerCase()
  //       .replace(/[^\w]+/g, "-")
  //       .replace(/^-+|-+$/g, "");

  //     // 2. Convert tokens back to a string for the TOC display
  //     // We use a simple map/join to get the text content of the tokens
  //     const plainText = tokens.map((t) => t.text).join("");

  //     toc.push({ depth, text: plainText, slug });

  //     // 3. Return the HTML. 'this.parser.parseInline' converts tokens to HTML
  //     // This ensures bold/italic inside headers still renders correctly
  //     const headerHtml = this.parser.parseInline(tokens);

  //     return `<h${depth} id="${slug}">${headerHtml}</h${depth}>`;
  //   },
  // };
  // marked.use({ renderer });
  // We parse the MD; this populates the 'toc' array
  const htmlContent = marked.parse(markdownString);
</script>

<Container py>
  <div class="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-12">
    <!-- <nav class="hidden md:block sticky top-8 h-fit">
      <h2
        class="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4"
      >
        On this page
      </h2>
      <ul class="space-y-2 border-l border-gray-200">
        {#each toc as { depth, text, slug }}
          {depth}
        {/each}
      </ul>
    </nav> -->

    <article class="prose prose-lg max-w-none font-sans">
      {@html htmlContent}
    </article>
  </div>
</Container>
