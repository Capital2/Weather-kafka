import React, { useEffect, useCallback } from "react";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka1:9092", "kafka2:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

export default function KafkaConsumer() {
  // declare the async function to handle the kafka
  const handleKafkaConsumer = useCallback(async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("We read from the topic")
        console.log({
          value: message.value.toString(),
        });

        // Some extra work with the data read from the topic
        // ...
      },
    });
  }, []);

  // the useEffect is only there to call `handleKafkaConsumer` at the right time
  useEffect(() => {
    handleKafkaConsumer()
      // make sure to catch any error
      .catch(console.error);
  }, [handleKafkaConsumer]);

  return consumer;
}
