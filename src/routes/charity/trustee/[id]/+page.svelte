<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import Container from "$lib/ui/Container.svelte";
  import Image from "$lib/ui/Image.svelte";
  import Flex from "$lib/ui/Flex.svelte";
  import Grid from "$lib/ui/Grid.svelte";
  import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<Container py>
  <Grid cols={2}>
    <Flex>
      <Heading text={data.trustee.name} />
      <p class="">{data.trustee.detail}</p>
    </Flex>
    <Flex>
      <Image
        imagesrc={`https://dartmoor.blob.core.windows.net/assets/${data.trustee.image_url}`}
        alt={data.trustee.name}
        grow
      />
    </Flex>
  </Grid>
</Container>
