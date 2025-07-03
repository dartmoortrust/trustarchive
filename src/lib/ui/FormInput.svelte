<script lang="ts">
  let { value = $bindable(), ...props } = $props();
</script>

<div class="flex flex-col gap-2">
  {#if props.title}
    <label class="text-2xl" for="title">{props.title}</label>
  {/if}
  <input name="title" bind:value class="border-2 p-1" {...props} />
  {#if props.hint}
    <div class="text-sm">
      {props.hint}
    </div>
  {/if}
</div>
