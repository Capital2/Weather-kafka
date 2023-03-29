import React, { useState, useRef } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

// styles
import "bootstrap/scss/bootstrap.scss";
import "assets/scss/paper-kit.scss?v=1.3.0";
import "assets/demo/demo.css?v=1.3.0";

// pages
import Home from "views/Home";
import Dashboard from "views/Dashboard";

// Components
import Navbar from "components/Navbar/Navbar";
import Footer from "components/Footer/Footer";
import Init from "components/Init/Init";

export default function App() {
  // Refrence on  the init modal
  const initModalRef = useRef();
  // Wrapper function arround the function develped within the Init component to be passed to the navbar to allow the toggle of the init modal from the navbar component
  const toggleInitModal = () => {
    initModalRef.current.toggleInitModal();
  };
  return (
    <>
      <Init ref={initModalRef} />
      <Navbar toggleInitModal={toggleInitModal} />
      <div className="content">
        <BrowserRouter>
          <Switch>
            <Route path="/home" render={(props) => <Home {...props} />} />
            <Route
              path="/dashboard"
              render={(props) => <Dashboard {...props} />}
            />
            <Redirect to="/home" />
          </Switch>
        </BrowserRouter>
      </div>
      <Footer />
    </>
  );
}
