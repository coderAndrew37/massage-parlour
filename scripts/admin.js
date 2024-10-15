const baseURL = "http://localhost:5500";
let editingServiceId = null; // Track if editing service
let editingGalleryId = null; // Track if editing gallery
let editingTestimonialId = null; // Track if editing testimonial

// Utility function to open modal
function openModal(modalId, title, item = {}, itemId = null) {
  document.getElementById(modalId).classList.add("active");
  document.getElementById(`${modalId}-title`).innerText = title;

  if (itemId) {
    if (modalId === "service-modal") {
      document.getElementById("service-title").value = item.title;
      document.getElementById("service-description").value = item.description;
      document.getElementById("service-price").value = item.priceCents;
      document.getElementById("service-image").value = item.image;
      editingServiceId = itemId;
    } else if (modalId === "gallery-modal") {
      document.getElementById("gallery-title").value = item.title;
      document.getElementById("gallery-image").value = item.image;
      editingGalleryId = itemId;
    } else if (modalId === "testimonial-modal") {
      document.getElementById("testimonial-name").value = item.name;
      document.getElementById("testimonial-quote").value = item.quote;
      document.getElementById("testimonial-image").value = item.image;
      editingTestimonialId = itemId;
    }
  }
}

// Utility function to close modal
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
  editingServiceId = null;
  editingGalleryId = null;
  editingTestimonialId = null;
}

// Add or Edit Service
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

// Add or Edit Gallery Item
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

// Add or Edit Testimonial
async function saveTestimonial(event) {
  event.preventDefault();
  const testimonialData = {
    name: document.getElementById("testimonial-name").value,
    quote: document.getElementById("testimonial-quote").value,
    image: document.getElementById("testimonial-image").value,
  };

  const url = editingTestimonialId
    ? `${baseURL}/api/testimonials/${editingTestimonialId}`
    : `${baseURL}/api/testimonials`;
  const method = editingTestimonialId ? "PUT" : "POST";

  await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testimonialData),
  });

  closeModal("testimonial-modal");
  fetchAndDisplayTestimonials(); // Refresh the testimonial list
}

// Fetch services and display
async function fetchAndDisplayServices() {
  const servicesTableBody = document.getElementById("services-table-body");
  servicesTableBody.innerHTML = "";

  const response = await fetch(`${baseURL}/api/services`);
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
}

// Fetch gallery items and display
async function fetchAndDisplayGallery() {
  const galleryTableBody = document.getElementById("gallery-table-body");
  galleryTableBody.innerHTML = ""; // Clear table

  try {
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
  } catch (error) {
    console.error("Failed to load gallery items", error);
  }
}

// Delete gallery item
async function deleteGalleryItem(itemId) {
  if (confirm("Are you sure you want to delete this gallery item?")) {
    try {
      await fetch(`${baseURL}/api/gallery/${itemId}`, { method: "DELETE" });
      fetchAndDisplayGallery(); // Refresh the gallery list after deletion
    } catch (error) {
      console.error("Failed to delete gallery item", error);
    }
  }
}

// Fetch testimonials and display
async function fetchAndDisplayTestimonials() {
  const testimonialsTableBody = document.getElementById(
    "testimonials-table-body"
  );
  testimonialsTableBody.innerHTML = ""; // Clear table

  try {
    const response = await fetch(`${baseURL}/api/testimonials`);
    const testimonials = await response.json();

    testimonials.forEach((testimonial, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${testimonial.name}</td>
          <td><img src="${testimonial.image}" alt="${
        testimonial.name
      }" width="100" /></td>
          <td>${testimonial.quote}</td>
          <td>
            <button class="btn btn-secondary" onclick="openModal('testimonial-modal', 'Edit Testimonial', ${JSON.stringify(
              testimonial
            )}, '${testimonial._id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteTestimonial('${
              testimonial._id
            }')">Delete</button>
          </td>
        </tr>
      `;
      testimonialsTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Failed to load testimonials", error);
  }
}

// Delete testimonial
async function deleteTestimonial(testimonialId) {
  if (confirm("Are you sure you want to delete this testimonial?")) {
    try {
      await fetch(`${baseURL}/api/testimonials/${testimonialId}`, {
        method: "DELETE",
      });
      fetchAndDisplayTestimonials(); // Refresh the testimonial list after deletion
    } catch (error) {
      console.error("Failed to delete testimonial", error);
    }
  }
}

// Attach modal handlers to form submissions
document.getElementById("service-form").addEventListener("submit", saveService);
document.getElementById("gallery-form").addEventListener("submit", saveGallery);
document
  .getElementById("testimonial-form")
  .addEventListener("submit", saveTestimonial);

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayServices();
  fetchAndDisplayGallery();
  fetchAndDisplayTestimonials();
});
