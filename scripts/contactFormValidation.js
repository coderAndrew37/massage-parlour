const baseURL = "http://localhost:5500";

// Custom Bootstrap validation for the Contact form
(function () {
  "use strict";
  const contactForm = document.querySelector(".contact-form .needs-validation");

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form reload
    event.stopPropagation();

    // Check if the form is valid
    if (contactForm.checkValidity()) {
      // Form is valid, proceed to submit
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

  // Collect form data
  const formData = new FormData(contactForm);
  const requestData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  try {
    // Send form data to the server (API) using fetch
    const response = await fetch(`${baseURL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (response.ok) {
      // If the submission was successful, show a success message
      alert("Message sent successfully!");
      contactForm.reset(); // Clear the form
      contactForm.classList.remove("was-validated");
    } else {
      // Show error if submission failed
      alert(result.error || "Failed to send the message.");
    }
  } catch (error) {
    // Handle network errors
    alert("An error occurred while sending the message.");
  }
}
