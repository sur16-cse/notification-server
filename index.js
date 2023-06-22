const express = require("express");
const bodyparser = require("body-parser");
const admin = require("./config.js").admin;

const app = express();
app.use(bodyparser.json());

const port = 3000;

const tokens = [];

app.post("/register", (req, res) => {
  const token = req.headers.authorization;
  const tokensRef = admin.database().ref("fcmTokens");
  tokensRef
    .push({ token })
    .then(() => {
      res.status(200).json({ message: "Token stored successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to store token." });
    });
});

app.post("/push", (req, res) => {
  const token = req.headers.authorization;
  console.log(token);

  const message = {
    data: {
      dodsfvv: "fhofao",
    },
    token: token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(response);
      //configure your response here

      res.status(201).send("Notification sent successfully");
    })
    .catch((error) => {
      console.log(error);
    });
});
app.listen(port, () => {
  console.log("listening to port" + port);
});
