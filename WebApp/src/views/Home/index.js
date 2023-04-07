import React, { useEffect, useState } from "react";

import HomeHeader from "components/Headers/HomeHeader";
import { Container, Row, Col, Button } from "reactstrap";

import Search from "components/Search/Search";
import CurrentWeather from "components/CurrentWeather/CurrentWeather";
import Forecast from "components/Forecast/Forecast";
import WeatherMap from "components/WeatherMap/WeatherMap";

import useKafkaConsumer from "hooks/useKafkaConsumer";
import { useAppState } from "hooks/useAppContext";
import Skeleton from "react-loading-skeleton";

import {
  weather as weatherFake,
  forecast as forecastFake,
  alerts as alertsFake,
} from "data/fakeOpenWeatherAPIData";

const Home = () => {
  // States required for the different components
  const [defaultWeahter, setDefaultWeather] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alertWeather, setAlertWeather] = useState(null);
  const [searchingFor, setSearchingFor] = useState(null);
  const [subscriptionsTracker, setSubscriptionsTracker] = useState([]);

  // Flag to detect if we are fething from cache
  const [fromCache, setFromCache] = useState(false)

  // Methods to subscribe, unsubscribe to topics and the list of messages we got
  const { subscribe, unsubscribe, messages, subscriptions, setSubscriptions } =
    useKafkaConsumer(
      process.env.REACT_APP_KAFKA_CONSUMER_IP,
      process.env.REACT_APP_KAFKA_CONSUMER_PORT
    );

  // States and methods extracted from the App global state
  const {
    defaultCity,
    email,
    defaultTopic,
    topics,
    notifications,
    newNotifications,
    isAlert,
    setNotifications,
    setNewNotifications,
    setDefaultCity,
    setEmail,
    setDefaultTopic,
    setTopics,
    setIsAlert,
    cacheDataRetrieval,
    setCacheDataRetrieval
  } = useAppState();

  // useEffect to track if the default city state is not null to extract the topic name associated to it from the backend
  // Default city subscription section
  useEffect(() => {
    if (defaultCity !== null) {
      const [lat, lon] = defaultCity.value.split("$");

      fetch(
        `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/topics/manage_subscription/?lat=${lat}&lon=${lon}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Set the default topic name in the global app state
          setDefaultTopic(data.topic_name);
          // Check if the data already exists in the local storage
          if (messages[data.topic_name]) {
            // Update the cache flag
            setFromCache(true)
            // Set data of the default city
            setCurrentWeather({
              cityLabel: defaultCity.label,
              ...messages[data.topic_name].weather,
            });
            setForecast({
              cityLabel: defaultCity.label,
              ...messages[data.topic_name].forecast,
            });
            setAlertWeather({
              cityLabel: defaultCity.label,
              ...messages[data.topic_name].alerts,
            });
            setDefaultWeather({
              cityLabel: defaultCity.label,
              ...messages[data.topic_name].weather,
            });
          }
          // Subscribe to my default app city
          if (subscriptionsTracker.indexOf(data.topic_name) === -1) {
            subscribe([data.topic_name]);
            setSubscriptionsTracker([...subscriptionsTracker, data.topic_name]);
          }
          // Set searching state to my default city to see current, forecast and map widgets data related to the default user city
          setSearchingFor({
            topicName: data.topic_name,
            label: defaultCity.label,
          });
        })
        .catch((error) => console.error(error));
    }
  }, [defaultCity]);

  // useEffect to manage the subcriptions cleanup
  // Cleanup section
  useEffect(() => {
    subscribe([...subscriptions]);
    return () => {
      // Unsubscribe from Kafka topics when component unmounts
      let topics_names = [];
      let tmpMessages = { ...messages }      
      delete tmpMessages.lastTopicUpdated
      for (const property in tmpMessages) {
        topics_names.push(tmpMessages[property].topic_name);
      }
      if (topics_names.length > 0) {
        unsubscribe([...topics_names]);
      }
    };
  }, [subscribe, unsubscribe]);

  const onSearchChange = (searchDataValue) => {
    // Extracting the latitude and longitude from the searchDataValue
    const [lat, lon] = searchDataValue.value.split("$");    

    fetch(
      `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/topics/manage_subscription/?lat=${lat}&lon=${lon}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (subscriptionsTracker.indexOf(data.topic_name) === -1) {
          subscribe([data.topic_name]);
          setSubscriptionsTracker([...subscriptionsTracker, data.topic_name]);
        } else {         
          // The user is already subscribed to the topic data.topic_name
          // Check if we have already pulled data realted to that topic (old data stored in the messages array)
          if (messages[data.topic_name]) {
            // Set the data that we already have retreving data from cache
            setCurrentWeather({
              cityLabel: searchDataValue.label,
              ...messages[data.topic_name].weather,
            });
            setForecast({
              cityLabel: searchDataValue.label,
              ...messages[data.topic_name].forecast,
            });
            setAlertWeather({
              cityLabel: searchDataValue.label,
              ...messages[data.topic_name].alerts,
            });
          } else {
            // Let the user see a loading skeletons and wait until data is pushed from kafka to be consumed in the frontend
            setCurrentWeather(null);
            setForecast(null);
            setAlertWeather(null);
          }
        }
        // If new data came for that topic it will displayed immediatly
        console.log("Search HTTP call")
        console.log(data.topic_name)
        setSearchingFor({ ...searchDataValue, topicName: data.topic_name });
      })
      .catch((error) => console.error(error));
  };

  const handleSubscribe = () => {
    // To avoid duplicate subscription to the default city topic
    // We are always subscribed to our default city when the component mounts !!!
    if (searchingFor && searchingFor.topicName !== defaultTopic) {
      setSubscriptions([...subscriptions, searchingFor.topicName]);
    }
  };

  const handleUnSubscribe = () => {
    if (searchingFor) {
      let tmpSubscriptions = subscriptions.filter(
        (subscription) => subscription !== searchingFor.topicName
      );
      setSubscriptions(tmpSubscriptions);
    }
  };

  // Listen for upcomping messages from the kafka consumer
  useEffect(() => {
    // Real time notifications (Check if there is alerts)
    console.log("data coming in real time");
    console.log(messages);

    if (Object.keys(messages).length > 0 && !fromCache) {
      // Notification section
      // Going to be changed after the code integration to retreive data from messages["lastTopicUpdated"] ---> messages[messages["lastTopicUpdated"]].alerts
      if (typeof (messages[messages["lastTopicUpdated"]].alerts) !== "string") {
        // Add the shake notification animation
        if (!isAlert) {
          setIsAlert(true);
        }
        // Set the seen flag for each alert to false
        messages[messages["lastTopicUpdated"]].alerts.forEach(alert => alert.seen = false);
        // Update the notifications array
        setNotifications([...notifications, ...messages[messages["lastTopicUpdated"]].alerts]);
        // Update the notification number
        setNewNotifications(newNotifications + messages[messages["lastTopicUpdated"]].alerts.length);
      }

      // Update the current, forecast and map component section
     
      if (searchingFor !== null && messages[searchingFor.topicName]) {
        console.log("functions to trigger changes")
        console.log(messages[searchingFor.topicName])
        console.log("----")
        setCurrentWeather({
          cityLabel: searchingFor.label,
          ...messages[searchingFor.topicName].weather,
        });
        setForecast({ cityLabel: searchingFor.label, ...messages[searchingFor.topicName].forecast });
        (typeof (messages[searchingFor.topicName].alerts) !== "string") ? (setAlertWeather({ cityLabel: searchingFor.label, ...messages[searchingFor.topicName].alerts })) : (setAlertWeather({ cityLabel: searchingFor.label, ...[] }))
        // Check if the message that we receive belongs to the user's default city to update the home header component
        if (searchingFor.topicName === defaultTopic) {
          setDefaultWeather({
            cityLabel: searchingFor.label,
            ...messages[searchingFor.topicName].weather,
          });
        }
      }
    }
  }, [messages]);

  return (
    <>
      <HomeHeader defaultWeahter={defaultWeahter} />
      <div className="section section-dark">
        <Container>
          <Row>
            <Col lg="6" md="12">
              <h2 className="title">Search your desired city</h2>
              <br />
              <Search onSearchChange={onSearchChange} />
              <br />
              <p className="description text-left">
                Paper Kit comes with 100 custom icons made by our friends from
                NucleoApp. The official package contains over 2.100 thin icons
                which are looking great in combination with Paper Kit Make sure
                you check all of them and use those that you like the most.
              </p>
              <br />
              <Button
                className="btn-round"
                color="danger"
                href="/nucleo-icons"
                target="_blank"
                onClick={handleSubscribe}
                disabled={
                  searchingFor != null &&
                  (subscriptions.indexOf(searchingFor.topicName) !== -1 ||
                    searchingFor.topicName === defaultTopic)
                }
              >
                Subscribe
              </Button>
              <Button
                className="btn-round ml-1"
                color="danger"
                href="https://nucleoapp.com/?ref=1712"
                outline
                target="_blank"
                onClick={handleUnSubscribe}
                disabled={
                  searchingFor != null &&
                  (subscriptions.indexOf(searchingFor.topicName) === -1 ||
                    searchingFor.topicName === defaultTopic)
                }
              >
                Unsubscribe
              </Button>
            </Col>
            <Col lg="6" md="12">
              {currentWeather ? (
                <CurrentWeather data={currentWeather} />
              ) : (
                <div style={{ position: "relative", top: "50px" }}>
                  <Skeleton count={10} baseColor="#202020" />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>{" "}
      <div className="section section-dark">
        <Container>
          <Row>
            <Col className="ml-auto mr-auto text-center" md="8">
              <h2 className="title">5 Day weather forecast</h2>
              <p className="description">
                The kit comes with three pre-built pages to help you get started
                faster. You can change the text and images and you're good to
                go. More importantly, looking at them will give you a picture of
                what you can built with this powerful kit.
              </p>
            </Col>
            <Col className="ml-auto mr-auto text-center" md="12">
              {forecast ? (
                <Forecast data={forecast} />
              ) : (
                <div style={{ position: "relative", top: "20px" }}>
                  <Skeleton count={10} baseColor="#202020" />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
      <div className="section">
        <Container className="mb-4">
          <Row>
            <Col className="ml-auto mr-auto text-center" md="8">
              <h2 className="title">Map Visulaization</h2>
              <p className="description">
                The kit comes with three pre-built pages to help you get started
                faster. You can change the text and images and you're good to
                go. More importantly, looking at them will give you a picture of
                what you can built with this powerful kit.
              </p>
            </Col>
            <Col className="ml-auto mr-auto text-center" md="12">
              {currentWeather == null ||
                forecast == null ||
                alertWeather == null ? (
                <Skeleton count={10} baseColor="#202020" />
              ) : (
                <WeatherMap
                  data={{
                    currentData: currentWeather,
                    forecastData: forecast,
                    alertData: alertWeather,
                  }}
                />
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;
