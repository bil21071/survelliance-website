const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (specifying the contactform database explicitly)
mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
    // Insert dummy data to ensure DB and collection are created
    createDummyData();
  })
  .catch((error) => console.log("MongoDB connection error:", error));

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  message: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// Function to Insert Dummy Data (just for initial setup/verification)
async function createDummyData() {
  try {
    const testContact = new Contact({
      name: "Test User",
      email: "test@example.com",
      phone: "123456789",
      service: "App and Web Development",
      message: "This is a test message",
    });

    await testContact.save();
    console.log("Dummy data inserted. Database and collection created!");
  } catch (error) {
    console.log("Error inserting dummy data:", error);
  }
}

// POST route for form submission
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  const newContact = new Contact({ name, email, phone, service, message });

  try {
    await newContact.save();
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting form", error });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
