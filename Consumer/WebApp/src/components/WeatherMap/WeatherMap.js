import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

const WeatherMap = ({ apiKey }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Use axios to fetch the weather data from the OpenWeather API
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
      // `https://api.openweathermap.org/data/2.5/onecall?lat=51.5074&lon=0.1278&exclude=&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("data my man")
        console.log(response)
        setWeatherData(response)
      })
      .catch((error) => console.error(error));
  }, []);

  if (!weatherData) return null;

  const { lat, lon, timezone, current, daily, hourly, alerts } = weatherData;

  return (
    <MapContainer center={[weatherData.coord.lat, weatherData.coord.lon]} zoom={13} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[weatherData.coord.lat, weatherData.coord.lon]}>
        <Popup>
          <h2>{timezone}</h2>
          <p>Current Temperature: {weatherData.main.temp}°C</p>
          <p>Feels like: {weatherData.main.feels_like}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Pressure: {weatherData.main.pressure} hPa</p>
          {/* <p>UV Index: {current.uvi}</p> */}
          <p>Visibility: {weatherData.visibility} meters</p>
          <p>Wind: {weatherData.wind.speed} m/s</p>
          <p>
            Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
          </p>
          <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
        </Popup>
      </Marker>
     
          
    </MapContainer>
  );
};

export default WeatherMap;
