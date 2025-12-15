<script lang="ts">
  import Icon from "@iconify/svelte";

  const { totalPages, currentPage, onPageChange } = $props<{
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }>();

  // Generate the visible page numbers with ellipsis
  function getPages() {
    const pages = [];
    const delta = 2; // Number of pages to show around the current one

    if (totalPages <= 7) {
      // Show all pages if count is small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always include first and last
      pages.push(1);
      let start = Math.max(2, currentPage - delta);
      let end = Math.min(totalPages - 1, currentPage + delta);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }

  function gotoPage(page) {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  }
</script>

<nav class="flex gap-2">
  <button
    class="hover:cursor-pointer p-1 border-gray-400 border-1"
    disabled={currentPage === 1}
    onclick={() => gotoPage(currentPage - 1)}
    ><Icon icon="solar:alt-arrow-left-linear" /></button
  >

  {#each getPages() as page}
    {#if page === "..."}
      <span class="ellipsis">...</span>
    {:else}
      <button
        class={`hover:cursor-pointer  px-2 bg-gray-400 border-gray-400 border-1 ${page === currentPage ? "bg-trust-b text-white" : "bg-white"}`}
        onclick={() => gotoPage(page)}
      >
        {page}
      </button>
    {/if}
  {/each}

  <button
    disabled={currentPage === totalPages}
    class="hover:cursor-pointer p-1 border-gray-400 border-1"
    onclick={() => gotoPage(currentPage + 1)}
    ><Icon icon="solar:alt-arrow-right-linear" /></button
  >
</nav>

<style>
  button.selected {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .ellipsis {
    padding: 6px 12px;
  }
</style>
