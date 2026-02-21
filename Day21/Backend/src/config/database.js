const mongoose = require("mongoose")

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]) 

function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to DB");
        
    })
}

module.exports = connectToDB