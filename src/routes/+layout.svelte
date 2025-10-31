<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
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

<div class="flex flex-col min-h-screen">
  <Toaster position="top-center" />
  <Navbar />

  <main class="flex-1 text-gray-800 bg-gray-50">
    {@render children()}
  </main>

  <Footer />
</div>
