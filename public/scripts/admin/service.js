import { serviceStore } from "./store.js"; // Import the store

const baseURL = "http://localhost:5500";

// Fetch and display services
// Modify the fetch call to access the `services` array within the response object
// Fetch and display services
export async function fetchAndDisplayServices() {
  const servicesTableBody = document.getElementById("services-table-body");
  servicesTableBody.innerHTML = "";

  try {
    const response = await fetch(`${baseURL}/api/services`);
    if (!response.ok)
      throw new Error(`Error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    const services = data.services || []; // Ensure `services` is an array

    services.forEach((service, index) => {
      // Check if service has an _id before adding it to the store
      if (service._id) {
        serviceStore[service._id] = service; // Store service in the serviceStore

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
      } else {
        console.warn("Service is missing _id:", service);
      }
    });
  } catch (error) {
    console.error("Failed to fetch services", error);
    servicesTableBody.innerHTML = `<tr><td colspan="5">Failed to load services: ${error.message}</td></tr>`;
  }
}

// Improved openServiceModal to handle undefined service
window.openServiceModal = (serviceId) => {
  const service = serviceStore[serviceId];
  if (!service) {
    console.error(`Service with ID ${serviceId} not found in serviceStore`);
    return; // Exit if service is undefined
  }

  document.getElementById("service-modal-title").innerText = "Edit Service";
  document.getElementById("service-title").value = service.title;
  document.getElementById("service-description").value = service.description;
  document.getElementById("service-price").value = service.priceCents;
  document.getElementById("service-current-image").src = service.image;
  document.getElementById("service-image-url").value = service.image;

  document.getElementById("service-modal").classList.remove("hidden");
};

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
// Save service (add or edit)
async function saveService(event) {
  event.preventDefault();

  const imageFileInput = document.getElementById("service-image-file");
  let imageUrl = document.getElementById("service-image-url").value;

  if (imageFileInput.files.length > 0) {
    const imageFile = imageFileInput.files[0];
    imageUrl = await uploadImage(imageFile);
  }

  const serviceData = {
    title: document.getElementById("service-title").value,
    description: document.getElementById("service-description").value,
    priceCents: parseInt(document.getElementById("service-price").value),
    image: imageUrl,
    additionalImages: [], // Optional field if populated
    videoUrl: "", // Optional field if populated
    benefits: [], // Optional field if populated
    relatedServiceIds: [], // Optional field if populated
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
  fetchAndDisplayServices(); // Refresh the list
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
