import { writable } from "svelte/store";

// Toast store to hold active toasts
export const toasts = writable<{ id: number; message: string; type: string }[]>(
  [],
);

// Function to add a toast notification
export function addToast(message: string, type: string = "info") {
  const id = Date.now(); // Unique id for each toast
  toasts.update((currentToasts) => [...currentToasts, { id, message, type }]);

  // Remove toast after 5 seconds (optional)
  setTimeout(() => {
    removeToast(id);
  }, 10000);
}

// Function to remove a toast by id
export function removeToast(id: number) {
  toasts.update((currentToasts) =>
    currentToasts.filter((toast) => toast.id !== id),
  );
}
