/*eslint-disable*/
import React from "react";

// reactstrap components
import { Row, Container } from "reactstrap";

function Footer() {
  return (
    <footer className="footer footer-black footer-white">
      <Container>
        <Row>
          <div className="credits ml-auto mr-auto text-center">
            <span className="copyright">
              © {new Date().getFullYear()}, made with{" "}
              <i className="fa fa-heart heart" /> by Achraf Ben Soltane, Moslem Gannoun, Mohamed Amine Ben Ammar, Fedi Takeli and Achref Samoud
            </span>
          </div>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
