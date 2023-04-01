import React from "react";

// reactstrap components
import {
  Button,
  Label,
  FormGroup,
  Input,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  Form,
} from "reactstrap";

// core components
import Navbar from "components/Navbar/Navbar"
import DashboardPageHeader from "components/Headers/DashboardPageHeader.js";
import Footer from "components/Footer/Footer";

// Async select
import { SearchCity } from "./SearchCity";

// Import the widgets


function DashboardPage() { 
  document.documentElement.classList.remove("nav-open");
  React.useEffect(() => {
    document.body.classList.add("landing-page");
    return function cleanup() {
      document.body.classList.remove("landing-page");
    };
  });
  return (
    <>
      <Navbar />
      <DashboardPageHeader />
      <div className="section profile-content">
        <Container>
          <div className="owner">
            <div className="avatar">
              <img
                alt="..."
                className="img-circle img-no-padding img-responsive"
                src={require("assets/img/faces/joe-gardner-2.jpg")}
              />
            </div>
            <div className="area-search-section mb-3    ">
              <div
                className="area-search-bar mb-2"
                style={{ width: "50%", position: "relative", left: "25%" }}
              >
                <SearchCity />
              </div>
              <Button className="ml-2" color="secondary">
                Add
              </Button>
            </div>
          </div>
          <Row>
            <Col className="ml-auto mr-auto text-center" md="6">
              <p>
                The seach will be performed based on the citties supported by
                Open Weather, In case of error you can check the list of
                supported cities.
              </p>
              <br />
            </Col>
          </Row>
          <br />
          <hr />
          <Row>
            {/* <Col md="6">
              <ReactWeatherWidget />
            </Col>
            <Col md="6">
              <ReactWeatherWidget />
            </Col>
            <Col md="6">
              <ReactWeatherWidget />
            </Col>
            <Col md="6">
              <ReactWeatherWidget />
            </Col> */}
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default DashboardPage;
