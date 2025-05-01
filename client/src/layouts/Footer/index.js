import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faGithub,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import "../../styles/common.css";
import { Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <div className="footer py-4">
      <Row className="text-center text-md-start">
        <Col
          xs={12}
          md={4}
          className="d-flex flex-column align-items-center align-items-md-start mb-3"
        >
          
          
          <h2 className="footer-title">Gugugaga</h2>
          <div className="footer-icons">
            <FontAwesomeIcon icon={faYoutube} className="icon mx-2" />
            <FontAwesomeIcon icon={faGithub} className="icon mx-2" />
            <FontAwesomeIcon icon={faFacebook} className="icon mx-2" />
          </div>
        </Col>

        <Col
          xs={12}
          md={8}
          className="d-flex flex-wrap justify-content-around text-center text-md-start"
        >
          <Col className="d-flex flex-column align-items-center align-items-md-start mb-3">
            <h5 className="footer-section-title">Technology</h5>
            <p>React</p>
            <p>NodeJS</p>
            <p>Llama</p>
          </Col>
          <Col className="d-flex flex-column align-items-center align-items-md-start mb-3">
            <h5 className="footer-section-title">Information</h5>
            <p>Gugugaga</p>
            <p>4 members</p>
            <p>Second-year student</p>
          </Col>
          <Col className="d-flex flex-column align-items-center align-items-md-start mb-3">
            <h5 className="footer-section-title">Values</h5>
            <p>Stress Relief</p>
            <p>Mental Clarity</p>
            <p>Emotional Expression</p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
