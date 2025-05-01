import { useState } from "react";
import EditButton from "../../assets/imgs/EditButton.svg";
import FilterButton from "../../assets/imgs/FilterButton.svg";
import { Row, Col, Card, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTreatment,
  setIsViewing,
  setStatus,
  receiveBookingThunk,
} from "../../redux/expertSlice";
import dateHelper from "../../utils/dateHelper";
function Booking() {
  const [filterMode, setFilterMode] = useState("day");
  const { currentTreatments, status, bookings } = useSelector(
    (state) => state?.expert
  );
  const { entity } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  return (
    <Col sm={12} md={5} className="custom-right">
      <Card className="mb-3 custom-card-title">
        <Card.Body className="fw-bold"> Bookings</Card.Body>

        {/* div này chứa danh sách tùy chọn lọc dữ liệu. */}
        
      </Card>
      <div className="treatment-scroll-container">
        {bookings.length === 0 ? (
          <div className="no-treatments-message">
            No {status === "current" ? "current" : "pending"} treatments found.
          </div>
        ) : (
          bookings
            .filter(
              (booking) =>
                !booking?.expert_ids?.some((_id) => _id === entity._id)
            )
            .map((booking, index) => (
              <Card className="mb-3 custom-card">
                <Card.Body className="custom-card-content">
                  <div className="card-header">
                    <span className="time-text"></span>
                  </div>
                  <div className="card-body">
                    <div>
                      <span className="date-text"></span>
                      <div className="header-text fw-bold">
                        Name: {booking.user_id.userName}
                      </div>
                      <div className="header-text">
                        <span className="fw-bold">Date: </span>
                        {dateHelper.getVietnamDate(booking.start_time)}
                      </div>
                      <div className="header-text">
                        <span className="fw-bold">Time: </span>{" "}
                        {dateHelper.getVietnamTime(booking.start_time)} -{" "}
                        {dateHelper.getVietnamTime(booking.end_time)}
                      </div>
                      <div className="header-text">
                        <span className="fw-bold">Duration: </span>{" "}
                        {booking.duration}
                      </div>
                      <div className="header-text">
                        <span className="fw-bold">Description: </span>{" "}
                        {booking.description}
                      </div>
                      <div className="d-flex justify-content-end">
                        <Button
                          className="small-btn"
                          onClick={() =>
                            dispatch(
                              receiveBookingThunk({ booking_id: booking._id })
                            )
                          }
                        >
                          Receive
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

export default Booking;
