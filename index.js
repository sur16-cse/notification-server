const express = require("express");
const bodyparser = require("body-parser");
const {register,update,push}=require("./router/router.js");



const app = express();
app.use(bodyparser.json());

const port = 3000;

const tokens = [];

// app.use(register)
// app.use(update)
// app.use(push)



app.listen(port, () => {
  console.log("Listening on port " + port);
});
