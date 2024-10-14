// Local Storage for Form Data
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

nameInput.value = localStorage.getItem("name") || "";
emailInput.value = localStorage.getItem("email") || "";
messageInput.value = localStorage.getItem("message") || "";

nameInput.addEventListener("input", () => {
  localStorage.setItem("name", nameInput.value);
});
emailInput.addEventListener("input", () => {
  localStorage.setItem("email", emailInput.value);
});
messageInput.addEventListener("input", () => {
  localStorage.setItem("message", messageInput.value);
});
