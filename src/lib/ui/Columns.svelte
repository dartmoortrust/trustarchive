<script lang="ts">
    let { children, cols=1} = $props();
    const columns = `columns-${cols}`;
</script>
<div class={`${columns}`}>
    {@render children?.()}
</div>