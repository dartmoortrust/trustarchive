<script>
  import { page } from "$app/state";
  async function logout() {
    await fetch("/auth/signout", { method: "POST", body: "" });
    window.location.href = "/";
  }
</script>

{#if page.data.session}
  <span>Welcome, {page.data.session.email}</span>
  <button class="hover:cursor-pointer" onclick={() => logout()}>Sign Out</button
  >
  <a href="/admin">Admin</a>
{:else}
  <a href="/auth/login">Login</a>
  <a href="/auth/signup">Signup</a>
{/if}
