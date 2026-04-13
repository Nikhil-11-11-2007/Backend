import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}

const config = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
    MISTRALAI_API_KEY: process.env.MISTRAL_API_KEY || '',
    COHERE_API_KEY: process.env.COHERE_API_KEY || '',
    MONGO_URI: process.env.MONGO_URI,
}


export default config;