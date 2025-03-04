import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/common.css";
import "./Home.css";
import { Button, Row, Col } from "react-bootstrap";
import sample from "../../assets/imgs/sample.webp";
function Home() {
  return (
    <div className="pink-bg vh-100">
      <div className="container">
        <Row>GUGUGAGA</Row>
        <Row>Write your life</Row>
        <Row>
          <Button>Start Writing</Button>
        </Row>
        <Row>
          <img src={sample} className="img-fluid"></img>
        </Row>
        <Row>
          <Col>
            <Row>Hôm nay bạn ổn không ?</Row>
            <Row>
              <Row>✨ Khoảnh Khắc Đặc Biệt</Row>
              <Row>
                Ghi lại những kỷ niệm đáng nhớ, những điều nhỏ bé nhưng ý nghĩa
                trong ngày của bạn.
              </Row>
            </Row>
            <Row>
              <Row>💭 Suy Nghĩ Hôm Nay</Row>
              <Row>
                Chia sẻ cảm xúc, suy nghĩ, hoặc bất kỳ điều gì bạn muốn bày tỏ
                ngay lúc này.
              </Row>
            </Row>
            <Row>
              <Row>🎯 Mục Tiêu & Dự Định</Row>
              <Row>
                Đặt ra mục tiêu mới hoặc theo dõi tiến trình của những kế hoạch
                đang thực hiện.
              </Row>
            </Row>
          </Col>
          <Col>
            <img src={sample} className="img-fluid"></img>
          </Col>
        </Row>
        <Row>
          <h2>Developers</h2>
          <Row>
            <Col>
              <img src={sample} className="img-fluid"></img>
              <p>Leader</p>
              <p>Lê Đắc Quốc Anh</p>
              <p>Fullstack</p>
            </Col>
            <Col>
              <img src={sample} className="img-fluid"></img>
              <p>Leader</p>
              <p>Lê Đắc Quốc Anh</p>
              <p>Fullstack</p>
            </Col>
            <Col>
            <img src={sample} className="img-fluid"></img>
              <p>Leader</p>
              <p>Lê Đắc Quốc Anh</p>
              <p>Fullstack</p>
            </Col>
          </Row>
        </Row>
      </div>
    </div>
  );
}

export default Home;
