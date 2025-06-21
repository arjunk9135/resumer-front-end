// components/ui/Loader/Loader.jsx

import React from "react";
import "./style.css";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="loader-svg">
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          fillRule="evenodd"
          fill="none"
          strokeWidth="2"
          stroke="#2563eb"
        >
          <line y2="6" x2="24" y1="2" x1="24"></line>
          <line transform="rotate(30 34 6.679)" y2="8.679" x2="34" y1="4.679" x1="34"></line>
          <line transform="rotate(60 41.321 14)" y2="16" x2="41.321" y1="12" x1="41.321"></line>
          <line transform="rotate(90 44 24)" y2="26" x2="44" y1="22" x1="44"></line>
          <line transform="rotate(120 41.321 34)" y2="36" x2="41.321" y1="32" x1="41.321"></line>
          <line transform="rotate(150 34 41.321)" y2="43.321" x2="34" y1="39.321" x1="34"></line>
          <line transform="rotate(180 24 44)" y2="46" x2="24" y1="42" x1="24"></line>
          <line transform="rotate(210 14 41.321)" y2="43.321" x2="14" y1="39.321" x1="14"></line>
          <line transform="rotate(240 6.679 34)" y2="36" x2="6.679" y1="32" x1="6.679"></line>
          <line transform="rotate(270 4 24)" y2="26" x2="4" y1="22" x1="4"></line>
          <line transform="rotate(300 6.679 14)" y2="16" x2="6.679" y1="12" x1="6.679"></line>
          <line transform="rotate(330 14 6.679)" y2="8.679" x2="14" y1="4.679" x1="14"></line>
        </g>
      </svg>
    </div>
  );
};

export default Loader;
