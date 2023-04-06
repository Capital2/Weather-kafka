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

  // Methods to subscribe, unsubscribe to topics and the list of messages we got
  const { subscribe, unsubscribe, messages } = useKafkaConsumer(
    process.env.REACT_APP_KAFKA_CONSUMER_IP,
    process.env.REACT_APP_KAFKA_CONSUMER_PORT
  );

  // States and methods extracted from the App global state
  const {
    defaultCity,
    email,
    defaultTopic,
    topics,
    setDefaultCity,
    setEmail,
    setDefaultTopic,
    setTopics,
  } = useAppState();

  // useEffect to track if the default city state is not null to extract the topic name associated to it from the backend
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
          setSearchingFor({
            topicName: data.topic_name,
            label: defaultCity.label,
          });
        })
        .catch((error) => console.error(error));
    }
  }, [defaultCity]);

  // useEffect to manage the subcriptions cleanup
  // useEffect(() => {
  //   return () => {
  //     // Unsubscribe from Kafka topics when component unmounts
  //     let topics_names = Object.keys(messages).map(
  //       (message) => message.topic_name
  //     );
  //     console.log("topics names that im going to unsubscribe from");
  //     console.log(topics_names);

  //     if (topics_names.length > 0) {
  //       unsubscribe([...topics_names]);
  //     }
  //   };
  // }, [unsubscribe]);

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
            // // Set the data that we already have
            // setCurrentWeather({
            //   cityLabel: searchDataValue.label,
            //   ...messages[data.topic_name].weather,
            // });
            // setForecast({
            //   cityLabel: searchDataValue.label,
            //   ...messages[data.topic_name].forecast,
            // });
            // setAlertWeather({
            //   cityLabel: searchDataValue.label,
            //   ...messages[data.topic_name].alerts,
            // });

            // For test purpose
            setCurrentWeather({
              cityLabel: defaultCity.label,
              ...weatherFake,
            });
            setForecast({
              cityLabel: defaultCity.label,
              ...forecastFake,
            });
            setAlertWeather({
              cityLabel: defaultCity.label,
              ...alertsFake,
            });
            setDefaultWeather({
              cityLabel: defaultCity.label,
              ...weatherFake,
            });
            // End for test purpose
          } else {
            // Let the user see a loading skeletons
            setCurrentWeather(null);
            setForecast(null);
            setAlertWeather(null);
          }
        }
        // If new data came for that topic displayed immediatly
        setSearchingFor({ ...searchDataValue, topicName: data.topic_name });
      })
      .catch((error) => console.error(error));
  };

  // Listen for upcomping messages from the kafka consumer
  useEffect(() => {
    if (searchingFor !== null && messages[searchingFor.topicName]) {
      setCurrentWeather({
        cityLabel: searchingFor.label,
        ...weatherFake,
      });
      setForecast({ cityLabel: searchingFor.label, ...forecastFake });
      setAlertWeather({ cityLabel: searchingFor.label, ...alertsFake });
      // Check if the message that we receive belongs to the user's default city to update the home header component
      if (searchingFor.topicName === defaultTopic) {
        setDefaultWeather({
          cityLabel: searchingFor.label,
          ...weatherFake,
        });
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
              >
                Subscribe
              </Button>
              <Button
                className="btn-round ml-1"
                color="danger"
                href="https://nucleoapp.com/?ref=1712"
                outline
                target="_blank"
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
