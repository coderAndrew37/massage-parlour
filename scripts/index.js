import "./formValidation.js";
import "./animations.js";
import "./contactFormValidation.js";
import "./quizFormValidation.js";
import "./navbarScroll.js";
import "./localStorageHandler.js";
import { search } from "./fetchContent.js";
import "./quiz.js";

// Save scroll position before page unload (only on reload, not on form submit)
window.addEventListener("beforeunload", function (e) {
  const activeElement = document.activeElement;
  if (!activeElement || activeElement.tagName.toLowerCase() !== "form") {
    const scrollPos = window.scrollY;
    localStorage.setItem("scrollPos", scrollPos); // Save scroll position before reload
  }
});

// Restore the scroll position after content is injected
function restoreScrollPosition() {
  const scrollPos = localStorage.getItem("scrollPos");
  if (scrollPos !== null) {
    setTimeout(() => {
      window.scrollTo(0, parseInt(scrollPos, 10)); // Restore to saved position
      localStorage.removeItem("scrollPos"); // Clear saved position after restoring
    }, 100); // Delay can be adjusted based on content load time
  }
}

// Restore scroll position after all dynamic content is fully loaded
function restoreScrollAfterContent() {
  // Ensure dynamic content (services, testimonials, gallery) is loaded
  Promise.all([
    renderServicesGrid(),
    renderTestimonialsGrid(),
    renderGalleryGrid(),
  ])
    .then(() => {
      // Once all content is loaded, restore the scroll position
      restoreScrollPosition();
    })
    .catch((error) => {
      console.error(
        "Error loading content or restoring scroll position:",
        error
      );
    });
}

// Call restoreScrollAfterContent after DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  animateHero(); // Animate hero section
  restoreScrollAfterContent(); // Load content and restore scroll position after it's done
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Handle search form submission without saving scroll position
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.removeItem("scrollPos"); // Clear saved scroll position
  const query = document.getElementById("searchQuery").value.trim();
  if (query) {
    search(query); // Call search function with input value
  }
});

// Prevent auto-scroll on form submission
document.getElementById("quizForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission
  localStorage.removeItem("scrollPos"); // Clear scroll position
  // Form submission logic...
});
