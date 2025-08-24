const cron = require("node-cron");
const { fetchMoviesByDate } = require("./service/tmdbService");
const { publishMovies } = require("./kafka/producer");

exports.handler = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    console.log("Fetching movies released on:", today);

    const movies = await fetchMoviesByDate(today);
    console.log(`Found ${movies.length} movies`);

    if (movies.length > 0) {
      console.log(`Publishing ${movies.length} movies to Kafka...`);
      await publishMovies(movies);
    }

    return { statusCode: 200, body: `Processed ${movies.length} movies.` };
  } catch (err) {
    console.error("Lambda failed:", err);
    return { statusCode: 500, body: "Error processing movies" };
  }
};

if (require.main === module) {
  const cronExp = "0 9 * * *";
  console.log("Starting cron job with schedule:", cronExp);

  cron.schedule(cronExp, async () => {
    console.log("Running daily movie job...");
    await exports.handler();
  });
}
