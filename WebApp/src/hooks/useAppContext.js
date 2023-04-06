import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const [data, setData] = useState("default data");

  const [defaultCity, setDefaultCity] = useState(null); // Default city object have label / value that contains lat and log
  const [email, setEmail] = useState(null); // user email
  const [defaultTopic, setDefaultTopic] = useState(null); // The default topic name
  const [topics, setTopics] = useState(null); // list of topics extracted from localstorage
  const [notifications, setNotifications] = ([]) // The array that contains all notifications
  const [isAlert, setIsAlert] = useState(false) // Flag to track when to notify the user that he have new notifications

  // For test purpose
  // useEffect(() => {
  //   console.log("values we got in the global state")
  //   console.log(defaultCity)
  //   console.log(email)
  // }, [])

  const pushData = (newData) => {
    setData(newData);
  };

  const addNotification = (notification) => {
    // Add new notification at the head of the array
    // ...
  }

  const deleteNotification = () => {
    // Delete a notification from the array of notifications based on the index
  }

  return {
    data,
    defaultCity,
    email,
    defaultTopic,
    topics,
    pushData,
    setDefaultCity,
    setEmail,
    setDefaultTopic,
    setTopics,
  };
};

export const AppProvider = ({ children }) => {
  const appContext = useAppContext();

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

export const useAppState = () => {
  const {  data,
    defaultCity,
    email,
    defaultTopic,
    topics,
    pushData,
    setDefaultCity,
    setEmail,
    setDefaultTopic,
    setTopics, } = useContext(AppContext);

  return {  data,
    defaultCity,
    email,
    defaultTopic,
    topics,
    pushData,
    setDefaultCity,
    setEmail,
    setDefaultTopic,
    setTopics, };
};
