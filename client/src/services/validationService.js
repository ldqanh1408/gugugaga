import { getUsers, addUser } from "./userService";

export const handleLogin = async ({
  account,
  password,
  setError,
  navigate,
  setAccountError,
  setPasswordError,
  accountError,
  passwordError,
}) => {
  try {
    if (!account) setAccountError("Account is required");
    if (!password) setPasswordError("Password is required");
    if(!account || !password) return;
    console.log(1);
    const users = await getUsers();
    const user = users.find(
      (user, index) => user.account === account && user.password === password
    );
    if (user) {
      // Giả sử bạn có một token giả lập để lưu vào localStorage
      const token = "fake-jwt-token";
      localStorage.setItem("token", token);
      // Chuyển hướng người dùng đến trang khác
      console.log("Login successful:", user);
      navigate("/");
      window.location.reload();
    }
    // Lưu token vào localStorage hoặc state quản lý
    // Chuyển hướng người dùng đến trang khác
    else {
      setError("Invalid username or password");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    setError("An error occurred. Please try again.");
  }
};

//Dùng để xử lí blur của các input login
export const handleBlur = ({
  field,
  account,
  setAccountError,
  password,
  setPasswordError,
}) => {
  if (field === "account" && !account) {
    setAccountError("Account is required");
  } else if (field === "password" && !password) {
    setPasswordError("Password is required");
  }
};

//Nếu field được focus thì bỏ cảnh báo
export const handleFocus = ({
  field,
  account,
  password,
  setAccountError,
  setPasswordError,
}) => {
  if (field === "account") {
    setAccountError("");
  } else if (field === "password") {
    setPasswordError("");
  }
};

export const handleConfirm = ({
  password,
  confirmPassword,
  setConfirmPasswordError,
}) => {
  if(password !== confirmPassword){
    setConfirmPasswordError("Confirmation password does not match. Please try again.");
  }
  else{
    setConfirmPasswordError("");
    
  }
}

export const handleSignUp = async ({
  password,
  confirmPassword,
  account,
  userName = "",
  email = "",
  phoneNumber = "",
  navigate,
  setError,
  setAccountError,
  setPasswordError,
  setConfirmPasswordError
}) => {
  try {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if(!password){setPasswordError("Account is required")}
    if(!account){setAccountError("Password is required")}
    if(!password  || !account) return;
    const newUser = {
      account,
      user_name: userName,
      password,
      email,
      phone_number: phoneNumber,
    };
    await addUser(newUser);
    console.log("User added successfully");
    navigate("/login");
  } catch (error) {
    setError("An error occurred. Please try again.");
  }
}