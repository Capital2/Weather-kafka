import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";

import 'leaflet/dist/leaflet.css';
import "./WeatherMap.css";

const WeatherMap = () => {
  const [lat, setLat] = useState(51.505);
  const [lng, setLng] = useState(-0.09);
  const [zoom, setZoom] = useState(13);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
    };
    fetchData();
  }, [lat, lng]);

  return (
    <MapContainer center={[lat, lng]} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {weather && (
        <Marker position={[lat, lng]}>
          <Popup>
            <div>
              <h2>{weather.name}</h2>
              <p>{weather.weather[0].description}</p>
              <p>Temperature: {weather.main.temp} &deg;C</p>
              <p>Humidity: {weather.main.humidity} %</p>
              <p>Wind speed: {weather.wind.speed} m/s</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default WeatherMap