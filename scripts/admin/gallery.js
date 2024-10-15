const baseURL = "http://localhost:5500";

// Fetch and display gallery items
export async function fetchAndDisplayGallery() {
  const galleryTableBody = document.getElementById("gallery-table-body");
  galleryTableBody.innerHTML = "";

  const response = await fetch(`${baseURL}/api/gallery`);
  const galleryItems = await response.json();

  galleryItems.forEach((item, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${item.image}" alt="${item.title}" width="100" /></td>
        <td>${item.title}</td>
        <td>
          <button class="btn btn-secondary" onclick="openModal('gallery-modal', 'Edit Gallery Item', ${JSON.stringify(
            item
          )}, '${item._id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteGalleryItem('${
            item._id
          }')">Delete</button>
        </td>
      </tr>
    `;
    galleryTableBody.insertAdjacentHTML("beforeend", row);
  });
}

// Add event listeners for the gallery section
export function attachGalleryListeners() {
  const galleryForm = document.getElementById("gallery-form");
  if (galleryForm) {
    galleryForm.addEventListener("submit", saveGallery);
  }
}

// Save gallery item
async function saveGallery(event) {
  event.preventDefault();
  const galleryData = {
    title: document.getElementById("gallery-title").value,
    image: document.getElementById("gallery-image").value,
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

  closeModal("gallery-modal");
  fetchAndDisplayGallery(); // Refresh the gallery list
}

// Delete gallery item
async function deleteGalleryItem(itemId) {
  if (confirm("Are you sure you want to delete this gallery item?")) {
    try {
      await fetch(`${baseURL}/api/gallery/${itemId}`, { method: "DELETE" });
      fetchAndDisplayGallery();
    } catch (error) {
      console.error("Failed to delete gallery item", error);
    }
  }
}
