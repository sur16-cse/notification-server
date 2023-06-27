const router = require("express").Router()
const { RegisterToken,UpdateTokenStatus, SendPushNotification } = require("../controller/controller.js");

const register = router.post("/register", (req, res) => RegisterToken(req, res));

const update = router.put("/update", (req, res) => UpdateTokenStatus(req, res));

const push = router.post("/push", (req, res) => SendPushNotification(req, res));

module.exports={
    register,
    update,
    push
}