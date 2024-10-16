const baseURL = "http://localhost:5500";

// Extract slug from the URL
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

// Log the slug to verify it's being extracted correctly
console.log("Extracted slug:", slug); // Debugging step

if (!slug) {
  console.error("No slug found in URL");
  document.getElementById("service-details").innerHTML =
    "<p>Service not found.</p>";
} else {
  // Fetch and render the service details
  async function renderServiceDetails() {
    try {
      const response = await fetch(`${baseURL}/api/services/${slug}`);
      if (!response.ok) {
        throw new Error("Service not found");
      }
      const service = await response.json();

      // Inject service details into the page
      const serviceHTML = `
        <div class="left-col">
          <img src="${service.image}" alt="${
        service.title
      }" class="img-fluid" />
        </div>
        <div class="right-col">
          <h1>${service.title}</h1>
          <p>${service.description}</p>
          <p><strong>Price:</strong> $${(service.priceCents / 100).toFixed(
            2
          )}</p>
          <a href="https://wa.me/254746577838" target="_blank">
            <button class="cta-button">Book Now</button>
          </a>
        </div>
      `;

      document.getElementById("service-details").innerHTML = serviceHTML;
    } catch (error) {
      console.error("Error fetching service details:", error);
      document.getElementById("service-details").innerHTML =
        "<p>Service not found.</p>";
    }
  }

  // Call the function to render service details
  renderServiceDetails();
}
