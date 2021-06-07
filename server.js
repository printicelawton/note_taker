// The following HTML routes should be created:

// * `GET /notes` should return the `notes.html` file.

// * `GET *` should return the `index.html` file.

// The following API routes should be created:

// * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.

// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into `npm` packages that could do this for you).

// https://www.npmjs.com/package/id-generator
// https://www.npmjs.com/search?q=npm%20uuid


// require dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const databasePath = path.join(__dirname, '/db/db.json');
var Generator = require('id-generator');
const database = require('./db/db.json');

// Tells node that we are creating an 'express' server
var app = express();

// Establishing a port.  Will us in our listener function/method
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing... relating to the 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static route to public folder
app.use(express.static('public'));

// Creating route to html
app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// This performs the get request to get the data
// from the database
app.get('/api/notes', function(req, res) {
  fs.readFile(databasePath, (err,data) => {
    let notes = JSON.parse(data);
    res.json(notes);
  })
});

// This performs the post request to update the data
// from the database
app.post('/api/notes', function(req, res) {
  var g = new Generator();
  let newNote = req.body;
  newNote.id = g.newId();
  fs.readFile(databasePath, (err,data) => {
    let notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(databasePath,JSON.stringify(notes), () => {
      res.json(notes);
    })
  })
});

// Route to use delete note  --- client talking to server 
app.delete('/api/notes/:id', function(req, res) {
  let noteID = req.params.id;

  fs.readFile(databasePath, (err,data) => {
    let notes = JSON.parse(data);
    let newArr = notes.filter((note) => note.id !== noteID );
    fs.writeFile(databasePath,JSON.stringify(newArr), () => {
     res.json(newArr);
   })
  })
});

//This is the listener
app.listen(PORT, function() {
  console.log('App listening on PORT: ' + PORT);
});