<script>
  import Container from "$lib/ui/Container.svelte";
  import Heading from "$lib/ui/Heading.svelte";

  const list = [{ id: 2, name: "Ted Dixon" }];
</script>

<Container>
  <Heading text="Moor Memories" />
  <ul>
    {#each list as item}
      <li>
        <a href={`/archive/collection/moormemories/${item.id}`}>{item.name}</a>
      </li>
    {/each}
  </ul>
</Container>
