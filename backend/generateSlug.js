const mongoose = require("mongoose");
const slugify = require("slugify");
const { Service } = require("./models/service"); // Adjust the path to your Service model

// MongoDB connection URI
const MONGODB_URI = "mongodb://localhost:27017/massage"; // Update this to your MongoDB URI

async function generateSlugsForServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch all services from the database
    const services = await Service.find();
    console.log(`Found ${services.length} services.`);

    // Iterate through each service
    for (const service of services) {
      // Check if the service already has a slug
      if (!service.slug) {
        // Generate a slug from the title
        const slug = slugify(service.title, { lower: true });

        // Update the service with the new slug
        service.slug = slug;

        // Attempt to save the service and log the result
        try {
          await service.save();
          console.log(
            `Slug successfully saved for service: ${service.title} -> ${slug}`
          );
        } catch (saveError) {
          console.error(
            `Error saving slug for service: ${service.title}. Error: ${saveError.message}`
          );
        }
      } else {
        console.log(
          `Service "${service.title}" already has a slug: ${service.slug}`
        );
      }
    }

    console.log("Slug generation process completed.");
  } catch (error) {
    console.error("Error generating slugs:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Call the function to generate slugs
generateSlugsForServices();
