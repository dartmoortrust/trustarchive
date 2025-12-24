<script>
  import { toasts, removeToast } from '$lib/toastStore';
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      animate:flip={{ duration: 300 }}
      transition:fly={{ y: 20, duration: 300 }}
      class="toast {toast.type}"
    >
      <span class="message">{toast.message}</span>
      <button onclick={() => removeToast(toast.id)}>✕</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
  }

  .toast {
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .info { background: #3b82f6; }
  .success { background: #10b981; }
  .error { background: #ef4444; }

  button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-weight: bold;
  }
</style>