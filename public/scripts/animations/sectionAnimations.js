import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateAboutUs() {
  gsap.from("#about-us h2", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power3.out",
    scrollTrigger: { trigger: "#about-us", start: "top 80%" },
  });
  gsap.from("#about-us p, #about-us .col-md-4", {
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: { trigger: "#about-us", start: "top 80%" },
  });
}

// Define other animations for different sections
export function animateContactUs() {
  gsap.from("#contact-us .contact-form, #contact-us .contact-info", {
    duration: 1.2,
    opacity: 0,
    y: 50,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: { trigger: "#contact-us", start: "top 80%" },
  });
}

export function animateFAQs() {
  gsap.from("#faqAccordion .accordion-item", {
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.3,
    ease: "power3.out",
    scrollTrigger: { trigger: "#faq", start: "top 80%" },
  });
}
