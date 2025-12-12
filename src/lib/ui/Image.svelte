<script lang="ts">
    let { alt, imagesrc, width=300, height=null, crop=false, grow=false } = $props();
    const imgproxyurl = "/api/image";
    //const s3url = "https://dartmoorpublic.lon1.cdn.digitaloceanspaces.com/w-";
    const src = `${imgproxyurl}?url=${imagesrc}&width=${width}&height=${height}&crop=${crop}`;
</script>

<img {src} {alt} class={`${grow ? "w-full" : ""}`} />
