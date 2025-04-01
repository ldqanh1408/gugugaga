import "./Loading.css";
import React from "react";
import ReactDOM from "react-dom";
import { ClipLoader } from "react-spinners";

function Loading() {
  return (
    <div>
      <div className="coating"></div>
      <div className="loading-overlay">
        <ClipLoader color="#ffffff" size={50} />
      </div>
    </div>
  );
}

export default Loading;
