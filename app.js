require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const MovieClient = require('./movieClient');
const Review = require('./models/Review');
const { errorMonitor } = require('events');
const e = require('express');

const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the 'views' directory to the 'templates' folder
app.set('views', path.join(__dirname, 'templates'));

// Instantiate MovieClient
const movieClient = new MovieClient(process.env.OMDB_API_KEY);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware for form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index'); // render the home page
});

app.get('/search', async (req, res) => {
  const { search } = req.query;
  try {
    const movies = await movieClient.search(search);
    res.render('searchResults', { movies, search });
  } catch (error) {
    res.render('error', { error: 'Error searching for movies' });
  }
});

app.get('/movie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // fetch movie basic details from database
    const movie = await movieClient.retrieveMovieById(id);
    // fetch reviews from database
    const reviews = await Review.find({ imdbId: id });    
    res.render('movieDetails', { movie, reviews });
  } catch (error) {
    console.error(error);
    res.render('error', { error: 'Error retrieving movie details' });
  }
});

app.post('/review/:imdbId', async (req, res) => {
  const { imdbId } = req.params;
  const { commenter, content } = req.body;
  const createdAt = Date.now();

  try {
    const newReview = new Review({ imdbId, commenter, content, createdAt });
    await newReview.save();
    res.redirect(`/movie/${imdbId}`);
  } catch (error) {
    console.error(error);
    res.render('error', { error: 'Error submitting review' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
