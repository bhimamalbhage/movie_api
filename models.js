const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: { type: String, required: true },
  genre: {
    name: { type: String, required: true },
    description: { type: String }
  },
  director: {
    name: { type: String, required: true },
    bio: { type: String },
    birthYear: { type: Number },
    deathYear: { type: Number }
  },
  year: { type: Number, required: true },
  rating: { type: Number, required: true },
  cast: [{ type: String }],
  duration: { type: Number, required: true },
},
);

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  Birthday: { type: Date },
  password: { type: String },
  favoriteMovies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Movie, User };
