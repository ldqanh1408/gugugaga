import "../../styles/common.css";
import "./Home.css";
import { Button, Row, Col } from "react-bootstrap";
import sample from "../../assets/imgs/sample.webp";
import developers from "../../assets/imgs/Developers.jpg";

import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return (
    <div className="container flex-grow-1">
      <Row className="mt-4">
        <h1 className="fw-bolder text">GUGUGAGA</h1>
        <p className="opacity-75 text">Write your life</p>
        <Button className="btn text">Write</Button>
      </Row>
      <Row>
        <img src={sample} className="img-fluid section img full"></img>
      </Row>
      <Row className="second">
        <Col>
          <h2 className="fw-bold">Hôm nay bạn ổn không ?</h2>
          <Row>
            <p className="fw-bold">✨ Khoảnh Khắc Đặc Biệt</p>
            <p className="opacity-75">
              Ghi lại những kỷ niệm đáng nhớ, những điều nhỏ bé nhưng ý nghĩa
              trong ngày của bạn.
            </p>
          </Row>
          <Row>
            <p className="fw-bold">💭 Suy Nghĩ Hôm Nay</p>
            <p className="opacity-75">
              Chia sẻ cảm xúc, suy nghĩ, hoặc bất kỳ điều gì bạn muốn bày tỏ
              ngay lúc này.
            </p>
          </Row>
          <Row>
            <p className="fw-bold">🎯 Mục Tiêu & Dự Định</p>
            <p className="opacity-75">
              Đặt ra mục tiêu mới hoặc theo dõi tiến trình của những kế hoạch
              đang thực hiện.
            </p>
          </Row>
        </Col>
        <Col>
          <img src={sample} className="img-fluid img"></img>
        </Col>
      </Row>
      <Row>
        <h2 className="fw-bold second">Developers</h2>
        <Row className="first">
          <Col className="member">
            <img src={developers} className="img-fluid member-img img"></img>
            <div className="description">
              <p className="fw-bold">Thành viên</p>
              <p>Lê Đắc Quốc Anh</p>
              <p>Fullstack</p>
            </div>
          </Col>
          <Col className="member">
            <img src={developers} className="img-fluid member-img img"></img>
            <div className="description">
              <p className="fw-bold">Thành viên</p>
              <p>Lê Đắc Quốc Anh</p>
              <p>Fullstack</p>
            </div>
          </Col>
          <Col className="member">
            <img src={developers} className="img-fluid member-img img"></img>
            <div className="description">
              <p className="fw-bold">Thành viên</p>
              <p>Lê Đắc Quốc Anh</p>
              <p>Fullstack</p>
            </div>
          </Col>
          <Col className="member">
            <img src={developers} className="img-fluid member-img img"></img>
            <div className="description">
              <p className="fw-bold">Thành viên</p>
              <p>Lê Đắc Quốc Anh</p>
              <p>Fullstack</p>
            </div>
          </Col>
        </Row>
      </Row>
    </div>
  );
}

export default Home;
