const mongoose = require("mongoose")

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected Successfully");
    } catch (error) {
        console.error("Failed to connect Database");
        console.error(error.message);
    }
}

module.exports = connectToDB