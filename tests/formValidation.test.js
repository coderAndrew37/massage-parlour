/**
 * @jest-environment jsdom
 */

describe("Custom Bootstrap Validation for Contact Form", () => {
  let form, nameInput, emailInput, messageInput;

  beforeEach(() => {
    // Mock DOM structure
    document.body.innerHTML = `
      <form class="needs-validation" novalidate>
        <input type="text" id="name" required />
        <input type="email" id="email" required />
        <textarea id="message" required></textarea>
        <button type="submit">Submit</button>
      </form>
    `;

    // Get form and input elements
    form = document.querySelector(".needs-validation");
    nameInput = document.getElementById("name");
    emailInput = document.getElementById("email");
    messageInput = document.getElementById("message");

    // Mock the custom validation script
    require("../scripts/formValidation.js");
  });

  test("should prevent submission and add 'was-validated' class if form is invalid", () => {
    form.checkValidity = jest.fn().mockReturnValue(false); // Mock form invalid

    const event = new Event("submit");
    event.preventDefault = jest.fn(); // Mock prevent default

    form.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled(); // Form should not submit
    expect(form.classList.contains("was-validated")).toBe(true); // Form should have 'was-validated' class
  });

  test("should allow submission and show alert if form is valid", () => {
    form.checkValidity = jest.fn().mockReturnValue(true); // Mock form valid

    window.alert = jest.fn(); // Mock alert

    const event = new Event("submit");
    event.preventDefault = jest.fn(); // Prevent actual form submission

    form.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled(); // Form should submit
    expect(window.alert).toHaveBeenCalledWith("Form submitted successfully!");
    expect(form.classList.contains("was-validated")).toBe(true); // Form should have 'was-validated' class
  });

  test("should show custom error message for invalid name input", () => {
    jest.spyOn(nameInput, "setCustomValidity");

    // Simulate invalid event
    const event = new Event("invalid", { bubbles: true });
    nameInput.dispatchEvent(event);

    expect(nameInput.setCustomValidity).toHaveBeenCalledWith(
      "Please provide your full name."
    );
  });

  test("should reset custom error message for name input on input event", () => {
    jest.spyOn(nameInput, "setCustomValidity");

    // Simulate input event
    const event = new Event("input", { bubbles: true });
    nameInput.dispatchEvent(event);

    expect(nameInput.setCustomValidity).toHaveBeenCalledWith(""); // Reset custom message
  });

  test("should show custom error message for invalid email input", () => {
    jest.spyOn(emailInput, "setCustomValidity");

    // Simulate invalid event
    const event = new Event("invalid", { bubbles: true });
    emailInput.dispatchEvent(event);

    expect(emailInput.setCustomValidity).toHaveBeenCalledWith(
      "Please provide a valid email address."
    );
  });

  test("should reset custom error message for email input on input event", () => {
    jest.spyOn(emailInput, "setCustomValidity");

    // Simulate input event
    const event = new Event("input", { bubbles: true });
    emailInput.dispatchEvent(event);

    expect(emailInput.setCustomValidity).toHaveBeenCalledWith(""); // Reset custom message
  });

  test("should show custom error message for invalid message input", () => {
    jest.spyOn(messageInput, "setCustomValidity");

    // Simulate invalid event
    const event = new Event("invalid", { bubbles: true });
    messageInput.dispatchEvent(event);

    expect(messageInput.setCustomValidity).toHaveBeenCalledWith(
      "Please enter your message."
    );
  });

  test("should reset custom error message for message input on input event", () => {
    jest.spyOn(messageInput, "setCustomValidity");

    // Simulate input event
    const event = new Event("input", { bubbles: true });
    messageInput.dispatchEvent(event);

    expect(messageInput.setCustomValidity).toHaveBeenCalledWith(""); // Reset custom message
  });
});
