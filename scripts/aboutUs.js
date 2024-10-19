const baseURL = "http://localhost:5500"; // Correct backend server URL

// Spinner element
const spinner = document.createElement("div");
spinner.classList.add("spinner-border", "text-primary");
spinner.setAttribute("role", "status");
spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';

/* ============= FETCH WITH RETRY ============= */

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

/* ============= TEAM SECTION WITH PAGINATION ============= */

// Fetch and Render Team Members with Pagination
async function renderTeamGrid(page = 1) {
  const limit = 6; // Limit to 6 members per page
  const teamGrid = document.querySelector(".js-team-grid");

  try {
    teamGrid.innerHTML = ""; // Clear previous content
    teamGrid.appendChild(spinner); // Show loading spinner

    const { teamMembers, currentPage, totalPages } = await fetchWithRetry(
      `${baseURL}/api/team?page=${page}&limit=${limit}`
    );

    if (!teamMembers.length) {
      teamGrid.innerHTML = "<p>No team members available at this time.</p>";
      return;
    }

    const teamHTML = teamMembers
      .map(
        (member) => `
        <div class="col-md-4">
          <div class="card">
            <img src="${member.image}" class="card-img-top" alt="${member.name}" />
            <div class="card-body">
              <h5 class="card-title">${member.name}</h5>
              <p class="card-text">${member.role}</p>
            </div>
          </div>
        </div>`
      )
      .join("");

    teamGrid.innerHTML = teamHTML; // Replace spinner with content
    renderPaginationControls(currentPage, totalPages, "team");

    // Call animation function after content loads
    ScrollTrigger.refresh();
  } catch (error) {
    console.error("Error fetching team members:", error);
    teamGrid.innerHTML =
      "<p>Error loading team members. Please try again later.</p>";
  }
}

/* ============= TESTIMONIALS SECTION WITH PAGINATION ============= */

// Fetch and Render Testimonials with Pagination
async function renderTestimonialsGrid(page = 1) {
  const limit = 6; // Limit to 6 testimonials per page
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
        <div class="col-md-4">
          <div class="testimonial-box">
            <blockquote class="blockquote">
              <p>${testimonial.quote}</p>
              <footer class="blockquote-footer">${testimonial.name}</footer>
            </blockquote>
          </div>
        </div>`
      )
      .join("");

    testimonialsGrid.innerHTML = testimonialsHTML; // Replace spinner with content
    renderPaginationControls(currentPage, totalPages, "testimonials");

    // Call animation function after content loads
    ScrollTrigger.refresh();
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    testimonialsGrid.innerHTML =
      "<p>Error loading testimonials. Please try again later.</p>";
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
        if (section === "team") {
          renderTeamGrid(page);
        } else if (section === "testimonials") {
          renderTestimonialsGrid(page);
        }
      }
    })
  );
}

/* ============= INITIALIZE ============= */

// DOMContentLoaded ensures the DOM is fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
  // Call the functions to load the content dynamically
  renderTeamGrid();
  renderTestimonialsGrid();
});
