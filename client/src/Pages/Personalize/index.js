import React from "react";
import { useNavigate } from "react-router-dom"; // Nếu dùng React Router
import "./Personalize.css"; // Import CSS file

const Personalize = () => {
  const navigate = useNavigate(); // Điều hướng trang

  const options = [
    { title: "Background", icon: "🖼️", path: "/personalize/background" },
    { title: "Colors", icon: "🎨", path: "/personalize/colors" },
    { title: "Fonts", icon: "🔤", path: "/personalize/fonts" },
  ];

  return (
    <div className="container personalize-container">
      <h2 className="personalize-header">
        Hãy tuỳ chỉnh nhật kí của bạn ^^
      </h2>

      <div className="personalize-options">
        {options.map((opt, index) => (
          <div
            key={index}
            onClick={() => navigate(opt.path)}
            className="personalize-option"
          >
            <div className="personalize-option-content">
              <span>{opt.icon}</span>
              <span>{opt.title}</span>
            </div>
            <div className="personalize-option-arrow">›</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Personalize;
