// Modal handling functions
export function openModal(modalId, title, item = {}, itemId = null) {
  document.getElementById(modalId).classList.add("active");
  document.getElementById(`${modalId}-title`).innerText = title;

  // Set form values for the given modal
  if (itemId) {
    if (modalId === "service-modal") {
      document.getElementById("service-title").value = item.title;
      document.getElementById("service-description").value = item.description;
      document.getElementById("service-price").value = item.priceCents;
      document.getElementById("service-image").value = item.image;
    } else if (modalId === "gallery-modal") {
      document.getElementById("gallery-title").value = item.title;
      document.getElementById("gallery-image").value = item.image;
    } else if (modalId === "testimonial-modal") {
      document.getElementById("testimonial-name").value = item.name;
      document.getElementById("testimonial-quote").value = item.quote;
      document.getElementById("testimonial-image").value = item.image;
    }
  }
}

export function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}