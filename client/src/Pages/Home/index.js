import "../../styles/common.css";
import "./Home.css";
import { Button, Row, Col } from "react-bootstrap";
import sample from "../../assets/imgs/sample.webp";
import developers from "../../assets/imgs/Developers.jpg";
import Ka from "../../assets/imgs/Ka1.jpg";
import QA from "../../assets/imgs/QA.jpg";
import Thanh from "../../assets/imgs/Thanh.jpg";
import Hao from "../../assets/imgs/Hao.jpg";
import AreYouOke from "../../assets/imgs/AreYouOke.jpg";
import firstPic from "../../assets/imgs/firstPic.jpg";
import secondPic from "../../assets/imgs/secondPic.jpg";
import thirdPic from "../../assets/imgs/thirdPic.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function Home() {
  return (
    <div className="container flex-grow-1 fade-in">
      <Row className="mt-4">
        <Col>
          <h1 className="fw-bolder fs-2 gradient-text">GUGUGAGA</h1>
          <p className="opacity-75 fs-5 text">Write your life</p>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={firstPic} className=" img-fluid img " alt="firstPic 1" />
              </div>
              <div className="carousel-item">
                <img src={secondPic} className=" img-fluid img " alt="secondPic 2" />
              </div>
              <div className="carousel-item">
                <img src={thirdPic} className=" img-fluid img" alt="thirdPic 3" />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </Col>
      </Row>

      <Row className="second align-items-center">
        <Col>
          <h2 className="fw-bold gradient-text">Are you okay today?</h2>
          <Row>
            <p className="fw-bold">✨ Special Moments</p>
            <p className="opacity-75">
              Capture memorable experiences and small but meaningful moments in your day.
            </p>
          </Row>
          <Row>
            <p className="fw-bold">💭 Today's Thoughts</p>
            <p className="opacity-75">
              Share you feelings, thoughts, or anything you'd like to express right now.
            </p>
          </Row>
          <Row>
            <p className="fw-bold">🎯 Goals & Plans</p>
            <p className="opacity-75">
              Set new goals or track the progress of your ongoing plans.
            </p>
          </Row>
        </Col>
        <Col className="are-you-oke-container">
          <img
            src={AreYouOke}
            className="img-fluid img are-you-oke-img hover-effect"
            alt="AreYouOke"
          ></img>
        </Col>
      </Row>

      {/* Layout Responsive */}
      <Row>
        <h2 className="fw-bold gradient-text second text-center">Developers</h2>
      </Row>

      <Row className="justify-content-center mt-4">
        {/* Dùng 1 Row chung cho tất cả các Col */}
        <Col className="member text-center mt-4 hover-effect" xs={12} sm={6} md={4} lg={3}>
          <img
            src={QA}
            className="img-fluid member-img img"
            alt="Quốc Anh"
          ></img>
          <div className="description">
            <p className="fs-5 fw-bold">Leader</p>
            <p className="fw-bold">Quốc Anh</p>
            <p className="fw-bold opacity-50">AI</p>
          </div>
        </Col>

        <Col className="member text-center mt-4  hover-effect" xs={12} sm={6} md={4} lg={3}>
          <img src={Ka} className="img-fluid member-img img" alt="Ba Ka"></img>
          <div className="description">
            <p className="fs-5 fw-bold">Member</p>
            <p className="fw-bold">Ba Ka</p>
            <p className="fw-bold opacity-50">Fullstack</p>
          </div>
        </Col>

        <Col className="member text-center mt-4  hover-effect" xs={12} sm={6} md={4} lg={3}>
          <img src={Thanh} className="img-fluid member-img img" alt="Nguyệt Thanh"></img>
          <div className="description">
            <p className="fs-5 fw-bold">Member</p>
            <p className="fw-bold">Nguyệt Thanh</p>
            <p className="fw-bold opacity-50">Frontend</p>
          </div>
        </Col>

        <Col className="member text-center mt-4  hover-effect" xs={12} sm={6} md={4} lg={3} >
          <img src={Hao} className="img-fluid member-img img" alt="Vũ Hảo"></img>
          <div className="description">
            <p className="fs-5 fw-bold">Member</p>
            <p className="fw-bold">Vũ Hảo</p>
            <p className="fw-bold opacity-50">AI</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
