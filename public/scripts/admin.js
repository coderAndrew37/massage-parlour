import {
  serviceStore,
  galleryStore,
  testimonialStore,
  teamMemberStore,
} from "./admin/store.js"; // Import additional store for team members

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
import {
  fetchAndDisplayTeamMembers,
  attachTeamMemberListeners,
  deleteTeamMember,
} from "./admin/teamMember.js"; // New functions for team members
// Open and Close Modal Functions
window.openServiceModal = (serviceId) => {
  const service = serviceStore[serviceId];

  // Check if modal elements exist before setting their properties
  const serviceTitle = document.getElementById("service-title");
  const serviceDescription = document.getElementById("service-description");
  const servicePrice = document.getElementById("service-price");
  const serviceImageUrl = document.getElementById("service-image-url");
  const serviceCurrentImage = document.getElementById("service-current-image");

  if (
    serviceTitle &&
    serviceDescription &&
    servicePrice &&
    serviceImageUrl &&
    serviceCurrentImage
  ) {
    document.getElementById("service-modal-title").innerText = "Edit Service";
    serviceTitle.value = service.title;
    serviceDescription.value = service.description;
    servicePrice.value = service.priceCents;
    serviceCurrentImage.src = service.image;
    serviceImageUrl.value = service.image;

    document.getElementById("service-modal").classList.remove("hidden");
  } else {
    console.error("Service modal elements not found.");
  }
};

window.closeServiceModal = () => {
  document.getElementById("service-modal").classList.add("hidden");
};

window.openGalleryModal = (itemId) => {
  const item = galleryStore[itemId];

  // Check if modal elements exist before setting their properties
  const galleryTitle = document.getElementById("gallery-title");
  const galleryImageUrl = document.getElementById("gallery-image-url");
  const galleryCurrentImage = document.getElementById("gallery-current-image");

  if (galleryTitle && galleryImageUrl && galleryCurrentImage) {
    document.getElementById("gallery-modal-title").innerText =
      "Edit Gallery Item";
    galleryTitle.value = item.title;
    galleryCurrentImage.src = item.image;
    galleryImageUrl.value = item.image;

    document.getElementById("gallery-modal").classList.remove("hidden");
  } else {
    console.error("Gallery modal elements not found.");
  }
};

window.closeGalleryModal = () => {
  document.getElementById("gallery-modal").classList.add("hidden");
};

window.openTestimonialModal = (testimonialId) => {
  const testimonial = testimonialStore[testimonialId];

  // Check if modal elements exist before setting their properties
  const testimonialName = document.getElementById("testimonial-name");
  const testimonialQuote = document.getElementById("testimonial-quote");
  const testimonialImageUrl = document.getElementById("testimonial-image-url");
  const testimonialCurrentImage = document.getElementById(
    "testimonial-current-image"
  );

  if (
    testimonialName &&
    testimonialQuote &&
    testimonialImageUrl &&
    testimonialCurrentImage
  ) {
    document.getElementById("testimonial-modal-title").innerText =
      "Edit Testimonial";
    testimonialName.value = testimonial.name;
    testimonialQuote.value = testimonial.quote;
    testimonialCurrentImage.src = testimonial.image;
    testimonialImageUrl.value = testimonial.image;

    document.getElementById("testimonial-modal").classList.remove("hidden");
  } else {
    console.error("Testimonial modal elements not found.");
  }
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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Event listeners and fetch functions for all sections
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayServices();
  attachServiceListeners();

  fetchAndDisplayGallery();
  attachGalleryListeners();

  fetchAndDisplayTestimonials();
  attachTestimonialListeners();

  fetchAndDisplayTeamMembers(); // Fetch and display team members
  attachTeamMemberListeners(); // Attach event listeners for team member actions
});

// Expose delete functions globally for button events
window.deleteService = deleteService;
window.deleteGalleryItem = deleteGalleryItem;
window.deleteTestimonial = deleteTestimonial;
