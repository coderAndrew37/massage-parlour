import { baseURL } from "./constants.js";

(function () {
  "use strict";
  const contactForm = document.querySelector(".contact-form .needs-validation");
  const submitButton = document.querySelector(
    ".contact-form button[type='submit']"
  );

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default submission
    event.stopPropagation(); // Stop further event propagation

    // Clear any previous error message
    document.getElementById("contactSubmissionError").style.display = "none";

    // Validate form before submission
    if (contactForm.checkValidity()) {
      submitButton.disabled = true; // Disable submit button while processing
      submitButton.textContent = "Sending...";

      // Proceed with submission
      await handleContactFormSubmission();

      submitButton.disabled = false; // Re-enable submit button
      submitButton.textContent = "Send";
    } else {
      contactForm.classList.add("was-validated"); // Show validation errors
    }
  });
})();

async function handleContactFormSubmission() {
  const contactForm = document.querySelector(".contact-form .needs-validation");

  const formData = new FormData(contactForm);
  const requestData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch(`${baseURL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Message sent successfully!");

      // Clear localStorage fields after successful submission
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("message");

      contactForm.reset(); // Reset the form fields
      contactForm.classList.remove("was-validated"); // Remove validation classes
    } else {
      displayError(result.error || "Failed to send the message.");
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    displayError("An error occurred while sending the message.");
  }
}

function displayError(message) {
  const errorContainer = document.getElementById("contactSubmissionError");
  errorContainer.textContent = message;
  errorContainer.style.display = "block";
}
