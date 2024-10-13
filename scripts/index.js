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
