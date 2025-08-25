const axios = require("axios");
require("dotenv").config();

const languages = ["vi", "en", "ja", "zh", "fr"];

/**
 * get movie by curent date
 * @param {string} date YYYY-MM-DD
 */
async function fetchMoviesByDate(date) {
  const allMovies = [];

  for (const lang of languages) {
    try {
      const response = await axios.get(process.env.BASE_URL, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: lang,
          "primary_release_date.gte": date,
          "primary_release_date.lte": date,
          sort_by: "popularity.desc",
        },
      });

      const movies = response.data.results;

      const filteredMovies = movies
        .filter((movie) => {
          return (
            movie.title &&
            movie.title.trim() !== "" &&
            movie.title !== movie.original_title
          );
        })
        .map((movie) => ({
          ...movie,
          language: lang,
        }));

      allMovies.push(...filteredMovies);

      console.log(
        `[${lang}] Fetched ${filteredMovies.length} translated movies.`
      );
    } catch (error) {
      console.error(
        `Error fetching movies for language ${lang}:`,
        error.message
      );
    }
  }

  return allMovies;
}

module.exports = { fetchMoviesByDate };
