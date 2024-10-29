import { fetchWithRetry } from "./fetchContent.js";
import { baseURL } from "../utils/constants.js";

export async function handleContactFormSubmission(form) {
  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);
  const requestData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  // Disable submit button and show loading state
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    const response = await fetchWithRetry(`${baseURL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      alert("Message sent successfully!");
      form.reset();
      form.classList.remove("was-validated");
    } else {
      throw new Error(response.error || "Failed to send the message.");
    }
  } catch (error) {
    console.error("Error during form submission:", error);
    alert("An error occurred while sending the message. Please try again.");
  } finally {
    // Re-enable submit button and reset button text
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
}
