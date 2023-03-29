export const openWeatherOptions = {
  method: "GET",
  headers: {
    appid: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
  },
};

export const GEO_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
