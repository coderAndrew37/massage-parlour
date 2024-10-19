const baseURL = "http://localhost:5500";
import {
  animateServiceDetails,
  animateAdditionalImages,
  // animateServiceVideo, // You can enable this if needed
  animateServiceTestimonials,
  animateRelatedServices,
} from "./serviceDetailsAnimations.js";

// Extract slug from the URL
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

// If slug is missing, show an error message
if (!slug) {
  console.error("No slug found in URL");
  document.getElementById("service-details").innerHTML =
    "<p>Service not found.</p>";
} else {
  // Render the service details if slug is present
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
      document.getElementById("service-price").innerHTML =
        `<strong>$${(service.priceCents / 100).toFixed(2)}</strong>` || "N/A";
      document.getElementById("service-image").src =
        service.image || "images/placeholder.jpg"; // Fallback image

      // Handle additional images
      const additionalImagesContainer =
        document.getElementById("additional-images");
      additionalImagesContainer.innerHTML = "";
      if (service.additionalImages && service.additionalImages.length > 0) {
        service.additionalImages.forEach((imageUrl) => {
          const imgElement = document.createElement("img");
          imgElement.src = imageUrl || "images/placeholder.jpg";
          imgElement.className = "img-fluid";
          imgElement.style.height = "250px";
          imgElement.style.objectFit = "cover";
          const colDiv = document.createElement("div");
          colDiv.className = "col-lg-4 col-md-6 col-sm-12 mb-3";
          colDiv.appendChild(imgElement);
          additionalImagesContainer.appendChild(colDiv);
        });
        animateAdditionalImages();
      } else {
        additionalImagesContainer.innerHTML =
          "<p>No additional images available.</p>";
      }

      // Handle benefits
      const benefitsList = document.getElementById("service-benefits");
      benefitsList.innerHTML = "";
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

      // Handle video
      const serviceVideo = document.getElementById("service-video-source");
      const videoElement = document.getElementById("service-video");

      if (service.videoUrl) {
        // Construct full video URL
        const fullVideoUrl = service.videoUrl.startsWith("http")
          ? service.videoUrl
          : `${baseURL}/${service.videoUrl.replace(/^\/?/, "")}`; // Removes any leading slash if present

        serviceVideo.src = fullVideoUrl; // Set the corrected full URL
        serviceVideo.type = "video/mp4"; // Ensure type is set

        // Reload the video to apply the new source
        videoElement.load();

        console.log("Correct Full Video URL:", fullVideoUrl); // For debugging

        // Handle video error
        serviceVideo.onerror = () => {
          document.getElementById("service-video").style.display = "none"; // Hide video section if the video fails to load
          console.error("Failed to load video:", fullVideoUrl);
        };
      } else {
        document.getElementById("service-video").style.display = "none"; // Hide video section if no video is available
      }

      animateServiceDetails();

      // Render related services and testimonials
      renderRelatedServices(service.relatedServiceIds || []);
      renderServiceTestimonials(service._id);
    } catch (error) {
      console.error("Error fetching service details:", error);
      document.getElementById("service-details").innerHTML =
        "<p>Failed to load service details. Please try again later.</p>";
    }
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
              service.image || "images/placeholder.jpg"
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

      // Trigger GSAP animation for related services once loaded
      animateRelatedServices();
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
      animateServiceTestimonials();
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      document.querySelector(".js-testimonials-grid").innerHTML =
        "<p>Failed to load testimonials. Please try again later.</p>";
    }
  }

  // Execute the renderServiceDetails function when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", renderServiceDetails);
}
