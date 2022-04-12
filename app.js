const express = require("express");
require("dotenv").config();
require("./db/connection")
const app = express();
const bodyParser = require("express").json
const UserRouter = require("./api/User");

app.use(bodyParser());

const port = process.env.PORT;

app.get("/", (req, res) =>{
    res.send("Hello");
})

app.use("/user", UserRouter);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})