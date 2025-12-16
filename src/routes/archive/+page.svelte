<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import type { PageData } from "./$types";
  import SearchForm from "$lib/ui/SearchForm.svelte";
  import Seo from "$lib/ui/SEO.svelte";
  import Flex from "$lib/ui/Flex.svelte";

  let { data }: { data: PageData } = $props();

  // Centralize commonly used data
  const contactEmail = "secretary@dartmoortrust.org";
  const description = `Tens of thousands of images, video and audio from Dartmoor's past`;
  const seoImage = `https://dartmoor.ac1n45ddogi6i.eu-west-1.cs.amazonlightsail.com/unsafe/rs:fit:500:/g:no/plain/https://dartmoorweb.s3.eu-west-1.amazonaws.com/w-d61c5bad8e99bb013682c0ac3673056ead9e5c17`;
</script>

<Seo title="The Dartmoor Trust Archive" {description} image={seoImage} />
<div class="container mx-auto grid gap-5 p-5 md:grid-cols-2 md:px-0">
  <Flex>
    <Heading text="Dartmoor Trust Archive" />
    <Heading text="About our project" level={2} />
    <p>
      The Dartmoor Trust Archive aims to provide a home for photos, video, and
      audio depicting life on Dartmoor. We have scanned tens of thousands of
      items and made them available to the public for free through this website.
      Our approach to preservation has been to capture these items to National
      Archive standards—these digital masters are then stored in multiple secure
      locations to ensure they are around for generations to come.
    </p>
    <p>
      We do not store the original items. If you have a collection that you
      would like to add to the Archive, please contact us to find out more about
      our project. Where a copyright exists, it remains with the copyright
      holder—we can support you in getting the items digitized and, where
      desired, advise on finding a new physical home for the original items.
    </p>

    <Heading text="Using our items" level={2} />
    <p>
      If you would like to use any of the items in our Archive for your work,
      please contact us first. We can discuss the terms and conditions
      surrounding their use. Email <a
        href={`mailto:${contactEmail}`}
        class="text-blue-600">{contactEmail}</a
      > with the record number(s) of the items you would like to use. We may be able
      to provide higher-resolution versions to support your work.
    </p>
  </Flex>
  <Flex>
    <Heading text="Search the Archive" level={2} />
    <SearchForm />
    <p>
      Search our tens of thousands of images, audio, and video from life here on
      Dartmoor. Some records date back to the late 1800s—we would love to hear
      from you. If you would like to contribute to the Archive, please email <a
        href={`mailto:${contactEmail}`}
        class="text-blue-600">{contactEmail}</a
      >.
    </p>

    {#if data.collections.length > 0}
      <Heading text="Our Collections" level={2} />
      <div class="flex flex-wrap gap-1">
        {#each data.collections as { slug, name }}
          <a
            class="bg-gray-50 px-2 py-1 transition hover:bg-gray-200"
            href={`/archive/collection/${slug}`}
            data-sveltekit-preload-data="false"
          >
            {name}
          </a>
        {/each}
      </div>
    {/if}
  </Flex>
</div>
