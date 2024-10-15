const baseURL = "http://localhost:5500";

// Fetch and display services
export async function fetchAndDisplayServices() {
  const servicesTableBody = document.getElementById("services-table-body");
  servicesTableBody.innerHTML = "";

  try {
    const response = await fetch(`${baseURL}/api/services`);

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const services = await response.json();

    services.forEach((service, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${service.title}</td>
          <td><img src="${service.image}" alt="${
        service.title
      }" width="100" /></td>
          <td>${service.priceCents}</td>
          <td>
            <button class="btn btn-secondary" onclick="openModal('service-modal', 'Edit Service', ${JSON.stringify(
              service
            )}, '${service._id}')">Edit</button>
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

// Save service (add or edit)
async function saveService(event) {
  event.preventDefault();
  const serviceData = {
    title: document.getElementById("service-title").value,
    description: document.getElementById("service-description").value,
    priceCents: parseInt(document.getElementById("service-price").value),
    image: document.getElementById("service-image").value,
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

  closeModal("service-modal");
  fetchAndDisplayServices(); // Refresh the services list
}

// Example for delete function (add more as needed)
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
