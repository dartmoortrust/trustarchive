<script>
  import Icon from "@iconify/svelte";
  import SearchForm from "./SearchForm.svelte";
  import { goto } from "$app/navigation";

  // Define the navigation links
  const links = [
    { text: "Charity", url: "/charity" },
    { text: "Archive", url: "/archive" },
    { text: "Links", url: "/links" },
  ];

  // Toggle state function
  let toggle = $state(false);
</script>

<!-- Mobile menu -->
<div class="flex p-3 border-b-2 md:hidden">
  <Icon
    icon="solar:hamburger-menu-outline"
    width="24"
    height="24"
    onclick={() => (toggle = !toggle)}
  />
  {#if toggle}
    <div
      class="absolute z-10 left-0 top-0 gap-5 p-3 w-full bg-slate-50 flex flex-col border-b-2"
    >
      <Icon
        icon="solar:hamburger-menu-outline"
        width="24"
        height="24"
        onclick={() => (toggle = !toggle)}
      />
      <a class="text-xl" href={`/`} onclick={() => (toggle = false)}>Home</a>
      {#each links as link}
        <a class="text-xl" href={link.url} onclick={() => (toggle = false)}
          >{link.text}</a
        >
      {/each}
    </div>
  {/if}
</div>

<!-- Desktop menu -->
<div class="hidden md:flex justify-stretch gap-10 shadow-md">
  <div class="container mx-auto flex justify-between gap-4">
    <!-- Logo and links -->
    <div class="my-auto flex gap-4 items-center">
      <a href="/" class="mr-10 py-5 border-slate-50 font-bold text-xl"
        >Dartmoor Trust</a
      >
      {#each links as link}
        <a class="text-lg hover:text-trust-b transition-all" href={link.url}>
          {link.text}
        </a>
      {/each}
    </div>

    <!-- Search form -->
    <div class="my-3">
      <SearchForm />
    </div>
  </div>
</div>
