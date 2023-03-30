import React, { useRef } from "react";
// nodejs library that concatenates strings
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
} from "reactstrap";
import { Sidebar } from "../Sidebar/Sidebar";

function AppNavbar({ toggleInitModal }) {
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [navbarCollapse, setNavbarCollapse] = React.useState(false);

  const sidebarRef = useRef();
  const toggleSidebar = () => {
    sidebarRef.current.toggleDrawer();
  };

  const toggleNavbarCollapse = () => {
    setNavbarCollapse(!navbarCollapse);
    document.documentElement.classList.toggle("nav-open");
  };

  React.useEffect(() => {
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 299 ||
        document.body.scrollTop > 299
      ) {
        setNavbarColor("");
      } else if (
        document.documentElement.scrollTop < 300 ||
        document.body.scrollTop < 300
      ) {
        setNavbarColor("navbar-transparent");
      }
    };

    window.addEventListener("scroll", updateNavbarColor);

    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });
  return (
    <>
      <Sidebar ref={sidebarRef} />
      <Navbar className={classnames("fixed-top", navbarColor)} expand="lg">
        <Container>
          <div className="navbar-translate">
            <NavbarBrand
              data-placement="bottom"
              href="/index"
              target="_blank"
              title="Coded by Creative Tim"
            >
              Paper Kit React
            </NavbarBrand>
            <button
              aria-expanded={navbarCollapse}
              className={classnames("navbar-toggler navbar-toggler", {
                toggled: navbarCollapse,
              })}
              onClick={toggleNavbarCollapse}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <Collapse
            className="justify-content-end"
            navbar
            isOpen={navbarCollapse}
          >
            <Nav navbar>
              <NavItem>
                <NavLink
                  data-placement="bottom"
                  href="#"
                  title="Notifications"
                  onClick={toggleSidebar}
                >
                  <i className="fa fa-bell" />
                  <p className="d-lg-none">Notifications</p>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  data-placement="bottom"
                  href="#"
                  title="Configuration"
                  onClick={toggleInitModal}
                >
                  <i className="fa fa-cog" />
                  <p className="d-lg-none">Configuration</p>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  data-placement="bottom"
                  href="https://www.github.com/CreativeTimOfficial/paper-kit-react?ref=creativetim"
                  target="_blank"
                  title="Star on GitHub"
                >
                  <i className="fa fa-github" />
                  <p className="d-lg-none">GitHub</p>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="https://demos.creative-tim.com/paper-kit-react/#/documentation?ref=pkr-index-navbar"
                  target="_blank"
                >
                  <i className="nc-icon nc-book-bookmark" /> Documentation
                </NavLink>
              </NavItem>
              <NavItem>
                <Button
                  className="btn-round"
                  color="danger"
                  href="https://www.creative-tim.com/product/paper-kit-pro-react?ref=pkr-index-navbar"
                  target="_blank"
                >
                  <i className="nc-icon nc-spaceship"></i> Upgrade to Pro
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AppNavbar;
