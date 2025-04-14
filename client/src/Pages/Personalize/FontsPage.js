import React, { useEffect } from 'react';
import './FontsPage.css';
import { useSelector, useDispatch } from 'react-redux';
import { setFont } from "../../redux/fontSlice";

export default function FontsPage() {
  const selectedFont = useSelector((state) => state.font.selectedFont);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.fontFamily = selectedFont;
  }, [selectedFont]);

  const handleFontChange = (e) => {
    dispatch(setFont(e.target.value));
  };

  return (
    <div>
      <div className="font-selector">
        <label>Chọn font: </label>
        <select onChange={handleFontChange} value={selectedFont}>
          <option value="Be Vietnam Pro">Be Vietnam Pro</option>
          <option value="Signika">Signika</option>
          <option value="Prompt">Prompt</option>
          <option value="Manrope">Manrope</option>
          <option value="Public Sans">Public Sans</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Oswald">Oswald</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Raleway">Raleway</option>
          <option value="Ubuntu">Ubuntu</option>
          <option value="Cabin">Cabin</option>
          <option value="Inconsolata">Inconsolata</option>
          <option value="Quicksand">Quicksand</option>
          <option value="Barlow">Barlow</option>
          <option value="Varela Round">Varela Round</option>
          <option value="Zilla Slab">Zilla Slab</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Roboto Condensed">Roboto Condensed</option>
          <option value="Fira Sans">Fira Sans</option>
        </select>
      </div>

      <div className="content">
        <h1>Trang tùy chỉnh Font</h1>
        <p>Chọn một font từ dropdown trên để áp dụng cho toàn bộ trang web.</p>
      </div>
    </div>
  );
}
