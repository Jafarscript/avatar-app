import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("<h1>Hello User</h1>")
})


app.listen(5050, () => {
    console.log("Click the link to open the url http://localhost:5050/")
})