import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
    url: "string",
    title: "string",

    downloadedAt: {
        type: Date,
        default: Date.now
    }
})

const downloadModel = mongoose.model("downloads", downloadSchema)

export default downloadModel