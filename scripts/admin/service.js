import { serviceStore } from "./store.js"; // Import the store

const baseURL = "http://localhost:5500";

// Fetch and display services
export async function fetchAndDisplayServices() {
  const servicesTableBody = document.getElementById("services-table-body");
  servicesTableBody.innerHTML = "";

  try {
    const response = await fetch(`${baseURL}/api/services`);
    if (!response.ok)
      throw new Error(`Error: ${response.status} ${response.statusText}`);

    const services = await response.json();

    services.forEach((service, index) => {
      // Store service in the serviceStore
      serviceStore[service._id] = service;

      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${service.title}</td>
          <td><img src="${service.image}" alt="${
        service.title
      }" width="100" /></td>
          <td>${service.priceCents}</td>
          <td>
            <button class="btn btn-secondary" onclick="openServiceModal('${
              service._id
            }')">Edit</button>
            <button class="btn btn-danger" onclick="deleteService('${
              service._id
            }')">Delete</button>
          </td>
        </tr>
      `;
      servicesTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Failed to fetch services", error);
    servicesTableBody.innerHTML = `<tr><td colspan="5">Failed to load services: ${error.message}</td></tr>`;
  }
}

// Add event listeners for the services section
export function attachServiceListeners() {
  const serviceForm = document.getElementById("service-form");
  if (serviceForm) {
    serviceForm.addEventListener("submit", saveService);
  }
}

// Open service modal with existing service data
window.openServiceModal = (serviceId) => {
  const service = serviceStore[serviceId];
  document.getElementById("service-modal-title").innerText = "Edit Service";
  document.getElementById("service-title").value = service.title;
  document.getElementById("service-description").value = service.description;
  document.getElementById("service-price").value = service.priceCents;

  // Set the current image
  document.getElementById("service-current-image").src = service.image;
  document.getElementById("service-image-url").value = service.image; // Store the current image URL

  document.getElementById("service-modal").classList.remove("hidden");
};

// Close the service modal
window.closeServiceModal = () => {
  document.getElementById("service-modal").classList.add("hidden");
};

// Save service (add or edit)
async function saveService(event) {
  event.preventDefault();

  // Check if a new image was uploaded
  const imageFileInput = document.getElementById("service-image-file");
  let imageUrl = document.getElementById("service-image-url").value;

  if (imageFileInput.files.length > 0) {
    const imageFile = imageFileInput.files[0];
    imageUrl = await uploadImage(imageFile); // Upload new image and get URL
  }

  const serviceData = {
    title: document.getElementById("service-title").value,
    description: document.getElementById("service-description").value,
    priceCents: parseInt(document.getElementById("service-price").value),
    image: imageUrl, // Use the new or existing image URL
  };

  const url = editingServiceId
    ? `${baseURL}/api/services/${editingServiceId}`
    : `${baseURL}/api/services`;
  const method = editingServiceId ? "PUT" : "POST";

  await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serviceData),
  });

  closeServiceModal();
  fetchAndDisplayServices(); // Refresh the services list
}

// Delete service
export async function deleteService(serviceId) {
  if (confirm("Are you sure you want to delete this service?")) {
    try {
      await fetch(`${baseURL}/api/services/${serviceId}`, { method: "DELETE" });
      fetchAndDisplayServices();
    } catch (error) {
      console.error("Failed to delete service", error);
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
