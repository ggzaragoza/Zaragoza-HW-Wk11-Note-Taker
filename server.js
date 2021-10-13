const express = require('express');
const path = require('path');
const fs = require('fs');


const notes = require('./db/db.json');
const noteId = require('./helpers/noteid.js');
// const index = require('./public/assets/js/index.js');


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

// app.get('/api/notes', (req, res) => 
//     res.status(200).json(notes)
// );


app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note.`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: noteId(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err)
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);
        
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 1), (err) =>
          err ? console.error(err) : console.info('Your new note was successfully saved!'))

            app.get('/api/notes', (req, res) => 
    res.status(200).json(notes)
);
      };
    });

    const response = {
      status: 'success',
      body: newNote,
    };
  
    console.log(response);
    res.status(201).json(response);

  } else {
    res.status(500).json('Error in posting note.');
  }

  

})


app.get('/api/notes', (req, res) => 
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      res.json(JSON.parse(data))
    }
    )
    // res.status(200).json(notes)
);

app.get('/api/notes/:id', (req, res) => 
    res.status(200).json(notes)
);

// app.post('/api/notes/:id', (req, res) => 
//     res.status(200).json(notes)
// );

app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note.`);

  // const currentNoteId = notes[i].id;
  // const result = [];
  const idtoDelete = req.params.id;
  console.log(idtoDelete);

  if (idtoDelete) {
    // const newNotes = [];

    // for (let i = 0; i < notes.length; i++) {
    //     const currentNoteId = notes[i].id;

    //     if (idtoDelete === currentNoteId) {
    //       const result = notes.filter(() => notes.indexOf(i));
    //       newNotes.push(result);
    //       // return newNotes;
    //     }
    // }

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        for (let i = 0; i < parsedNotes.length; i++) {
          // let existingNoteId = parsedNotes[i].id;
  
          if (idtoDelete === parsedNotes[i].id) {
            const newNotes = parsedNotes.filter((item, i) => parsedNotes.indexOf(item !== i));

            fs.writeFile('./db/db.json', JSON.stringify(newNotes, null, 1), (err) =>
            err ? console.error(err) : console.info('Your note has been deleted.'))
          }

        break;
        }
      

        // return newNotes;
    
        // console.info(newNotes);
      }
    })

  

    // fs.readFile('./db/db.json', 'utf8', (err, data) => {
    //   if (err) {
    //     console.error(err)
    //   } else {
    //     const parsedNotes = JSON.parse(data);

    //     parsedNotes.push(newNotes);
        
    //     fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 1), (err) =>
    //       err ? console.error(err) : console.info('Your note has been deleted.'))
    //   };
    // });

    // const newNote = {
    //   title,
    //   text,
    //   id: noteId(),
    // };

    

    const response = {
      status: 'success',
      // body: newNotes
    };
  
    console.log(response);
    res.status(201).json(response);

  } else {
    res.status(500).json('Error in deleting note.');
  }

})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);