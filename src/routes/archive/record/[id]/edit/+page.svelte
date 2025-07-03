<script lang="ts">
  import type { ActionData, PageData } from "../$types";
  import Icon from "@iconify/svelte";
  import { DefaultMarker, MapLibre } from "svelte-maplibre";
  import { env } from "$env/dynamic/public";
  import MarkerInfo from "$lib/ui/MarkerInfo.svelte";
  import { OSGB2latLng } from "$lib/os";
  import { toast } from "svelte-sonner";
  import Heading from "$lib/ui/Heading.svelte";
  import FormInput from "$lib/ui/FormInput.svelte";
  import ArchiveImageEdit from "$lib/ui/ArchiveImageEdit.svelte";
  import { page } from "$app/state";

  let { data, form }: { data: PageData; form: ActionData } = $props();
  let tab = $state(0);
  let originalData = $state(data.record);
  let formData = $state(data.record);
  // Image states
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formDataToSend = new FormData();
    formDataToSend.append("record_id", originalData.id); // Always include ID

    // Helper function to safely append values to FormData
    function appendValue(key: string, value: any) {
      if (value === null || value === undefined || value === "") {
        // Check for null, undefined, or empty string
        formDataToSend.append(key, ""); // Or null, or whatever your backend expects for "no value"
      } else {
        formDataToSend.append(key, value);
      }
    }

    appendValue("title", formData.title); // Use the $state variable for title
    appendValue("caption", formData.caption);
    appendValue("date_day", formData.date_day);
    appendValue("date_month", formData.date_month);
    appendValue("date_year", formData.date_year);
    appendValue("detail", formData.detail);
    appendValue("collection_id", formData.collection_id);
    appendValue("medium_id", formData.medium_id);
    appendValue("geojson", JSON.stringify(formData.geojson));
    appendValue("original_id", formData.original_id);
    appendValue("image_transform", JSON.stringify(formData.image_transform));
    appendValue("caption_rear", formData.caption_rear);
    try {
      const response = await fetch(form.action, {
        // Use form.action directly
        method: form.method,
        body: formDataToSend, // Send FormData directly
      });

      if (!response.ok) {
        const errorData = await response.json(); // Or response.text()
        console.log(errorData);
        throw new Error(errorData.message || response.statusText);
      }
      const result = await response.json(); // Process successful response
      console.log("Success:", result);
      toast.success("Your edits have been saved!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error has occured");
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/OrdnanceSurvey/os-api-branding@0.3.1/os-api-branding.css"
  />
  <script
    src="https://cdn.jsdelivr.net/gh/OrdnanceSurvey/os-api-branding@0.3.1/os-api-branding.js"
  ></script>
</svelte:head>
{#if data.session.roles?.includes("record-edit")}
  <div class="container mx-auto py-5 flex flex-col gap-5">
    <!-- Tabs Box -->
    <div class="col-span-2 container mx-auto bg-gray-50 p-2 flex gap-2">
      <button
        class={`hover:cursor-pointer p-1 text-white  flex ${tab === 0 ? "bg-blue-600" : "bg-blue-200"}`}
        onclick={() => (tab = 0)}
      >
        <Icon icon="akar-icons:edit" width="24" height="24" />
        Edit Metadata
      </button>
      <button
        class={`hover:cursor-pointer p-1 text-white flex ${tab === 1 ? "bg-pink-600" : "bg-pink-200"}`}
        onclick={() => (tab = 1)}
      >
        <Icon icon="solar:point-on-map-bold-duotone" width="24" height="24" />
        Edit Location
      </button>

      <a
        href={`/archive/record/${data.record.id}`}
        class={`p-1 text-white flex bg-gray-600`}
      >
        <Icon icon="material-symbols:image-outline" width="24" height="24" />
        View Record
      </a>
      <button
        class={`p-1 hover:cursor-pointer text-white flex ${tab === 2 ? "bg-green-600" : "bg-green-200"}`}
        onclick={() => (tab = 2)}
      >
        <Icon icon="ri:dashboard-fill" width="24" height="24" />
        Dashboard
      </button>
    </div>
    <!-- Edit Tabs -->
    <div id="">
      <form
        class="flex flex-col gap-5"
        action="?/update"
        method="POST"
        onsubmit={handleSubmit}
      >
        <!-- ID Input Hidden -->
        {#if tab === 0}
          <div class="grid grid-cols-2 gap-5" id="tab0">
            <div class="flex flex-col gap-3">
              <input type="hidden" name="record_id" value={formData.id} />
              <div
                class={`flex-col gap-3 bg-gray-50 p-2 transition-all flex ${formData.original_id !== originalData.original_id ? "bg-green-200" : "bg-gray-50"}`}
              >
                <FormInput
                  bind:value={formData.original_id}
                  title="Original ID"
                  hint="If the asset has been given to us and was already given an ID
                  - enter that here. In many cases this will have been added by
                  the Archive Admin, it may be something that is used as the
                  file name"
                />
              </div>

              <div
                class={`flex-col gap-3 bg-gray-50 p-2 transition-all flex ${formData.title !== originalData.title ? "bg-green-200" : "bg-gray-50"}`}
              >
                <FormInput
                  bind:value={formData.title}
                  title="Title"
                  hint="One sentence that describes this record. Think of this as the headline for the page"
                />
              </div>
              <div
                class={`flex-col gap-3 bg-gray-50 p-2 transition-all flex ${formData.caption !== originalData.caption ? "bg-green-200" : "bg-gray-50"}`}
              >
                <FormInput
                  bind:value={formData.caption}
                  title="Caption Front"
                  hint="Any text that is recorded on the FRONT of the original item - e.g. a
                  caption on the photograph"
                />
              </div>
              <div
                class={`flex-col gap-3 bg-gray-50 p-2 transition-all flex ${formData.caption_rear !== originalData.caption_rear ? "bg-green-200" : "bg-gray-50"}`}
              >
                <FormInput
                  bind:value={formData.caption_rear}
                  title="Caption Rear"
                  hint="Any text that is recorded on the REAR of the original item - e.g. notes"
                />
              </div>
              <!-- Date Inputs -->
              <div
                class={`flex-col gap-3 bg-gray-50 p-2 transition-all flex 
                ${
                  formData.date_year !== originalData.date_year ||
                  formData.date_month !== originalData.date_month ||
                  formData.date_day !== originalData.date_day
                    ? "bg-green-200"
                    : "bg-gray-50"
                }`}
              >
                <label class="text-2xl" for="dates">Date</label>
                <div class="grid grid-cols-3 gap-3">
                  <input
                    class="border-2 p-1"
                    name="date_day"
                    type="number"
                    placeholder="Day"
                    maxlength={2}
                    bind:value={formData.date_day}
                  />
                  <input
                    class="border-2 p-1"
                    name="date_month"
                    type="number"
                    maxlength={2}
                    placeholder="Month"
                    bind:value={formData.date_month}
                  />
                  <input
                    class="border-2 p-1"
                    name="date_year"
                    maxlength={4}
                    type="number"
                    placeholder="Year"
                    bind:value={formData.date_year}
                  />
                </div>
                <div class="text-sm">
                  Enter any known date information for when the record was
                  captured. The date a photograph was taken or a document
                  published. Enter any date information known - e.g. "6" in the
                  month box for June. The year box should be four digits long.
                </div>
              </div>
              <!-- Detail Input -->
              <div
                class={`flex-col gap-3 bg-gray-50 p-2 transition-all flex ${formData.detail !== originalData.detail ? "bg-green-200" : "bg-gray-50"}`}
              >
                <label class="text-2xl" for="detail">Detail</label>
                <textarea
                  bind:value={formData.detail}
                  rows="15"
                  name="detail"
                  class="border-2 p-1"
                ></textarea>
                <div class="flex gap-2 items-center text-sm">
                  In full prose, describe the record. What is going on? When and
                  where? Who is in the record?
                </div>
              </div>
              <!-- Collection Input -->
              <div
                class={`flex-col gap-3 bg-gray-50 p-2 transition-all flex ${formData.collection_id !== originalData.collection_id ? "bg-green-200" : "bg-gray-50"}`}
              >
                <label class="text-2xl" for="detail">Collection</label>
                <select
                  name="collection_id"
                  class="p-3 bg-white"
                  bind:value={formData.collection_id}
                >
                  {#each data.collections as col}
                    <option
                      value={col.id}
                      selected={col.id === formData.collection_id}
                      >{col.name || `${col.category}/${col.type}`}</option
                    >
                  {/each}
                </select>
              </div>
              <!-- Medium Input -->
              <div
                class={`flex-col gap-3 bg-gray-50 p-2 transition-all flex ${formData.medium_id !== originalData.medium_id ? "bg-green-200" : "bg-gray-50"}`}
              >
                <label class="text-2xl" for="medium_id">Medium</label>
                <select
                  name="medium_id"
                  class="p-3 bg-white"
                  bind:value={formData.medium_id}
                >
                  {#each data.media as med}
                    <option
                      value={med.id}
                      selected={med.id === formData.medium_id}
                      >{med.category}/{med.type}</option
                    >
                  {/each}[-4, 50]
                </select>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <div class="flex">
                <ArchiveImageEdit bind:formData />
              </div>
              <div class="relative flex gap-2 text-3xl"></div>
              <div class="bg-gray-200 p-3 space-y-3">
                <div>
                  File Path: {data.record.file_path}
                </div>
                <div>
                  Notes: {data.record.notes || "None"}
                </div>
              </div>
            </div>
          </div>
        {:else if tab == 1}
          <div class="grid grid-cols-4 gap-3 bg-gray-50 p-2" id="tab1">
            <div class="col-span-3">
              <MapLibre
                onclick={(e) => {
                  console.log(e.lngLat);
                  formData.geojson = {
                    type: "Point",
                    coordinates: [e.lngLat.lng, e.lngLat.lat],
                  };
                }}
                center={formData.geojson?.coordinates
                  ? formData.geojson?.coordinates
                  : [-4, 50.5]}
                zoom={formData.geojson?.coordinates ? 15 : 8}
                class="w-full h-[60rem]"
                standardControls
                style={`https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${env.PUBLIC_OS_KEY}`}
              >
                {#if formData.geojson}
                  <DefaultMarker
                    bind:lngLat={formData.geojson.coordinates}
                    draggable
                  />
                {/if}
              </MapLibre>
            </div>
            <div class="flex flex-col gap-5">
              <MarkerInfo
                lat={formData.geojson?.coordinates[0]}
                lng={formData.geojson?.coordinates[1]}
              />
              <span class="text-sm"
                >You may enter an OS Grid reference (e.g SX 8325 8553) to add a
                marker to the map.</span
              >
              <div class="flex">
                <input id="grquery" class="p-1 grow border-2" /><button
                  class="p-1 bg-yellow-200"
                  onclick={(e) => {
                    e.preventDefault();
                    const gr = document.getElementById("grquery").value;
                    let ll = OSGB2latLng(gr);
                    formData.geojson = {
                      type: "Point",
                      coordinates: [ll.longitude, ll.latitude],
                    };
                  }}>Search</button
                >
              </div>
              <span class="text-sm"
                >If you wish to remove the marker completely you can by clicking
                the button below.</span
              >
              <button
                class="p-1 bg-red-500 text-white"
                onclick={(e) => {
                  e.preventDefault();
                  formData.geojson = null;
                }}>Remove Marker</button
              >
            </div>
          </div>
        {:else if tab == 2}
          <div class="flex gap-5 flex-col">
            <Heading text="Your previous edits" level={2} />
            <div class="flex flex-col">
              {#each data.user_edits as edit}
                <a href={`/archive/record/${edit.id}`}
                  >{edit.id} | {edit.title}</a
                >
              {/each}
            </div>
          </div>
        {/if}
        <button class="bg-green-800 text-white p-2" type="submit">Save</button>
      </form>
    </div>
  </div>
{:else}
  Not allowed
{/if}
