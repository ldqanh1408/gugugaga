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
import { AppRouter } from "./Router";

function App() {
  return (
    <>
      <AppRouter />
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
      </>
  );
}

export default App;
