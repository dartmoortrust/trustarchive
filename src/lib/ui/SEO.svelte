<script lang="ts">
  import { page } from "$app/state";

  interface Props {
    title?: string;
    description?: string;
    image?: string;
  }

  let {
    title = "The Dartmoor Trust | dartmoortrust.org",
    description = "Dartmoor\'s past, present and future",
    image = "https://dartmoortrust.org/images/Trust-Logo-330x261.webp",
  }: Props = $props();
</script>

<svelte:head>
  <title>{title} | dartmoortrust.org</title>
  <meta name="description" content={description} />
  <meta property="og_site_name" content="“dartmoortrust.org”" />
  <meta
    property="og:url"
    content="https://dartmoortrust.org{page.url.pathname.toString()}"
  />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="dartmoortrust.org" />
  <meta
    property="twitter:url"
    content="https://dartmoortrust.org{page.url.pathname.toString()}"
  />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  {@html `  <script type="application/ld+json">{
     "@context": "https://schema.org",
     "@type": "Website",
     "name": "${title} | dartmoortrust.org",
     "url": "https//dartmoortrust.org${page.url.pathname}",
     "logo": "${image}"}</script>`}
</svelte:head>
