// GSAP Animation for Hero Section
gsap.from(".hero-text h1", {
  duration: 1.2,
  y: -50,
  opacity: 0,
  ease: "power3.out",
});

gsap.from(".hero-text p", {
  duration: 1.5,
  y: 50,
  opacity: 0,
  ease: "power3.out",
  delay: 0.5,
});

gsap.from(".cta-button", {
  duration: 1.8,
  y: 50,
  opacity: 0,
  ease: "power3.out",
  delay: 1,
});

// GSAP Animation for Gallery Section
gsap.from("#gallery .col-md-4", {
  duration: 1,
  opacity: 0,
  y: 50,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#gallery",
    start: "top 80%",
  },
});

// GSAP Animation for Testimonials Section
gsap.from(".testimonial-box", {
  duration: 1,
  opacity: 0,
  y: 50,
  stagger: 0.3,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#testimonials",
    start: "top 80%",
  },
});

// GSAP Animation for Why Choose Us Section
gsap.from(".why-choose-us img", {
  duration: 1.2,
  x: -50,
  opacity: 0,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".why-choose-us",
    start: "top 80%",
  },
});

gsap.from(".why-choose-us-text", {
  duration: 1.5,
  x: 50,
  opacity: 0,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".why-choose-us",
    start: "top 80%",
  },
});

// GSAP Animation for Services Section
gsap.from(".card", {
  duration: 1,
  y: 50,
  opacity: 0,
  stagger: 0.3, // Adds staggered delay to each card
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#services",
    start: "top 80%",
  },
});

// Navbar background change on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Custom Bootstrap validation for the contact form with client-side validation
(function () {
  "use strict";
  const forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          alert("Form submitted successfully!");
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Input field error message
document.getElementById("name").oninvalid = function (event) {
  event.target.setCustomValidity("Please provide your full name.");
};

document.getElementById("email").oninvalid = function (event) {
  event.target.setCustomValidity("Please provide a valid email address.");
};

document.getElementById("message").oninvalid = function (event) {
  event.target.setCustomValidity("Please enter your message.");
};

// Reset custom error message when user types
document.getElementById("name").oninput = function (event) {
  event.target.setCustomValidity("");
};

document.getElementById("email").oninput = function (event) {
  event.target.setCustomValidity("");
};

document.getElementById("message").oninput = function (event) {
  event.target.setCustomValidity("");
};

// Scroll Debouncing for Navbar
let isScrolling;
window.addEventListener("scroll", function () {
  clearTimeout(isScrolling);
  isScrolling = setTimeout(function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }, 200); // 200ms debounce
});

// Local Storage for Form Data
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

nameInput.value = localStorage.getItem("name") || "";
emailInput.value = localStorage.getItem("email") || "";
messageInput.value = localStorage.getItem("message") || "";

nameInput.addEventListener("input", () => {
  localStorage.setItem("name", nameInput.value);
});
emailInput.addEventListener("input", () => {
  localStorage.setItem("email", emailInput.value);
});
messageInput.addEventListener("input", () => {
  localStorage.setItem("message", messageInput.value);
});
