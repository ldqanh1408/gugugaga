import "./Loading.css";
import React from "react";
import ReactDOM from "react-dom";
import {ClipLoader} from "react-spinners"

function Loading() {
  return (
    <div className="loading-overlay">
      <ClipLoader color="#ffffff" size={50} />
    </div>
  );
}

export default Loading;
