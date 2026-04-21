import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "CNY"],
            default: "INR"
        }
    }
},{
    _id: false,
    _v: false
})

export default priceSchema