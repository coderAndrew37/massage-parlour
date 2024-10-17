const baseURL = "http://localhost:5500";
import {
  animateGallery,
  animateTestimonials,
  animateServices,
} from "./animations.js";

// Extract slug from the URL
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

console.log("Extracted slug:", slug);

if (!slug) {
  console.error("No slug found in URL");
  document.getElementById("service-details").innerHTML =
    "<p>Service not found.</p>";
} else {
  async function renderServiceDetails() {
    try {
      const response = await fetch(`${baseURL}/api/services/${slug}`);
      if (!response.ok) {
        throw new Error("Service not found");
      }
      const service = await response.json();

      console.log("Service data:", service);

      // Inject service details into the page
      document.getElementById("service-title").innerText =
        service.title || "Service Title";
      document.getElementById("service-description").innerText =
        service.description || "No description available.";
      document.getElementById("service-price").innerHTML =
        `<strong>$${(service.priceCents / 100).toFixed(2)}</strong>` || "N/A";

      // Load main image
      document.getElementById("service-image").src =
        service.image || "placeholder.jpg";

      // Handle additional images
      const additionalImagesContainer =
        document.getElementById("additional-images");
      additionalImagesContainer.innerHTML = ""; // Clear existing content
      if (service.additionalImages && service.additionalImages.length > 0) {
        if (window.innerWidth < 768) {
          const heading = document.createElement("h3");
          heading.textContent = "Explore More Photos";
          additionalImagesContainer.appendChild(heading);
        }
        service.additionalImages.forEach((imageUrl) => {
          const imgElement = document.createElement("img");
          imgElement.src = imageUrl;
          imgElement.className = "img-fluid col-lg-4 col-md-6 col-sm-12 mb-3";
          imgElement.style.height = "250px"; // Uniform height for all images
          imgElement.style.objectFit = "cover"; // Maintain aspect ratio
          additionalImagesContainer.appendChild(imgElement);
        });
      } else {
        additionalImagesContainer.innerHTML =
          "<p>No additional images available.</p>";
      }

      // Handle benefits
      const benefitsList = document.getElementById("service-benefits");
      benefitsList.innerHTML = ""; // Clear existing content
      if (service.benefits && service.benefits.length > 0) {
        service.benefits.forEach((benefit) => {
          const liElement = document.createElement("li");
          liElement.innerHTML = `<i class="${benefit.icon} fa-2x me-2" style="color: red;"></i> <span class="benefit-text">${benefit.description}</span>`;
          benefitsList.appendChild(liElement);
        });
      } else {
        benefitsList.innerHTML =
          "<li>No benefits available for this service.</li>";
      }

      // Inject video URL
      const serviceVideo = document.getElementById("service-video-source");
      if (service.videoUrl) {
        serviceVideo.src = `${baseURL}/${service.videoUrl}`;
      } else {
        document.getElementById("service-video").style.display = "none"; // Hide video section if no video
      }

      renderRelatedServices(service.relatedServiceIds || []);
      renderServiceTestimonials(service._id);

      // Trigger GSAP animations
      animateGallery();
      animateTestimonials();
    } catch (error) {
      console.error("Error fetching service details:", error);
      document.getElementById("service-details").innerHTML =
        "<p>Failed to load service details. Please try again later.</p>";
    }
  }

  document.addEventListener("DOMContentLoaded", renderServiceDetails);
}

// Fetch and render related services with error handling
async function renderRelatedServices(relatedServiceIds) {
  if (!relatedServiceIds || relatedServiceIds.length === 0) {
    console.warn("No related services found.");
    document.querySelector(".js-related-services-grid").innerHTML =
      "<p>No related services available.</p>";
    return;
  }

  try {
    const relatedServices = await Promise.all(
      relatedServiceIds.map((id) =>
        fetch(`${baseURL}/api/services/${id}`).then((res) => res.json())
      )
    );

    const relatedServicesHTML = relatedServices
      .map(
        (service) => `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${
              service.image || "placeholder.jpg"
            }" class="card-img-top" alt="${service.title}" loading="lazy" />
            <div class="card-body">
              <h5 class="card-title">${service.title}</h5>
              <p class="card-text">${
                service.description || "No description available."
              }</p>
              <a href="/service-details.html?slug=${
                service.slug
              }" class="btn btn-primary">Learn More</a>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    document.querySelector(".js-related-services-grid").innerHTML =
      relatedServicesHTML;

    // Trigger GSAP animation for services once loaded
    animateServices();
  } catch (error) {
    console.error("Error fetching related services:", error);
    document.querySelector(".js-related-services-grid").innerHTML =
      "<p>Failed to load related services. Please try again later.</p>";
  }
}

// Fetch and render service-specific testimonials with error handling
async function renderServiceTestimonials(serviceId) {
  try {
    const response = await fetch(
      `${baseURL}/api/testimonials?serviceId=${serviceId}`
    );
    if (!response.ok) {
      throw new Error("Testimonials not found");
    }
    const testimonials = await response.json();

    const testimonialsHTML = testimonials
      .map(
        (testimonial) => `
        <div class="col-md-4">
          <div class="testimonial-box">
            <img src="${testimonial.image}" alt="${testimonial.name}" class="img-fluid rounded-circle" />
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

    // Trigger GSAP animation for testimonials
    animateTestimonials();
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    document.querySelector(".js-testimonials-grid").innerHTML =
      "<p>Failed to load testimonials. Please try again later.</p>";
  }
}
