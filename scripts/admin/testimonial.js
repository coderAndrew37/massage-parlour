import { testimonialStore } from "./store.js"; // Import the store

const baseURL = "http://localhost:5500";

// Fetch and display testimonials
export async function fetchAndDisplayTestimonials() {
  const testimonialsTableBody = document.getElementById(
    "testimonials-table-body"
  );
  testimonialsTableBody.innerHTML = "";

  const response = await fetch(`${baseURL}/api/testimonials`);
  const testimonials = await response.json();

  testimonials.forEach((testimonial, index) => {
    // Store testimonial in testimonialStore
    testimonialStore[testimonial._id] = testimonial;

    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${testimonial.name}</td>
        <td><img src="${testimonial.image}" alt="${
      testimonial.name
    }" width="100" /></td>
        <td>${testimonial.quote}</td>
        <td>
          <button class="btn btn-secondary" onclick="openTestimonialModal('${
            testimonial._id
          }')">Edit</button>
          <button class="btn btn-danger" onclick="deleteTestimonial('${
            testimonial._id
          }')">Delete</button>
        </td>
      </tr>
    `;
    testimonialsTableBody.insertAdjacentHTML("beforeend", row);
  });
}

// Add event listeners for the testimonials section
export function attachTestimonialListeners() {
  const testimonialForm = document.getElementById("testimonial-form");
  if (testimonialForm) {
    testimonialForm.addEventListener("submit", saveTestimonial);
  }
}

// Save testimonial
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

// Delete testimonial
export async function deleteTestimonial(testimonialId) {
  if (confirm("Are you sure you want to delete this testimonial?")) {
    try {
      await fetch(`${baseURL}/api/testimonials/${testimonialId}`, {
        method: "DELETE",
      });
      fetchAndDisplayTestimonials();
    } catch (error) {
      console.error("Failed to delete testimonial", error);
    }
  }
}
