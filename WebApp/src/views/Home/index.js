import React, { useEffect, useState } from "react";

import HomeHeader from "components/Headers/HomeHeader";
import { Container, Row, Col, Button } from "reactstrap";

import Search from "components/Search/Search";
import CurrentWeather from "components/CurrentWeather/CurrentWeather";
import Forecast from "components/Forecast/Forecast";
import WeatherMap from "components/WeatherMap/WeatherMap";

import useKafkaConsumer from "hooks/useKafkaConsumer";
import { useAppState } from "hooks/useAppContext";

const Home = () => {
  const [defaultWeahter, setDefaultWeather] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alertWeather, setAlertWeather] = useState(null);

  const { subscribe, unsubscribe, messages } = useKafkaConsumer(
    process.env.REACT_APP_KAFKA_CONSUMER_IP,
    process.env.REACT_APP_KAFKA_CONSUMER_PORT
  );

  const {
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
  } = useAppState();

  // useEffect to to track if the default city state is not null to extract the topic name associated to it from the backend
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

          // Get data associated to that topic from the localStorage
          if (messages[data.topic_name]) {
            setDefaultWeather(messages[data.topic_name]);
          }

          // Subscribe to my default app city
          // Before subscribing check if there is data alredy set in the localstorage
          subscribe([data.topic_name]);
        })
        .catch((error) => console.error(error));
    }
  }, [defaultCity]);

  // useEffect to manage the subcriptions cleanup
  // useEffect(() => {
  //   // Subscribe to Kafka topics when component mounts
  //   // subscribe(["P36D847569TP11D09386"]);

  //   return () => {
  //     // Unsubscribe from Kafka topics when component unmounts
  //     unsubscribe(["P36D847569TP11D09386"]);
  //   };
  // }, [subscribe, unsubscribe]);

  const onSearchChange = (searchDataValue) => {
    // Extracting the latitude and longitude from the searchDataValue
    const [lat, lon] = searchDataValue.value.split("$");

    const currentWeatherFetch = fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`
    );
    const alertWeatherFetch = fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
    );

    Promise.all([currentWeatherFetch, forecastFetch, alertWeatherFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();
        const alertResponse = await response[2].json();

        setCurrentWeather({
          cityLabel: searchDataValue.label,
          ...weatherResponse,
        });
        setForecast({ cityLabel: searchDataValue.label, ...forecastResponse });
        console.log("alerts weather response");
        console.log(alertResponse);
        setAlertWeather({ cityLabel: searchDataValue.label, ...alertResponse });
      })
      .catch((error) => console.error(error));
  };

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
              <p className="description">
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
                View Demo Icons
              </Button>
              <Button
                className="btn-round ml-1"
                color="danger"
                href="https://nucleoapp.com/?ref=1712"
                outline
                target="_blank"
              >
                View All Icons
              </Button>
            </Col>
            {currentWeather && (
              <Col lg="6" md="12">
                <CurrentWeather data={currentWeather} />
              </Col>
            )}
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
            {forecast && (
              <Col className="ml-auto mr-auto text-center" md="12">
                <Forecast data={forecast} />
              </Col>
            )}
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
          </Row>
        </Container>
        <WeatherMap
          data={{
            currentData: currentWeather,
            forecastData: forecast,
            alertData: alertWeather,
          }}
        />
      </div>
    </>
  );
};

export default Home;
