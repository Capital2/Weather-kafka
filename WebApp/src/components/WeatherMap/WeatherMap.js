import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "styles/WeatherMap.css";
import marker from "assets/img/map/Location.svg";
import { Icon } from "leaflet";

import Forecast from "components/Forecast/Forecast";

const myIcon = new Icon({
  iconUrl: marker,
  iconSize: [32, 32],
});


const WeatherMap = ({ data }) => {
  const { currentData, forecastData, alertData } = data;
  const [center, setCenter] = useState({
    lat: currentData !== null ? currentData.coord.lat : 0,
    lon: currentData !== null ? currentData.coord.lon : 0,
  });
  const [zoom, setZoom] = useState(13);

  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }
  
  useEffect(() => {
    if (currentData !== null) {
      setCenter({
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      });
    }
  }, [currentData]);

  // if (currentData == null || forecastData == null || alertData == null) {
  //   return null;
  // }
  console.log("data written to the map component")
  console.log(data)
  return (
    <MapContainer center={center} zoom={zoom}>
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {currentData !== null && (
        <Marker
          position={[currentData.coord.lat + (Math.random() - 0.5) * 0.01, currentData.coord.lon + (Math.random() - 0.5) * 0.01]}
          icon={myIcon}
          draggable={true}
        >
          <Popup className="current-forecast-weather-popup">
            <div className="current-forecast-weather">
              <div>
                <h2>{currentData.name}</h2>
                <p>
                  Temperature: {Math.round(currentData.main.temp - 273.15)}°C
                </p>
                <p>Humidity: {currentData.main.humidity}%</p>
                <p>Wind Speed: {currentData.wind.speed} m/s</p>
                <p>Weather: {currentData.weather[0].main}</p>
              </div>
              <Forecast data={forecastData} />
            </div>
          </Popup>
        </Marker>
      )}
      {alertData !== null && alertData.alerts !== undefined && (
        <>
          {alertData.alerts.map((alert) => (
            <Marker
              key={alert.event}
              position={[alertData.lat, alertData.lon]}
              icon={myIcon}
              draggable={true}
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
