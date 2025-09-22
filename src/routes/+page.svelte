<script lang="ts">
  import Flex from "$lib/ui/Flex.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Hero from "$lib/ui/Hero.svelte";
  import Image from "$lib/ui/Image.svelte";
  import Seo from "$lib/ui/SEO.svelte";
  import type { PageData } from "./$types";

  const phoebevents = [
    // {
    //   title: "Light in the West",
    //   location: "The RWS Gallery, Whitcomb Street, London, WC2 7HA",
    //   description:
    //     "Celebrating the 25th anniversary of the Academy and the legacy of art in the region. Including paintings from the Newlyn and St Ives schools. See further details at www.southwestacademy.org",
    //   image: "3.png",
    //   date: "July 18th - July 25th 2025. Daily from 11am to 5pm.",
    // },
    // {
    //   title: "Dartmoor - New Horizons",
    //   location: "Neadon Barn, Manageton, Devon, TQ13 9UY.",
    //   date: "September 6th - 14th. Daily from 10:30am to 4:30pm.",
    //   description:
    //     "A major exhibition of dartmoor paintings. For more information and map to the location please visit www.devonopenstudios.co.uk",
    // },
  ];

  const events = [
    {
      title: "Dartmoor in the 1920's",
      location: "Dartmoor National Park Visitor Centre, Princetown, Devon",
      description:
        "A free exhibition about life and tourism on Dartmoor. Come and see us at the Dartmoor National Park visitor centre in Princetown.",
      date: "June 17th - July 27th 2025. Daily from 10am to 5pm.",
      image: "1920s.jpg",
    },
  ];

  let { data }: { data: PageData } = $props();
</script>

<Seo
  title="Home"
  description="The Dartmoor Trust exists to support life in this beautiful and special part of the World. Our people, environment and heritage. We pride ourselves in having supported hundreds of community groups to bring their projects to life and we welcome you to join us in our work. Your donations and legacies help the Dartmoor Trust to continue to provide funding to allow for this important work to continue."
  image="/images/banner1.jpg"
/>
<div class="">
  <Hero bgimage="/images/banner2.jpg">
    <h1 class="md:hidden text-center p-10 font-bold text-4xl text-white">
      The Dartmoor Trust
    </h1>
  </Hero>
</div>

<div class="grid md:grid-cols-2 gap-5 container md:mx-auto md:px-0 px-5 py-5">
  <div
    class="col-span-2 grid grid-cols-3 gap-10 bg-white p-10 rounded-xl text-slate-800"
  >
    <div class="gap-10 col-span-2">
      <div class="space-y-10">
        <Heading
          text="THE PHOEBE WORTLEY-TALBOT LEGACY PROJECT 2024-2025"
          level={2}
        />
        <p>
          Phoebe Wortley-Talbot was born in 1926 and died in 2009 leaving a
          considerable sum of money in trust for her remaining family to use
          charitably, much of it supporting projects on her beloved Dartmoor
          which had been her home for many years. This became the Phoebe
          Wortley- Talbot Charitable Trust. In 2023 a generous grant was made to
          the Dartmoor Trust, whose Archive of 100,000 photographs of the moor
          is dedicated to preserving visual images free to public access. This
          grant resulted in a two-year programme inviting contemporary artists
          to provide their own interpretations of the moor. Year 1 resulted in a
          hugely successful photography exhibition of Dartmoor, while in Year 2
          (2025) members of the South West Academy of Fine & Applied Arts will
          provide new interpretations of the moor through paintings and other
          works of art.
        </p>
        {#each data.events as event}
          {#if event.tag === "phoebe"}
            <div class="border-l-2 pl-5 text-slate-800">
              <Flex>
                <Heading text={event.title} level={3} />
                <p class="text-sm">{event.subtitle}</p>
                <p class="text-sm">{event.location}</p>
                <p class="">{event.tease}</p>
                <a href={`/event/${event.id}`} class="text-blue-500"
                  >More Information</a
                >
              </Flex>
            </div>
          {/if}
        {/each}
      </div>
    </div>
    <Image
      imagesrc="Phoebe_in_later_years.webp"
      alt="Phoebe Wortley-Talbot"
      width={500}
      grow
    />
  </div>
</div>
<!-- <div
  class="gap-5 container mx-auto space-y-10 bg-white p-10 rounded-xl text-slate-80"
>
  <Heading text="Events" level={2} />
  {#each data.events as event}
    {#if event.tag !== "phoebe"}
      <div class="border-l-2 pl-5 text-slate-800">
        <Flex>
          <Heading text={event.title} level={3} />
          <p class="text-sm">{event.subtitle}</p>
          <p class="text-sm">{event.location}</p>
          <p class="">{event.tease}</p>
          <a href={`/event/${event.id}`} class="text-blue-500"
            >More Information</a
          >
        </Flex>
      </div>
    {/if}
  {/each}
</div> -->
<div class="grid md:grid-cols-2 gap-5 container md:mx-auto md:px-0 px-5 py-5">
  <!-- <div class="p-5 bg-white rounded-xl text-slate-800">
    <Flex>
      <Heading text="Dartmoor Trust Archive" level={2} />
      <p class="">
        Tens of thousands of photographs, videos and audio recordings that
        record the history of Dartmoor and it's people.
      </p>
      <Button href="/archive" text="Explore the Archive" />
      <Image alt="Dartmoor Trust Archive" imagesrc="archive.jpeg" crop />
    </Flex>
  </div> -->
  <div class="block md:col-span-2 rounded-xl bg-white md:flex">
    <blockquote
      class="space-y-5 p-5 text-xl font-semibold italic text-gray-900"
    >
      <svg
        aria-hidden="true"
        class="h-10 w-10 text-gray-400 dark:text-gray-600"
        viewBox="0 0 24 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
          fill="currentColor"
        ></path>
      </svg>
      <p>
        The Dartmoor Trust exists to support life in this beautiful and special
        part of the World. Our people, environment and heritage. We pride
        ourselves in having supported hundreds of community groups to bring
        their projects to life and we welcome you to join us in our work. Your
        donations and legacies help the Dartmoor Trust to continue to provide
        funding to allow for this important work to continue.
      </p>
      <p class="text-left text-lg font-light not-italic">
        Tony Clark OBE - Chairman
      </p>
    </blockquote>
    <Image imagesrc="clark.webp" alt="Tony Clark" width={500} grow />
  </div>
</div>
