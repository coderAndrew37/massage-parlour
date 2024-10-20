document
  .getElementById("quizForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Clear any previous feedback
    document.getElementById("quizResults").style.display = "none";
    const errorContainer = document.getElementById("submissionError");
    if (errorContainer) {
      errorContainer.remove();
    }

    // The form is already validated by formValidation.js, we just proceed to form submission
    if (document.querySelector(".needs-validation").checkValidity()) {
      try {
        // Log the start of the submission process for debugging
        console.log("Submitting the form...");

        // Gather form data
        const formData = {
          email: document.getElementById("email").value,
          quizAnswers: {
            q1: document.getElementById("q1").value,
            q2: document.getElementById("q2").value,
            q3: document.getElementById("q3").value,
          },
        };

        // Log the formData to verify what's being sent
        console.log("Form data:", formData);

        // Send form data via POST request to the quiz API
        const response = await fetch("http://localhost:5500/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        // Log the full response for debugging
        console.log("Server response:", data);

        if (response.ok) {
          // Show the recommendation and success message
          document.getElementById("quizResults").style.display = "block";
          document.getElementById("resultText").textContent =
            data.recommendation;
          alert(
            "Quiz submitted successfully! Your recommendation has been emailed."
          );
        } else {
          // Display server error message
          console.error("Error from server:", data.error); // Log the error to the console
          displayError(data.error); // Display the error message on the form
        }
      } catch (error) {
        // Handle network errors
        console.error("Network error:", error); // Log the network error
        displayError("Failed to submit the quiz. Please try again later.");
      }
    } else {
      console.error("Form validation failed."); // Log validation issues
    }
  });

// Helper function to display form error messages
function displayError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.id = "submissionError";
  errorDiv.className = "alert alert-danger mt-3";
  errorDiv.textContent = message;
  document.querySelector(".quiz-form").appendChild(errorDiv);

  // Log the message to confirm that the error is being displayed
  console.log("Displayed error message on form:", message);
}
