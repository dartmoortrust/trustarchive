<script lang="ts">
  import Button from "$lib/ui/Button.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Image from "$lib/ui/Image.svelte";
  import Seo from "$lib/ui/SEO.svelte";
  import type { PageData } from "../$types";
  let { data }: { data: PageData } = $props();
  const partners = [
    "Aune Head",
    "Bellever YHA",
    "Boston Brena",
    "Bovey Tracey Heritage Trust",
    "Bovey Tracey Town Council",
    "Brenda Boston",
    "Brent Island Trust",
    "Bridford PCC",
    "Bridford Trust",
    "Buckfastleigh Heritage",
    "Bucknell",
    "Burrator Resevoir",
    "Chagford Church PCC",
    "Chagford Community History Project",
    "Chagford Conservation Group",
    "Chagford PCC",
    "Chapman Chris",
    "Chatterbox Theatre",
    "Cheriton Bishop Parish Council",
    "Christow Church PCC",
    "Clearbrook Appeal",
    "Coldharbour Mill Trust",
    "Dartmoor Circle",
    "Dartmoor Commoners Council",
    "Dartmoor Folk Festival Assoc",
    "Dartmoor Hill Ponies",
    "Dartmoor Pony Heritage Fund",
    "Dartmoor Pony Moorland Scheme",
    "Dartmoor Preservation Association",
    "Dartmoor Railway Dartmoor Rescue Group",
    "Devon Air Ambulance Trust",
    "Devon Archaeological Society",
    "Devon Wildlife Trust",
    "Disabled Young & Adults centre (DYAC)",
    "DNPA Oral History Project",
    "Drake Training South West",
    "Drakes Trail Dartmoor",
    "Gidleigh PCC",
    "Grimspound & Sortridge Leat Committee",
    "Heppell Debbie",
    "Holne & Scoriton Local Housing Group",
    "Holne Parish Council",
    "Huccaby PCC",
    "Ilsington Arts Festival",
    "Ilsington Methodist Church",
    "Ilsington PCC",
    "Ilsington Summer Ball",
    "Kelly Mine Preservation Society",
    "Leats Partnership Project",
    "Leusden PCC",
    "Lutton Stirling Bomber Memorial Group",
    "Manaton Millenium Ctee",
    "Manaton PCC",
    "Mary Tavy Miners Dry",
    "Meavy PCC",
    "MED Theatre",
    "Mint Press",
    "Moretonhampstead PCC",
    "Moretonhamptead Development Trust",
    "National Trust - Castle Drogo",
    "National Turst Parke",
    "Newcombe Helen",
    "North Bovey Conservation Group",
    "Ohio University",
    "Okehampton Arcade Trust",
    "Okehampton Waterwheel",
    "Okehampton YHA",
    "Orbiston David",
    "Peter Tavy",
    "Plasterdown Grouped Parish Coucil",
    "Princetown St Michael's Trust",
    "Radford Joanna",
    "RAF Harrowbeer Interest Group",
    "Ramblers",
    "Roborough Down tramway Project",
    "Sampford Spiney PCC",
    "Sanders Jenny",
    "Scorriton Housing Community Land Trust",
    "Smith Chris",
    "Sourton Church PCC",
    "South Brent Action and Community Group",
    "South Brent Community Centre Group",
    "South Brent Parish Council",
    "South Tawton Parish Council",
    "Tavistock & District Outdoor Education Forum",
    "Tavistock and District Conservation Project",
    "Tavistock and District Local History Society",
    "Tavistock Lions",
    "Tavistock Museum",
    "Valiant Soldier, Buckfast",
    "Wakeham Colin",
    "Westcountry Rivers Trust",
    "Whiteface Dartmoor Sheep Project",
    "Whitten EHT",
    "Widecombe & Distr Local History Group",
    "Widecombe Church House Management Committee",
    "Widecombe PCC",
    "Workshop under the Sky",
    "Wren Trust",
  ];
</script>

<Seo
  title="Dartmoor Trust | Charity"
  description="The Dartmoor Trust is an exceptional charity committed to supporting the people and history of Dartmoor. Situated amidst the captivating landscapes of South West England, Dartmoor boasts not only breathtaking natural beauty but also a rich tapestry of history that spans thousands of years. The Dartmoor Trust recognizes the significance of preserving this heritage and actively works to promote its conservation, education, and community engagement."
  image="https://dartmoorasset.s3.eu-west-1.amazonaws.com/charity/charity.jpg"
/>

<div class="container mx-auto grid md:grid-cols-4 gap-5 py-5 px-5 md:px-0">
  <div class="col-span-3 flex flex-col gap-5">
    <Heading text="Our Charity" />
    <Heading text="About the Dartmoor Trust" level={2} />
    <p>
      The Dartmoor Trust is an exceptional charity committed to supporting the
      people and history of Dartmoor. Situated amidst the captivating landscapes
      of South West England, Dartmoor boasts not only breathtaking natural
      beauty but also a rich tapestry of history that spans thousands of years.
      The Dartmoor Trust recognizes the significance of preserving this heritage
      and actively works to promote its conservation, education, and community
      engagement.
    </p>
    <p>
      The Dartmoor Trust is deeply rooted in the local communities and endeavors
      to foster a strong sense of pride and connection to Dartmoor's heritage.
      Through a range of initiatives, including workshops, exhibitions, and
      events, the Trust highlights the cultural traditions, folklore, and
      historical importance of the region. By engaging with the local
      population, the charity instills a deep appreciation for Dartmoor's
      history and encourages active participation in its preservation.
    </p>
    <p>
      Beyond community engagement, the Dartmoor Trust plays a crucial role in
      safeguarding Dartmoor's physical and archaeological assets. Collaborating
      closely with local authorities, conservation groups, and volunteers, the
      Trust identifies and protects significant historical sites, monuments, and
      landmarks. Through research, sustainable practices, and responsible
      tourism advocacy, the Trust ensures that Dartmoor's heritage is conserved
      for future generations to cherish, enabling visitors to experience the
      region's rich history while preserving its integrity.
    </p>
    <Heading text="Our Trustees" level={2} />
    <div class="grid gap-5 grid-cols-2 md:grid-cols-4">
      {#each data?.trustees as trustee}
        <a
          href="/charity/trustee/{trustee.slug}"
          class="shadow-md hover:shadow-lg transition bg-white rounded-xl"
        >
          <div class="rounded-t-xl overflow-hidden">
            <Image
              imagesrc={`https://dartmoor.blob.core.windows.net/assets/${trustee.image_url}`}
              alt={trustee.name}
              grow
            />
          </div>

          <span class="block p-5 font-light text-center">
            {trustee.name}
          </span>
        </a>
      {/each}
    </div>

    <Heading text="Support our Work" level={2} />
    <p>
      Donating to the Dartmoor Trust is an investment in the preservation of a
      cherished heritage. Your contribution helps ensure that the rich history,
      cultural traditions, and natural beauty of Dartmoor are safeguarded for
      future generations to appreciate and enjoy. By supporting our charity, you
      actively contribute to community engagement, conservation efforts, and
      educational programs that promote a deep connection to Dartmoor's people
      and their remarkable history.
    </p>
    <Heading text="Apply for Support" level={2} />

    <p>
      Applying for support from the Dartmoor Trust is a wonderful opportunity
      for individuals, organizations, and projects that align with our mission
      of preserving Dartmoor's people and history. Whether you are an aspiring
      artist looking to promote Dartmoor's cultural heritage, a community group
      seeking funding for a historical preservation project, or a researcher
      aiming to uncover new insights into the region's past, the Dartmoor Trust
      welcomes applications from all those who share a passion for the
      preservation and celebration of Dartmoor's unique heritage. Our
      application process is designed to be inclusive and accessible, ensuring
      that deserving initiatives have the opportunity to receive the support
      they need. By applying for support from the Dartmoor Trust, you join a
      community of like-minded individuals and organizations committed to making
      a positive impact on the preservation and appreciation of Dartmoor's
      people and history.
    </p>
    <p>
      Before you apply, be sure to read the <a
        class="link"
        href="/charity/terms-and-conditions"
        >terms and conditions of application</a
      >.
    </p>
    <Button
      text="Download an Application Form"
      href="https://dartmoorasset.s3.eu-west-1.amazonaws.com/documents/DartmoorTrustGrantApplicationForm.pdf"
    />
    <Heading text="Donations" level={2} />
    <p class="">
      We welcome donations to support our work. If you would like to make a
      simple BACS transfer you may use the details below. Every penny goes into
      supporting our projects and keeping the work to support Dartmoor alive.
    </p>
    <p>
      NATWEST BANK<br />
      Sort Code: 54 21 14<br />
      Account Name: Dartmoor Trust<br />
      Account Number: 2444 0477
    </p>
  </div>
  <div class="flex flex-col gap-5">
    <Heading text="Previous Partners" level={2} />
    <ul>
      {#each partners as partner}
        <li>{partner}</li>
      {/each}
    </ul>
  </div>
</div>
