import React from "react";
import "./cropmenu.css";

const staticCategories = [
  "Corn", "Banana", "Pomegranate", "Cotton", "Mango",
  "Rice", "Brinjal", "Tomato", "Mirchi"
];

const CropMenu = ({ onCropSelect }) => {
  return (
    <div className="crop-bar">
      <span className="crop-name" onClick={() => onCropSelect(null)}>🏠 Home</span>
      {staticCategories.map((cat) => (
        <span key={cat} className="crop-name" onClick={() => onCropSelect(cat)}>
          {cat}
        </span>
      ))}
    </div>
  );
};

export default CropMenu;




