export const updateSearch = async (newData) => {
  newData["id"] = newData["record_id"];
  delete newData["record_id"];
  console.log(JSON.stringify(newData));
  return;

  const res = await fetch(`https://cloud.dartmoortrust.org/indexes/records`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer 50fbbc5cfa2f46569b696993bc8cd380",
    },
    body: JSON.stringify(newData),
  });

  return await res.json();
};
