import React from 'react';
import './DetachSheet.css';

const DetachSheet = ({ show, onClose }) => {
  return (
    <div className={`detach-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className={`detach-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detach-sheet-header"></div>
        <img src="your_image.jpg" alt="meal" className="detach-sheet-image" />
        <h2 className="detach-sheet-title">Your Meal is Coming</h2>
        <p className="detach-sheet-text">
          Your food is on its way and will arrive soon! Sit back and get ready to enjoy your meal.
        </p>
        <button className="detach-sheet-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default DetachSheet;
