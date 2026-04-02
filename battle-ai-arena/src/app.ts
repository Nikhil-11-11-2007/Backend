import express from "express";
import useGraph from "./services/graph.ai.service.js"

const app = express()

app.get("/helth", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.post("/use-graph", async (req, res) => {

    await useGraph("write an factorial function in javascript")

})

export default app