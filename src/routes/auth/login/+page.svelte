<script lang="ts">
  // import type { PageData, ActionData } from "./$types";
  import { enhance } from "$app/forms";
  import Container from "$lib/ui/Container.svelte";
  import FormInput from "$lib/ui/FormInput.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Icon from "@iconify/svelte";
  let error = $state();
  // let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Container>
  <div class="w-1/2 mx-auto flex flex-col gap-3">
    <Heading text="Login" />
    <form
      class="flex flex-col gap-3"
      method="POST"
      use:enhance={({ formElement, formData, action, cancel }) => {
        return async ({ result }) => {
          if (result.type === "success") {
            window.location.href = "/";
          } else {
            error = result.data.message;
          }
        };
      }}
    >
      <FormInput title="Email" name="email" />
      <FormInput title="Password" name="password" type="password" />
      <button class="p-3 bg-green-700 text-white" type="submit">Login</button>
    </form>
    <div>
      <a
        class="block decoration-violet-500 underline underline-offset-4"
        href="/auth/signup">Register for an account</a
      >
      <a
        class="block decoration-violet-500 underline underline-offset-4"
        href="/auth/reset">Reset password</a
      >
    </div>

    {#if error}
      <div class="flex bg-red-600 px-2 text-white items-center">
        <span class="grow p-2">{error}</span>
        <Icon
          icon="ri:close-circle-line"
          onclick={() => (error = null)}
          class="hover:cursor-pointer"
        />
      </div>
    {/if}
  </div>
</Container>
