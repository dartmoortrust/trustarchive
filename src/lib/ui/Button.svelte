<script lang="ts">
  let { href = null, text, type = "default" } = $props();
</script>

<a
  {href}
  class="font-bold rounded-xl inline-block bg-slate-100 text-gray-800 hover:cursor-pointer text-center transition-all hover:bg-slate-200/70 p-3"
  >{text}
</a>
