// GSAP Animation for About Us Section
gsap.from("#about-us h2", {
  duration: 1,
  y: 50,
  opacity: 0,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#about-us",
    start: "top 80%",
  },
});

gsap.from("#about-us p, #about-us .col-md-4", {
  duration: 1,
  opacity: 0,
  y: 50,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#about-us",
    start: "top 80%",
  },
});

// GSAP Animation for Contact Us Section
gsap.from("#contact-us .contact-form, #contact-us .contact-info", {
  duration: 1.2,
  opacity: 0,
  y: 50,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#contact-us",
    start: "top 80%",
  },
});

// GSAP Animation for FAQs Section
gsap.from("#faqAccordion .accordion-item", {
  duration: 1,
  opacity: 0,
  y: 50,
  stagger: 0.3,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#faq",
    start: "top 80%",
  },
});

// animations.js

// GSAP Animation for Hero Section
export function animateHero() {
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
}

// GSAP Animation for dynamically loaded content
export function animateGallery() {
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
}

export function animateTestimonials() {
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
}

export function animateServices() {
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
}

// Call hero animations on page load
document.addEventListener("DOMContentLoaded", () => {
  animateHero();
});
