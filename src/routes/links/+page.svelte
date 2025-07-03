<script lang="ts">
  import Container from "$lib/ui/Container.svelte";
  import Flex from "$lib/ui/Flex.svelte";
  import Grid from "$lib/ui/Grid.svelte";
  import Heading from "$lib/ui/Heading.svelte";

  const urls = [
    {
      url: "http://www.visitdartmoor.co.uk",
      title: "Visit Dartmoor",
      text: "Official Tourism Partner to Dartmoor National Park Authority. The most popular website for Places to Stay - Things to Do - Places to Eat & Drink",
    },
    {
      url: "https://www.theboxplymouth.com/",
      title: "Southwest Image Bank",
      text: "The South West Image Bank (SWiB) is a community based specialist repository based in Plymouth",
    },
    {
      url: "http://www.dartmoorpreservation.com",
      title: "Dartmoor Preservation Association",
      text: "Founded in 1883, the Dartmoor Preservation Association is a charity that works to protect the special qualities of Dartmoor and carries out active conservation projects",
    },
    {
      url: "http://www.dartmoor-crosses.org.uk/",
      title: "Dartmoor Crosses",
      text: "A website dedicated to the study of Dartmoor crosses. Researched and compiled by two Devon walking enthusiasts.",
    },
    {
      url: "https://ashburtonmuseum2.wixsite.com/mysite",
      title: "Ashburton Museum",
    },
    {
      url: "http://throwleigharchive.org/",
      title: "Throwleigh Archive",
      text: "A Local Heritage Initiative project which aims to raise awareness of the history and heritage of the village of Throwleigh.",
    },
    {
      url: "http://www.dartmoorlife.org.uk/",
      title: "Museum of Dartmoor Life",
    },
    {
      url: "http://www.dartmoor-prison.co.uk/",
      title: "Dartmoor Prison Museum",
    },
    {
      url: "http://www.moretonhampstead.org.uk",
      title: "Moretonhampstead History Society",
      text: "A comprehensive website detailing the history of Moretonhampstead.",
    },
    {
      url: "https://www.dartmoorlife.org.uk/",
      title: "Museum of Dartmoor Life",
      text: "The website of the Museum of Dartmoor Life",
    },
    {
      url: "http://www.dpht.co.uk/",
      title: "Dartmoor Pony Trust",
      text: "A charity dedicated to the preservation of the Dartmoor Pony breed.",
    },
    {
      url: "http://www.widecombe-in-the-moor.com/",
      title: "Widecombe-in-the-Moor",
      text: "The website of Widecombe-in-the-Moor famous for its annual fair, the song Widecombe Fair and the characters of Uncle Tom Cobley and All.",
    },
    {
      url: "http://www.chagford-parish.co.uk/",
      title: "Chagford Parish",
      text: "The website dedicated to the stannary town of Chagford.",
    },
    {
      url: "http://www.rafharrowbeer.co.uk/",
      title: "RAF Harrowbeer",
      text: "A website dedicated to the history of RAF Harrowbeer, Yelverton and the activities of the RAF Harrowbeer Interest Group.",
    },
    {
      url: "http://www.belstonevillage.net/",
      title: "Belstone Village",
      text: "A community website containing a wealth of information and photographs about the village of Belstone",
    },
    { url: "https://tavistockmuseum.co.uk/", title: "Tavistock Museum" },
    {
      url: "https://www.communityarchives.org.uk/",
      title: "Community Archives and Heritage Group",
    },
    {
      url: "https://swheritage.org.uk/devon-archives/",
      title: "Devon Heritage Centre",
    },
    {
      url: "http://www.devonruralarchive.com",
      title: "The Devon Rural Archive",
    },
    { url: "http://www.dartmoorsociety.com/home", title: "Dartmoor Society" },
    {
      url: "http://www.dtrg.org.uk",
      title: "Dartmoor Tinworking Research Group",
      text: "Exists to promote research, conservation, publication and debate about tinners and their tin works, besides being a focus for celebration of their contribution to Dartmoor.",
    },
    {
      url: "http://chagfordlocalhistorysociety.org.uk",
      title: "Chagford Local History Society",
    },
    {
      url: "https://www.tavistockhistory.co.uk/",
      title: "Tavistock Local History Society",
    },
  ].sort(function (a, b) {
    return a.title.localeCompare(b.title);
  });
</script>

<div class="container mx-auto py-5 px-5 md:px-0">
  <Flex>
    <Heading text="Links" />
    <Flex space={1}>
      {#each urls as url}
        <a href={url.url}>{url.title}</a>
      {/each}
    </Flex>
  </Flex>
</div>
