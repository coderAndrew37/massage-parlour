import { galleryStore } from "./store.js"; // Import the store

const baseURL = "http://localhost:5500";

// Fetch and display gallery items
export async function fetchAndDisplayGallery() {
  const galleryTableBody = document.getElementById("gallery-table-body");
  galleryTableBody.innerHTML = "";

  try {
    const response = await fetch(`${baseURL}/api/gallery`);
    if (!response.ok)
      throw new Error(`Error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    const galleryItems = data.gallery || []; // Ensure it's an array

    galleryItems.forEach((item, index) => {
      galleryStore[item._id] = item;

      const row = `
        <tr>
          <td>${index + 1}</td>
          <td><img src="${item.image}" alt="${item.title}" width="100" /></td>
          <td>${item.title}</td>
          <td>
            <button class="btn btn-secondary" onclick="openGalleryModal('${
              item._id
            }')">Edit</button>
            <button class="btn btn-danger" onclick="deleteGalleryItem('${
              item._id
            }')">Delete</button>
          </td>
        </tr>
      `;
      galleryTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Failed to fetch gallery items", error);
    galleryTableBody.innerHTML = `<tr><td colspan="4">Failed to load gallery: ${error.message}</td></tr>`;
  }
}

// Add event listeners for the gallery section
export function attachGalleryListeners() {
  const galleryForm = document.getElementById("gallery-form");
  if (galleryForm) {
    galleryForm.addEventListener("submit", saveGallery);
  }
}

// Open gallery modal with existing gallery item data
window.openGalleryModal = (itemId) => {
  const item = galleryStore[itemId];
  document.getElementById("gallery-modal-title").innerText =
    "Edit Gallery Item";
  document.getElementById("gallery-title").value = item.title;

  // Set the current image
  document.getElementById("gallery-current-image").src = item.image;
  document.getElementById("gallery-image-url").value = item.image; // Store the current image URL

  document.getElementById("gallery-modal").classList.remove("hidden");
};

// Close the gallery modal
window.closeGalleryModal = () => {
  document.getElementById("gallery-modal").classList.add("hidden");
};

// Save gallery item (add or edit)
async function saveGallery(event) {
  event.preventDefault();

  // Check if a new image was uploaded
  const imageFileInput = document.getElementById("gallery-image-file");
  let imageUrl = document.getElementById("gallery-image-url").value;

  if (imageFileInput.files.length > 0) {
    const imageFile = imageFileInput.files[0];
    imageUrl = await uploadImage(imageFile); // Upload new image and get URL
  }

  const galleryData = {
    title: document.getElementById("gallery-title").value,
    image: imageUrl, // Use the new or existing image URL
  };

  const url = editingGalleryId
    ? `${baseURL}/api/gallery/${editingGalleryId}`
    : `${baseURL}/api/gallery`;
  const method = editingGalleryId ? "PUT" : "POST";

  await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(galleryData),
  });

  closeGalleryModal();
  fetchAndDisplayGallery(); // Refresh the gallery list
}

// Delete gallery item
export async function deleteGalleryItem(itemId) {
  if (confirm("Are you sure you want to delete this gallery item?")) {
    try {
      await fetch(`${baseURL}/api/gallery/${itemId}`, { method: "DELETE" });
      fetchAndDisplayGallery();
    } catch (error) {
      console.error("Failed to delete gallery item", error);
    }
  }
}

// Function to handle image upload
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${baseURL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.url; // Return uploaded image URL
}
