import {
  animateServices,
  animateTestimonials,
  animateGallery,
} from "./animations.js"; // Adjust path as necessary

import { baseURL } from "./constants.js"; // Import baseURL

console.log(`The baseURL:${baseURL}`);

// Helper function for retrying fetch requests
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    console.log("Fetching URL:", url); // Debug URL
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(
        `Error Response: ${response.status} - ${response.statusText}`
      );
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched data:", data); // Debug response
    return data;
  } catch (error) {
    console.error("Fetch error:", error.message); // Debug fetch errors
    if (retries > 0) {
      console.warn(`Retrying... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay);
    } else {
      throw error; // No retries left
    }
  }
}

// Helper function to get elements per page based on section and screen size
function getElementsPerPage(section) {
  if (section === "services") {
    return window.innerWidth >= 992 ? 9 : 6; // 9 services for large screens, 6 for small screens
  }
  if (section === "testimonials" || section === "gallery") {
    return window.innerWidth >= 992 ? 6 : 3; // 6 items for large screens, 3 for small screens
  }
  return 3; // Default to 3 if section is not specified
}

// Smooth scroll to a specific section by section ID
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 100, // Adjust the offset to align the section
      behavior: "smooth", // Smooth scrolling effect
    });
  }
}

// Fetch and render services
// Fetch and render services
export async function renderServicesGrid(page = 1) {
  const limit = getElementsPerPage("services");
  const servicesGrid = document.querySelector(".js-services-grid");

  // Show skeletons before loading data
  servicesGrid.innerHTML = `
    <div class="col-md-4 mb-4"><div class="skeleton skeleton-card"></div></div>
    <div class="col-md-4 mb-4"><div class="skeleton skeleton-card"></div></div>
    <div class="col-md-4 mb-4"><div class="skeleton skeleton-card"></div></div>
  `;

  try {
    const { services, currentPage, totalPages } = await fetchWithRetry(
      `${baseURL}/api/services?page=${page}&limit=${limit}`
    );

    if (!services.length) {
      servicesGrid.innerHTML = "<p>No services available at this time.</p>";
      return;
    }

    const servicesHTML = services
      .map(
        (service) => `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${service.image}" class="card-img-top" alt="${service.title}" loading="lazy" />
            <div class="card-body">
              <h5 class="card-title">${service.title}</h5>
              <p class="card-text">${service.description}</p>
              <a href="/service-details.html?slug=${service.slug}" class="btn btn-primary">Learn More</a>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    servicesGrid.innerHTML = servicesHTML;

    renderPaginationControls(currentPage, totalPages, "services");
    scrollToSection("services");

    animateServices();

    setTimeout(() => ScrollTrigger.refresh(), 100); // Refresh scroll after a slight delay
  } catch (error) {
    console.error("Error fetching services:", error);
    servicesGrid.innerHTML =
      "<p>Error loading services. Please try again later.</p>";
  }
}

// Fetch and render testimonials
export async function renderTestimonialsGrid(page = 1) {
  const limit = getElementsPerPage("testimonials");
  const testimonialsGrid = document.querySelector(".js-testimonials-grid");

  testimonialsGrid.innerHTML = `
    <div class="col-md-4 mb-4"><div class="skeleton skeleton-testimonial"></div></div>
    <div class="col-md-4 mb-4"><div class="skeleton skeleton-testimonial"></div></div>
    <div class="col-md-4 mb-4"><div class="skeleton skeleton-testimonial"></div></div>
  `;

  try {
    const { testimonials, currentPage, totalPages } = await fetchWithRetry(
      `${baseURL}/api/testimonials?page=${page}&limit=${limit}`
    );

    if (!testimonials.length) {
      testimonialsGrid.innerHTML =
        "<p>No testimonials available at this time.</p>";
      return;
    }

    const testimonialsHTML = testimonials
      .map(
        (testimonial) => `
        <div class="col-md-4 mb-4">
          <div class="testimonial-box">
            <img src="${testimonial.image}" alt="${testimonial.name}" />
            <blockquote class="blockquote">
              <p>${testimonial.quote}</p>
              <footer class="blockquote-footer">${testimonial.name}</footer>
            </blockquote>
          </div>
        </div>
      `
      )
      .join("");

    testimonialsGrid.innerHTML = testimonialsHTML;

    renderPaginationControls(currentPage, totalPages, "testimonials");
    scrollToSection("testimonials");

    animateTestimonials();

    setTimeout(() => ScrollTrigger.refresh(), 100);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    testimonialsGrid.innerHTML =
      "<p>Error loading testimonials. Please try again later.</p>";
  }
}

// Fetch and render gallery
export async function renderGalleryGrid(page = 1) {
  const limit = getElementsPerPage("gallery");
  const galleryGrid = document.querySelector(".js-gallery-grid");

  galleryGrid.innerHTML = `
    <div class="col-md-4 mb-4"><div class="skeleton skeleton-image"></div></div>
    <div class="col-md-4 mb-4"><div class="skeleton skeleton-image"></div></div>
    <div class="col-md-4 mb-4"><div class="skeleton skeleton-image"></div></div>
  `;

  try {
    const { gallery, currentPage, totalPages } = await fetchWithRetry(
      `${baseURL}/api/gallery?page=${page}&limit=${limit}`
    );

    if (!gallery.length) {
      galleryGrid.innerHTML = "<p>No gallery items available at this time.</p>";
      return;
    }

    const galleryHTML = gallery
      .map(
        (item) => `
        <div class="col-md-4 mb-4">
          <img src="${item.image}" alt="${item.title}" />
          <div class="gallery-overlay">
            <div class="gallery-text">${item.title}</div>
            <a href="https://wa.me/254746577838" class="book-now-link">Book Now</a>
          </div>
        </div>
      `
      )
      .join("");

    galleryGrid.innerHTML = galleryHTML;

    renderPaginationControls(currentPage, totalPages, "gallery");
    scrollToSection("gallery");

    animateGallery();

    setTimeout(() => ScrollTrigger.refresh(), 100);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    galleryGrid.innerHTML =
      "<p>Error loading gallery. Please try again later.</p>";
  }
}

/*==================== FAQs Section ==============================*/

// Fetch and render FAQs
export async function renderFAQs() {
  const faqContainer = document.getElementById("faqAccordion");

  try {
    const response = await fetch("scripts/faqs.json"); // Path to JSON file
    const faqs = await response.json();

    const faqHTML = faqs
      .map(
        (faq, index) => `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${index}">
            <button
              class="accordion-button ${index === 0 ? "" : "collapsed"}"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse${index}"
              aria-expanded="${index === 0 ? "true" : "false"}"
              aria-controls="collapse${index}"
            >
              ${faq.question}
            </button>
          </h2>
          <div
            id="collapse${index}"
            class="accordion-collapse collapse ${index === 0 ? "show" : ""}"
            aria-labelledby="heading${index}"
            data-bs-parent="#faqAccordion"
          >
            <div class="accordion-body">
              ${faq.answer}
            </div>
          </div>
        </div>
      `
      )
      .join("");

    faqContainer.innerHTML = faqHTML;
  } catch (error) {
    console.error("Error loading FAQs:", error);
    faqContainer.innerHTML =
      "<p>Error loading FAQs. Please try again later.</p>";
  }
}

// Initialize FAQs on page load
document.addEventListener("DOMContentLoaded", () => {
  renderFAQs();
});

/* ============= PAGINATION CONTROLS ============= */

// Render pagination controls dynamically
function renderPaginationControls(currentPage, totalPages, section) {
  const paginationContainer = document.querySelector(
    `.${section}-pagination-container`
  );

  if (!paginationContainer) {
    console.error(`Pagination container for section '${section}' not found.`);
    return;
  }

  let paginationHTML = `<ul class="pagination">`;

  paginationHTML +=
    currentPage === 1
      ? `<li class="page-item disabled"><a class="page-link">Previous</a></li>`
      : `<li class="page-item"><a class="page-link" href="#" data-page="${
          currentPage - 1
        }" data-section="${section}">Previous</a></li>`;

  for (let page = 1; page <= totalPages; page++) {
    paginationHTML +=
      page === currentPage
        ? `<li class="page-item active"><a class="page-link">${page}</a></li>`
        : `<li class="page-item"><a class="page-link" href="#" data-page="${page}" data-section="${section}">${page}</a></li>`;
  }

  paginationHTML +=
    currentPage === totalPages
      ? `<li class="page-item disabled"><a class="page-link">Next</a></li>`
      : `<li class="page-item"><a class="page-link" href="#" data-page="${
          currentPage + 1
        }" data-section="${section}">Next</a></li>`;

  paginationHTML += `</ul>`;

  paginationContainer.innerHTML = paginationHTML;

  // Add event listeners for pagination links
  paginationContainer.querySelectorAll(".page-link").forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(e.target.getAttribute("data-page"));
      const section = e.target.getAttribute("data-section");

      if (page) {
        if (section === "services") {
          renderServicesGrid(page);
        } else if (section === "testimonials") {
          renderTestimonialsGrid(page);
        } else if (section === "gallery") {
          renderGalleryGrid(page);
        }
      }
    })
  );
}

/* ============= SEARCH SECTION ============= */

// Fetch and render search results
async function search(query) {
  try {
    const results = await fetchWithRetry(`${baseURL}/api/search?q=${query}`);

    // Clear previous search results
    const servicesGrid = document.querySelector(".js-services-grid");
    const testimonialsGrid = document.querySelector(".js-testimonials-grid");
    const galleryGrid = document.querySelector(".js-gallery-grid");

    servicesGrid.innerHTML = "";
    testimonialsGrid.innerHTML = "";
    galleryGrid.innerHTML = "";

    // Handle "No results found" scenario
    if (
      !results.services.length &&
      !results.testimonials.length &&
      !results.gallery.length
    ) {
      servicesGrid.innerHTML = "<p>No results found for your query.</p>";
      testimonialsGrid.innerHTML =
        "<p>No testimonials found for your query.</p>";
      galleryGrid.innerHTML = "<p>No gallery items found for your query.</p>";
      return;
    }

    // Render services
    if (results.services.length) {
      const servicesHTML = results.services
        .map(
          (service) => `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${service.image}" class="card-img-top" alt="${service.title}" loading="lazy" />
            <div class="card-body">
              <h5 class="card-title">${service.title}</h5>
              <p class="card-text">${service.description}</p>
              <a href="service-details.html?slug=${service.slug}" class="btn btn-primary">Learn More</a>
            </div>
          </div>
        </div>
      `
        )
        .join("");
      servicesGrid.innerHTML = servicesHTML;
      animateServices();
    }

    // Render testimonials
    if (results.testimonials.length) {
      const testimonialsHTML = results.testimonials
        .map(
          (testimonial) => `
        <div class="col-md-4">
          <div class="testimonial-box">
            <img src="${testimonial.image}" alt="${testimonial.name}" />
            <blockquote class="blockquote">
              <p>${testimonial.quote}</p>
              <footer class="blockquote-footer">${testimonial.name}</footer>
            </blockquote>
          </div>
        </div>
      `
        )
        .join("");
      testimonialsGrid.innerHTML = testimonialsHTML;
      animateTestimonials();
    }

    // Render gallery
    if (results.gallery.length) {
      const galleryHTML = results.gallery
        .map(
          (item) => `
        <div class="col-md-4">
          <img src="${item.image}" alt="${item.title}" />
          <div class="gallery-overlay">
            <div class="gallery-text">${item.title}</div>
            <a href="https://wa.me/254746577838" class="book-now-link">Book Now</a>
          </div>
        </div>
      `
        )
        .join("");
      galleryGrid.innerHTML = galleryHTML;
      animateGallery();
    }

    // Refresh ScrollTrigger for new content
    ScrollTrigger.refresh();
  } catch (error) {
    console.error("Error fetching search results:", error);
    // Optionally show error message in UI
    const servicesGrid = document.querySelector(".js-services-grid");
    servicesGrid.innerHTML =
      "<p>There was an error fetching the search results. Please try again later.</p>";
  }
}

/* ============= INITIALIZE ============= */

// DOMContentLoaded ensures the DOM is fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
  // Call the functions to load the content dynamically
  renderServicesGrid();
  renderTestimonialsGrid();
  renderGalleryGrid();
});

// Export the search function for use in index.js
export { search };
