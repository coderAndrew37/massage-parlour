(function () {
  "use strict";
  const forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault(); // Prevent form from reloading page
          event.stopPropagation();
        } else {
          // If valid, prevent reload but allow processing
          event.preventDefault(); // Prevent reload
          alert("Form submitted successfully!");
          // Form submission logic...
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Input field error message customization
document.getElementById("name").oninvalid = function (event) {
  event.target.setCustomValidity("Please provide your full name.");
};

document.getElementById("email").oninvalid = function (event) {
  event.target.setCustomValidity("Please provide a valid email address.");
};

document.getElementById("message").oninvalid = function (event) {
  event.target.setCustomValidity("Please enter your message.");
};

// Reset custom error message when user types
document.getElementById("name").oninput = function (event) {
  event.target.setCustomValidity("");
};

document.getElementById("email").oninput = function (event) {
  event.target.setCustomValidity("");
};

document.getElementById("message").oninput = function (event) {
  event.target.setCustomValidity("");
};
