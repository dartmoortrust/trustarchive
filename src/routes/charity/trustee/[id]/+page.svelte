<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import Container from "$lib/ui/Container.svelte";
  import Image from "$lib/ui/Image.svelte";
  import Flex from "$lib/ui/Flex.svelte";
  import Grid from "$lib/ui/Grid.svelte";
  import { getTrusteeById } from "../../../data.remote.js";
  let { params } = $props();
  const trustee = $derived(await getTrusteeById(params.id));
</script>

<Container py>
  <Grid cols={2}>
    <Flex>
      <Heading text={trustee.name} />
      <p class="">{trustee.detail}</p>
    </Flex>
    <Flex>
      <Image
        imagesrc={`https://dartmoor.blob.core.windows.net/assets/${trustee.image_url}`}
        alt={trustee.name}
        grow
      />
    </Flex>
  </Grid>
</Container>
