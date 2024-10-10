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

app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/movies/:name', (req, res) => {
    res.send(`Successfully fetched data for the movie: ${req.params.name}.`);
});

app.get('/genres/:name', (req, res) => {
    res.send(`Successfully fetched movies in the genre: ${req.params.name}.`);
});

app.get('/directors/:name', (req, res) => {
    res.send(`Successfully fetched details about the director: ${req.params.name}.`);
});

app.post('/users/register', (req, res) => {
    res.send('User registration was successful.');
});

app.put('/users/:username', (req, res) => {
    res.send(`Successfully updated the username for user: ${req.params.username}.`);
});

app.post('/users/:username/favorites', (req, res) => {
    res.send(`Successfully added a movie to ${req.params.username}'s list of favorites.`);
});

app.delete('/users/:username/favorites/:movieTitle', (req, res) => {
    res.send(`Successfully removed ${req.params.movieTitle} from ${req.params.username}'s list of favorites.`);
});

app.delete('/users/:username', (req, res) => {
    res.send(`Successfully deregistered user: ${req.params.username}.`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
