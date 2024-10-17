const baseURL = "http://localhost:5500";

// Extract slug from the URL
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

// Log the slug to check if it's correctly extracted
console.log("Extracted slug:", slug);

if (!slug) {
  console.error("No slug found in URL");
  document.getElementById("service-details").innerHTML =
    "<p>Service not found.</p>";
} else {
  // Fetch and render the service details by slug
  async function renderServiceDetails() {
    try {
      const response = await fetch(`${baseURL}/api/services/${slug}`);
      if (!response.ok) {
        throw new Error("Service not found");
      }
      const service = await response.json();

      // Debugging log: check if the service data is correct
      console.log("Service data:", service);

      // Inject service details into the page
      document.getElementById("service-title").innerText = service.title;
      document.getElementById("service-description").innerText =
        service.description;
      document.getElementById("service-price").innerText = (
        service.priceCents / 100
      ).toFixed(2);
      document.getElementById("service-image").src = service.image;

      // Display additional images
      const additionalImagesContainer =
        document.getElementById("additional-images");
      service.additionalImages.forEach((imageUrl) => {
        const imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.className = "img-fluid col-md-6 mb-3";
        additionalImagesContainer.appendChild(imgElement);
      });

      // Display benefits with Font Awesome icons
      const benefitsList = document.getElementById("service-benefits");
      service.benefits.forEach((benefit) => {
        const liElement = document.createElement("li");
        liElement.innerHTML = `<i class="${benefit.icon}"></i> ${benefit.description}`;
        benefitsList.appendChild(liElement);
      });

      // Fetch related services and testimonials (you can reuse your existing functions here)
      renderRelatedServices(service.relatedServiceIds);
      renderServiceTestimonials(service._id);
    } catch (error) {
      console.error("Error fetching service details:", error);
      document.getElementById("service-details").innerHTML =
        "<p>Service not found.</p>";
    }
  }

  // Call the function to render service details
  document.addEventListener("DOMContentLoaded", renderServiceDetails);
}

// Fetch and render related services
async function renderRelatedServices(relatedServiceIds) {
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

    document.querySelector(".js-related-services-grid").innerHTML =
      relatedServicesHTML;
  } catch (error) {
    console.error("Error fetching related services:", error);
  }
}

// Fetch and render service-specific testimonials
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
  } catch (error) {
    console.error("Error fetching testimonials:", error);
  }
}
