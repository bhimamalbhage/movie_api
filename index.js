const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Movie, User } = require("./models");

// app.use(morgan('common'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("common", { stream: accessLogStream }));

app.use(express.static("public"));

app.use(express.json());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

mongoose
  .connect("mongodb://localhost:27017/movieDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send("Welcome to the Movie API!");
});

app.get("/movies", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).send("Error retrieving movies");
  }
});

app.get("/movies/:name",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.name });
    if (!movie) return res.status(404).send("Movie not found");
    res.json(movie);
  } catch (err) {
    res.status(500).send("Error retrieving movie");
  }
});

app.get("/genres/:name",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const genre = await Movie.findOne({ "genre.name": req.params.name }, "genre");
    if (!genre) return res.status(404).send("Genre not found");
    res.json(genre.genre);
  } catch (err) {
    res.status(500).send("Error retrieving genre");
  } 
});

app.get("/directors/:name",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const director = await Movie.findOne({ "director.name": req.params.name }, "director");
    if (!director) return res.status(404).send("Director not found");
    res.json(director.director);
  } catch (err) {
    res.status(500).send("Error retrieving director");
  }
});


app.post("/users", async (req, res) => {
  try {
    const { username, email, Birthday, favoriteMovies, password } = req.body;
    const newUser = new User({ username, email, Birthday, favoriteMovies, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send("Error registering user");
  }
});

app.put("/users/:username", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send("User not found");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send("Error updating user");
  }
});

app.post("/users/:username/favorites/:movieId", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $addToSet: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send("Error adding to favorites");
  }
});

app.delete("/users/:username/favorites/:movieId", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send("Error removing from favorites");
  }
});

app.delete("/users/:username", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username });
    if (!user) return res.status(404).send("User not found");
    res.send("User deregistered");
  } catch (err) {
    res.status(500).send("Error deregistering user");
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Server listening on port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
