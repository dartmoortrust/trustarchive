<script>
  import Flex from "$lib/ui/Flex.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Image from "$lib/ui/Image.svelte";
</script>

<div
  class="container mx-auto flex flex-col md:grid grid-cols-2 p-5 md:px-0 gap-5"
>
  <Flex>
    <Heading text="Phoebe Wortley-Talbot Legacy Project" />
    <Image
      imagesrc="PWT_project_logo.webp"
      alt="Phoebe"
      size={400}
      crop={false}
    />
    <p>
      The Legacy project is bringing together a skilful body of creatives to
      create a lasting portrait of Dartmoor. The aim of this collaborative
      project, run by The Dartmoor Trust, is that it will encompass the essence
      of the moor as interpreted through the eyes of contemporary practitioners.
      It will serve as a thought-provoking documentation of life on Dartmoor and
      the artistic processes photographers use today.
    </p>
    <p>
      This project is to be run over two years. The first year is a
      collaboration of photographers, all with work based upon Dartmoor. Their
      work will come together, along with some historic imagery from the <a
        href="/archive">Dartmoor Trust Archive</a
      > to form the exhibition 'Dartmoor Light and Shadow' taking place in September
      2024 along with a further publication celebrating the photographers, our moor,
      and the legacy of Phoebe Wortley-Talbot. This book will be available to purchase
      at the exhibition and at various stockists after the show.
    </p>
  </Flex>
  <Flex>
    <Image
      imagesrc="Light_and_Shadow_jacket.webp"
      alt="Light and Shadow cover"
    />
    <p>
      The second year of the project is dedicated to painting and fine art, and
      will run in collaboration with The South West Academy of Fine and Applied
      Arts. A second exhibition will be held in September 2025 to bring together
      the work of all the artists involved along with a publication celebrating
      their work.
    </p>
    <p>
      Both aspects of this project aim to inspire young creatives in education.
      There is a Legacy Project Prize on offer to the photography students of <a
        href="https://www.aup.ac.uk/">Arts University of Plymouth</a
      > granting a student a place in the first exhibition and book alongside industry
      professionals, as well as a financial grant to help kick start their creative
      career in the South West. The South West Academy of Fine and Applied Arts will
      support an educational programme running heavily throughout the course of this
      project, working directly with schools and encouraging young artists to take
      part.
    </p>
    <Heading text="Who was Phoebe?" level={2} />

    <p>
      Phoebe Wortley-Talbot was born in 1926 and died in 2009 leaving a
      considerable sum of money in trust for her remaining family to use
      charitably, much of it supporting projects on her beloved Dartmoor which
      had been her home for many years. This became the Phoebe Wortley-Talbot
      Charitable Trust. During her life she was involved in activities aimed at
      protecting the moorland environment and preserving the traditional way of
      life on the moor. She often wrote to newspapers about issues relating to
      the preservation of the moor and gave talks on wildlife and travel. In
      fulfilling her legacy those running the Phoebe W-T Trust have given
      donations to various Devon- and Dartmoor-based organisations including the
      Devon Wildlife Trust, the Brooke Charity for ponies, the Dartmoor Pony
      Heritage Trust and the Dartmoor Trust. In 2023 a generous grant was made
      to the Dartmoor Trust, whose archive of 100,000 photographs of the moor is
      dedicated to preserving visual images free to public access. This grant
      resulted in this two-year programme inviting contemporary artists to
      provide their own interpretations of the moor.
    </p>
    <Image imagesrc="youngphoebe.jpeg" alt="Young Phoebe" />
  </Flex>
</div>
