<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  const { pagination } = $props<{
    pagination: {
      limit: number;
      full_count: number;
      page: number;
    };
  }>();

  const totalPages = $derived(
    Math.ceil(pagination.full_count / pagination.limit),
  );
  const changePage = (n: number) => {
    const newParams = new URLSearchParams(page.url.searchParams);
    if (n) {
      newParams.set("page", String(n));
    } else {
      newParams.delete("page");
    }
    console.log(newParams.toString());

    // 3. Navigate to the current path with the updated string
    goto(`?${newParams.toString()}`, {
      // keepFocus: false,
      // replaceState: true,
      // noScroll: true
    });
  };
</script>

<div class="flex gap-2 items-center">
  <button
    class="bg-white shadow p-2 cursor-pointer disabled:bg-gray-100"
    onclick={() => changePage(pagination.page - 1)}
    disabled={pagination.page < 2}>Previous</button
  >
  Page {pagination.page}/{totalPages}
  <button
    class="bg-white shadow p-2 cursor-pointer disabled:bg-gray-100"
    onclick={() => changePage(pagination.page + 1)}
    disabled={pagination.page ===
      Math.ceil(pagination.full_count / pagination.limit)}>Next</button
  >
</div>
