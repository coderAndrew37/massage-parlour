import "./constants.js";

// Custom Bootstrap validation for the Contact form
(function () {
  "use strict";
  const contactForm = document.querySelector(".contact-form .needs-validation");
  const submitButton = document.querySelector(
    ".contact-form button[type='submit']"
  );

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form reload
    event.stopPropagation();

    if (contactForm.checkValidity()) {
      // Form is valid, show loading state and proceed to submit
      submitButton.disabled = true;
      submitButton.innerHTML = "Sending..."; // Change button text to loading

      await handleContactFormSubmission();
    } else {
      // Form is invalid, show validation errors
      contactForm.classList.add("was-validated");
    }
  });
})();

// Handle contact form submission logic
async function handleContactFormSubmission() {
  const contactForm = document.querySelector(".contact-form .needs-validation");

  const formData = new FormData(contactForm);
  const requestData = {
    name: formData.get("name"),
    email: formData.get("email"),
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
      contactForm.reset();
      contactForm.classList.remove("was-validated");
    } else {
      alert(result.error || "Failed to send the message.");
    }
  } catch (error) {
    alert("An error occurred while sending the message.");
  } finally {
    const submitButton = document.querySelector(
      ".contact-form button[type='submit']"
    );
    submitButton.disabled = false;
    submitButton.innerHTML = "Submit"; // Restore button text after submission
  }
}
