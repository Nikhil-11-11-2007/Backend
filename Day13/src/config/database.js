const mongoose = require("mongoose")

function connectedToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to DB Successfully");
    })
}

module.exports = connectedToDB