export const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5500" // Local development API
    : "https://massage-parlour.onrender.com"; // Production API
