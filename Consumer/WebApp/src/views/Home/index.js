import React, { useEffect, useState } from "react";

import Search from "components/Search/Search";
import HomeHeader from "components/Headers/HomeHeader";
import { Container, Row, Col } from "reactstrap";

const Home = () => {
  document.documentElement.classList.remove("nav-open");
  useEffect(() => {
    document.body.classList.add("home-page");

    // Check if the user already configured his default city
    console.log("component mount ");
    let defaultCity = localStorage.getItem("defaultCity");
    console.log(defaultCity);

    return function cleanup() {
      document.body.classList.remove("home-page");
    };
  });

  const onSearchChange = (searchDataValue) => {
    console.log(searchDataValue)
  }

  return (
    <>
      <HomeHeader />
      <Container className="mt-4">
        <Row>
          <Col className="ml-auto mr-auto" lg="4">
          <Search onSearchChange={onSearchChange} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
