// GSAP Animation for Service Details Section
export function animateServiceDetails() {
  const mediaQueryLarge = window.matchMedia("(min-width: 769px)");
  const mediaQuerySmall = window.matchMedia("(max-width: 768px)");

  // For larger screens
  if (mediaQueryLarge.matches) {
    gsap.from("#service-image", {
      duration: 0.8,
      x: 80, // Move the image in from the right
      ease: "power1.out",
      scrollTrigger: {
        trigger: "#service-content",
        start: "top 80%",
      },
    });

    gsap.from(".book-now-button", {
      duration: 1,
      scale: 0.85,
      ease: "power1.out",
      scrollTrigger: {
        trigger: "#service-content",
        start: "top 80%",
      },
    });
  }

  // For smaller screens
  if (mediaQuerySmall.matches) {
    gsap.from("#service-image", {
      duration: 0.5,
      x: 0, // Keep movement neutral for smaller screens
      ease: "power1.out",
      scrollTrigger: {
        trigger: "#service-content",
        start: "top 80%",
      },
    });

    gsap.from(".book-now-button", {
      duration: 0.6,
      scale: 1,
      ease: "power1.out",
      scrollTrigger: {
        trigger: "#service-content",
        start: "top 80%",
      },
    });
  }
}

// GSAP Animation for Additional Images Section
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
  } else {
    console.warn("No additional images found to animate.");
  }
}

// GSAP Animation for Service Testimonials Section
export function animateServiceTestimonials() {
  gsap.from(".testimonial-box", {
    duration: 1, // Slightly faster
    y: 60, // Shorter slide for smoother transition
    stagger: 0.2, // Reduce delay between testimonials for quick loading
    ease: "power1.out", // Smooth easing
    scrollTrigger: {
      trigger: "#testimonials",
      start: "top 80%",
    },
  });
}

// GSAP Animation for Related Services Section
export function animateRelatedServices() {
  gsap.from(".js-related-services-grid .card", {
    duration: 0.9, // Slightly quicker load
    y: 60, // Shorter slide
    stagger: 0.15, // Quicker stagger for faster card load
    ease: "power1.out", // Smoother easing
    scrollTrigger: {
      trigger: "#related-services",
      start: "top 80%",
    },
  });
}

// Hover effect for buttons (optional)
export function addHoverAnimations() {
  const buttons = document.querySelectorAll(".btn, .book-now-button");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, { scale: 1.1, duration: 0.2, ease: "power2.out" }); // Quick hover effect
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { scale: 1, duration: 0.2, ease: "power2.out" });
    });
  });
}

// Hover effect for service images (optional)
export function addImageHoverAnimations() {
  const images = document.querySelectorAll("img");
  images.forEach((image) => {
    image.addEventListener("mouseenter", () => {
      gsap.to(image, { scale: 1.05, duration: 0.3, ease: "power2.out" }); // Slight zoom effect
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
