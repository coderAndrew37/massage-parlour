import { fetchWithRetry } from "../api/fetchContent.js";
import { renderPaginationControls } from "../utils/pagination.js";
import {
  animateServices,
  animateTestimonials,
  animateGallery,
} from "../animations/sectionAnimations.js";
import { baseURL } from "../utils/constants.js";

function renderGrid(section, page = 1, animateFunction) {
  const limit = getElementsPerPage(section);
  const gridElement = document.querySelector(`.js-${section}-grid`);
  displaySkeletons(gridElement, section);

  fetchWithRetry(`${baseURL}/api/${section}?page=${page}&limit=${limit}`)
    .then((data) => {
      if (!data[section].length) {
        gridElement.innerHTML = `<p>No ${section} available at this time.</p>`;
        return;
      }
      gridElement.innerHTML = generateHTML(data[section], section);
      renderPaginationControls(
        data.currentPage,
        data.totalPages,
        section,
        (newPage) => renderGrid(section, newPage, animateFunction)
      );
      animateFunction();
    })
    .catch((error) => {
      console.error(`Error fetching ${section}:`, error);
      gridElement.innerHTML = `<p>Error loading ${section}. Please try again later.</p>`;
    });
}

export function renderServicesGrid(page) {
  renderGrid("services", page, animateServices);
}

export function renderTestimonialsGrid(page) {
  renderGrid("testimonials", page, animateTestimonials);
}

export function renderGalleryGrid(page) {
  renderGrid("gallery", page, animateGallery);
}

// Helper functions
function getElementsPerPage(section) {
  return section === "services"
    ? window.innerWidth >= 992
      ? 9
      : 6
    : window.innerWidth >= 992
    ? 6
    : 3;
}

function displaySkeletons(container, section) {
  container.innerHTML = Array(3)
    .fill(
      `<div class="col-md-4 mb-4"><div class="skeleton skeleton-${section}"></div></div>`
    )
    .join("");
}

function generateHTML(items, section) {
  return items
    .map((item) => {
      if (section === "services") return `<div class="card">...</div>`;
      if (section === "testimonials")
        return `<div class="testimonial-box">...</div>`;
      return `<div class="gallery-item">...</div>`;
    })
    .join("");
}
