const admin = require("../config/config.js").admin;

// Register token
function RegisterToken(req, res) {
  const token = req.headers.authorization;
  console.log(token);

  // Check if the token already exists in the database
  const tokensRef = admin.database().ref("fcmTokens");
  tokensRef
    .orderByChild("token")
    .equalTo(token)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Token already exists, return an error
        console.log("Token already exists");
        res.status(200).json({ error: "Token already exists." });
      } else {
        // Token is unique, store it in the database with "online" status and timestamp
        const timestamp =  new Date().toLocaleString();;
        tokensRef
          .push({ token, status: "online", lastActivity: timestamp })
          .then(() => {
            res.status(200).json({ message: "Token stored successfully." });
          })
          .catch((error) => {
            console.log("Failed to store token.",error)
            res.status(500).json({ error: "Failed to store token." });
          });
      }
    })
    .catch((error) => {
        console.log("Failed to check token uniqueness.",error)
      res
        .status(500)
        .json({ error: "Failed to check token uniqueness." });
    });
}



// Update token status and timestamp
function UpdateTokenStatus(req, res) {
  const token = req.headers.authorization;

  const tokensRef = admin.database().ref("fcmTokens");
  tokensRef
    .orderByChild("token")
    .equalTo(token)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Token exists, update its status to "online" and lastActivity timestamp
        snapshot.forEach((childSnapshot) => {
          const tokenId = childSnapshot.key;
          tokensRef.child(tokenId).update({ status: "online", lastActivity:  new Date().toLocaleString() });
        });
        res.status(200).json({ message: "Token status updated successfully." });
      } else {
        res.status(404).json({ error: "Token not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update token status." });
    });
}

// Check offline status of tokens
function CheckOfflineStatus() {
    console.log("check offline status")
  const tokensRef = admin.database().ref("fcmTokens");
  const offlineThreshold =  new Date().toLocaleString(); - 2 * 60 * 1000; // 2 minutes in milliseconds

  tokensRef
    .orderByChild("lastActivity")
    .endAt(offlineThreshold)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const tokenId = childSnapshot.key;
          const status = childSnapshot.val().status;
          if (status === "online") {
            tokensRef.child(tokenId).update({ status: "offline" });
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error checking offline status:", error);
    });
}

// Send push notification
function SendPushNotification(req, res) {
// UpdateTokenStatus(req, res);
  const message = req.body;

  const tokensRef = admin.database().ref("fcmTokens");
  tokensRef
    .orderByChild("status")
    .equalTo("online")
    .once("value")
    .then((snapshot) => {
      const tokens = [];
      snapshot.forEach((childSnapshot) => {
        const token = childSnapshot.val().token;
        tokens.push(token);
      });

      if (tokens.length === 0) {
        res.status(400).json({ error: "No online tokens found." });
        return;
      }

      const payload = {
        notification: message.notification,
        data: message.data,
      };

      const multicastMessage = {
        tokens: tokens,
        ...payload,
      };

      admin
        .messaging()
        .sendEachForMulticast(multicastMessage)
        .then((response) => {
          console.log("Successfully sent notifications:", response);
          res
            .status(201)
            .json({ message: "Notification sent successfully." });
        })
        .catch((error) => {
          console.error("Error sending notifications:", error);
          res.status(500).json({ error: "Failed to send notifications." });
        });
    })
    .catch((error) => {
      console.error("Error retrieving tokens:", error);
      res.status(500).json({ error: "Failed to retrieve tokens." });
    });
}

// Call the checkOfflineStatus function periodically
setInterval(CheckOfflineStatus, 5 * 60 * 1000); // Run every 5 minutes

module.exports = {
  RegisterToken,
  UpdateTokenStatus,
  SendPushNotification,
};
