import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Modal } from "react-bootstrap";
import "./SignUpBusiness.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { ACCOUNT, PASSWORD, USER_NAME } from "../../constants";
import { handleBlur, handleFocus, handleConfirm } from "../../services";
import { register, getToken } from "../../services/authService";
import Loading from "../../components/Common/Loading";
import { ClipLoader } from "react-spinners";
import { setRole, registerThunk } from "../../redux/authSlice";
import { vietnamProvinces } from "../../utils/signupHelper";

function SignUpBusiness() {
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessNameError, setBusinessNameError] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessEmailError, setBusinessEmailError] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [provinceError, setProvinceError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [detailAddressError, setDetailAddressError] = useState("");
  const state = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);

  const handleSignUpError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleProvinceChange = (e) => {
    const selectedProvinceCode = parseInt(e.target.value);
    setProvince(selectedProvinceCode);
    const selectedProvince = vietnamProvinces.find(
      (province) => province.code === selectedProvinceCode
    );
    setDistrictOptions(selectedProvince ? selectedProvince.districts : []);
    setDistrict(""); // Reset district when province changes
  };

  const isValidAccount = (account) => {
    const accountRegex = /^[a-zA-Z0-9._]{5,20}$/;
    return accountRegex.test(account);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%,?&#])[A-Za-z\d@$!%,?&#]{8,32}$/;
    return passwordRegex.test(password) && !/\s/.test(password);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!isValidAccount(account)) {
      handleSignUpError(
        "Account name must be 5-20 characters and only contain letters, numbers, dots (.), or underscores (_)."
      );
      setLoading(false);
      return;
    }
    if (!isValidPassword(password)) {
      handleSignUpError(
        "Password must be 8-32 characters long, include at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character (@, $, !, %, ,, ?, &, #), and no spaces."
      );
      setLoading(false);
      return;
    }
    if (!isValidAccount(businessName)) {
      handleSignUpError(
        "Business name must be 5-20 characters and only contain letters, numbers, dots (.), or underscores (_)."
      );
      setLoading(false);
      return;
    }
    if (!isValidEmail(businessEmail)) {
      handleSignUpError("Invalid email format.");
      setLoading(false);
      return;
    }

    // Validation for empty or null fields
    if (
      !businessEmail ||
      !businessName ||
      !account ||
      !password ||
      !province ||
      !district ||
      !detailAddress
    ) {
      handleSignUpError(
        "All fields are required. Please fill in all the details."
      );
      setLoading(false);
      return;
    }

    try {
      const formData = {
        business_email: businessEmail,
        business_name: businessName,
        account,
        password,
        role: "BUSINESS",
        province,
        district,
        detail_address: detailAddress,
      };
      try {
        await dispatch(registerThunk(formData)).unwrap(); // sẽ throw nếu thất bại
        navigate("/login"); // chỉ chạy nếu đăng ký thành công
      } catch (error) {
        handleSignUpError(
          "Registration failed. Please check your details and try again."
        );
        console.error({ message: error.message });
      }
    } catch (error) {
      handleSignUpError(
        "Registration failed. Please check your details and try again."
      );
      console.error({ message: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="container">
      {loading && <Loading />}
      <div>
        <div>
          <h1 className="signup-header">Sign Up</h1>
          <hr className="signup-line"></hr>
        </div>

        <div className="">
          <Form className="d-flex flex-column form-1 login">
            <Form.Group className="mt-4">
              <Form.Label className="signup-custom-h2-label">
                Account:
              </Form.Label>
              <Form.Control
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Enter your username..."
                className="signup-box"
                onBlur={() =>
                  handleBlur({
                    field: ACCOUNT,
                    account,
                    password,
                    userName,
                    setAccountError,
                    setPasswordError,
                    setUserNameError,
                  })
                }
                onFocus={() =>
                  handleFocus({
                    field: ACCOUNT,
                    account,
                    password,
                    userName,
                    setAccountError,
                    setPasswordError,
                    setUserNameError,
                  })
                }
              ></Form.Control>
              <span className="notice d-block">
                Enter an account name with 5-20 characters, consisting only of
                letters (A-Z, a-z), numbers (0-9), dots (.), or underscores (_).
                Special characters are not allowed.
              </span>
              <Form.Text className="text-danger">{accountError}</Form.Text>
            </Form.Group>
            <Form.Group className="mt-4">
              <Form.Label className="signup-custom-h2-label">
                Password:
              </Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="signup-box"
                onBlur={() =>
                  handleBlur({
                    field: "password",
                    password,
                    setPasswordError,
                  })
                }
                onFocus={() =>
                  handleFocus({
                    field: "password",
                    password,
                    setPasswordError,
                  })
                }
              ></Form.Control>
              <span className="notice d-block">
                Enter a password with 8 to 32 characters, including at least 1
                lowercase letter (a-z), 1 uppercase letter (A-Z), 1 number
                (0-9), 1 special character (@, $, !, %, , ?, &, #), and no
                spaces.
              </span>
              <Form.Text className="text-danger">{passwordError}</Form.Text>
            </Form.Group>
            <Form.Group className="mt-4">
              <Form.Label className="signup-custom-h2-label">
                Business email:
              </Form.Label>
              <Form.Control
                type="email"
                required
                onChange={(e) => setBusinessEmail(e.target.value)}
                onBlur={() =>
                  handleBlur({
                    field: "businessEmail",
                    businessEmail,
                    setBusinessEmailError,
                  })
                }
                onFocus={() =>
                  handleFocus({
                    field: "businessEmail",
                    businessEmail,
                    setBusinessEmailError,
                  })
                }
                placeholder="Enter your email..."
                className="signup-box"
              ></Form.Control>
              <Form.Text className="text-danger">
                {businessEmailError}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mt-4">
              <Form.Label className="signup-custom-h2-label">
                Business name:
              </Form.Label>
              <Form.Control
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your name..."
                className="signup-box"
                onBlur={() =>
                  handleBlur({
                    field: "businessName",
                    businessName,
                    setBusinessNameError,
                  })
                }
                onFocus={() =>
                  handleFocus({
                    field: "businessName",
                    businessName,
                    setBusinessNameError,
                  })
                }
              ></Form.Control>
              <Form.Text className="text-danger">{businessNameError}</Form.Text>
            </Form.Group>
            <Form.Group className="mt-4">
              <Form.Label className="signup-custom-h2-label">
                Province:
              </Form.Label>
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
              <Form.Label className="signup-custom-h2-label">
                District:
              </Form.Label>
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

            <Form.Group className="mt-4">
              <Form.Label className="signup-custom-h2-label">
                Detail Address:
              </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="Enter your detailed address..."
                className="signup-box"
                onBlur={() =>
                  handleBlur({
                    field: "detailAddress",
                    detailAddress,
                    setDetailAddressError,
                  })
                }
                onFocus={() =>
                  handleFocus({
                    field: "detailAddress",
                    detailAddress,
                    setDetailAddressError,
                  })
                }
              ></Form.Control>
              <Form.Text className="text-danger">
                {detailAddressError}
              </Form.Text>
            </Form.Group>
            <Button
              style={{ marginRight: "0" }}
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <ClipLoader color="white" size={20} /> : "Sign Up"}
            </Button>
          </Form>
        </div>
      </div>
      <Modal show={showErrorModal} onHide={closeErrorModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registration Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SignUpBusiness;
