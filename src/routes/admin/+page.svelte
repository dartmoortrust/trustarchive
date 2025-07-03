<script lang="ts">
  import Container from "$lib/ui/Container.svelte";
  import Heading from "$lib/ui/Heading.svelte";

  let currentTab = $state(0);
  const tabs = [
    { title: "Tab 1", content: "Content 1" },
    { title: "Tab 2", content: "Content 2" },
  ];
  const { data } = $props();
</script>

<Container>
  <div class="grid grid-cols-2 gap-10">
    <div class="flex flex-col gap-4">
      <Heading text="Your Previous Edits" level={2} />
      <table class="table-auto">
        <thead>
          <tr class="text-left"><th>ID</th><th>Edit Date</th></tr>
        </thead>
        <tbody>
          {#each data.past_edits as edit}
            <tr
              ><td
                ><a href={`/archive/record/${edit.record_id}`}
                  >{edit.record_id}</a
                ></td
              ><td>{edit.created_at.toLocaleString("en-GB")}</td></tr
            >
          {/each}
        </tbody>
      </table>
    </div>
    <div class="flex flex-col gap-4">
      <Heading text="User Edits" level={2} />
      <table class="table-auto">
        <thead>
          <tr class="text-left">
            <th>Name</th>
            <th>Email</th>
            <th>Edits</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {#each data.users as user}
            <tr>
              <td>{user.name || "Unknown"}</td>
              <td>{user.email}</td>
              <td>{user.count}</td>
              <td
                >{#each String(user.roles).split(",") as role}<span
                    class="bg-white mr-2 p-1">{role}</span
                  >{/each}</td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="col-span-2 flex flex-col gap-4">
      <Heading text="Comments" level={2} />
      <table class="table-auto">
        <thead>
          <tr class="text-left"
            ><th>Email</th><th>Record ID</th><th>Comment</th><th
              >Comment Date</th
            ></tr
          >
        </thead>
        <tbody>
          {#each data.comments as comment}
            <tr class="align-top">
              <td>{comment.email}</td>
              <td>{comment.record_id}</td>
              <td>{comment.comment}</td>
              <td>{comment.created_at.toLocaleString("en-GB")}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</Container>
