const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();

// app.use(morgan('common'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

app.use(morgan('common', { stream: accessLogStream }));

app.use(express.static('public'));

const topMovies = [
    { title: "The Silence of the Lambs", year: 1991 },
    { title: "The Prestige", year: 2006 },
    { title: "The Godfather", year: 1972 },
    { title: "The Grand Budapest Hotel", year: 2014 },
    { title: "Coco", year: 2017 },
    { title: "The Departed", year: 2006 },
    { title: "Fight Club", year: 1999 },
    { title: "12 Years a Slave", year: 2013 },
    { title: "Her", year: 2013 },
    { title: "La La Land", year: 2016 },
];


app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
