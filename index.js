const express = require("express");
const cors = require("cors");
const db = require("./firebase"); // your firebase.js file

const app = express();

app.use(cors());
app.use(express.json());

app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send("All fields are required ❌");
    }

    await db.collection("contacts").add({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    res.status(200).send("Message saved successfully ✅");
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).send("Error saving data ❌");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
