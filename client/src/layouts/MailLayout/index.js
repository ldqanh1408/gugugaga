import React from "react";
import { Outlet } from "react-router-dom";
import "./MailLayout.css";

const MailLayout = () => {
  return (
    <div className="mail-layout">
      <Outlet />
    </div>
  );
};

export default MailLayout;
