export const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5500" // Local development API
    : "https://massage-2-6xo1wesm3-coderandrew37s-projects.vercel.app/api"; // Production API URL
