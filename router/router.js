const router = require("express").Router()
const { RegisterToken, sendPushNotification } = require("../controller/controller.js");

const register = router.post("/register", (req, res) => RegisterToken(req, res));

const push = router.post("/push", (req, res) => sendPushNotification(req, res));

module.exports={
    register,
    push
}