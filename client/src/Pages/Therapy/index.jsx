import { Button, Container, Form } from "react-bootstrap";
import "./Therapy.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchAvailableExperts,
  requestTreatmentThunk,
  setDuration,
  setStartTime,
  setSelected,
} from "../../redux/therapySlice";

function Therapy() {
  const { start_time, duration, experts, selected } = useSelector(
    (state) => state?.therapy
  );
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchExperts = async () => {
      if (start_time && duration) {
        console.log(experts);
        const start = new Date(start_time);
        const end = new Date(start.getTime() + parseInt(duration) * 60000);

        const payload = {
          start_time: start.toISOString(),
          end_time: end.toISOString(),
        };

        dispatch(fetchAvailableExperts(payload));
      }
    };

    fetchExperts();
  }, [start_time, duration]);

  return (
    <Container className="wrapper">
      <h1 className="mt-4">Therapy Booking</h1>
      <hr />

      <Form.Label className="custom-h2-label">Choose date</Form.Label>
      <Form.Group className="edit-profile-box">
        <Form.Control
          className="no-border"
          type="datetime-local"
          name="dob"
          onChange={(e) => dispatch(setStartTime(e.target.value))}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="custom-h2-label">Choose Duration</Form.Label>
        <Form.Select
          name="duration"
          className="duration"
          onChange={(e) => dispatch(setDuration(e.target.value))}
        >
          <option value="30">30 phút</option>
          <option value="45">45 phút</option>
          <option value="60">60 phút</option>
        </Form.Select>
      </Form.Group>

      <h2 className="custom-h2-label">Choose expert</h2>

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
                  <div className="text-muted mb-2">{expert.gender}</div>
                </div>
              </div>
            ))
          ) : (
            <p>Không có chuyên gia phù hợp.</p>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <Button
          onClick={() =>
            dispatch(
              requestTreatmentThunk({
                expert_id: selected,
                start_time:new Date(start_time).toISOString(),
                end_time: new Date(
                  new Date(start_time).getTime() + parseInt(duration) * 60000
                ).toISOString(),
              })
            )
          }
        >
          Booking
        </Button>
      </div>
    </Container>
  );
}

export default Therapy;
