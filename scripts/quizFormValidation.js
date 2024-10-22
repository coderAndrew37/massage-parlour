import "./constants.js";

(function () {
  "use strict";
  const quizForm = document.getElementById("quizForm");

  quizForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form reload
    event.stopPropagation();

    // Check if the form is valid
    if (quizForm.checkValidity()) {
      // Form is valid, proceed to submit
      await handleQuizFormSubmission();
    } else {
      // Form is invalid, show validation errors
      quizForm.classList.add("was-validated");
    }
  });
})();

// Handle quiz form submission logic
async function handleQuizFormSubmission() {
  const quizForm = document.getElementById("quizForm");

  // Collect form data
  const formData = new FormData(quizForm);
  const quizAnswers = {
    q1: formData.get("q1"),
    q2: formData.get("q2"),
    q3: formData.get("q3"),
  };
  const email = formData.get("email");

  // Build the request payload
  const requestData = {
    email: email,
    quizAnswers: quizAnswers,
  };

  try {
    // Send form data to the server (API) using fetch
    const response = await fetch(`${baseURL}/api/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (response.ok) {
      // If the submission was successful, show the recommendation
      document.getElementById("quizResults").style.display = "block";
      document.getElementById("resultText").textContent = result.recommendation;
    } else {
      // Show error if submission failed
      const errorDiv = document.getElementById("submissionError");
      errorDiv.style.display = "block";
      errorDiv.textContent = result.error || "Failed to submit the quiz.";
    }
  } catch (error) {
    // Handle network errors
    const errorDiv = document.getElementById("submissionError");
    errorDiv.style.display = "block";
    errorDiv.textContent = "An error occurred while submitting the quiz.";
  }
}
