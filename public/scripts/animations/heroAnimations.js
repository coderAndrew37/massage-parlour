// src/animations/heroAnimations.js
import gsap from "gsap";

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
