<script lang="ts">
  import Icon from "@iconify/svelte";
  import AuthButton from "./AuthButton.svelte";
  import Link from "./Link.svelte";
</script>

<footer class="bg-white text-gray-900">
  <div
    class="container  md:px-5 mx-auto py-10 flex flex-col md:flex-row gap-5 justify-between"
  >
    <div class="flex flex-col text-sm grow items-center md:items-start">
      <span>
        Email: <a
          href="mailto:secretary@dartmoortrust.org"
          class="text-blue-600">secretary@dartmoortrust.org</a
        >
      </span>
      <span>Charity Number: 1056362</span>
      <Link href="/docs" text="Docs" />
    </div>
    <div class="flex items-center gap-3 mx-auto">
      <a href="https://www.facebook.com/thedartmoortrust">
        <Icon icon="simple-icons:facebook" height="40" />
      </a>
      <a href="https://www.instagram.com/dartmoortrustarchive/?hl=en">
        <Icon icon="simple-icons:instagram" height="40" />
      </a>
      <a href="https://twitter.com/dartmoorarchive">
        <Icon icon="simple-icons:x" height="30" />
      </a>
      <AuthButton />
    </div>
  </div>
</footer>
