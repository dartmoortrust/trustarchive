<script lang="ts">
  import Icon from "@iconify/svelte";
  import ArchiveImage from "./ArchiveImage.svelte";
  let { formData = $bindable() } = $props();
</script>

<div class="relative w-full">
  {#key JSON.stringify(formData.image_transform)}
    <ArchiveImage record={formData} />
  {/key}
  <div class="absolute top-0 flex gap-1">
    <button
      type="button"
      class="p-2 flex items-center bg-blue-700 text-white"
      onclick={() => {
        formData.image_transform["n"]
          ? delete formData.image_transform["n"]
          : (formData.image_transform["n"] = true);
      }}><Icon icon="oui:invert" /></button
    >
    <button
      type="button"
      class="bg-green-700 text-white p-2 flex items-center gap-2"
      onclick={() => {
        if (formData.image_transform["r"]) {
          if (formData.image_transform["r"] === 270) {
            formData.image_transform["r"] = 0;
          } else {
            formData.image_transform["r"] = formData.image_transform["r"] + 90;
          }
        } else {
          formData.image_transform["r"] = 90;
        }
      }}><Icon icon="lucide:rotate-cw" /></button
    >
    <button
      type="button"
      class="bg-green-700 text-white p-2 flex items-center gap-2"
      onclick={() => {
        if (formData.image_transform["r"]) {
          if (formData.image_transform["r"] === 0) {
            formData.image_transform["r"] = 270;
          } else {
            formData.image_transform["r"] = formData.image_transform["r"] - 90;
          }
        } else {
          formData.image_transform["r"] = 270;
        }
      }}><Icon icon="lucide:rotate-ccw" /></button
    >
    <button
      type="button"
      class="bg-red-700 text-white p-2 flex items-center gap-2"
      onclick={() => {
        formData.image_transform["y"]
          ? delete formData.image_transform["y"]
          : (formData.image_transform["y"] = true);
      }}><Icon icon="ri:flip-horizontal-2-line" /></button
    >
    <button
      type="button"
      class="bg-red-700 text-white p-2 flex items-center gap-2"
      onclick={() => {
        formData.image_transform["x"]
          ? delete formData.image_transform["x"]
          : (formData.image_transform["x"] = true);
      }}><Icon icon="ri:flip-vertical-2-line" /></button
    >
  </div>
</div>
