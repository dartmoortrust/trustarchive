<script lang="ts">
  import { run } from 'svelte/legacy';

  import { removeToast, toasts } from "$lib/toastStore";
  import Icon from "@iconify/svelte";

  let toastsList: { id: number; message: string; type: string }[] = $state([]);

  // Subscribe to the toast store
  run(() => {
    $toasts, (toastsList = $toasts);
  });
  function closeToast(id: number) {
    removeToast(id);
  }
</script>

<div class="toast-container absolute top-5 right-5 space-y-5">
  {#each toastsList as { id, message, type } (id)}
    <div
      class="relative gap-4 flex items-center border-2 border-gray-400 bg-white text-black px-4"
    >
      <!-- <Icon
        icon="hugeicons:information-circle"
        class="font-light"
        height="25"
      /> -->
      <span class="p-3">{message}</span>
      <button class="close-btn" onclick={() => closeToast(id)}
        ><Icon
          class="font-light font-gray-400"
          icon="lucide:circle-x"
          height="25"
        /></button
      >
    </div>
  {/each}
</div>

<style>
</style>
