const express = require('express');
const path = require('path');
const app = express();
const db = require('./db/db.json');
const fs = require('fs')
const uuid = require('uuidv1');
//const { json } = require('express');
// const = require db.json, urlroutes, fs
const PORT = process.env.PORT || 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// app use url, api

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});


app.get('/api/notes', (req, res) => {
  const dbNotes = fs.readFileSync('./db/db.json', 'utf-8')
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
    try {
      const notes = fs.readFileSync('./db/db.json', 'utf-8')
      const notesO = JSON.parse(notes)
      notesO.push(newNote)
      fs.writeFileSync('./db/db.json', JSON.stringify(notesO))

    } catch (error) {
      console.log(error)
      res.json(error)
    }
    res.json(response)
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  console.log("Deleting note with ID: ", noteId);  // Added console log

  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  notes = notes.filter((note) => note.id !== noteId);

  console.log("Updated notes: ", notes);  // Added console log

  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json(notes);
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost: ${PORT}`);
});
