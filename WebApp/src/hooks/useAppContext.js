import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const [data, setData] = useState("default data");

  const [defaultCity, setDefaultCity] = useState(null); // Default city object have label / value that contains lat and log
  const [email, setEmail] = useState(null); // user email
  const [defaultTopic, setDefaultTopic] = useState(null); // The default topic name
  const [topics, setTopics] = useState(null); // list of topics extracted from localstorage

  const [notifications, setNotifications] = useState([]); // The array that contains all notifications
  const [newNotifications, setNewNotifications] = useState(0); // THe number of new notifications
  const [isAlert, setIsAlert] = useState(false); // Flag to track when to notify the user that he have new notifications
  const [cacheDataRetrieval, setCacheDataRetrieval] = useState(true);

  const pushData = (newData) => {
    setData(newData);
  };

  useEffect(() => {
    // This function will be called after the component is mounted
    let localStorageNotifications = localStorage.getItem("notifications");
    if (localStorageNotifications === null) {
      localStorage.setItem("notifications", JSON.stringify([]));
    } else {
      // Rebuild the global app state from the stored data in the local storage
      let parsedLocalStorageNotifications = JSON.parse(
        localStorageNotifications
      );
      setNotifications([...parsedLocalStorageNotifications]);
      setNewNotifications(parsedLocalStorageNotifications.length);
    }
  }, []);

  useEffect(() => {
    // Write the unseen notifications to the localstorage
    let unseenNotifications = notifications.filter(
      (notification) => !notification.seen
    );

    localStorage.setItem("notifications", JSON.stringify(unseenNotifications));
  }, [notifications]);

  return {
    data,
    defaultCity,
    email,
    defaultTopic,
    topics,
    isAlert,
    notifications,
    newNotifications,
    cacheDataRetrieval,
    pushData,
    setDefaultCity,
    setEmail,
    setDefaultTopic,
    setTopics,
    setIsAlert,
    setNotifications,
    setNewNotifications,
    setCacheDataRetrieval,
  };
};

export const AppProvider = ({ children }) => {
  const appContext = useAppContext();

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

export const useAppState = () => {
  const {
    data,
    defaultCity,
    email,
    defaultTopic,
    topics,
    isAlert,
    notifications,
    newNotifications,
    cacheDataRetrieval,
    pushData,
    setDefaultCity,
    setEmail,
    setDefaultTopic,
    setTopics,
    setIsAlert,
    setNotifications,
    setNewNotifications,
    setCacheDataRetrieval
  } = useContext(AppContext);

  return {
    data,
    defaultCity,
    email,
    defaultTopic,
    topics,
    isAlert,
    notifications,
    newNotifications,
    cacheDataRetrieval,
    pushData,
    setDefaultCity,
    setEmail,
    setDefaultTopic,
    setTopics,
    setIsAlert,
    setNotifications,
    setNewNotifications,
    setCacheDataRetrieval
  };
};
