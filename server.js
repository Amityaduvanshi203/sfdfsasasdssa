const express = require("express");
const cors = require("cors");
const db = require("./firebase");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log("📝 Received data:", { name, email, subject, message });

    if (!name || !email || !message) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    const docRef = await db.collection("contacts").add({
      name,
      email,
      subject: subject || "No Subject",
      message,
      createdAt: new Date()
    });

    console.log("✅ Document saved with ID:", docRef.id);
    res.status(200).json({ success: true, message: "Message saved successfully ✅", docId: docRef.id });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ error: "Error saving data: " + err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
