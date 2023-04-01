import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const useKafkaConsumer = (ipAddress, port) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const newSocket = io(`http://${ipAddress}:${port}`);

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const subscribe = (topics) => {
    if (socket) {
      socket.emit('message', { type: "subscribe",  topics });
    }
  };

  const unsubscribe = (topics) => {
    if (socket) {
      socket.emit('message', { type: "unsubscribe", topics });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {       
        setMessages((prevMessages) => ({
          ...prevMessages,
          [message.topic]: message.data,
        }));
      });
    }
  }, [socket]);

  return { subscribe, unsubscribe, messages };
};

export default useKafkaConsumer;