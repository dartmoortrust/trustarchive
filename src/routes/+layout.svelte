<script lang="ts">
  import "./layout.css";
  import "../app.css";
  import Navbar from "$lib/ui/Navbar.svelte";
  import { Toaster } from "svelte-sonner";
  import Footer from "$lib/ui/Footer.svelte";

  let { data, children } = $props();
</script>

<svelte:head>
  <script
    defer
    src="https://cloud.umami.is/script.js"
    data-website-id="1c2acd43-3991-4fd3-9cbf-0e42d032e7bf"
    async
  ></script>
</svelte:head>
<div class="flex min-h-screen flex-col" data-sveltekit-preload-data="off">
  <Toaster position="top-center" expand={true} richColors />
  <Navbar />
  <main class="flex-1 bg-[#f7f7f7] text-gray-800">
    {@render children()}
  </main>
  <Footer />
</div>
