const app = require("./src/app")

const mongoose = require("mongoose")

app.get("/", (req,res) => {
    res.send("Hello world Nikhil")
})

function connectDb() {
    mongoose.connect("mongodb+srv://ng364357_db_user:le6jaDzroBX3kxwo@cluster0.n2h38fj.mongodb.net/Day6")
    .then(() => {
        console.log("Connected successfully");
    })
}

connectDb()

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})