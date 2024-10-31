import "./constants.js";

(function () {
  "use strict";
  const quizForm = document.getElementById("quizForm");

  // Ensure the form element exists
  if (!quizForm) {
    console.error("Quiz form not found on the page.");
    return;
  }

  quizForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default page reload
    event.stopPropagation(); // Stop further event propagation

    // Check form validity
    if (quizForm.checkValidity()) {
      console.log("Form is valid. Proceeding with submission.");
      await handleQuizFormSubmission();
    } else {
      console.log("Form is invalid. Showing validation feedback.");
      quizForm.classList.add("was-validated"); // Show validation feedback
    }
  });
})();

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

  // Payload data without email verification
  const requestData = {
    email: email,
    quizAnswers: quizAnswers,
  };

  try {
    const response = await fetch(`${baseURL}/api/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("quizResults").style.display = "block";
      document.getElementById("resultText").textContent = result.recommendation;
    } else {
      // Display error message if submission failed
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
