import React, { useEffect, useState } from "react";

import Search from "components/Search/Search";
import CurrentWeather from "components/CurrentWeather/CurrentWeather";
import HomeHeader from "components/Headers/HomeHeader";
import { Container, Row, Col } from "reactstrap";

const Home = () => {
    
  const onSearchChange = (searchDataValue) => {
    console.log(searchDataValue);
  };

  return (
    <>
      <HomeHeader />
      <Container className="mt-4">
        <Row>
          <Col className="ml-auto mr-auto" lg="4">
            <Search onSearchChange={onSearchChange} />
          </Col>
        </Row>
        <Row>
          <Col className="ml-auto mr-auto" lg="12">
            <CurrentWeather />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
