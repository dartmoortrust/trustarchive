<script lang="ts">
  import RecordGrid from "$lib/ui/RecordGrid.svelte";
  import type { PageData } from "./$types";
  import Icon from "@iconify/svelte";
    import Container from "$lib/ui/Container.svelte";
  let { data }: { data: PageData } = $props();
</script>

<Container>
  <div>
    <form>
<input
      type="text"
      name="q"
      placeholder="Search the archive"
      class="border border-gray-300 rounded-md px-4 py-2 w-full"
    />      
    <button type="submit" class="ml-2">
      <Icon icon="solar:search-bold" class="w-6 h-6" />
      Search
    </button> 
    </form>
    
  </div>
    <RecordGrid records={data.records} />

</Container>
