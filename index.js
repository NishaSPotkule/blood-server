require("dotenv").config();

const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.post("/sendRequest", async (req, res) => {

  const { tokens, bloodGroup } = req.body;

  if (!tokens || tokens.length === 0) {
    return res.status(400).send({ success: false, message: "No tokens" });
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

    res.send({ success: true, response });

  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});