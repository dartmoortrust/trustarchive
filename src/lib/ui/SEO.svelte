<script lang="ts">
  export let title: string = "";
  export let description: string = "";
  export let keywords: string = "";
  export let canonical: string = "";
  export let ogType: string = "website";
  export let ogImage: string = "";
  export let ogImageAlt: string = "";
  export let noindex: boolean = false;
  export let nofollow: boolean = false;
  export let jsonLd: Record<string, any> | null = null;
</script>

<svelte:head>
  {#if title}
    <title>{title}</title>
    <meta property="og:title" content={title} />
  {/if}

  {#if description}
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
  {/if}

  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}

  {#if canonical}
    <link rel="canonical" href={canonical} />
    <meta property="og:url" content={canonical} />
  {/if}

  {#if ogType}
    <meta property="og:type" content={ogType} />
  {/if}

  {#if ogImage}
    <meta property="og:image" content={ogImage} />
  {/if}

  {#if ogImageAlt}
    <meta property="og:image:alt" content={ogImageAlt} />
  {/if}

  {#if noindex || nofollow}
    <meta
      name="robots"
      content="{noindex ? 'noindex' : 'index'},{nofollow
        ? 'nofollow'
        : 'follow'}"
    />
  {/if}

  {#if jsonLd}
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
  {/if}
</svelte:head>
