import { handleContactFormSubmission } from "../api/contactFormSubmission.js";

export function initFormValidation() {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (form.checkValidity()) {
        await handleContactFormSubmission(form);
      } else {
        form.classList.add("was-validated");
      }
    });
  });

  setCustomErrorMessages();
}

function setCustomErrorMessages() {
  const customMessages = {
    name: "Please provide your full name.",
    email: "Please provide a valid email address.",
    message: "Please enter your message.",
  };

  Object.keys(customMessages).forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.oninvalid = (event) =>
        event.target.setCustomValidity(customMessages[fieldId]);
      field.oninput = (event) => event.target.setCustomValidity("");
    }
  });
}
