
import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WeatherLayer = ({ weatherData }) => {
  const createIcon = (iconCode) => {
    return L.icon({
      iconUrl: `http://openweathermap.org/img/w/${iconCode}.png`,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });
  };

  const getExtremeWeatherAlert = (weather) => {
    let extremeWeatherAlert = null;
    if (weather.hasOwnProperty("alerts") && weather.alerts.length > 0) {
      extremeWeatherAlert = weather.alerts[0];
    }
    return extremeWeatherAlert;
  };

  const createPopupContent = (weather) => {
    let extremeWeatherAlert = getExtremeWeatherAlert(weather);
    let popupContent = `<div>Temperature: ${weather.main.temp} &#8451;</div>
                        <div>Humidity: ${weather.main.humidity} %</div>
                        <div>Wind Speed: ${weather.wind.speed} m/s</div>`;
    if (extremeWeatherAlert) {
      popupContent += `<div>Alert: ${extremeWeatherAlert.event}</div>`;
    }
    return popupContent;
  };

  const createMarker = (weather) => {
    const marker = L.marker([weather.coord.lat, weather.coord.lon], {
      icon: createIcon(weather.weather[0].icon),
    });
    marker.bindPopup(createPopupContent(weather));
    return marker;
  };

  const markers = weatherData.map((weather) => createMarker(weather));

  return <>{markers}</>;
};

export default WeatherLayer;