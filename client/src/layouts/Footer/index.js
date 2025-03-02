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
            <Row className="">
                <Col className="d-flex flex-column justify-content-around item1">
                    <h2>Gugugaga</h2>
                    <div >
                        <FontAwesomeIcon icon={faYoutube} className="icon"/>
                        <FontAwesomeIcon icon={faGithub} className="icon"/>
                        <FontAwesomeIcon icon={faFacebook} className="icon"/>
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