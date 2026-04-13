import mongoose from "mongoose";
import dns from "node:dns/promises"
import config from "./config.js";


dns.setServers(["1.1.1.1", "8.8.8.8"])

const connectDB = async () => {

    await mongoose.connect(config.MONGO_URI)
    console.log("MongoDB connected")

}


export default connectDB