<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { enhance } from "$app/forms";
  import Container from "$lib/ui/Container.svelte";
  import FormInput from "$lib/ui/FormInput.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Icon from "@iconify/svelte";
  let error = $state();
  let message = $state();
  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Container>
  <div class="w-1/2 mx-auto flex flex-col gap-3">
    <Heading text="Reset Password" />
    {#if data.reset_key}
      <form
        action="?/setpassword"
        class="flex flex-col gap-3"
        method="POST"
        use:enhance={({ formElement, formData, action, cancel }) => {
          return async ({ result }) => {
            if (result.type === "success") {
              message = result.data.message;
            } else {
              error = result.data.error;
            }
          };
        }}
      >
        <input type="hidden" name="key" value={data.reset_key} />
        <FormInput title="New Password" name="password" />
        <button class="p-3 bg-green-700 text-white" type="submit">Save</button>
      </form>
    {:else}
      <form
        class="flex flex-col gap-3"
        method="POST"
        action="?/sendemail"
        use:enhance={({ formElement, formData, action, cancel }) => {
          return async ({ result }) => {
            if (result.type === "success") {
              message = "Please check your email.";
            } else {
              error = result.data.error;
            }
          };
        }}
      >
        <FormInput
          title="Email"
          name="email"
          hint="Please enter your email address."
        />
        <button class="p-3 bg-green-700 text-white" type="submit">Reset</button>
      </form>
    {/if}
    <div>
      <a
        class="block decoration-violet-500 underline underline-offset-4"
        href="/auth/login">Login Page</a
      >
      <a
        class="block decoration-violet-500 underline underline-offset-4"
        href="/auth/signup">Register</a
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
    {#if message}
      <div class="flex bg-green-600 px-2 text-white items-center">
        <span class="grow p-2">{message}</span>
        <Icon
          icon="ri:close-circle-line"
          onclick={() => (message = null)}
          class="hover:cursor-pointer"
        />
      </div>
    {/if}
  </div>
</Container>
