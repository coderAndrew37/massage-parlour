gsap.registerPlugin(ScrollTrigger);

// GSAP Animation for Service Details Section
export function animateServiceDetails() {
  gsap.from("#service-image", {
    duration: 1,
    x: -100, // Slide in from left with more distance
    opacity: 0,
    ease: "power2.out", // Slightly smoother easing
    scrollTrigger: {
      trigger: "#service-content",
      start: "top 80%",
    },
  });

  /*
  gsap.from("#service-title, #service-description", {
    duration: 1.4,
    opacity: 0,
    y: 70, // Increased upward motion
    ease: "power3.out",
    stagger: 0.2, // Less delay between each element
    scrollTrigger: {
      trigger: "#service-content",
      start: "top 80%",
    },
  });
*/

  gsap.from(".book-now-button", {
    duration: 1.2,
    opacity: 0,
    scale: 0.8, // Button grows as it fades in
    ease: "back.out(1.7)", // Elastic bounce effect
    scrollTrigger: {
      trigger: "#service-content",
      start: "top 80%",
    },
  });
}

// GSAP Animation for Additional Images Section
export function animateAdditionalImages() {
  gsap.from("#additional-images .col", {
    duration: 1,
    opacity: 0,
    y: 100, // Slightly larger movement
    stagger: 0.15, // Quicker appearance of each image
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#additional-images",
      start: "top 80%",
    },
  });
}

// GSAP Animation for Service Video Section
/*
export function animateServiceVideo() {
  gsap.from("#service-video", {
    duration: 1.4,
    opacity: 0,
    y: 100,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#service-video-section",
      start: "top 80%",
    },
  });
}
  */

// GSAP Animation for Testimonials Section
export function animateServiceTestimonials() {
  gsap.from(".testimonial-box", {
    duration: 1.2,
    opacity: 0,
    y: 80,
    stagger: 0.25, // Slightly more delay for each testimonial
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#testimonials",
      start: "top 80%",
    },
  });
}

// GSAP Animation for Related Services Section
export function animateRelatedServices() {
  gsap.from(".js-related-services-grid .card", {
    duration: 1,
    y: 70,
    opacity: 0,
    stagger: 0.2, // Quick stagger for related services cards
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#related-services",
      start: "top 80%",
    },
  });
}

// Hover effect for buttons
export function addHoverAnimations() {
  const buttons = document.querySelectorAll(".btn, .book-now-button");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, { scale: 1.1, duration: 0.3, ease: "power2.out" });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
  });
}

// Hover effect for service images
export function addImageHoverAnimations() {
  const images = document.querySelectorAll("img");
  images.forEach((image) => {
    image.addEventListener("mouseenter", () => {
      gsap.to(image, { scale: 1.05, duration: 0.4, ease: "power2.out" });
    });
    image.addEventListener("mouseleave", () => {
      gsap.to(image, { scale: 1, duration: 0.4, ease: "power2.out" });
    });
  });
}

// Call animations when the page content loads
document.addEventListener("DOMContentLoaded", () => {
  animateServiceDetails();
  animateAdditionalImages();
  // animateServiceVideo();
  animateServiceTestimonials();
  animateRelatedServices();

  // Add hover animations
  addHoverAnimations();
  addImageHoverAnimations();
});
