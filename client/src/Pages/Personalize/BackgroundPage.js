import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BackgroundPage.css";

function BackgroundPage() {
  const [mode, setMode] = useState("Solid color");
  const [color, setColor] = useState({ r: 229, g: 202, b: 194 });
  const [image, setImage] = useState(null);
  const [recentImages, setRecentImages] = useState([]);

  useEffect(() => {
    const savedColor = localStorage.getItem("backgroundColor");
    const savedImage = localStorage.getItem("backgroundImage");

    if (savedImage) {
      document.body.style.backgroundImage = `url(${savedImage})`;
      document.body.style.backgroundSize = "cover";
    } else if (savedColor) {
      document.body.style.backgroundColor = savedColor;
    }
  }, []);

  const handleColorPickerChange = (updatedColor) => {
    setColor(updatedColor.rgb);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setRecentImages([imageUrl, ...recentImages.slice(0, 3)]);
  };

  const handleImageClick = (img) => {
    setImage(img);
  };

  const handleDone = () => {
    if (mode === "Solid color") {
      const bgColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
      document.body.style.background = bgColor;
      localStorage.setItem("backgroundColor", bgColor);
      localStorage.removeItem("backgroundImage");
    } else if (mode === "Picture" && image) {
      document.body.style.backgroundImage = `url(${image})`;
      document.body.style.backgroundSize = "cover";
      localStorage.setItem("backgroundImage", image);
      localStorage.removeItem("backgroundColor");
    }
  };

  return (
    <div className="container mt-5 mx-auto" style={{ maxWidth: "850px" }}>
      <h3><strong>Background</strong></h3>
      <div className="border rounded p-4 mt-3" style={{ backgroundColor: "#fef9fb" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div><h3>🖼️ Personalize your background</h3></div>
          <select
            className="form-select w-auto"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option>Solid color</option>
            <option>Picture</option>
          </select>
        </div>

        {mode === "Solid color" && (
          <>
            <div className="mb-3">Pick a background color</div>
            <div className="mb-3">
            <div style={{ maxWidth: "400px" }}>
            <SketchPicker
              color={color}
              onChange={handleColorPickerChange}
              width="100%" // hoặc width="360px"
            />
            </div>
            </div>
            <div className="mb-2">RGB: ({color.r}, {color.g}, {color.b})</div>
            <div
              style={{
                backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                width: 100,
                height: 50,
                border: "1px solid #ccc",
              }}
            ></div>
          </>
        )}

        {mode === "Picture" && (
          <>
            <div className="mb-3">Recent images</div>
            <div className="d-flex mb-3">
              {recentImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleImageClick(img)}
                  style={{
                    width: 80,
                    height: 50,
                    marginRight: 10,
                    border: img === image ? "2px solid #000" : "1px solid #ccc",
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3 w-100">
              <label className="form-label">Choose a photo</label>
              <input
                type="file"
                id="upload-photo"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none", marginLeft: 'auto' }}
              />
              <label htmlFor="upload-photo" className="browse-btn ml-auto">
                Browse Photo
              </label>
            </div>

          </>
        )}

        <div className="d-flex justify-content-end">
          <button className="btn btn-primary me-2" onClick={handleDone}>Done</button>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundPage;
