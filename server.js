const express = require('express');
const app = express();
const { clog } = require('./clog');
const PORT = process.env.PORT || 3001;
const path = require('path');
const fs = require('fs/promises');
// clog added to monitor localhost activity
app.use(clog);

app.use(express.json());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', async (req, res) => {
  await fs.readFile('./db/db.json', 'utf8')
  .then((data) => {
    let parseData = JSON.parse(data)
    res.json(parseData)
  })
});



app.post('/api/notes', async (req, res) => { 
  const newNotes = {
    ...req.body,
    id: 
    Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
  };

  const dataToRead = await fs.readFile('./db/db.json', 'utf8')
  let parseData = JSON.parse(dataToRead)
  parseData.push(newNotes)
  const stringifyData = JSON.stringify(parseData, null, 4);
  await fs.writeFile("./db/db.json", stringifyData);
  res.send("Successfully added note!")
});




app.delete('/api/notes/:id', async (req, res) => { 
  const dataToRead = await fs.readFile('./db/db.json', 'utf8')
  let parseData = JSON.parse(dataToRead)
  const filterNote = parseData.filter((note) => note.id !== req.params.id)
  const stringifyData = JSON.stringify(filterNote, null, 4);
  await fs.writeFile("./db/db.json", stringifyData);
  res.send("Successfully deleted your note!")
});


app.listen(PORT, () => 
  console.log(`http://localhost:${PORT}`)
  );
