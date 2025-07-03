<script lang="ts">
  import { browser } from "$app/environment";
  import ArchiveImage from "$lib/ui/ArchiveImage.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import type { ActionData, PageData } from "../$types";
  import { enhance } from "$app/forms";
  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
  {#if browser}
    <script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      defer
    ></script>
  {/if}
</svelte:head>
<div class="container mx-auto grid md:grid-cols-2 gap-10 py-5 md:py-10">
  {#if form?.success == "true"}
    <div
      class="z-10 flex gap-3 text-xl fixed top-0 left-0 bg-green-800 w-full p-5 text-white justify-between"
    >
      <i class="fi fi-rr-social-network"></i>
      <div class=" flex gap-1">
        <p>Comment has been saved - thank you.</p>
        <a href={`/archive/record/${data.record.id}`} class="underline flex"
          >Return to record.</a
        >
      </div>

      <!-- <i
        class="fi fi-rs-circle-xmark flex align-end"
        onclick={() => (form.sucess = "")}
      ></i> -->
    </div>
  {:else if form?.success == "false"}
    <div
      class="z-10 gap-3 text-xl fixed top-0 left-0 bg-red-800 flex w-full p-5 text-white justify-between"
    >
      <i class="fi fi-rr-hand"></i>
      <div class=" flex gap-1">
        <p>
          Oh dear, something has gone wrong. Please check the form. Or you can
        </p>
        <a href={`/archive/record/${data.record.id}`} class="underline flex"
          >return to record.</a
        >
      </div>

      <!-- <XCircleIcon class="flex align-end" onclick={() => (form.success = "")} /> -->
    </div>
  {/if}
  <div class="flex flex-col gap-5">
    <Heading text="Tell us more about this record" />

    <form class="flex flex-col gap-5" method="POST" use:enhance>
      <input name="record_id" value={data.record.id} hidden />
      <p class="">
        We welcome your input about this record - everything you can tell us
        will help us to improve the Archive. For example - Where was this taken?
        What is shown? When do you think the record was created (photo taken,
        audio recorded). Do you know any of the people, or the names of the
        people, in the record?
      </p>
      <p>
        If you included your name and email address below we may contact you for
        more information - we trust this is okay, however, if you would rather
        not be included you may ignore these fields.
      </p>
      <label class="font-bold text-2xl" for="feedback"
        >What would you like to tell us?</label
      >
      <textarea class="border-2 p-3" name="feedback" rows="15"></textarea>
      <label class="font-bold text-2xl" for="feedback">Your name</label>
      <input class="border-2 p-3" name="name" value={data.session.name} />
      <label class="font-bold text-2xl" for="feedback">Your email address</label
      >
      <input class="border-2 p-3" name="email" value={data.session.email} />
      <div class="cf-turnstile" data-sitekey="0x4AAAAAAA0GfYqfe0Q31b4N"></div>
      <button type="submit" class="text-white bg-green-800 p-3">Save</button>
    </form>
  </div>
  <div>
    <ArchiveImage record={data.record} width={500} grow />
  </div>
</div>
