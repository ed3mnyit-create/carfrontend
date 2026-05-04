"use client";
import React, { useState } from "react";

/**
 * Tooltip Component
 * Simple tooltip for displaying labels when icons are used instead of text on mobile.
 */
const Tooltip = ({ children, text, position = "top" }) => {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(true)}
      onTouchEnd={() => setTimeout(() => setShow(false), 1500)}
    >
      {children}
      {show && (
        <div
          className={`absolute z-[110] whitespace-nowrap bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl animate-in fade-in zoom-in duration-200 pointer-events-none ${positionClasses[position]}`}
        >
          {text}
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45 ${position === "top" ? "-bottom-1" : "-top-1"}`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
