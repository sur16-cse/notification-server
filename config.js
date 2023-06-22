var admin = require("firebase-admin");

//path to the json you just downloaded
var serviceAccount = require("./fir.json");

//init 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-push-notification-24fb4-default-rtdb.firebaseio.com/"
})

module.exports.admin = admin