const express = require("express")

const app = express()

app.use(express.json())

const notes = []

app.post("/notes", (req,res) => {
    notes.push(req.body) 
    res.status(201).json({
        message: "note created successfully"
    })   
})

app.get("/notes", (req,res) => {
    res.status(200).json({
        notes: notes    
    })
})

app.delete("/notes/:idx", (req,res) => {
    delete notes[req.params.idx]
    res.status(200).json({
        message: "note deleted successfully"
    })
})

app.patch("/notes/:idx", (req,res) => {
    notes[req.params.idx].description = req.body.description
    res.status(200).json({
        message: "Note updated successfully"
    })
})

// le6jaDzroBX3kxwo

module.exports = app