import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./layouts/Navigation/index";
import {
  Home,
  ExploreYourselfPage,
  TodayMailsPage,
  Login,
  EnterLogin,
  SignUp,
} from "./Pages/index";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore-yourself" element={<ExploreYourselfPage />} />
        <Route path="/today-mails" element={<TodayMailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/enter" element={<EnterLogin />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
