require("dotenv").config();
const { Kafka } = require("kafkajs");
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let host = process.env.KAFKA_BROKER_IP 
let port = process.env.KAFKA_BROKER_PORT 

let id = 0
const kafka = new Kafka({
  clientId: "my-app",
  brokers: [`${host}:${port}`],  
});

// Map socket connections to Kafka consumers
const consumers = new Map();

// Handle socket connections
io.on("connection", (socket) => {
  console.log("Socket connected");
  id++
  // Initialize an empty list of consumers for this socket connection
  consumers.set(socket.id, []);

  // Handle incoming messages from the client
  socket.on("message", async (message) => {    
    const { type, topics } = message;
    
    if (type === "subscribe") {      
      // Create a Kafka consumer for each topic specified by the client
      topics.forEach(async (topic) => {
        console.log(`Creating Kafka consumer for topic ${topic}`);

        const consumer = kafka.consumer({ groupId: `test-group-${id}` });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });

        // Add the consumer to the map of consumers for this socket connection
        consumers.set(socket.id, [
          ...(consumers.get(socket.id) || []),
          { topic, consumer },
        ]);
        
        console.log("Consumers list");
        console.log(consumers);

        // Listen for incoming messages from Kafka

        // For each message function
        // await consumer.run({
        //   eachMessage: async ({ message }) => {
        //     console.log(`Received message on topic ${topic}: ${message.value.toString()}`);
        //     // Send the message to the connected socket client
        //     socket.emit('message', { topic, data: message.value.toString() });
        //   }
        // });

        // For each batch function
        await consumer.run({
          eachBatchAutoResolve: true,
          eachBatch: async ({
            batch,
            resolveOffset,
            heartbeat,
            commitOffsetsIfNecessary,
            uncommittedOffsets,
            isRunning,
            isStale,
            pause,
          }) => {         
            console.log("data consumed")  
            console.log(batch.messages)
            let lastMsg =
              batch.messages[batch.messages.length - 1].value.toString();
            socket.emit("message", { topic, data: lastMsg });
          },
        });

        // Handle errors and close the consumer on disconnect
        consumer.on("consumer.crash", (error) => {
          console.error(
            `Error in Kafka consumer for topic ${topic}: ${error.message}`
          );
          consumer.disconnect();
          consumers.set(
            socket.id,
            consumers.get(socket.id).filter((c) => c.topic !== topic)
          );
        });
      });
    } else if (type === "unsubscribe") {
      // Find the consumers associated with the specified topics and close them
      topics.forEach((topic) => {
        const consumer = consumers
          .get(socket.id)
          .find((c) => c.topic === topic)?.consumer;
        if (consumer) {
          console.log("component will unmount delete the consumer");
          consumer.disconnect();
          consumers.set(
            socket.id,
            consumers.get(socket.id).filter((c) => c.topic !== topic)
          );

          console.log("after delete lel consumer");
          console.log(consumers);
        }
      });
    }
  });

  // Handle socket disconnections
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    // Close all Kafka consumers associated with this socket connection
    consumers.get(socket.id).forEach((c) => c.consumer.disconnect());
    consumers.delete(socket.id);
  });
});

server.listen(8080, () => {
  console.log(
    `Server listening on localhost:8080`
  );
});
