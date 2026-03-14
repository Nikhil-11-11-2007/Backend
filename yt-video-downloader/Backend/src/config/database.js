import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from "mongoose";

export async function connectToDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to DB successfully");
    } catch(err) {
        console.log("DB connection failed")
    }
}