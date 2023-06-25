const admin = require("../config/config.js").admin;
//register token
function RegisterToken(req,res){
    const token = req.headers.authorization;
    console.log(token)

    // Check if the token already exists in the database
    const tokensRef = admin.database().ref("fcmTokens");
    tokensRef
        .orderByChild("token")
        .equalTo(token)
        .once("value")
        .then((snapshot) => {
            if (snapshot.exists()) {
                // Token already exists, return an error
                console.log("Token already exist")
                res.status(200).json({ error: "Token already exists." });

            } else {
                // Token is unique, store it in the database
                tokensRef
                    .push({ token })
                    .then(() => {
                        res.status(200).json({ message: "Token stored successfully." });
                    })
                    .catch((error) => {
                        res.status(500).json({ error: "Failed to store token." });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to check token uniqueness." });
        });
}

//send push notfication
function sendPushNotification(){
    const message = req.body;

    const tokensRef = admin.database().ref("fcmTokens");
    tokensRef.once("value")
        .then((snapshot) => {
            const tokens = [];
            snapshot.forEach((childSnapshot) => {
                const token = childSnapshot.val().token;
                tokens.push(token);
            });

            if (tokens.length === 0) {
                res.status(400).json({ error: "No tokens found." });
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

            admin.messaging().sendEachForMulticast(multicastMessage)
                .then((response) => {
                    console.log("Successfully sent notifications:", response);
                    res.status(201).json({ message: "Notification sent successfully." });
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

module.exports={
    RegisterToken,
    sendPushNotification
}