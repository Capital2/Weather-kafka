import React, { useEffect, useState } from "react";

import HomeHeader from "components/Headers/HomeHeader";
import { Container, Row, Col, Button } from "reactstrap";

import Search from "components/Search/Search";
import CurrentWeather from "components/CurrentWeather/CurrentWeather";
import Forecast from "components/Forecast/Forecast";
import WeatherMap from "components/WeatherMap/WeatherMap";

const Home = () => {
  const [defaultWeahter, setDefaultWeather] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alertWeather, setAlertWeather] = useState(null);

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
        setAlertWeather({ cityLabel: searchDataValue.label, ...alertResponse })
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <HomeHeader />
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
        <WeatherMap data={{ currentData: currentWeather, forecastData: forecast, alertData: alertWeather }} />
      </div>
    </>
  );
};

export default Home;
