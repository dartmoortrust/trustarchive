<script lang="ts">
  import AuthButton from "./AuthButton.svelte";
  import { FacebookLogo, InstagramLogo, XLogo } from "phosphor-svelte";
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
      <a href="https://www.facebook.com/thedartmoortrust">
        <FacebookLogo weight="regular" size={32} />
      </a>
      <a href="https://www.instagram.com/dartmoortrustarchive/?hl=en">
        <InstagramLogo weight="regular" size={32} />
      </a>
      <a href="https://twitter.com/dartmoorarchive">
        <XLogo weight="regular" size={32} />
      </a>
      <AuthButton />
    </div>
  </div>
</footer>
