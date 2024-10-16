import {
  animateServices,
  animateTestimonials,
  animateGallery,
} from "./animations.js"; // Adjust path as necessary

const baseURL = "http://localhost:5500"; // Correct backend server URL

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

// Fetch and Render Services
async function renderServicesGrid() {
  try {
    const services = await fetchWithRetry(`${baseURL}/api/services`);

    // Log services to check if slugs are present
    console.log(services); // Debugging step

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

    document.querySelector(".js-services-grid").innerHTML = servicesHTML;

    // Trigger GSAP animation for services after the content is rendered
    animateServices();
    ScrollTrigger.refresh(); // Refresh ScrollTrigger to include new elements
  } catch (error) {
    console.error("Error fetching services:", error);
  }
}

// Fetch and Render Testimonials
async function renderTestimonialsGrid() {
  try {
    const testimonials = await fetchWithRetry(`${baseURL}/api/testimonials`);
    const testimonialsHTML = testimonials
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

    // Trigger GSAP animation for testimonials after the content is rendered
    animateTestimonials();
    ScrollTrigger.refresh(); // Refresh ScrollTrigger to include new elements
  } catch (error) {
    console.error("Error fetching testimonials:", error);
  }
}

// Fetch and Render Gallery
async function renderGalleryGrid() {
  try {
    const galleryItems = await fetchWithRetry(`${baseURL}/api/gallery`);
    const galleryHTML = galleryItems
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

    // Trigger GSAP animation for gallery after the content is rendered
    animateGallery();
    ScrollTrigger.refresh(); // Refresh ScrollTrigger to include new elements
  } catch (error) {
    console.error("Error fetching gallery items:", error);
  }
}

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

// DOMContentLoaded ensures the DOM is fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
  // Call the functions to load the content dynamically
  renderServicesGrid();
  renderTestimonialsGrid();
  renderGalleryGrid();
});

// Export the search function for use in index.js
export { search };
