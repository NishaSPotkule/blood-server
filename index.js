require("dotenv").config();

const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


if (!process.env.FIREBASE_KEY) {
  console.log("❌ FIREBASE_KEY is missing");
  process.exit(1);
}

let serviceAccount;

try {
 
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

  
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

} catch (error) {
  console.log("❌ FIREBASE_KEY JSON parse error");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.post("/sendRequest", async (req, res) => {

  const { tokens, bloodGroup } = req.body;

 
  if (!tokens || tokens.length === 0) {
    return res.status(400).send({
      success: false,
      message: "No tokens provided"
    });
  }

  try {
    const message = {
      notification: {
        title: "🚨 Blood Request",
        body: `Urgent need for ${bloodGroup} donor nearby!`
      },
      tokens: tokens
    };

   
    const response = await admin.messaging().sendMulticast(message);

    res.send({
      success: true,
      response: response
    });

  } catch (error) {
    console.log("❌ Error sending notification:", error);

    res.status(500).send({
      success: false,
      error: error.message
    });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});