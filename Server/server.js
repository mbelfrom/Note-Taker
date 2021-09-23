const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require("path");
const fs = require('fs');
const { Server } = require('http');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


module.exports = Server;