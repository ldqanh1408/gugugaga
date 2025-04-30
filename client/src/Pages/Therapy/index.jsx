import { Button, Container, Form } from "react-bootstrap";
import "./Therapy.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  fetchAvailableExperts,
  requestTreatmentThunk,
  setDuration,
  setStartTime,
  setSelected,
  setDescription,
  getAverageRatingThunk,
  getReceiversThunk,
  createBookingThunk,
  cancelBookingThunk,
  getMyBookingThunk,
  acceptBookingThunk,
} from "../../redux/therapySlice";
import { getAverageRating } from "../../services/treatmentService";
import refreshIcon from "../../assets/icons/refresh.svg";
function Therapy() {
  const {
    start_time,
    duration,
    experts,
    selected,
    description,
    averageRatings,
    booking,
  } = useSelector((state) => state?.therapy);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReceiversThunk()); // Gọi redux thunk (hoặc API)

    dispatch(getMyBookingThunk());
  }, [dispatch]);

  useEffect(() => {
    const getAvarageAll = async () => {
      experts?.map((e) => dispatch(getAverageRatingThunk({ expert_id: e._id })));
    };

    getAvarageAll();
  }, [experts]);
  console.log(averageRatings);

  return (
    <Container className="wrapper">
      <h1 className="mt-4">Therapy Booking</h1>
      <hr />

      <Form.Label className="custom-h2-label">Choose date</Form.Label>
      <Form.Group className="edit-profile-box mb-3">
        <Form.Control
          className="no-border"
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            // reset giờ khi chọn lại ngày
            setSelectedTimeSlot("");
          }}
          min={new Date().toISOString().slice(0, 10)}
        />
      </Form.Group>

      <Form.Label className="custom-h2-label">Choose time slot</Form.Label>
      <Form.Select
        className="mb-4"
        value={selectedTimeSlot}
        onChange={(e) => {
          const time = e.target.value; // vd: "08:00"
          setSelectedTimeSlot(time);
          if (selectedDate && time) {
            const combinedDateTime = new Date(`${selectedDate}T${time}:00`);
            dispatch(setStartTime(combinedDateTime.toISOString()));
          }
        }}
      >
        <option value="">--Select a time slot--</option>
        <option value="08:00">08:00 - 09:00</option>
        <option value="09:00">09:00 - 10:00</option>
        <option value="10:00">10:00 - 11:00</option>
        <option value="14:00">14:00 - 15:00</option>
        <option value="15:00">15:00 - 16:00</option>
      </Form.Select>

      <Form.Group className="mb-4">
        <Form.Label className="custom-h2-label">Choose Duration</Form.Label>
        <Form.Select
          name="duration"
          className="duration"
          onChange={(e) => dispatch(setDuration(e.target.value))}
        >
          <option value="">--Selected--</option>
          <option value="30">30 phút</option>
          <option value="45">45 phút</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="custom-h2-label">Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={description}
          placeholder="Enter description..."
          onChange={(e) => dispatch(setDescription(e.target.value))}
        />
      </Form.Group>

      <h2 className="custom-h2-label d-flex">
        Experts{" "}
        <img
          src={refreshIcon}
          className="icon"
          onClick={() => dispatch(getReceiversThunk())}
        ></img>
      </h2>

      <div className="container my-5">
        <div className="row g-4">
          {Array.isArray(experts) && experts.length > 0 ? (
            experts.map((expert, index) => (
              <div className="col-md-6 col-lg-6" key={expert._id || index}>
                <div
                  className={`expert-card ${
                    selected === expert._id ? "selected" : ""
                  }`}
                  onClick={() => dispatch(setSelected(expert._id))}
                >
                  <h6>👩‍⚕️ {expert.expert_name}</h6>

                  <div className="text-muted mb-2">Gender: {expert.gendar}</div>
                  <div className="text-muted mb-2 fw-bold">Average rating: {averageRatings[expert?._id]?.average_rating?.toFixed(2)}</div>
                  <div className="text-muted mb-2">Business name: {expert?.business_id?.business_name}</div>
                  <div className="text-muted mb-2">Business address: {expert?.business_id?.business_address}</div>

                </div>
              </div>
            ))
          ) : (
            <p>
              {booking
                ? "Đang chờ chuyên gia phản hồi..."
                : "Không có chuyên gia phù hợp."}
            </p>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-end">
        {booking ? (
          <div>
            <Button
              variant="danger"
              onClick={() =>
                dispatch(cancelBookingThunk({ booking_id: booking?._id }))
              }
            >
              Cancel
            </Button>
            <Button  onClick={() => {
              const data = {
                booking_id: booking?._id,
                description,
                duration,
                expert_id: selected
              }
              dispatch(acceptBookingThunk(data));
        
            }} disabled={!!!selected}>Choose</Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              if (!start_time || !selectedTimeSlot) {
                alert("Please select a time slot before booking.");
                return;
              }

              const [hour, minute] = selectedTimeSlot.split(":");
              const endHour = parseInt(hour) + 1;

              const endTime = new Date(
                `${selectedDate}T${endHour.toString().padStart(2, "0")}:${minute}:00`
              );

              dispatch(
                createBookingThunk({
                  start_time: start_time,
                  end_time: endTime.toISOString(),
                  description: description || "",
                  duration,
                })
              );
            }}
          >
            Booking
          </Button>
        )}
      </div>
    </Container>
  );
}

export default Therapy;
