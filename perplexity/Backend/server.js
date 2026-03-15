import "dotenv/config";
import app from "./src/app.js";
import http from 'http'
import connectDB from "./src/config/database.js";
import { initiSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app)

initiSocket(httpServer)

connectDB()
    .catch((err) => {
        console.error("mongoDB connection failed:", err);
        process.exit(1);
    })

httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})