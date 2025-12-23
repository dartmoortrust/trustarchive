<script>
  const originalUrl =
    "https://dartmoor.blob.core.windows.net/public/33/w-33653b3e0e271b60b5e646d2bfe8c4ec97406d16";
  // Construct the optimized URL
  const optimizedSrc = `/api/image?url=${encodeURIComponent(originalUrl)}&s=200&c=true&q=75`;
</script>

<img src={optimizedSrc} alt="Optimized Example" width="200" class="w-full" />
