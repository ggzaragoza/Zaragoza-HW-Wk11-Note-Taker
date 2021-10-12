const express = require('express');
const path = require('path');
const fs = require('fs');

const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => 
    res.status(200).json(notes)
);

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
      };

      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err)
        } else {
          const parsedNotes = JSON.parse(data);

          parsedNotes.push(newNote);
          
          fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 1), (err) =>
            err ? console.error(err) : console.info('Your new note was successfully saved!'))
        };
      });

      const response = {
        status: 'success',
        body: newNote,
      };
    
        console.log(response);
        res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }

});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);