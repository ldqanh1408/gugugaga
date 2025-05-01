import { useState } from "react";
import EditButton from "../../assets/imgs/EditButton.svg";
import FilterButton from "../../assets/imgs/FilterButton.svg";
import { Row, Col, Card, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTreatment,
  setIsViewing,
  setStatus,
} from "../../redux/expertSlice";
import dateHelper from "../../utils/dateHelper";
import ViewInfor from "./ViewInfor";

function Current() {
  const [filterMode, setFilterMode] = useState("day");
  const { treatments, status, isViewing } = useSelector(
    (state) => state?.expert
  );
  const dispatch = useDispatch();
  console.log(treatments);

  if (isViewing) return <ViewInfor></ViewInfor>;

  return (
    <Col sm={12} md={5} className="custom-right">
      <Card className="mb-3 custom-card-title">
        <Card.Body className="fw-bold">Current</Card.Body>

        {/* div này chứa danh sách tùy chọn lọc dữ liệu. */}
       
      </Card>
      <div className="treatment-scroll-container">
        {treatments.length === 0 ? (
          <div className="no-treatments-message">
            No {status === "current" ? "current" : "pending"} treatments found.
          </div>
        ) : (
          treatments
            .filter((t) => {
              const endTime = new Date(t.schedule_id.end_time);
              const now = new Date();
              const endTimePlus2h = new Date(endTime.getTime() + 2 * 60 * 60 * 1000); // current time + 2 hours
              return now.getTime() <= endTimePlus2h.getTime();
            })
            .map((t, index) => (
              <Card className="mb-3 custom-card">
                <Card.Body className="custom-card-content">
                  <div className="card-header">
                    <span className="time-text"></span>
                  </div>
                  <div className="card-body">
                    <div>
                      <span className="date-text"></span>
                      <div className="header-text ">
                        <span className="fw-bold">Name: </span>{" "}
                        {t.user_id.userName}
                      </div>
                      <div className="header-text ">
                        <span className="fw-bold">Date: </span>{" "}
                        {dateHelper.getVietnamDate(t.schedule_id.start_time)}
                      </div>
                      <div className="header-text ">
                        <span className="fw-bold">Time: </span>{" "}
                        {dateHelper.getVietnamTime(t.schedule_id.start_time)} -{" "}
                        {dateHelper.getVietnamTime(t.schedule_id.end_time)}
                      </div>
                      <div className="header-text ">
                        <span className="fw-bold">Duration: </span> {t.duration}
                      </div>
                      <div className="header-text ">
                        <span className="fw-bold">Description: </span>{" "}
                        {t.description}
                      </div>
                      <div className="d-flex justify-content-end">
                        <Button
                          className="small-btn"
                          onClick={() => {
                            dispatch(setSelectedTreatment(t));
                            dispatch(setIsViewing(true));
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
        )}
      </div>
    </Col>
  );
}

export default Current;
