<script lang="ts">
  let { children, verticalpad = 10 } = $props();
</script>

<div
  class="container md:mx-auto"
  style:padding-top="{verticalpad * 0.25}rem"
  style:padding-bottom="{verticalpad * 0.25}rem"
>
  {@render children?.()}
</div>
