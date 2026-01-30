<script lang="ts">
  import { page } from "$app/state";
  import ArchiveImage from "$lib/ui/ArchiveImage.svelte";
  import { toast } from "svelte-sonner";
  import {
    getRecord,
    placeSearch,
    updateRecord,
  } from "../../../../data.remote";
  import HelperBox from "$lib/ui/form/HelperBox.svelte";
  import { OSGB2latLng } from "$lib/os";
  import { encodeBase32 } from "geohashing";
  import Icon from "@iconify/svelte";
  import MapEdit from "$lib/ui/MapEdit.svelte";

  let { params } = $props();
  // Load the initial record
  const oldRecord = await getRecord(params.id);

  // svelte-ignore state_referenced_locally
  updateRecord.fields.set({
    ...oldRecord,
    date_day: oldRecord.date_day ?? "",
    date_month: oldRecord.date_month ?? "",
    date_year: oldRecord.date_year ?? "",
  });

  // Date constants
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
    value: String(1900 + i),
    label: String(1900 + i),
  })).reverse();

  // Search logic
  let placename = $state("");
  let placeresults = $state([]);
  let osgr = $state("");

  const handlePlaceSearch = async (e: Event) => {
    e.preventDefault();
    if (!placename.trim()) return toast.error("Please enter a place name");
    try {
      placeresults = await placeSearch(placename);
      if (placeresults.length === 0) toast.info("No places found.");
    } catch (error) {
      toast.error("Failed to search for place");
    }
  };

  const handleOSGridSearch = (e: Event) => {
    e.preventDefault();
    try {
      const ll = OSGB2latLng(osgr);
      if (ll.latitude && ll.longitude) {
        updateRecord.fields.geohash.set(
          encodeBase32(ll.latitude, ll.longitude),
        );
        toast.success("Location updated");
      }
    } catch (error) {
      toast.error("Invalid OS Grid reference");
    }
  };
</script>

<div class="container mx-auto flex flex-row gap-10">
  {#if page.data?.session?.roles?.includes("record-edit")}
    <div class="basis-2/3">
      <form
        class="flex flex-col gap-4"
        {...updateRecord.enhance(async ({ submit, data }) => {
          try {
            await submit();
          } catch (error) {
            console.log("error", error);
          }
        })}
      >
        <input
          type="hidden"
          {...updateRecord.fields.id.as("text")}
          class="w-0 h-0"
        />
        <input
          type="hidden"
          {...updateRecord.fields.geohash.as("text")}
          class="w-0 h-0"
        />
        <input
          {...updateRecord.fields.transform.r.as("number")}
          type="hidden"
          class="w-0 h-0"
        />
        <input
          {...updateRecord.fields.transform.flip.as("checkbox")}
          class="w-0 h-0"
        />
        <input
          {...updateRecord.fields.transform.flop.as("checkbox")}
          class="w-0 h-0"
        />
        <input
          {...updateRecord.fields.transform.n.as("checkbox")}
          class="w-0 h-0"
        />
        <label>
          <h2>Title</h2>
          <input {...updateRecord.fields.title.as("text")} />
        </label>
        {#each updateRecord.fields.title.issues() as issue}
          <p class="issue">{issue.message}</p>
        {/each}
        <HelperBox
          >Title - One sentence to describe the record. Akin to a headline - for
          example "A train standing in Princetown station in 1923" The intention
          is not to describe everything but to summarise the key subject matter
          of the record.</HelperBox
        >

        <label>
          <h2>Caption Front</h2>
          <input {...updateRecord.fields.caption_front.as("text")} />
        </label>
        {#each updateRecord.fields.caption_front.issues() as issue}
          <p class="issue">{issue.message}</p>
        {/each}
        <HelperBox
          >Caption Front - Any text writted on the front of the record where
          applicable. As close to verbatim as possible retaining text case and
          any mis-spelling.</HelperBox
        >

        <label>
          <h2>Caption Back</h2>
          <input {...updateRecord.fields.caption_back.as("text")} />
        </label>
        {#each updateRecord.fields.caption_back.issues() as issue}
          <p class="issue">{issue.message}</p>
        {/each}
        <HelperBox
          >Caption Back - Any text writted on the back of the record where
          applicable. As close to verbatim as possible retaining text case and
          any mis-spelling.</HelperBox
        >

        <label>
          <h2>Original ID</h2>
          <input {...updateRecord.fields.original_id.as("text")} />
        </label>
        {#each updateRecord.fields.original_id.issues() as issue}
          <p class="issue">{issue.message}</p>
        {/each}
        <HelperBox
          >Original ID - This is rarely needed. If an item has a reference
          number pertaining to the collection it can be recorded here. This is
          typical in more established collections like Chapman or Burnard.</HelperBox
        >

        <div class="flex justify-between gap-10">
          <label>
            <h2>Date Day</h2>
            <select {...updateRecord.fields.date_day.as("select")}>
              <option value="">Unknown</option>
              {#each days as day}<option value={day.value}>{day.label}</option
                >{/each}
            </select>
          </label>
          <label>
            <h2>Date Month</h2>
            <select {...updateRecord.fields.date_month.as("select")}>
              <option value="">Unknown</option>
              {#each months as month}<option value={month.value}
                  >{month.label}</option
                >{/each}
            </select>
          </label>
          <label>
            <h2>Date Year</h2>
            <select {...updateRecord.fields.date_year.as("select")}>
              <option value="">Unknown</option>
              {#each years as year}<option value={year.value}
                  >{year.label}</option
                >{/each}
            </select>
          </label>
          <label>
            <h2>Date Estimated</h2>
            <input {...updateRecord.fields.date_estimated.as("checkbox")} />
          </label>
        </div>
        <HelperBox
          >A four digit entry of the year that the asset was created - not the
          date it was added to the Archive (this is automatically generated).
          E.g. "1914" for an image taken in the first year of the 1WW. We record
          the year, month and day separately as we often only have partial
          information. Please enter a 4 digit number for year, 2 for month and 2
          for day where known. If not known, leave the appropriate box set to
          'Unknown'. Select the 'circa' box where this is an estimate.</HelperBox
        >

        <label>
          <h2>Details</h2>
          <textarea rows="15" {...updateRecord.fields.detail.as("text")}
          ></textarea>
        </label>
        {#each updateRecord.fields.detail.issues() as issue}
          <p class="issue">{issue.message}</p>
        {/each}
        <HelperBox
          >Detail - This is a place to include all of the known information
          about the Record that hasn't been entered elsewhere. You may repeat
          information if it makes the detailed description clearer to the
          audience. Ideally we would have several paragraphs here but often
          there is a shortage of information. Use as many variants of words as
          possible in the Detail to assist searchers. If the information is from
          a book or the internet, please provide a reference. Please include
          information on the photographer/author of a document etc if known.</HelperBox
        >

        <label>
          <h2>Location Name</h2>
          <input {...updateRecord.fields.location_name.as("text")} />
        </label>
        {#each updateRecord.fields.location_name.issues() as issue}
          <p class="issue">{issue.message}</p>
        {/each}
        <HelperBox
          >Where does this record depict or where was it created? If you know
          the name of the location, put it in here.</HelperBox
        >

        <h2>Mapped Location</h2>
        <MapEdit {updateRecord} />
        <button onclick={() => updateRecord.fields.geohash.set()}
          >Clear Marker</button
        >
        <HelperBox
          >A pin denoting the location. The location name entered above and this
          pin are not always linked and will therefore not automatically
          correlate. To assist with finding the location on this map there are
          two search options below.</HelperBox
        >

        <div class="bg-white p-4 rounded border space-y-3">
          <div class="flex gap-2">
            <label class="flex-1">
              <span class="text-sm font-medium"
                >Search by OS Grid Reference</span
              >
              <input
                bind:value={osgr}
                type="text"
                placeholder="e.g. TQ 12345 67890"
                class="os-input"
              />
            </label>
            <button
              type="button"
              onclick={handleOSGridSearch}
              class="search-btn">Go</button
            >
          </div>
          <div class="flex gap-2">
            <label class="flex-1">
              <span class="text-sm font-medium">Search by Place Name</span>
              <input
                bind:value={placename}
                type="text"
                placeholder="Search for a place"
                class="os-input"
              />
            </label>
            <button type="button" onclick={handlePlaceSearch} class="search-btn"
              >Search</button
            >
          </div>
        </div>

        {#if placeresults.length > 0}
          <div class="flex flex-wrap gap-2">
            {#each placeresults as { name1, geohash }}
              <button
                type="button"
                class="bg-white border-2 p-2 rounded hover:border-green-600"
                onclick={() => updateRecord.fields.geohash.set(geohash)}
                >{name1}</button
              >
            {/each}
          </div>
        {/if}
        <HelperBox
          >To help with using the map you can search by OS Grid Reference, e.g.
          SX345456 or search our directory of location names. If you search by
          name, results will appear above this text. Clicking on the box with
          your chosen name will move the map to this location.</HelperBox
        >

        <label>
          <h2>Notes</h2>
          <textarea rows="10" {...updateRecord.fields.notes.as("text")}
          ></textarea>
        </label>
        {#each updateRecord.fields.notes.issues() as issue}
          <p class="issue">{issue.message}</p>
        {/each}

        <div class="flex gap-10">
          <label>
            <h2>Downloadable</h2>
            <input {...updateRecord.fields.downloadable.as("checkbox")} />
          </label>
          <label>
            <h2>Public Record</h2>
            <input {...updateRecord.fields.public.as("checkbox")} />
          </label>
        </div>
        <HelperBox
          >If downloadable is checked there will be a link for the public to
          download the original item. If Public Record is checked it can be
          searched for and viewed, otherwise it is hidden.</HelperBox
        >

        <button class="save-button">Save</button>
        {#if updateRecord.result}
          <div class="bg-green-800 text-white p-5 text-center">
            Record Saved
          </div>
        {/if}
        {#each updateRecord.fields.allIssues() as issue}
          <p class="issue">{issue.message}</p>
        {/each}
      </form>
    </div>

    <div class="basis-1/3">
      <div class="sticky top-5 flex flex-col gap-4">
        <div class="bg-white p-4 rounded border">
          <h3 class="font-semibold mb-3">Image Transforms</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              class="tool-btn"
              onclick={() => {
                const startRotate = updateRecord.fields.transform.r.value();
                let endRotate = 0;
                if (startRotate + 90 === 360) {
                  endRotate = 0;
                } else {
                  endRotate = startRotate + 90;
                }
                updateRecord.fields.transform.r.set(endRotate);
              }}><Icon icon="ic:baseline-rotate-right" width="24" /></button
            >

            <button
              type="button"
              class="tool-btn"
              onclick={() => {
                const startRotate = updateRecord.fields.transform.r.value();
                let endRotate = 0;
                if (startRotate - 90 === -90) {
                  endRotate = 270;
                } else {
                  endRotate = startRotate - 90;
                }
                updateRecord.fields.transform.r.set(endRotate);
              }}><Icon icon="ic:baseline-rotate-left" width="24" /></button
            >

            <button
              type="button"
              class="tool-btn"
              onclick={() =>
                updateRecord.fields.transform.flip.set(
                  !updateRecord.fields.transform.flip.value(),
                )}
            >
              <Icon icon="ic:baseline-swap-vertical-circle" width="24" />
            </button>

            <button
              type="button"
              class="tool-btn"
              onclick={() =>
                updateRecord.fields.transform.flop.set(
                  !updateRecord.fields.transform.flop.value(),
                )}
            >
              <Icon icon="ic:baseline-swap-horizontal-circle" width="24" />
            </button>

            <button
              type="button"
              class="tool-btn"
              onclick={() =>
                updateRecord.fields.transform.n.set(
                  !updateRecord.fields.transform.n.value(),
                )}
            >
              <Icon icon="ic:baseline-invert-colors" width="24" />
            </button>
          </div>

          <div class="bg-white p-4 rounded border">
            <h3 class="font-semibold mb-3">Preview</h3>
            <ArchiveImage
              record={updateRecord.fields.value()}
              size={500}
              crop={false}
              lightbox={true}
            />
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div>Not allowed</div>
  {/if}
</div>

<style>
  h2 {
    font-size: larger;
    font-weight: 900;
    width: 100%;
  }
  textarea,
  .os-input,
  label > input {
    border: 1px solid #c4c4c4;
    background-color: white;
    padding: 4px;
    width: 100%;
  }
  select {
    background-color: white;
    border: 1px solid #c4c4c4;
    padding: 5px;
  }
  .save-button {
    background-color: #2c4e2c;
    color: white;
    padding: 10px;
    cursor: pointer;
  }
  .search-btn {
    background-color: #4b5563;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
  }
  .tool-btn {
    background-color: #e5e7eb;
    padding: 12px;
    border-radius: 6px;
  }
  .tool-btn:hover {
    background-color: #16a34a;
    color: white;
  }
  p.issue {
    padding: 5px 10px;
    font-weight: 900;
    background-color: #f35959;
    color: white;
    margin-top: 4px;
  }
</style>
