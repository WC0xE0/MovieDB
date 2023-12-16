const mongoose = require('mongoose');

// Define the Review schema
const reviewSchema = new mongoose.Schema({
  imdbId: {
    type: String,
    required: true
  },
  commenter: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model from the schema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
