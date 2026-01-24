// server create karna
const express = require("express")

const app = express() // server create ho jata hai
app.use(express.json())
const notes = []

// POST Notes
app.post("/notes", (req,res) => {
    console.log(req.body);
    notes.push(req.body)
    console.log(notes);
    res.send("note created")
})

// Get Notes
app.get("/notes", (req,res) => {
    res.send(notes)
})

// Delete Notes using Params
// Delete/notes/1,2,3
app.delete("/notes/:idx",(req,res) => {
    delete notes[req.params.idx]
    // console.log(req.params.idx);
    res.send("note deleted sucessful")
    
})

// Patch/notes/:idx
// req.body = {description :- "sample modified description"}

app.patch("/notes/:idx", (req,res) => {
    notes[req.params.idx].description = req.body.description
    res.send("description updaated")
})



app.put("/notes/:idx", (req,res) => {

    // meaning of this line  notes ke andar ke object ko nye object se replace kr do
    notes[req.params.idx] = req.body
    res.send("Update successfully")
})


module.exports = app