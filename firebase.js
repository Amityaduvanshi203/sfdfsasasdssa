// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-key..json"); // apna Firebase key

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
  console.log("✅ Firebase initialized successfully");
} catch (err) {
  console.error("❌ Firebase initialization error:", err);
}

const db = admin.firestore();

module.exports = db;
