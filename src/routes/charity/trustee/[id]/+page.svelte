<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import Container from "$lib/ui/Container.svelte";
  import Grid from "$lib/ui/Grid.svelte";
  import Image from "$lib/ui/Image.svelte";
  import Flex from "$lib/ui/Flex.svelte";
  let { data } = $props();
</script>

<div
  class="container mx-auto p-5 md:px-0 flex flex-col md:grid grid-cols-2 gap-5"
>
  <Flex>
    <Heading text={data.trustee.name} />
    <p class="md:text-xl">{data.trustee.detail}</p>
  </Flex>
  <Flex>
    <Image
      imagesrc={`https://dartmoor.blob.core.windows.net/assets/${data.trustee.image_url}`}
      alt={data.trustee.name}
      grow
    />
  </Flex>
</div>
