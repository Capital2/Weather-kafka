import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useKafkaConsumer = (ipAddress, port) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    const newSocket = io(`http://${ipAddress}:${port}`);

    setSocket(newSocket);

    let localStorageMessages = localStorage.getItem("messages");
    if (localStorageMessages === null) {
      localStorage.setItem("messages", JSON.stringify(messages));
    } else {
      setMessages(JSON.parse(localStorageMessages));
    }

    let localStorageSubscriptions = localStorage.getItem("subscriptions");
    if (localStorageSubscriptions === null) {
      localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    } else {
      // Loop through the subscriptions array and subscribe to each topic
      let parsedSubscriptions = JSON.parse(localStorageSubscriptions)
      console.log("ii")
      console.log(parsedSubscriptions)
      subscribe([...parsedSubscriptions])
      setSubscriptions(parsedSubscriptions)
    }

    return () => {
      newSocket.close()
      syncToLocalStorage()
    }
  }, []);

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

  const syncToLocalStorage = () => {
    localStorage.setItem("messages", JSON.stringify(messages));
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }

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
