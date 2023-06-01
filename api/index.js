const express = require('express');
const path = require('path')
const fs = require('fs')
const uuid = require('uuidv1');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    const dbNotes = fs.readFileSync('./db/db.json','utf-8')
    const notes = JSON.parse(dbNotes || []) 
    res.json(notes)
});

app.post('/api/notes', (req, res) => {
    const title = req.body.title
    const text = req.body.text

    if (title, text) {
        const newNote = {
            title, text, id: uuid()
        }
        const response = {
            status: "success", 
            body: newNote
        }
        try{
            const notes = fs.readFileSync('./db/db.json','utf-8')
            const notesO = JSON.parse(notes)
            notesO.push(newNote)
            fs.writeFileSync('./db/db.json', JSON.stringify(notesO))
        } catch(error) {
            console.log(error)
            res.json(error)
        }
        res.json(response)
    }
});

module.exports = app;
