const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const filePath = 'db/db.json';
const uuid = require('uuid');

app.use(express.static('public'));
app.use(express.json());

app.post('/api/notes', (req, res) => {
    let newData = req.body;
    newData.id = uuid.v4();
    const oldData = readJsonFile();
    const combinedData = [...oldData, newData];
    saveJsonFile(combinedData);
    res.json(newData);
});

app.get('/api/notes', (req, res) => {
    const jsonData = readJsonFile();
    res.json(jsonData)
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const oldData = readJsonFile();
    const newData = oldData.filter(note => noteId !== note.id);
    saveJsonFile(newData);
    res.sendStatus(200);
});

function readJsonFile() {
    const jsonData = JSON.parse(fs.readFileSync(filePath));
    return jsonData;
}

function saveJsonFile(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, '', 2))
}


app.get('/notes', (req, res) => {
    res.sendFile('notes.html', { root: __dirname + '/public' });
});

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});