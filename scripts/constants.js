const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://massage-2.vercel.app/api" // The Vercel domain with the /api prefix for backend routes
    : "http://localhost:5500"; // Keep localhost for development
