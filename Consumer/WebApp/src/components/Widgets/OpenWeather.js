import React from "react";
import ReactWeather, { useOpenWeather } from "react-open-weather";

import logo from './logo.svg'

export const OpenWeather = () => {
  //   const { data, isLoading, errorMessage } = useOpenWeather({
  //     key: "YOUR-API-KEY",
  //     lat: "48.137154",
  //     lon: "11.576124",
  //     lang: "en",
  //     unit: "metric", // values are (metric, standard, imperial)
  //   });

  return (
    <ReactWeather
      isLoading={false}
      //   errorMessage={errorMessage}
      //   data={data}
      data={{
        forecast: [
          {
            date: "Fri 27 November",
            description: "Clear",
            icon: "/assets/img/clouds/cloud-with-rain.svg",
            temperature: { min: "-0", max: "6" },
            wind: "2",
            humidity: 60,
          },
          {
            date: "Sat 28 November",
            description: "Clouds",
            icon: "",
            temperature: { min: "-1", max: "6" },
            wind: "3",
            humidity: 67,
          },
        ],
        current: {
          date: "Fri 27 Novemberz",
          description: "Clear",
          icon: "./logo.svg",
          temperature: { current: "-2", min: -3, max: 1 },
          wind: "2",
          humidity: 90,
        },
      }}
      lang="en" 
      locationLabel="Munich"
      unitsLabels={{ temperature: "C", windSpeed: "Km/h" }}
      showForecast
    />
  );
};

