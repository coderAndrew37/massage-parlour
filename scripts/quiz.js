import { baseURL } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.getElementById("quizForm");

  // Ensure the form element exists
  if (!quizForm) {
    console.error("Quiz form not found on the page.");
    return;
  }

  quizForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Clear previous messages and errors
    document.getElementById("quizResults").style.display = "none";
    const errorContainer = document.getElementById("submissionError");
    if (errorContainer) errorContainer.remove();

    // Display loading state on the submit button
    const submitButton = quizForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    // Check form validity and handle submission
    if (quizForm.checkValidity()) {
      await handleQuizFormSubmission();
    } else {
      quizForm.classList.add("was-validated");
    }

    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  });
});

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

  const requestData = {
    email: email,
    quizAnswers: quizAnswers,
  };

  try {
    console.log("Sending request to:", `${baseURL}/api/quiz`);
    const response = await fetch(`${baseURL}/api/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    if (response.ok) {
      // Display success message and recommendation
      document.getElementById("quizResults").style.display = "block";
      document.getElementById("resultText").textContent =
        result.recommendation || "Thank you for submitting the quiz!";
      quizForm.reset(); // Clear all form fields, including the email field
    } else {
      displayError(result.error || "Failed to submit the quiz.");
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    displayError("An error occurred while submitting the quiz.");
  }
}

function displayError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.id = "submissionError";
  errorDiv.className = "alert alert-danger mt-3";
  errorDiv.textContent = message;
  document.querySelector(".quiz-form").appendChild(errorDiv);
}
