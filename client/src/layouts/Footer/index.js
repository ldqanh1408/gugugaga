import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faGithub,
    faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import '../../styles/common.css';
import { Row, Col } from "react-bootstrap";

const Footer = () => {
    return (
        <div className="footer">
            <Row className="container">
                <Col>
                    <h2>Gugugaga</h2>
                    <div>
                        <i>{faYoutube}</i>
                    </div>
                </Col>
                <Col className="d-flex">
                    <Col className="d-flex flex-column align-items-center">
                        <h6>Technology</h6>
                        <p>Page</p>
                        <p>Page</p>
                        <p>Page</p>
                    </Col>
                    <Col className="d-flex flex-column align-items-center">
                        <h6>Technology</h6>
                        <p>Page</p>
                        <p>Page</p>
                        <p>Page</p>
                    </Col>
                    <Col className="d-flex flex-column align-items-center">
                        <h6>Technology</h6>
                        <p>Page</p>
                        <p>Page</p>
                        <p>Page</p>
                    </Col>
                </Col>
            </Row>
        </div>
    );
};

export default Footer;