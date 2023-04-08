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
  }, [subscribe]);

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
          // Display to the user loading screens
          setCurrentWeather(null);
          setForecast(null);
          setAlertWeather(null);
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
        console.log("Search HTTP response")
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

      fetch(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/topics/add_subscriber/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, city: defaultTopic })
      })
        .then(response => response.json())
        .then(data => {
          console.log("user email subscribed successfully")
        })
        .catch(error => {
          // handle error
          console.error("Error occured while sending the user email")
        });
    }


  };

  const handleUnSubscribe = () => {
    if (searchingFor) {
      // Manage the subscriotions (array that I use to load the topics from locaStorage to perform auto subscriptions)
      let tmpSubscriptions = subscriptions.filter(
        (subscription) => subscription !== searchingFor.topicName
      );
      setSubscriptions(tmpSubscriptions);

      // Unsubscribe from the socket
      unsubscribe([searchingFor.topicName])

      
      fetch(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/topics/delete_subscriber/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, city: defaultTopic })
      })
        .then(response => response.json())
        .then(data => {
          console.log("user unsubscribed successfully")
        })
        .catch(error => {
          // handle error
          console.error("Error while unsbscribing")
        });
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


    }
  }, [messages]);

  useEffect(() => {
    // Update the current, forecast and map component section
    if (searchingFor !== null && messages[searchingFor.topicName]) {
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
  }, [messages, searchingFor])

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
                Our intuitive search field allows you to effortlessly browse information about cities around the world. Whether you're looking for travel guides, local attractions, or up-to-date weather forecasts, simply type in the name of the city you're interested in and let our powerful search engine do the work. Get ready to explore the world, one city at a time.
              </p>
              <br />
              <Button
                className="btn-round"
                color="danger"
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
                outline
                onClick={handleUnSubscribe}
                disabled={searchingFor != null && searchingFor.topicName === defaultTopic}
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
              <p className="description text-center">
                Get ahead of the weather with our comprehensive 5-day forecast. Plan your activities, prepare for any changes in temperature, and stay up-to-date on the latest conditions in your area. With accurate and reliable forecasts, you can make the most of your day, rain or shine.
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
              <p className="description text-center">
                Explore the world like never before with our interactive map visualization. Zoom in, zoom out, and discover new places with ease. With real-time updates and detailed information, you can navigate with confidence and explore the world in a whole new way. Whether you're planning your next vacation or just curious about the world around you, our map visualization is the perfect tool for any adventure.
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
