import { Button, Container, Form, Spinner, Alert } from "react-bootstrap";
import "./Therapy.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { handleBlur, handleFocus, handleConfirm } from "../../services";

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
import { vietnamProvinces } from "../../utils/signupHelper";

function Therapy() {
  const {
    start_time,
    duration,
    experts,
    selected,
    description,
    averageRatings,
    booking,
    error,
    loading,
  } = useSelector((state) => state?.therapy);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [provinceError, setProvinceError] = useState("");
  const [districtError, setDistrictError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleProvinceChange = (e) => {
    const selectedProvinceCode = e.target.value ? parseInt(e.target.value) : "";
    setProvince(selectedProvinceCode);
    const selectedProvince = vietnamProvinces.find(
      (province) => province.code === selectedProvinceCode
    );
    setDistrictOptions(selectedProvince ? selectedProvince.districts : []);
    setDistrict(""); // Reset district when province changes
  };
  const [currentPage, setCurrentPage] = useState(1);
  const expertsPerPage = 10;
  const expertListToShow = isFilterActive ? filteredExperts : experts || [];

  const indexOfLastExpert = currentPage * expertsPerPage;
  const indexOfFirstExpert = indexOfLastExpert - expertsPerPage;
  const currentExperts = expertListToShow?.slice(
    indexOfFirstExpert,
    indexOfLastExpert
  );
  const totalPages = Math.floor((expertListToShow?.length - 1 + expertsPerPage) / expertsPerPage);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const dispatch = useDispatch();
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  };
  useEffect(() => {
    dispatch(getReceiversThunk());
    dispatch(getMyBookingThunk());
  }, [dispatch]);

  useEffect(() => {
    const getAvarageAll = async () => {
      experts?.map((e) =>
        dispatch(getAverageRatingThunk({ expert_id: e._id }))
      );
    };
    getAvarageAll();
  }, [experts]);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };
  const filterExperts = () => {
    if (!province && !district) {
      alert("Please select a province or district before filtering.");
      return;
    }

    if (isFilterActive) {
      // Clear filter
      setFilteredExperts([]);
      setIsFilterActive(false);
    } else {
      // Apply filter
      const filtered = experts.filter((expert) => {
        const business = expert?.business_id;
        if (!business) return false;

        const matchProvince =
          province !== ""
            ? Number(business?.province) === Number(province)
            : true;
        const matchDistrict =
          district !== ""
            ? Number(business?.district) === Number(district)
            : true;

        return matchProvince && matchDistrict;
      });

      setFilteredExperts(filtered);
      setIsFilterActive(true);
      setCurrentPage(1); // Reset to the first page
    }
  };
  return (
    <Container className="wrapper fade-in">
      <h1 className="mt-4 fw-bolder fs-2 gradient-text  text-center animate__animated animate__fadeInDown">
        Therapy Booking
      </h1>
      <hr className="animate__animated animate__fadeIn" />

      {error && (
        <Alert variant="danger" className="animate__animated animate__shakeX">
          {error}
        </Alert>
      )}

      <Form.Label className="custom-h2-label">Choose date</Form.Label>
      <Form.Group className="edit-profile-box mb-3">
        <Form.Control
          className="no-border"
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTimeSlot("");
          }}
          min={getTomorrowDate()}
        />
      </Form.Group>

      <Form.Label className="custom-h2-label">Choose time slot</Form.Label>
      <Form.Select
        className="mb-4 animate__animated animate__fadeIn"
        value={selectedTimeSlot}
        onChange={(e) => {
          const time = e.target.value;
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
          className="duration animate__animated animate__fadeIn"
          onChange={(e) => dispatch(setDuration(e.target.value))}
        >
          <option value="">--Selected--</option>
          <option value="30">30 phút</option>
          <option value="45">45 phút</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="custom-h2-label">
          Description (Gồm mô tả bệnh và địa điểm đang sinh sống)
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={description}
          placeholder="Enter description..."
          onChange={(e) => dispatch(setDescription(e.target.value))}
          className="animate__animated animate__fadeIn"
        />
      </Form.Group>

      <h2 className="custom-h2-label d-flex align-items-center">
        Experts{" "}
        <img
          src={refreshIcon}
          className="icon ms-2 animate__animated animate__rotateIn"
          onClick={() => dispatch(getReceiversThunk())}
          alt="refresh"
        />
      </h2>
      <div className="d-flex align-items-center gap-2 ms-3">
        <Form.Group className="mt-4">
          <Form.Label className="signup-custom-h2-label">Province:</Form.Label>
          <Form.Select
            onChange={handleProvinceChange}
            className="signup-box"
            value={province}
            onBlur={() =>
              handleBlur({
                field: "province",
                province,
                setProvinceError,
              })
            }
            onFocus={() =>
              handleFocus({
                field: "province",
                province,
                setProvinceError,
              })
            }
          >
            <option value="">Select your province...</option>
            {vietnamProvinces?.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-danger">{provinceError}</Form.Text>
        </Form.Group>

        <Form.Group className="mt-4">
          <Form.Label className="signup-custom-h2-label">District:</Form.Label>
          <Form.Select
            onChange={(e) => setDistrict(e.target.value)}
            className="signup-box"
            value={district}
            onBlur={() =>
              handleBlur({
                field: "district",
                district,
                setDistrictError,
              })
            }
            onFocus={() =>
              handleFocus({
                field: "district",
                district,
                setDistrictError,
              })
            }
          >
            <option value="">Select your district...</option>
            {districtOptions.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-danger">{districtError}</Form.Text>
        </Form.Group>
      </div>
      <Button onClick={filterExperts}>
        {isFilterActive ? "Clear Filter" : "Filter"}
      </Button>

      <div className="container my-5">
        <div className="row g-4">
          {Array.isArray(experts) && experts.length > 0 ? (
            currentExperts.map((expert, index) => (
              <div
                className="col-md-6 col-lg-6 animate__animated animate__zoomIn"
                key={expert._id || index}
              >
                <div
                  className={`expert-card ${
                    selected === expert._id ? "selected" : ""
                  }`}
                  onClick={() => {
                    dispatch(
                      setSelected(selected === expert._id ? null : expert._id)
                    );
                  }}
                >
                  <h6>👩‍⚕️ {expert.expert_name}</h6>
                  <div className="text-muted mb-2">
                    Gender:{" "}
                    {expert.gender === "other" ? "secret" : expert.gender}
                  </div>
                  <div className="text-muted mb-2 fw-bold">
                    Average rating:{" "}
                    {typeof averageRatings[expert?._id]?.average_rating ===
                    "number"
                      ? averageRatings[expert?._id]?.average_rating.toFixed(2)
                      : "N/A"}{" "}
                  </div>
                  <div className="text-muted mb-2">
                    Business name: {expert?.business_id?.business_name}
                  </div>
                  <div className="text-muted mb-2">
                    Business address: {expert?.business_id?.detail_address}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="animate__animated animate__fadeIn">
              {booking
                ? "Waiting for expert feedback..."
                : "No suitable expert available."}
            </p>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4 align-items-center flex-wrap gap-2">
        <Button
          variant="outline-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>

        {getVisiblePages().map((page, index) =>
          page === "..." ? (
            <span key={index} className="mx-2">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "primary" : "outline-primary"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline-secondary"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
      <div className="d-flex justify-content-end">
        {loading ? (
          <Spinner
            animation="border"
            className="animate__animated animate__fadeIn"
          />
        ) : booking ? (
          <div>
            <Button
              variant="danger"
              onClick={() =>
                dispatch(cancelBookingThunk({ booking_id: booking?._id }))
              }
              className="animate__animated animate__pulse"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const data = {
                  booking_id: booking?._id,
                  description,
                  duration,
                  expert_id: selected,
                };
                dispatch(acceptBookingThunk(data));
              }}
              disabled={!selected}
              className="animate__animated animate__pulse"
            >
              Choose
            </Button>
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
            className="animate__animated animate__pulse"
          >
            Booking
          </Button>
        )}
      </div>
    </Container>
  );
}

export default Therapy;
