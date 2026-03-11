import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from 'mongoose'


const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`mongoDB connected: ${conn.connection.host}`)
}


export default connectDB;