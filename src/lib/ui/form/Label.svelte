<script lang="ts">
  let { name, label }: { name: string; label: string } = $props();
</script>

<label for={name} class="font-black text-lg">{label}</label>
