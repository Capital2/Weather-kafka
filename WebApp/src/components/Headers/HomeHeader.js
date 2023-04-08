/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

import Skeleton from "react-loading-skeleton";
import { SpinnerDotted } from "spinners-react";

function HomeHeader({ defaultWeahter }) { 
  return (
    <>
      <div
        className="page-header section-dark"
        style={{
          backgroundImage:
            "url(" + require("assets/img/antoine-barres.jpg") + ")",
        }}
      >
        <div className="filter" />
        <div className="content-center">
          <Container>
            <div className="title-brand">
              <h1 className="presentation-title">
                {defaultWeahter ? defaultWeahter.cityLabel : <SpinnerDotted style={{ color: "#fff", width: "250px", height: "250px" }} />}
              </h1>
              <div className="fog-low">
                <img alt="..." src={require("assets/img/fog-low.png")} />
              </div>
              <div className="fog-low right">
                <img alt="..." src={require("assets/img/fog-low.png")} />
              </div>
            </div>
            <h2 className="presentation-subtitle text-center">
              {defaultWeahter && (
                <>
                  <span>
                    Tempreture at your current location is{" "}
                    {defaultWeahter.main.temp}°C, Feels like{" "}
                    {defaultWeahter.main.feels_like}°C
                  </span>
                  <br />
                  <span>
                    Varies between {defaultWeahter.main.temp_min}°C and{" "}
                    {defaultWeahter.main.temp_max}°C
                  </span>
                </>
              )}
            </h2>
          </Container>
        </div>
        <div
          className="moving-clouds"
          style={{
            backgroundImage: "url(" + require("assets/img/clouds.png") + ")",
          }}
        />
        <h6 className="category category-absolute">
          Designed and coded by{" "}
         2IDL1 Students         
        </h6>
      </div>
    </>
  );
}

export default HomeHeader;
