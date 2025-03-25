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
import Carpy from "../../assets/imgs/carpy.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return (
    <div className="container flex-grow-1">
      <Row className="mt-4">
        <h1 className="fw-bolder text">GUGUGAGA</h1>
        <p className="opacity-75 text">Write your life</p>
        <Button className="btn text" href="note">Write</Button>
      </Row>

      <Row className="mt-4">
        <img src={Carpy} className="img-fluid img" alt="Carpy"></img>
      </Row>

      <Row className="second align-items-center">
        <Col>
          <h2 className="fw-bold">Hôm nay bạn ổn không ?</h2>
          <Row>
            <p className="fw-bold">✨ Khoảnh Khắc Đặc Biệt</p>
            <p className="opacity-75">
              Ghi lại những kỷ niệm đáng nhớ, những điều nhỏ bé nhưng ý nghĩa trong ngày của bạn.
            </p>
          </Row>
          <Row>
            <p className="fw-bold">💭 Suy Nghĩ Hôm Nay</p>
            <p className="opacity-75">
              Chia sẻ cảm xúc, suy nghĩ, hoặc bất kỳ điều gì bạn muốn bày tỏ ngay lúc này.
            </p>
          </Row>
          <Row>
            <p className="fw-bold">🎯 Mục Tiêu & Dự Định</p>
            <p className="opacity-75">
              Đặt ra mục tiêu mới hoặc theo dõi tiến trình của những kế hoạch đang thực hiện.
            </p>
          </Row>
        </Col>
        <Col>
          <img src={AreYouOke} className="img-fluid img" alt="AreYouOke"></img>
        </Col>
      </Row>

      {/* Layout Responsive */}
      <Row>
        <h2 className="fw-bold second text-center">Developers</h2>
      </Row>

      <Row className="justify-content-center mt-4">
        {/* Dùng 1 Row chung cho tất cả các Col */}
        <Col className="member text-center mt-4" xs={12} sm={6} md={4} lg={3}>
          <img src={QA} className="img-fluid member-img img" alt="Quốc Anh"></img>
          <div className="description">
            <p className="fs-5 fw-bold">Leader</p>
            <p className="fw-bold">Quốc Anh</p>
            <p className="fw-bold opacity-50">AI</p>
          </div>
        </Col>

        <Col className="member text-center mt-4" xs={12} sm={6} md={4} lg={3}>
          <img src={Ka} className="img-fluid member-img img" alt="Ba Ka"></img>
          <div className="description">
            <p className="fs-5 fw-bold">Thành viên</p>
            <p className="fw-bold">Ba Ka</p>
            <p className="fw-bold opacity-50">Fullstack</p>
          </div>
        </Col>

        <Col className="member text-center mt-4" xs={12} sm={6} md={4} lg={3}>
          <img src={Thanh} className="img-fluid member-img img" alt="Nguyệt Thanh"></img>
          <div className="description">
            <p className="fs-5 fw-bold">Thành viên</p>
            <p className="fw-bold">Nguyệt Thanh</p>
            <p className="fw-bold opacity-50">Frontend</p>
          </div>
        </Col>

        <Col className="member text-center mt-4" xs={12} sm={6} md={4} lg={3} >
          <img src={Hao} className="img-fluid member-img img" alt="Vũ Hảo"></img>
          <div className="description">
            <p className="fs-5 fw-bold">Thành viên</p>
            <p className="fw-bold">Vũ Hảo</p>
            <p className="fw-bold opacity-50">AI</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
