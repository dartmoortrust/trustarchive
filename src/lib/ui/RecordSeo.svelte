<script>
  const {record} = $props();
  
  // Helper to strip HTML tags if your descriptions contain them
  const cleanDescription = record.description?.replace(/<[^>]*>?/gm, '').substring(0, 160) || '';
  
  // Construct the Schema.org JSON-LD object
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": record.title || "A record from the Dartmoor Trust Archive",
    "description": cleanDescription,
    "contentUrl": record.imageUrl,
    "thumbnailUrl": record.thumbnailUrl || record.imageUrl,
    "dateCreated": record.date_year || 2025,
    "creator": {
      "@type": "Organisation",
      "name": "Dartmoor Trust"
    },
    "spatialCoverage": {
      "@type": "Place",
      "name": record.location_name || "Dartmoor, Devon"
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": "The Dartmoor Trust"
    }
  };
</script>

<svelte:head>
  <title>{record.title} | Dartmoor Trust Archive</title>
  <meta name="description" content={cleanDescription} />

  <meta property="og:type" content="article" />
  <meta property="og:title" content={record.title} />
  <meta property="og:description" content={cleanDescription} />
  <meta property="og:image" content={record.imageUrl} />
  <meta property="og:url" content="https://dartmoortrust.org/archive/record/{record.id}" />

  {@html `<script type="application/ld+json">${JSON.stringify(schemaOrgJSONLD)}</script>`}
</svelte:head>