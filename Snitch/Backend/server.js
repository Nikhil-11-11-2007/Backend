import dotenv from "dotenv"
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

dotenv.config()

const startServer = async () => {

    try{

        await connectDB()
        app.listen(3000, () => {
            console.log("server is running on port 3000")
        })
    } catch(err){
        console.log("Failed to start server:", err.message)
        process.exit(1)
    }

}


startServer()
