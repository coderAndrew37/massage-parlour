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
    const servicesHTML = services
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
  } catch (error) {
    console.error("Error fetching gallery items:", error);
  }
}

// DOMContentLoaded ensures the DOM is fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
  // Call the functions to load the content dynamically
  renderServicesGrid();
  renderTestimonialsGrid();
  renderGalleryGrid();
});
