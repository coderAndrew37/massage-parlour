import { fetchWithRetry } from "../api/fetchContent.js";
import { baseURL } from "../utils/constants.js";
import {
  animateServices,
  animateTestimonials,
  animateGallery,
} from "../animations/sectionAnimations.js";

export async function search(query) {
  if (!query) {
    displayNoResults("Please enter a search query.");
    return;
  }

  try {
    const results = await fetchWithRetry(
      `${baseURL}/api/search?q=${encodeURIComponent(query)}`
    );

    // Clear previous search results
    clearResults();

    if (
      !results.services.length &&
      !results.testimonials.length &&
      !results.gallery.length
    ) {
      displayNoResults("No results found for your query.");
      return;
    }

    // Render each section if results are available
    if (results.services.length)
      renderSection(results.services, "services", animateServices);
    if (results.testimonials.length)
      renderSection(results.testimonials, "testimonials", animateTestimonials);
    if (results.gallery.length)
      renderSection(results.gallery, "gallery", animateGallery);
  } catch (error) {
    console.error("Error fetching search results:", error);
    displayNoResults(
      "There was an error fetching search results. Please try again later."
    );
  }
}

// Helper Functions
function clearResults() {
  document.querySelector(".js-services-grid").innerHTML = "";
  document.querySelector(".js-testimonials-grid").innerHTML = "";
  document.querySelector(".js-gallery-grid").innerHTML = "";
}

function displayNoResults(message) {
  document.querySelector(".js-services-grid").innerHTML = `<p>${message}</p>`;
  document.querySelector(
    ".js-testimonials-grid"
  ).innerHTML = `<p>${message}</p>`;
  document.querySelector(".js-gallery-grid").innerHTML = `<p>${message}</p>`;
}

function renderSection(items, section, animateFunction) {
  const gridElement = document.querySelector(`.js-${section}-grid`);
  const htmlContent = items
    .map((item) => {
      if (section === "services") {
        return `<div class="col-md-4"><div class="card"><img src="${item.image}" alt="${item.title}"><div class="card-body"><h5>${item.title}</h5><p>${item.description}</p><a href="/service-details.html?slug=${item.slug}" class="btn btn-primary">Learn More</a></div></div></div>`;
      }
      if (section === "testimonials") {
        return `<div class="col-md-4"><div class="testimonial-box"><img src="${item.image}" alt="${item.name}"><blockquote><p>${item.quote}</p><footer>${item.name}</footer></blockquote></div></div>`;
      }
      return `<div class="col-md-4"><img src="${item.image}" alt="${item.title}"><div class="gallery-overlay"><p>${item.title}</p><a href="https://wa.me/254746577838" class="book-now-link">Book Now</a></div></div>`;
    })
    .join("");

  gridElement.innerHTML = htmlContent;
  animateFunction();
}
