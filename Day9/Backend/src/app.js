const express = require("express")
const noteModel = require("./models/note.model")

const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

app.post("/api/notes", async (req, res) => {
    const { title, description } = req.body
    const note = await noteModel.create({
        title, description
    })

    res.status(201).json({
        message: "note created",
        note
    })

})

app.get("/api/notes", async (req, res) => {

    const note = await noteModel.find()

    res.status(200).json({
        message: "note fetched",
        note
    })
})


app.delete("/api/notes/:id", async (req, res) => {
    const id = req.params.id

    const note = await noteModel.findByIdAndDelete(id)

    res.status(200).json({
        message: "note deleted",
        note
    })

})

app.patch("/api/notes/:id", async (req, res) => {
    const id = req.params.id
    const { description } = req.body

    const note = await noteModel.findByIdAndUpdate(id, { description })
    res.status(200).json({
        message: "updated successfully",
        note
    })
})

module.exports = app