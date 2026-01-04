<script lang="ts">
  import ArchiveImage from "$lib/ui/ArchiveImage.svelte";
  import Icon from "@iconify/svelte";
  import Select from "$lib/ui/form/Select.svelte";
  import Input from "$lib/ui/form/Input.svelte";
  import Checkbox from "$lib/ui/form/Checkbox.svelte";
  import TextArea from "$lib/ui/form/TextArea.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Map from "$lib/ui/Map.svelte";
  import { toast } from "svelte-sonner";
  import { OSGB2latLng } from "$lib/os";
  import {
    getRecord,
    placeSearch,
    updateRecord,
  } from "../../../../data.remote";
  import { page } from "$app/state";
  import HelperBox from "$lib/ui/form/HelperBox.svelte";

  // Types for better type safety
  interface Transform {
    r?: number; // rotation
    flip?: boolean; // vertical flip
    flop?: boolean; // horizontal flip
    n?: boolean; // negative/invert
  }

  interface Record {
    transform: Transform;
    location_estimated?: boolean;
    [key: string]: any;
  }

  // Props
  let { params } = $props();

  // Fetch and initialize data
  const oldData = $derived(await getRecord(params.id));
  // Initialize record state with proper transform object
  let record = $state<Record>({
    ...oldData,
    transform: oldData.transform || {
      r: 0,
      flip: false,
      flop: false,
      n: false,
    },
  });

  // Sync transform to form field
  updateRecord.fields.set(oldData);

  $effect(() => {
    updateRecord.fields.transform.set(JSON.stringify(record.transform));
  });
  $effect(() => {
    updateRecord.fields.location_geom.set(JSON.stringify(record.geom));
  });

  // Location search state
  let osgr = $state("");
  let placename = $state("");
  let placeresults = $state<Array<{ name1: string; coords: [number, number] }>>(
    [],
  );

  // Dropdown options
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
    value: 1900 + i,
    label: String(1900 + i),
  })).reverse(); // Most recent years first

  // Transform manipulation functions
  const rotate = (degrees: number) => {
    const currentRotation = record.transform.r || 0;
    let newRotation = currentRotation + degrees;

    // Normalize rotation to 0-359 range
    newRotation = ((newRotation % 360) + 360) % 360;

    record.transform = { ...record.transform, r: newRotation };
  };

  const toggleFlip = () => {
    record.transform = { ...record.transform, flip: !record.transform.flip };
  };

  const toggleFlop = () => {
    record.transform = { ...record.transform, flop: !record.transform.flop };
  };

  const toggleInvert = () => {
    record.transform = { ...record.transform, n: !record.transform.n };
  };

  const resetTransform = () => {
    record.transform = { r: 0, flip: false, flop: false, n: false };
  };

  // Location search handlers
  const handleOSGridSearch = (e: Event) => {
    e.preventDefault();
    const cleanRef = osgr.replace(/\s+/g, "").toUpperCase();
    const match = cleanRef.match(/^([A-Z]{2})(\d{2,10})$/);

    if (!match) {
      toast.error("Invalid OS Grid reference format");
      return;
    }

    try {
      const ll = OSGB2latLng(osgr);
      record.geom = [ll.longitude, ll.latitude];
      toast.success("Location updated");
    } catch (error) {
      toast.error("Failed to convert OS Grid reference");
    }
  };

  const handlePlaceSearch = async (e: Event) => {
    e.preventDefault();
    if (!placename.trim()) {
      toast.error("Please enter a place name");
      return;
    }
    try {
      placeresults = await placeSearch(placename);
    } catch (error) {
      toast.error("Failed to search for place");
      placeresults = [];
    }
  };

  const selectPlace = (name: string, coords: [number, number]) => {
    record.geom = coords;
    placeresults = [];
    updateRecord.fields.location_name.set(name);
    toast.success("Location updated");
  };

  // Form submission
  const handleSubmit = async ({ form, data, submit }: any) => {
    try {
      let resp = await submit();
      console.log(form.result);
      toast.success("Successfully saved!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes");
    }
  };
</script>

<div class="container mx-auto flex flex-row gap-10 p-4">
  {#if page.data.session.roles?.includes("record-edit")}
    <!-- Main Form Section -->
    <div class="basis-2/3">
      <form class="flex flex-col gap-4" {...updateRecord}>
        <!-- Hidden fields -->
        <input type="hidden" {...updateRecord.fields.id.as("text")} />
        <input type="hidden" {...updateRecord.fields.transform.as("text")} />
        <input
          type="hidden"
          {...updateRecord.fields.location_geom.as("text")}
        />

        <!-- Title -->
        <Input
          {...updateRecord.fields.title.as("text")}
          issues={updateRecord.fields.title.issues()}
          label="Title"
        />
        <HelperBox
          >Title - One sentence to describe the record. Akin to a headline - for
          example "A train standing in Princetown station in 1923" The intention
          is not to describe everything but to summarise the key subject matter
          of the record.</HelperBox
        >

        <!-- Captions -->
        <Input
          {...updateRecord.fields.caption_front.as("text")}
          issues={updateRecord.fields.caption_front.issues()}
          label="Caption (front)"
        />
        <HelperBox
          >Caption Front - Any text writted on the front of the record where
          applicable. As close to verbatim as possible retaining text case and
          any mis-spelling.
        </HelperBox>
        <Input
          {...updateRecord.fields.caption_back.as("text")}
          issues={updateRecord.fields.caption_back.issues()}
          label="Caption (back)"
        />
        <HelperBox
          >Caption Back - Any text writted on the back of the record where
          applicable. As close to verbatim as possible retaining text case and
          any mis-spelling.
        </HelperBox>
        <!-- Original ID -->
        <Input
          {...updateRecord.fields.original_id.as("text")}
          issues={updateRecord.fields.original_id.issues()}
          label="Original ID"
        />
        <HelperBox
          >Original ID - This is rarely needed. If an item has a reference
          number pertaining to the collection it can be recorded here. This is
          typical in more established collections like Chapman or Burnard.
        </HelperBox>
        <!-- Details -->
        <TextArea
          label="Details"
          maxLength={500}
          issues={updateRecord.fields.detail.issues()}
          {...updateRecord.fields.detail.as("text")}
        />
        <HelperBox
          >Detail - This is a place to include all of the known information
          about the Record that hasn't been entered elsewhere. You may repeat
          information if it makes the detailed description clearer to the
          audience. Ideally we would have several paragraphs here but often
          there is a shortage of information. Use as many variants of words as
          possible in the Detail to assist searchers. If the information is from
          a book or the internet, please provide a reference. Please include
          information on the photographer/author of a document etc if known. If
          there is a lengthy description that applies to many images, please
          contact the Archive Manager, who will enable you to include the
          information in Dartmoor Data with a link from the Record.
        </HelperBox>
        <hr class="my-2" />

        <!-- Date Fields -->
        <div class="flex gap-4 items-end">
          <Select
            label="Day"
            items={days}
            {...updateRecord.fields.date_day.as("select")}
          />
          <Select
            label="Month"
            items={months}
            {...updateRecord.fields.date_month.as("select")}
          />
          <Select
            label="Year"
            items={years}
            {...updateRecord.fields.date_year.as("select")}
          />
          <Checkbox
            label="Circa"
            {...updateRecord.fields.date_estimated.as("checkbox")}
          />
        </div>
        <HelperBox>
          A four digit entry of the year that the asset was created - not the
          date it was added to the Archive (this is automatically generated).
          E.g. "1914" for an image taken in the first year of the 1WW. We record
          the year, month and day separately as we often only have partial
          information. Please enter a 4 digit number for year, 2 for month and 2
          for day where known. If not known, leave the appropriate box set to
          'Unknown'. Select the 'circa' box where this is an estimate.
        </HelperBox>
        <hr class="my-2" />
        <!-- Location Section -->
        <Heading level={2} text="Location" />

        <!-- Map Component (commented out in original) -->
        <Map
          estimated={record.location_estimated}
          bind:geojson={record.geom}
          edit={true}
        />
        <div class="flex gap-5">
          <Input
            {...updateRecord.fields.location_name.as("text")}
            issues={updateRecord.fields.location_name.issues()}
            label="Location Name"
          />
          <Checkbox
            label="Estimated"
            {...updateRecord.fields.location_estimated.as("checkbox")}
          />
        </div>
        <HelperBox>
          Where known, the location of the image should be recorded. This may be
          where the image was taken, the location the picture depicts or the
          asset describes. To do this place a marker upon the Ordnance Survey
          map. If no location exists, you will see a zoomed-out map of Dartmoor
          without a marker. If there is an existing location the map will be
          centred and zoomed on that marker. If the image is a general view,
          position the pin at the point where the image was taken from.
        </HelperBox>
        <!-- Location Search Tools -->
        <div class="bg-white p-4 rounded border space-y-3">
          <div class="flex gap-2">
            <label class="flex-1">
              <span class="text-sm font-medium">OS Grid Reference</span>
              <input
                bind:value={osgr}
                onkeydown={(e) => {
                  if (e.key === "Enter") {
                    handleOSGridSearch(e);
                  }
                }}
                type="text"
                placeholder="e.g. TQ 12345 67890"
                class="w-full border-2 border-gray-300 px-3 py-2 rounded mt-1"
              />
            </label>
            <button
              type="button"
              onclick={(e) => handleOSGridSearch(e)}
              class="self-end bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
            >
              Go
            </button>
          </div>

          <div class="flex gap-2">
            <label class="flex-1">
              <span class="text-sm font-medium">Place Name</span>
              <input
                bind:value={placename}
                type="text"
                onkeydown={(e) => {
                  if (e.key === "Enter") {
                    handlePlaceSearch(e);
                  }
                }}
                placeholder="Search for a place"
                class="w-full border-2 border-gray-300 px-3 py-2 rounded mt-1"
              />
            </label>
            <button
              type="button"
              onclick={(e) => handlePlaceSearch(e)}
              class="self-end bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        <!-- Place Search Results -->
        {#if placeresults.length > 0}
          <div class="flex flex-wrap gap-2">
            {#each placeresults as { name1, coords }}
              <button
                type="button"
                class="bg-white border-2 border-gray-300 hover:border-green-600 p-2 rounded shadow-sm hover:shadow transition-all"
                onclick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectPlace(name1, coords);
                }}
              >
                {name1}
              </button>
            {/each}
          </div>
        {/if}
        <HelperBox>
          To help with using the map you can search by OS Grid Reference, e.g.
          SX345456 or search our directory of location names. If you search by
          name, results will appear above this text. Clicking on the box with
          your chosen name will move the map to this location.
        </HelperBox>
        <button
          type="submit"
          class="p-3 bg-green-700 hover:bg-green-800 hover:cursor-pointer text-white rounded transition-colors font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>

    <!-- Preview Section -->
    <div class="basis-1/3">
      <div class="sticky top-5 flex flex-col gap-4">
        <!-- Transform Controls -->

        <!-- Image Preview -->
        <div class="bg-white p-4 rounded border">
          <h3 class="font-semibold mb-3">Preview</h3>
          <ArchiveImage {record} size={500} crop={false} />
        </div>
        <div class="bg-white p-4 rounded border">
          <h3 class="font-semibold mb-3">Image Transforms</h3>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              onclick={() => rotate(90)}
              class="bg-gray-200 hover:bg-green-600 hover:text-white p-3 rounded transition-all"
              title="Rotate clockwise 90°"
            >
              <Icon icon="ic:baseline-rotate-right" width="24" />
            </button>

            <button
              type="button"
              onclick={() => rotate(-90)}
              class="bg-gray-200 hover:bg-green-600 hover:text-white p-3 rounded transition-all"
              title="Rotate counter-clockwise 90°"
            >
              <Icon icon="ic:baseline-rotate-left" width="24" />
            </button>

            <button
              type="button"
              onclick={toggleFlip}
              class="bg-gray-200 hover:bg-green-600 hover:text-white p-3 rounded transition-all"
              class:bg-green-600={record.transform.flip}
              class:text-white={record.transform.flip}
              title="Flip vertically"
            >
              <Icon icon="ic:baseline-swap-vertical-circle" width="24" />
            </button>

            <button
              type="button"
              onclick={toggleFlop}
              class="bg-gray-200 hover:bg-green-600 hover:text-white p-3 rounded transition-all"
              class:bg-green-600={record.transform.flop}
              class:text-white={record.transform.flop}
              title="Flip horizontally"
            >
              <Icon icon="ic:baseline-swap-horizontal-circle" width="24" />
            </button>

            <button
              type="button"
              onclick={toggleInvert}
              class="bg-gray-200 hover:bg-green-600 hover:text-white p-3 rounded transition-all"
              class:bg-green-600={record.transform.n}
              class:text-white={record.transform.n}
              title="Invert colors"
            >
              <Icon icon="ic:baseline-invert-colors" width="24" />
            </button>

            <button
              type="button"
              onclick={resetTransform}
              class="bg-red-100 hover:bg-red-600 hover:text-white p-3 rounded transition-all ml-auto"
              title="Reset all transforms"
            >
              <Icon icon="ic:baseline-refresh" width="24" />
            </button>
          </div>

          <!-- Transform State Display -->
          <div class="mt-3 p-2 bg-gray-50 rounded text-sm font-mono">
            <div>Rotation: {record.transform.r || 0}°</div>
            <div>Flip: {record.transform.flip ? "Yes" : "No"}</div>
            <div>Flop: {record.transform.flop ? "Yes" : "No"}</div>
            <div>Invert: {record.transform.n ? "Yes" : "No"}</div>
          </div>
        </div>
        <!-- Validation Errors -->
        {#if updateRecord.fields.allIssues()}
          <div class="bg-red-50 border border-red-200 rounded p-4">
            <h3 class="font-semibold text-red-800 mb-2">Validation Errors:</h3>
            <ul class="space-y-1">
              {#each updateRecord.fields.allIssues() as issue}
                <li class="text-red-700 text-sm">
                  <strong>{issue.path}:</strong>
                  {issue.message}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
        <!-- Debug Info (optional - remove in production) -->
        {#if import.meta.env.DEV}
          <details class="bg-gray-50 p-3 rounded text-xs">
            <summary class="cursor-pointer font-semibold">Debug Info</summary>
            <pre class="mt-2 overflow-auto">{JSON.stringify(
                record,
                null,
                2,
              )}</pre>
          </details>
        {/if}
      </div>
    </div>
  {:else}
    <div>Not allowed</div>
  {/if}
</div>
