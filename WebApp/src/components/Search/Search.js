import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

const Search = ({ onSearchChange }) => {
  // State that holds the typed value of the input field
  const [searchData, setSearchData] = useState(null);

  // Function to handle the changes in the HTML input field
  const handleSearchDataChange = (searchDataValue) => {
    setSearchData(searchDataValue);
    // Pass the data to the parent component
    onSearchChange(searchDataValue);
  };

  // Function to parse the data returned from the openweather api
  const parseData = (data) => {  
    return {
        options: data.map((city) => {
            return {
                value: `${city.lat}$${city.lon}`,
                label: `${city.name} ${city.state} ${city.country}`
            }
        })
    }
  }

  // Function to load the options from the openweather api
  const loadOptions = (searchDataInputValue) => {
    return fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${searchDataInputValue}&limit=5&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
    )
      .then((response) => response.json())
      .then((response) => parseData(response))
      .catch((error) => console.error(error));
  };
  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={searchData}
      onChange={handleSearchDataChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
