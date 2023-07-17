const express = require("express");
const bodyparser = require("body-parser");
// const {register,update,push}=require("./router/router.js");
const data = require("./.well-known/assetlinks.json")



const app = express();
app.use(bodyparser.json());

const port = 3000;

const tokens = [];

// app.use(register)
// app.use(update)
// app.use(push)

app.get("./well-known/assetlinks.json",(request,response)=>{
  response.setHeader('content-type','application/json')
  response.json(data)
})

app.listen(port, () => {
  console.log("Listening on port " + port);
});
