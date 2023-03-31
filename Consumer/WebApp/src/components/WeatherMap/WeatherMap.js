import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "styles/WeatherMap.css";
import marker from "assets/img/map/Location.svg";
import { Icon } from "leaflet";

import Forecast from "components/Forecast/Forecast";

const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
const myIcon = new Icon({
  iconUrl: marker,
  iconSize: [32, 32],
});

const WeatherMap = () => {
  const [center, setCenter] = useState({ lat: 51.5074, lng: 0.1278 }); // London
  // const [center, setCenter] = useState({ lat: 37.0902, lng: -95.7129 });
  const [zoom, setZoom] = useState(13);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alerts, setAlerts] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}` // London
        );
        const data = await res.json();
        console.log("Data 1");
        console.log(data);
        setWeather(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchForecastData = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=London&appid=${API_KEY}` // London
        );
        const data = await res.json();
        console.log("Data 2");
        console.log(data);
        setForecast(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAlertData = async () => {
      try {
        const res = await fetch(
         // `https://api.openweathermap.org/data/2.5/onecall?lat=${51.5074}&lon=${0.1278}&exclude=minutely,hourly,daily&appid=${API_KEY}` // London
         `https://api.openweathermap.org/data/2.5/onecall?lat=${center.lat}&lon=${center.lng}&exclude=minutely,hourly,daily&appid=${API_KEY}`
        );
        const data = await res.json();
        console.log("Data 3");
        console.log(data);
        setAlerts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeatherData();
    fetchForecastData();
    fetchAlertData();
  }, []);

  if (weather == null || forecast == null || alerts == null) {
    return null;
  }
  return (
    <MapContainer center={center} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {weather && (
        <Marker position={[weather.coord.lat, weather.coord.lon]} icon={myIcon}>
          <Popup className="current-forecast-weather-popup">
            <div className="current-forecast-weather">
              <div>
                <h2>{weather.name}</h2>
                <p>Temperature: {Math.round(weather.main.temp - 273.15)}°C</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
                <p>Weather: {weather.weather[0].main}</p>
              </div>
              <Forecast data={forecast} />
            </div>
          </Popup>
        </Marker>
      )}
      {/* {forecast && (
        <>
          {forecast.list.map((item, index) => (
            <Marker
              key={item.dt}
              position={[forecast.city.coord.lat, forecast.city.coord.lon]}
              icon={myIcon}              
            >
              <Popup>
                <div>
                  <h2>{item.dt_txt}</h2>
                  <p>Temperature: {Math.round(item.main.temp - 273.15)}°C</p>
                  <p>Humidity: {item.main.humidity}%</p>
                  <p>Wind Speed: {item.wind.speed} m/s</p>
                  <p>Weather: {item.weather[0].main}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </>
      )} */}
      {alerts.alerts !== undefined && (
        <>
          {alerts.alerts.map((alert) => (
            <Marker
              key={alert.event}
              position={[alerts.lat, alerts.lon]}
              icon={myIcon}
            >
              <Popup>
                <div>
                  <h2>{alert.event}</h2>
                  <p>{alert.description}</p>
                  <p>Effective: {new Date(alert.start * 1000).toString()}</p>
                  <p>Expires: {new Date(alert.end * 1000).toString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  );
};

export default WeatherMap;
