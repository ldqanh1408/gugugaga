import "./Loading.css"
import React from "react";
import ReactDOM from "react-dom";

function Loading() {
    return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Đang kiểm tra...</p>
        </div>
      );
}

export default Loading;
