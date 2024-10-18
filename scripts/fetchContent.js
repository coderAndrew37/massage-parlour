import {
  animateServices,
  animateTestimonials,
  animateGallery,
} from "./animations.js"; // Adjust path as necessary

const baseURL = "http://localhost:5500"; // Correct backend server URL

// Spinner element
const spinner = document.createElement("div");
spinner.classList.add("spinner-border", "text-primary");
spinner.setAttribute("role", "status");
spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';

// Helper function for retrying fetch requests
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay); // Retry after a delay
    } else {
      throw error; // If no retries left, throw the error
    }
  }
}

// Helper function to get elements per page based on section and screen size
function getElementsPerPage(section) {
  if (section === "services") {
    return window.innerWidth >= 992 ? 9 : 6; // 9 services for large screens, 6 for small screens
  }
  if (section === "testimonials" || section === "gallery") {
    return window.innerWidth >= 992 ? 6 : 3; // 6 elements for large screens, 3 for small screens
  }
  return 3; // Default to 3
}

// Scroll to a specific section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 100, // Adjust offset if needed
      behavior: "smooth",
    });
  }
}

/* ============= SERVICES SECTION WITH PAGINATION ============= */

// Fetch and Render Services with Pagination
async function renderServicesGrid(page = 1) {
  const limit = getElementsPerPage("services");
  const servicesGrid = document.querySelector(".js-services-grid");

  try {
    servicesGrid.innerHTML = ""; // Clear previous content
    servicesGrid.appendChild(spinner); // Show loading spinner

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

    servicesGrid.innerHTML = servicesHTML; // Replace spinner with content
    renderPaginationControls(currentPage, totalPages, "services");

    // Scroll to the services section after loading
    scrollToSection("services");

    animateServices();
    ScrollTrigger.refresh();
  } catch (error) {
    console.error("Error fetching services:", error);
    servicesGrid.innerHTML =
      "<p>Error loading services. Please try again later.</p>";
  }
}

/* ============= TESTIMONIALS SECTION WITH PAGINATION ============= */

// Fetch and Render Testimonials with Pagination
async function renderTestimonialsGrid(page = 1) {
  const limit = getElementsPerPage("testimonials");
  const testimonialsGrid = document.querySelector(".js-testimonials-grid");

  try {
    testimonialsGrid.innerHTML = ""; // Clear previous content
    testimonialsGrid.appendChild(spinner); // Show loading spinner

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

    testimonialsGrid.innerHTML = testimonialsHTML; // Replace spinner with content
    renderPaginationControls(currentPage, totalPages, "testimonials");

    // Scroll to the testimonials section after loading
    scrollToSection("testimonials");

    animateTestimonials();
    ScrollTrigger.refresh();
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    testimonialsGrid.innerHTML =
      "<p>Error loading testimonials. Please try again later.</p>";
  }
}

/* ============= GALLERY SECTION WITH PAGINATION ============= */

// Fetch and Render Gallery with Pagination
async function renderGalleryGrid(page = 1) {
  const limit = getElementsPerPage("gallery");
  const galleryGrid = document.querySelector(".js-gallery-grid");

  try {
    galleryGrid.innerHTML = ""; // Clear previous content
    galleryGrid.appendChild(spinner); // Show loading spinner

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

    galleryGrid.innerHTML = galleryHTML; // Replace spinner with content
    renderPaginationControls(currentPage, totalPages, "gallery");

    // Scroll to the gallery section after loading
    scrollToSection("gallery");

    animateGallery();
    ScrollTrigger.refresh();
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    galleryGrid.innerHTML =
      "<p>Error loading gallery. Please try again later.</p>";
  }
}

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

// Fetch and Render Search Results
async function search(query) {
  try {
    const results = await fetchWithRetry(`${baseURL}/api/search?q=${query}`);

    // Render Services
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
              <a href="https://wa.me/254746577838" class="btn btn-primary">Book Now</a>
            </div>
          </div>
        </div>
      `
        )
        .join("");
      document.querySelector(".js-services-grid").innerHTML = servicesHTML;
      animateServices();
    }

    // Render Testimonials
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
      document.querySelector(".js-testimonials-grid").innerHTML =
        testimonialsHTML;
      animateTestimonials();
    }

    // Render Gallery
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
      document.querySelector(".js-gallery-grid").innerHTML = galleryHTML;
      animateGallery();
    }

    // Refresh ScrollTrigger for new content
    ScrollTrigger.refresh();
  } catch (error) {
    console.error("Error fetching search results:", error);
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
