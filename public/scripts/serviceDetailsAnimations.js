gsap.registerPlugin(ScrollTrigger);

// GSAP Animation for Service Image and CTA Button Only
export function animateServiceDetails() {
  const mediaQueryLarge = window.matchMedia("(min-width: 769px)");

  // For larger screens
  if (mediaQueryLarge.matches) {
    gsap.from("#service-image", {
      duration: 1,
      x: -100, // Move image from the left
      opacity: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#service-content",
        start: "top 80%",
      },
    });

    gsap.from(".book-now-button", {
      duration: 1,
      y: 20,
      opacity: 0,
      ease: "back.out(1.7)", // Slight bounce for the CTA button
      scrollTrigger: {
        trigger: "#service-content",
        start: "top 85%",
      },
    });
  } else {
    // For smaller screens, keep animations subtle
    gsap.from("#service-image", {
      duration: 0.8,
      opacity: 0,
      x: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#service-content",
        start: "top 85%",
      },
    });

    gsap.from(".book-now-button", {
      duration: 0.8,
      y: 20,
      opacity: 0,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: "#service-content",
        start: "top 90%",
      },
    });
  }
}

// Additional animations
export function animateAdditionalImages() {
  const additionalImages = document.querySelectorAll("#additional-images .col");

  if (additionalImages.length > 0) {
    gsap.from(additionalImages, {
      duration: 0.8,
      y: 70,
      stagger: 0.1,
      ease: "power1.out",
      scrollTrigger: {
        trigger: "#additional-images",
        start: "top 80%",
      },
    });
  }
}

// Service Testimonials Animation
export function animateServiceTestimonials() {
  gsap.from(".testimonial-box", {
    duration: 1,
    y: 60,
    stagger: 0.2,
    ease: "power1.out",
    scrollTrigger: {
      trigger: "#testimonials",
      start: "top 80%",
    },
  });
}

// Related Services Section Animation
export function animateRelatedServices() {
  gsap.from(".js-related-services-grid .card", {
    duration: 0.9,
    y: 60,
    stagger: 0.15,
    ease: "power1.out",
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
      gsap.to(button, { scale: 1.1, duration: 0.2, ease: "power2.out" });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { scale: 1, duration: 0.2, ease: "power2.out" });
    });
  });
}

// Hover effect for images
export function addImageHoverAnimations() {
  const images = document.querySelectorAll("img");
  images.forEach((image) => {
    image.addEventListener("mouseenter", () => {
      gsap.to(image, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    });
    image.addEventListener("mouseleave", () => {
      gsap.to(image, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
  });
}

// Call animations when the page content loads
document.addEventListener("DOMContentLoaded", () => {
  animateServiceDetails();
  animateAdditionalImages();
  animateServiceTestimonials();
  animateRelatedServices();

  // Add hover animations
  addHoverAnimations();
  addImageHoverAnimations();
});
