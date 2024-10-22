import "./constants.js";

document
  .getElementById("quizForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Clear any previous feedback
    document.getElementById("quizResults").style.display = "none";
    const errorContainer = document.getElementById("submissionError");
    if (errorContainer) errorContainer.remove();

    // Display loading state
    const submitButton = document.querySelector(
      "#quizForm button[type='submit']"
    );
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    // Gather form data
    const formData = {
      email: document.getElementById("email").value,
      quizAnswers: {
        q1: document.getElementById("q1").value,
        q2: document.getElementById("q2").value,
        q3: document.getElementById("q3").value,
      },
    };

    try {
      // Submit the quiz via POST request
      const response = await fetch(`${baseURL}/api/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Display the message about verification email
        alert("Verification email sent. Please check your inbox to verify.");
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
      } else {
        // Display error message if submission failed
        displayError(data.error);
      }
    } catch (error) {
      displayError("Failed to submit the quiz. Please try again later.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit"; // Reset the submit button state
    }
  });

// Helper function to display form error messages
function displayError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.id = "submissionError";
  errorDiv.className = "alert alert-danger mt-3";
  errorDiv.textContent = message;
  document.querySelector(".quiz-form").appendChild(errorDiv);
}
