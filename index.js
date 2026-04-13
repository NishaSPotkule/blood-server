const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.post("/sendRequest", async (req, res) => {

  const { token, bloodGroup } = req.body;

  try {
    const message = {
      notification: {
        title: "🚨 Blood Request",
        body: `Urgent need for ${bloodGroup} donor nearby!`
      },
      token: token
    };

    await admin.messaging().send(message);

    res.send({ success: true });

  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));