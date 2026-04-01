import express from "express";

const app = express()

app.get("/helth", (req, res) => {
    res.status(200).json({ status: "ok" })
})

export default app