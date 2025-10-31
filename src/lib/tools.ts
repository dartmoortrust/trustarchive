export const fileIdToBlobUrl = (file_id: string) => {
  const bloburl = "https://dartmoor.blob.core.windows.net/web/";
  const key = file_id?.slice(0, 2) + "/w-" + file_id;
  return bloburl + key;
};

export const getRandomGradient = () => {
  const gradients = [
    "bg-gradient-to-r from-pink-500 to-yellow-500",
    "bg-gradient-to-l from-green-400 to-blue-500",
    "bg-gradient-to-t from-purple-600 to-indigo-700",
    "bg-gradient-to-b from-red-500 to-orange-400",
    "bg-gradient-to-tr from-cyan-400 to-teal-500",
    "bg-gradient-to-bl from-fuchsia-500 to-pink-600",
    "bg-gradient-to-tl from-lime-300 to-green-500",
    "bg-gradient-to-br from-blue-400 to-sky-600",
    "bg-gradient-to-r from-yellow-300 to-amber-500",
    "bg-gradient-to-l from-indigo-500 to-violet-700",
  ];
  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex];
};
