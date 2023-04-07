import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useKafkaConsumer = (ipAddress, port) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const newSocket = io(`http://${ipAddress}:${port}`);
    setSocket(newSocket);

    // Messages section
    let localStorageMessages = localStorage.getItem("messages");
    if (localStorageMessages === null) {
      localStorage.setItem("messages", JSON.stringify(messages));
    } else {
      setMessages(JSON.parse(localStorageMessages));
    }

    // Subscriptions section
    let localStorageSubscriptions = localStorage.getItem("subscriptions");
    if (localStorageSubscriptions === null) {
      localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    } else {
      let parsedSubscriptions = JSON.parse(localStorageSubscriptions);      
      setSubscriptions([...parsedSubscriptions]);
    }

    return () => {
      newSocket.close();
    };
  }, []);

  // Messages synchronizer
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // Subscriptions synchornizer
  useEffect(() => {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  const subscribe = (topics) => {
    if (socket) {
      socket.emit("message", { type: "subscribe", topics });
    }
  };

  const unsubscribe = (topics) => {
    if (socket) {
      socket.emit("message", { type: "unsubscribe", topics });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("message", (message) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [message.topic]: message.data,
        }));
      });
    }
  }, [socket]);

  return { subscribe, unsubscribe, messages, subscriptions, setSubscriptions };
};

export default useKafkaConsumer;
