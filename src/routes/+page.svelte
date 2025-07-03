<script lang="ts">
  import Button from "$lib/ui/Button.svelte";
  import Flex from "$lib/ui/Flex.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Hero from "$lib/ui/Hero.svelte";
  import Image from "$lib/ui/Image.svelte";
  import Seo from "$lib/ui/SEO.svelte";
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
  <div class="p-5 bg-white rounded-xl text-slate-800">
    <div class="flex flex-col gap-5">
      <Heading text="Dartmoor in the 1920's" level={2} />
      <p class="">
        Join us to look back at life on Dartmoor in the 1920s.
      </p>
      <Image imagesrc="1920s.jpg" />

    </div>
  </div>
  <div class="p-5 bg-white rounded-xl text-slate-800">
    <Flex>
      <Heading text="Dartmoor Trust Archive" level={2} />
      <p class="">
        Tens of thousands of photographs, videos and audio recordings that
        record the history of Dartmoor and it's people.
      </p>
      <Button href="/archive" text="Explore the Archive" />
      <Image alt="Dartmoor Trust Archive" imagesrc="archive.jpeg" crop />
    </Flex>
  </div>
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
