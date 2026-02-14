const mongoose = require("mongoose")

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"])

async function connectToDB() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to DB");
    
}

module.exports = connectToDB