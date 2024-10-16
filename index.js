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
    { title: "The Silence of the Lambs", year: 1991, genre: "Thriller", description: "Psychological thriller" },
    { title: "The Prestige", year: 2006, genre: "Drama", description: "Drama with a focus on magic and illusion" },
    { title: "The Godfather", year: 1972, genre: "Crime", description: "Crime and mafia underworld" },
    { title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy", description: "Witty comedy with vibrant visuals" },
    { title: "Coco", year: 2017, genre: "Animation", description: "Animated story about family and heritage" },
    { title: "The Departed", year: 2006, genre: "Crime", description: "Crime drama with undercover agents" },
    { title: "Fight Club", year: 1999, genre: "Drama", description: "Cult classic exploring modern masculinity" },
    { title: "12 Years a Slave", year: 2013, genre: "Biography", description: "Historical biography about slavery" },
    { title: "Her", year: 2013, genre: "Romance", description: "Romantic sci-fi about AI and love" },
    { title: "La La Land", year: 2016, genre: "Musical", description: "Musical about love and dreams in LA" },
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
    res.send(`Successfully fetched details about the genre: ${req.params.name}.`);
});

app.get('/directors/:name', (req, res) => {
    res.send(`Successfully fetched details about the director: ${req.params.name}.`);
});

app.post('/users', (req, res) => {
    res.send('User registration was successful.');
});

app.put('/users/:username', (req, res) => {
    res.send(`Successfully updated the username for user: ${req.params.username}.`);
});

app.post('/users/:username/favorites/:movieId', (req, res) => {
    res.send(`Successfully added movie with ID ${req.params.movieId} to ${req.params.username}'s list of favorites.`);
});

app.delete('/users/:username/favorites/:movieId', (req, res) => {
    res.send(`Successfully removed movie with ID ${req.params.movieId} from ${req.params.username}'s list of favorites.`);
});

app.delete('/users/:username', (req, res) => {
    res.send(`Successfully deregistered user: ${req.params.username}.`);
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Server listening on port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
