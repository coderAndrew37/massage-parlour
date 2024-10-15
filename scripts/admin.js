import { serviceStore, galleryStore, testimonialStore } from "./admin/store.js";

import {
  fetchAndDisplayServices,
  attachServiceListeners,
  deleteService,
} from "./admin/service.js";
import {
  fetchAndDisplayGallery,
  attachGalleryListeners,
  deleteGalleryItem,
} from "./admin/gallery.js";
import {
  fetchAndDisplayTestimonials,
  attachTestimonialListeners,
  deleteTestimonial,
} from "./admin/testimonial.js";

// Open and Close Modal Functions
window.openServiceModal = (serviceId) => {
  const service = serviceStore[serviceId];
  document.getElementById("service-modal-title").innerText = "Edit Service";
  document.getElementById("service-title").value = service.title;
  document.getElementById("service-description").value = service.description;
  document.getElementById("service-price").value = service.priceCents;
  document.getElementById("service-image").value = service.image;
  document.getElementById("service-modal").classList.remove("hidden");
};

window.closeServiceModal = () => {
  document.getElementById("service-modal").classList.add("hidden");
};

window.openGalleryModal = (itemId) => {
  const item = galleryStore[itemId];
  document.getElementById("gallery-modal-title").innerText =
    "Edit Gallery Item";
  document.getElementById("gallery-title").value = item.title;
  document.getElementById("gallery-image").value = item.image;
  document.getElementById("gallery-modal").classList.remove("hidden");
};

window.closeGalleryModal = () => {
  document.getElementById("gallery-modal").classList.add("hidden");
};

window.openTestimonialModal = (testimonialId) => {
  const testimonial = testimonialStore[testimonialId];
  document.getElementById("testimonial-modal-title").innerText =
    "Edit Testimonial";
  document.getElementById("testimonial-name").value = testimonial.name;
  document.getElementById("testimonial-quote").value = testimonial.quote;
  document.getElementById("testimonial-image").value = testimonial.image;
  document.getElementById("testimonial-modal").classList.remove("hidden");
};

window.closeTestimonialModal = () => {
  document.getElementById("testimonial-modal").classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", () => {
  // Fetch data and attach listeners for all sections
  fetchAndDisplayServices();
  attachServiceListeners();

  fetchAndDisplayGallery();
  attachGalleryListeners();

  fetchAndDisplayTestimonials();
  attachTestimonialListeners();
});

// Expose delete functions globally for button events
window.deleteService = deleteService;
window.deleteGalleryItem = deleteGalleryItem;
window.deleteTestimonial = deleteTestimonial;
