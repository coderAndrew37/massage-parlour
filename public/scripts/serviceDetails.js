import { baseURL } from "./constants.js";
import "./constants.js";
/*
import {
  animateServiceDetails,
  animateAdditionalImages,
  animateServiceTestimonials,
  animateRelatedServices,
} from "./serviceDetailsAnimations.js";

*/
// Extract slug from the URL
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

// If slug is missing, show an error message
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

      // Inject service details into the page
      document.getElementById("service-title").innerText =
        service.title || "Service Title";
      document.getElementById("service-description").innerText =
        service.description || "No description available.";
      document.getElementById("service-price").innerHTML = `<strong>$${(
        service.priceCents / 100
      ).toFixed(2)}</strong>`;
      document.getElementById("service-image").src =
        service.image || "images/placeholder.jpg";

      // Show elements
      document.getElementById("service-title").style.opacity = 1;
      document.getElementById("service-description").style.opacity = 1;
      document.getElementById("service-price-container").style.opacity = 1;
      document.getElementById("service-image").style.opacity = 1;
      document.querySelector(".book-now-button").style.opacity = 1;

      // Hide skeletons after content is loaded
      document.querySelectorAll(".skeleton").forEach((skeleton) => {
        skeleton.style.display = "none";
      });

      // Render benefits
      const benefitsList = document.getElementById("service-benefits");
      if (service.benefits && service.benefits.length > 0) {
        benefitsList.innerHTML = "";
        service.benefits.forEach((benefit) => {
          const listItem = document.createElement("li");
          const iconElement = document.createElement("i");
          iconElement.className = benefit.icon;
          iconElement.style.marginRight = "10px";
          listItem.appendChild(iconElement);
          listItem.appendChild(document.createTextNode(benefit.description));
          benefitsList.appendChild(listItem);
        });
        benefitsList.style.display = "block";
        document.querySelector("h3").style.display = "block";
      } else {
        benefitsList.style.display = "none";
        document.querySelector("h3").style.display = "none";
      }

      // Handle additional images
      const additionalImagesContainer =
        document.getElementById("additional-images");
      additionalImagesContainer.innerHTML = "";
      if (service.additionalImages && service.additionalImages.length > 0) {
        service.additionalImages.forEach((imageUrl) => {
          const imgElement = document.createElement("img");
          imgElement.src = imageUrl || "images/placeholder.jpg";
          imgElement.className = "img-fluid lazyload";
          imgElement.setAttribute("loading", "lazy");
          imgElement.style.height = "250px";
          imgElement.style.objectFit = "cover";
          const colDiv = document.createElement("div");
          colDiv.className = "col-lg-4 col-md-6 col-sm-12 mb-3";
          colDiv.appendChild(imgElement);
          additionalImagesContainer.appendChild(colDiv);
        });
        // animateAdditionalImages();
      } else {
        additionalImagesContainer.innerHTML =
          "<p>No additional images available.</p>";
      }

      // Remove skeleton and focus on rendering the video directly
      const serviceVideo = document.getElementById("service-video-source");
      const videoElement = document.getElementById("service-video");
      const videoSection = document.getElementById("service-video-section");

      if (service.videoUrl) {
        const fullVideoUrl = service.videoUrl.startsWith("http")
          ? service.videoUrl
          : `${baseURL}/${service.videoUrl.replace(/^\/?/, "")}`;

        // Set the video source and log it to ensure it's correct
        console.log("Video URL:", fullVideoUrl);
        serviceVideo.src = fullVideoUrl;
        serviceVideo.type = "video/mp4";

        // Show the video element and video section
        videoSection.style.display = "block"; // Display video section
        videoElement.load(); // Load video after setting the source
      } else {
        // Hide the video section if no video URL is available
        console.warn("No video URL available for this service.");
        videoSection.style.display = "none";
      }

      //animateServiceDetails();
      renderRelatedServices(service.relatedServiceIds || []);
      renderServiceTestimonials(service._id);
    } catch (error) {
      console.error("Error fetching service details:", error);
      document.getElementById("service-details").innerHTML =
        "<p>Failed to load service details. Please try again later.</p>";
    }
  }

  document.addEventListener("DOMContentLoaded", renderServiceDetails);

  async function renderRelatedServices(relatedServiceIds) {
    if (!relatedServiceIds || relatedServiceIds.length === 0) {
      console.warn("No related services found.");
      document.querySelector(".js-related-services-grid").innerHTML =
        "<p>No related services available.</p>";
      return;
    }

    try {
      // Map through relatedServiceIds and ensure only the ID (_id) is passed
      const relatedServices = await Promise.all(
        relatedServiceIds.map(async (idObj) => {
          const id = typeof idObj === "object" ? idObj._id : idObj; // Ensure we get the correct _id
          const response = await fetch(`${baseURL}/api/services/${id}`);
          if (!response.ok) {
            throw new Error(`Service with ID ${id} not found`);
          }
          return response.json();
        })
      );

      // Generate the HTML for related services
      const relatedServicesHTML = relatedServices
        .map((service) => {
          const serviceImage = service.image || "images/placeholder.jpg"; // Fallback to placeholder image
          const serviceDescription =
            service.description || "No description available.";

          return `
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="${serviceImage}" class="card-img-top" alt="${service.title}" loading="lazy" />
              <div class="card-body">
                <h5 class="card-title">${service.title}</h5>
                <p class="card-text">${serviceDescription}</p>
                <a href="/service-details.html?slug=${service.slug}" class="btn btn-primary">Learn More</a>
              </div>
            </div>
          </div>
        `;
        })
        .join("");

      // Insert the generated HTML into the grid
      document.querySelector(".js-related-services-grid").innerHTML =
        relatedServicesHTML;

      // Trigger GSAP animation for related services once loaded
      // animateRelatedServices();
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
      const data = await response.json(); // Paginated response (contains testimonials array)

      // Ensure testimonials is an array
      const testimonials = data.testimonials; // Extract testimonials array
      if (!Array.isArray(testimonials)) {
        throw new Error("Invalid testimonials format");
      }

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

      // Trigger GSAP animation for testimonials once they are rendered
      //animateServiceTestimonials();
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      document.querySelector(".js-testimonials-grid").innerHTML =
        "<p>Failed to load testimonials. Please try again later.</p>";
    }
  }

  // Execute the renderServiceDetails function when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", renderServiceDetails);
}
