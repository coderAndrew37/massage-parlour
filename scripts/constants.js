export const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5500" // Local development API
    : "https://massage-2-q1w93y11n-coderandrew37s-projects.vercel.app/api"; // Production API
