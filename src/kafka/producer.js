const { Kafka, Partitioners } = require("kafkajs");
const { kafkaBrokers, kafkaTopic } = require("../config/config");

const kafka = new Kafka({ brokers: kafkaBrokers });

// ✅ Use LegacyPartitioner to suppress warning and preserve old behavior
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

async function publishMovies(movies) {
  await producer.connect();
  for (const movie of movies) {
    await producer.send({
      topic: kafkaTopic,
      messages: [{ value: JSON.stringify(movie) }],
    });
  }
  console.log(
    `Published ${movies.length} movies to Kafka topic: ${kafkaTopic}`
  );
  await producer.disconnect();
}

module.exports = { publishMovies };
