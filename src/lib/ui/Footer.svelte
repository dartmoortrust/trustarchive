<script lang="ts">
  import Icon from "@iconify/svelte";
  import AuthButton from "./AuthButton.svelte";

  const socialLinks = [
    {
      href: "https://www.facebook.com/thedartmoortrust",
      icon: "tabler:brand-facebook",
    },
    {
      href: "https://www.instagram.com/dartmoortrustarchive/?hl=en",
      icon: "tabler:brand-instagram",
    },
    {
      href: "https://twitter.com/dartmoorarchive",
      icon: "tabler:brand-twitter",
    },
  ];
</script>

<footer class="bg-white text-gray-900">
  <div
    class="container mx-auto py-10 flex flex-col md:flex-row gap-5 justify-between"
  >
    <div class="flex flex-col text-sm grow text-center md:text-left">
      <span>
        Email: <a
          href="mailto:secretary@dartmoortrust.org"
          class="text-blue-600">secretary@dartmoortrust.org</a
        >
      </span>
      <span>Charity Number: 1056362</span>
    </div>
    <div class="flex items-center gap-3 mx-auto">
      {#each socialLinks as { href, icon }, i}
        <a {href} target="_blank" rel="noopener noreferrer">
          <Icon
            {icon}
            class="text-3xl text-slate-900 hover:text-slate-700 transition-all"
          />
        </a>
      {/each}
      <AuthButton />
    </div>
  </div>
</footer>
