require("dotenv").config();

module.exports = {
  tmdbApiKey: process.env.TMDB_API_KEY,
  kafkaBrokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
  kafkaTopic: process.env.KAFKA_TOPIC || "movies",
};
