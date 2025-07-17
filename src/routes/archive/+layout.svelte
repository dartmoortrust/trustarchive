<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';
    import Icon from '@iconify/svelte';

    let { data, children }: { data: LayoutData, children: Snippet } = $props();
</script>
<div class="mx-auto container py-4">
    <a class="inline-flex items-center gap-2 bg-white p-2 shadow hover:shadow-md transition-all" href="/archive">
        <Icon icon ={'solar:inbox-outline'} />
        All Collections
    </a>
        <a class="inline-flex items-center gap-2 bg-white p-2 shadow hover:shadow-md transition-all"  href="/archive/search">
        <Icon icon ={'solar:magnifer-linear'} />
        Search Page
    </a>
</div>
{@render children()}