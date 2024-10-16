import { testimonialStore } from "./store.js"; // Import the store

const baseURL = "http://localhost:5500";

// Fetch and display testimonials
export async function fetchAndDisplayTestimonials() {
  const testimonialsTableBody = document.getElementById(
    "testimonials-table-body"
  );
  testimonialsTableBody.innerHTML = "";

  try {
    const response = await fetch(`${baseURL}/api/testimonials`);
    if (!response.ok)
      throw new Error(`Error: ${response.status} ${response.statusText}`);

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
  } catch (error) {
    console.error("Failed to fetch testimonials", error);
    testimonialsTableBody.innerHTML = `<tr><td colspan="5">Failed to load testimonials: ${error.message}</td></tr>`;
  }
}

// Add event listeners for the testimonials section
export function attachTestimonialListeners() {
  const testimonialForm = document.getElementById("testimonial-form");
  if (testimonialForm) {
    testimonialForm.addEventListener("submit", saveTestimonial);
  }
}

// Open testimonial modal with existing testimonial data
window.openTestimonialModal = (testimonialId) => {
  const testimonial = testimonialStore[testimonialId];
  document.getElementById("testimonial-modal-title").innerText =
    "Edit Testimonial";
  document.getElementById("testimonial-name").value = testimonial.name;
  document.getElementById("testimonial-quote").value = testimonial.quote;

  // Set the current image
  document.getElementById("testimonial-current-image").src = testimonial.image;
  document.getElementById("testimonial-image-url").value = testimonial.image; // Store the current image URL

  document.getElementById("testimonial-modal").classList.remove("hidden");
};

// Close the testimonial modal
window.closeTestimonialModal = () => {
  document.getElementById("testimonial-modal").classList.add("hidden");
};

// Save testimonial (add or edit)
async function saveTestimonial(event) {
  event.preventDefault();

  // Check if a new image was uploaded
  const imageFileInput = document.getElementById("testimonial-image-file");
  let imageUrl = document.getElementById("testimonial-image-url").value;

  if (imageFileInput.files.length > 0) {
    const imageFile = imageFileInput.files[0];
    imageUrl = await uploadImage(imageFile); // Upload new image and get URL
  }

  const testimonialData = {
    name: document.getElementById("testimonial-name").value,
    quote: document.getElementById("testimonial-quote").value,
    image: imageUrl, // Use the new or existing image URL
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

  closeTestimonialModal();
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
