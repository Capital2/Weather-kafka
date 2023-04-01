const kafka = require('kafka-node');
const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }});

const kafkaHost = 'localhost:9092';
const kafkaClient = new kafka.KafkaClient({ kafkaHost });

// Map socket connections to Kafka consumers
const consumers = new Map();

// Handle socket connections
io.on('connection', (socket) => {
  console.log('Socket connected');

  // Initialize an empty list of consumers for this socket connection
  consumers.set(socket.id, []);

  // Handle incoming messages from the client
  socket.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
    const { type, topics } = message;

    if (type === 'subscribe') {
      // Create a Kafka consumer for each topic specified by the client
      topics.forEach((topic) => {
        console.log(`Creating Kafka consumer for topic ${topic}`);

        const consumer = new kafka.Consumer(kafkaClient, [{ topic }]);

        // Add the consumer to the map of consumers for this socket connection
        consumers.set(socket.id, [...(consumers.get(socket.id) || []), { topic, consumer }]);

        // Listen for incoming messages from Kafka
        consumer.on('message', (message) => {
          console.log(`Received message on topic ${topic}: ${message.value}`);
          // Send the message to the connected socket client
          socket.emit('message', { topic, data: message.value });
        });

        // Handle errors and close the consumer on disconnect
        consumer.on('error', (error) => {
          console.error(`Error in Kafka consumer for topic ${topic}: ${error}`);
          consumer.close();
          consumers.set(socket.id, consumers.get(socket.id).filter(c => c.topic !== topic));
        });
      });
    } else if (type === 'unsubscribe') {
      // Find the consumers associated with the specified topics and close them
      topics.forEach((topic) => {
        const consumer = consumers.get(socket.id).find(c => c.topic === topic)?.consumer;
        if (consumer) {
          consumer.close();
          consumers.set(socket.id, consumers.get(socket.id).filter(c => c.topic !== topic));
        }
      });
    }
  });

  // Handle socket disconnections
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    // Close all Kafka consumers associated with this socket connection
    consumers.get(socket.id).forEach(c => c.consumer.close());
    consumers.delete(socket.id);
  });
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
