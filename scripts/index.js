import "./animations.js";
import "./formValidation.js";
import "./navbarScroll.js";
import "./localStorageHandler.js";
import { search } from "./fetchContent.js";
import "./quiz.js";

// Save the scroll position when the form is submitted or before reloading
function saveScrollPosition() {
  const scrollPos = window.scrollY;
  localStorage.setItem("scrollPos", scrollPos); // Save current scroll position
}

// Restore the scroll position after all content is loaded
function restoreScrollPosition() {
  const scrollPos = localStorage.getItem("scrollPos");
  if (scrollPos !== null) {
    setTimeout(() => {
      // Add a slight delay to ensure layout shifts are accounted for
      window.scrollTo(0, parseInt(scrollPos)); // Scroll back to the saved position
      localStorage.removeItem("scrollPos"); // Clean up after restoring
    }, 100); // 100ms delay (adjustable)
  }
}

// Restore the scroll position after dynamic content is loaded
function restoreScrollAfterContent() {
  // Ensure dynamic content is loaded before restoring scroll position
  Promise.all([
    renderServicesGrid(),
    renderTestimonialsGrid(),
    renderGalleryGrid(),
  ])
    .then(() => {
      restoreScrollPosition(); // Restore scroll position after all content is loaded
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
  animateHero(); // Animate the hero section
  restoreScrollAfterContent(); // Load all content and restore scroll position after it's done
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

// Handle search form submission
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchQuery").value.trim();
  if (query) {
    search(query); // Call the search function with the input value
  }
});

// Save scroll position when a form is submitted
document
  .getElementById("quizForm")
  .addEventListener("submit", saveScrollPosition);
