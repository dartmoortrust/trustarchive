<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import Seo from "$lib/ui/SEO.svelte";

  import type { PageData } from "../$types";

  let { data }: { data: PageData } = $props();
</script>

<Seo
  title="Home"
  description="The Dartmoor Trust exists to support life in this beautiful and special part of the World. Our people, environment and heritage. We pride ourselves in having supported hundreds of community groups to bring their projects to life and we welcome you to join us in our work. Your donations and legacies help the Dartmoor Trust to continue to provide funding to allow for this important work to continue."
  image="/images/banner1.jpg"
/>

<div class=" gap-5 container md:mx-auto md:px-0 px-5 py-5">
  <article class="space-y-5">
    <Heading text={data.event.title} level={1} />
    <Heading text={data.event.subtitle} level={3} />
    {@html data.event.detail}
  </article>
</div>
