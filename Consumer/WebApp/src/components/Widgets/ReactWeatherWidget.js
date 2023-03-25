import ReactWeather, {  useOpenWeather  } from 'react-open-weather';
// 
export const ReactWeatherWidget = () => { 

  const { data, isLoading, errorMessage } = useOpenWeather  ({
    key: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
    lat: '48.137154',
    lon: '11.576124',
    lang: 'en',
    unit: 'M', // values are (M,S,I)
  });

  const customStyles = {
    fontFamily:  'Helvetica, sans-serif',
    gradientStart:  '#0181C2',
    gradientMid:  '#04A7F9',
    gradientEnd:  '#4BC4F7',
    locationFontColor:  '#FFF',
    todayTempFontColor:  '#FFF',
    todayDateFontColor:  '#B5DEF4',
    todayRangeFontColor:  '#B5DEF4',
    todayDescFontColor:  '#B5DEF4',
    todayInfoFontColor:  '#B5DEF4',
    todayIconColor:  '#FFF',
    forecastBackgroundColor:  '#FFF',
    forecastSeparatorColor:  '#DDD',
    forecastDateColor:  '#777',
    forecastDescColor:  '#777',
    forecastRangeColor:  '#777',
    forecastIconColor:  '#4BC4F7',
  };

  const dataX = {
    forecast: [
        {
          date: 'Fri 27 November',
          description: 'Clear',
          icon:'SVG PATH',
          temperature: { min: '-0', max: '6' },
          wind: '2',
          humidity: 60,
        },
        {
          date: 'Sat 28 November',
          description: 'Clouds',
          icon:'SVG PATH',
          temperature: { min: '-1', max: '6' },
          wind: '3',
          humidity: 67,
        },
       
    ],
    current: {
        date: 'Fri 27 November',
        description: 'Clear',
        icon:'SVG PATH',
        temperature: { current: '-2', min: -3, max: 1 },
        wind: '2',
        humidity: 90,
      },
  };
  return (
    <div style={{ width: "500px", height: "500px" }}>
    <ReactWeather
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel="Munich"
      unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
      showForecast
      
    />
    </div>
    
  );
};

