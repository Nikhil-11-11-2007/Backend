const mongoose = require("mongoose")

require("node:dns/promises").setServers(["1.1.1.1","8.8.8.8"])

function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to DB");
    })
    .catch(err => {
        console.log("Error connecting to DB", err);
        
    })
}

module.exports = connectToDB