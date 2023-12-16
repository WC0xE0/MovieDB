const axios = require('axios');

class Movie {
  constructor(omdbJson, detailed = false) {
    if (detailed) {
      this.genres = omdbJson.Genre;
      this.director = omdbJson.Director;
      this.actors = omdbJson.Actors;
      this.plot = omdbJson.Plot;
      this.awards = omdbJson.Awards;
    }
    this.title = omdbJson.Title;
    this.year = omdbJson.Year;
    this.imdbId = omdbJson.imdbID;
    this.type = 'Movie';
    this.posterUrl = omdbJson.Poster;
  }
}

class MovieClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://www.omdbapi.com/';
  }

  async search(searchString) {
    try {
      const response = await axios.get(`${this.baseUrl}?s=${encodeURIComponent(searchString)}&type=movie&apikey=${this.apiKey}`);
      if (response.data.Search) {
        return response.data.Search.map(movieData => new Movie(movieData));
      } else {
        return {};
      }
      
    } catch (error) {
      console.error('Error searching for movies', error);
      throw error;
    }
  }

  async retrieveMovieById(imdbId) {
    try {
      const response = await axios.get(`${this.baseUrl}?i=${encodeURIComponent(imdbId)}&apikey=${this.apiKey}`);
      return new Movie(response.data, true);
    } catch (error) {
      console.error('Error retrieving movie', error);
      throw error;
    }
  }
}

module.exports = MovieClient;

