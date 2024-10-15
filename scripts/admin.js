import {
  fetchAndDisplayServices,
  attachServiceListeners,
} from "./admin/service.js";
import {
  fetchAndDisplayGallery,
  attachGalleryListeners,
} from "./admin/gallery.js";
import {
  fetchAndDisplayTestimonials,
  attachTestimonialListeners,
} from "./admin/testimonial.js";
import { openModal, closeModal } from "./admin/modals.js";

document.addEventListener("DOMContentLoaded", () => {
  loadHTMLSections();

  // Retry logic to ensure sections are loaded before proceeding
  const waitForSectionsToLoad = () => {
    const servicesSection = document.getElementById("services-section");
    const gallerySection = document.getElementById("gallery-section");
    const testimonialsSection = document.getElementById("testimonials-section");

    // Check if all sections are loaded
    if (servicesSection && gallerySection && testimonialsSection) {
      // Fetch data and attach listeners once sections are available
      fetchAndDisplayServices();
      attachServiceListeners();

      fetchAndDisplayGallery();
      attachGalleryListeners();

      fetchAndDisplayTestimonials();
      attachTestimonialListeners();
    } else {
      // Retry every 100ms if sections are not yet loaded
      setTimeout(waitForSectionsToLoad, 100);
    }
  };

  // Function to dynamically load HTML sections
  function loadHTMLSections() {
    const sections = [
      { id: "header", url: "header.html" },
      { id: "sidebar", url: "sidebar.html" },
      { id: "services-section", url: "services-section.html" },
      { id: "gallery-section", url: "gallery-section.html" },
      { id: "testimonials-section", url: "testimonials-section.html" },
      { id: "modals", url: "modals.html" },
    ];

    // Fetch and load all HTML sections asynchronously
    Promise.all(
      sections.map((section) =>
        fetch(section.url)
          .then((res) => res.text())
          .then((data) => {
            document.getElementById(section.id).innerHTML = data;
          })
      )
    ).then(() => {
      waitForSectionsToLoad(); // Start checking after all sections are loaded
    });
  }
});
