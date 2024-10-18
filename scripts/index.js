import "./animations.js";
import "./formValidation.js";
import "./navbarScroll.js";
import "./localStorageHandler.js";
import { search } from "./fetchContent.js";

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
