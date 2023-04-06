import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "styles/Forecast.css";

import { Card, ListGroup, ListGroupItem } from "reactstrap";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Forecast = ({ data }) => {
  const dayInAWeek = new Date().getDay();
  const forecastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length).concat(
    WEEK_DAYS.slice(0, dayInAWeek)
  );

  // console.log("Forecast days ", forecastDays);
  console.log("the forecast field")
  console.log(data.list)
  return (
    <>
      <label className="title">Daily</label>
      <Accordion allowZeroExpanded>
        {data.list !== undefined && data.list.splice(0, 7).map((item, index) => (
          <AccordionItem key={index}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className="daily-item">
                  <img
                    className="icon-small"
                    src={require(`assets/img/weather/${item.weather[0].icon}.png`)}
                    alt="Weather"
                  />
                  <label className="day">{forecastDays[index]}</label>
                  <label className="description">
                    {item.weather[0].description}
                  </label>
                  <label className="min-max">
                    {Math.round(item.main.temp_min)}°C /{" "}
                    {Math.round(item.main.temp_max)}°C
                  </label>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <Card className="day-details">
                <ListGroup flush>
                  <ListGroupItem>
                    <div className="daily-details-grid-item">
                      <label htmlFor="">Pressure</label>
                      <label htmlFor="">{item.main.pressure} hPa</label>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    {" "}
                    <div className="daily-details-grid-item">
                      <label htmlFor="">Humidity</label>
                      <label htmlFor="">{item.main.humidity}%</label>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="daily-details-grid-item">
                      <label htmlFor="">Clouds</label>
                      <label htmlFor="">{item.clouds.all}%</label>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                  <div className="daily-details-grid-item">
                    <label htmlFor="">Wind Speed</label>
                    <label htmlFor="">{item.wind.speed} m/s</label>
                  </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="daily-details-grid-item">
                      <label htmlFor="">Sea Level</label>
                      <label htmlFor="">{item.main.sea_level}m</label>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="daily-details-grid-item">
                      <label htmlFor="">Feels Like</label>
                      <label htmlFor="">
                        {Math.round(item.main.feels_like)}°C
                      </label>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card>             
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default Forecast;
