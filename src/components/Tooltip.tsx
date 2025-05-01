"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = "",
  position = "top",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  // Handle client-side only rendering for the portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Calculate tooltip position when it becomes visible
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      calculatePosition();
    }
  }, [isVisible, position, content]);

  // Update position on scroll and resize
  useEffect(() => {
    if (!isVisible) return;

    const handleUpdate = () => {
      if (triggerRef.current) {
        calculatePosition();
      }
    };

    window.addEventListener("scroll", handleUpdate, true); // true for capture phase to get all scrolls
    window.addEventListener("resize", handleUpdate);

    // Initial calculation after render
    setTimeout(calculatePosition, 0);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isVisible, position]);

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Default offset values
    const offset = 10;

    let top = 0;
    let left = 0;
    let finalPosition = position;

    // Default dimensions if tooltip isn't rendered yet
    const tooltipHeight = tooltipRect?.height || 30;
    const tooltipWidth = tooltipRect?.width || 100;

    // Initial position calculation
    switch (position) {
      case "top":
        top = triggerRect.top - tooltipHeight - offset;
        left = triggerRect.left + triggerRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.left - tooltipWidth - offset;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.right + offset;
        break;
    }

    // Ensure tooltip stays in viewport
    if (tooltipRect) {
      // Check top boundary
      if (top < 0) {
        if (position === "top") {
          // Flip to bottom
          top = triggerRect.bottom + offset;
          finalPosition = "bottom";
        } else {
          // Just adjust to be within viewport
          top = offset;
        }
      }

      // Check bottom boundary
      if (top + tooltipHeight > windowHeight) {
        if (position === "bottom") {
          // Flip to top
          top = triggerRect.top - tooltipHeight - offset;
          finalPosition = "top";
        } else {
          // Just adjust to be within viewport
          top = windowHeight - tooltipHeight - offset;
        }
      }

      // Check left boundary
      if (left - tooltipWidth / 2 < 0) {
        left = tooltipWidth / 2 + offset;
      }

      // Check right boundary
      if (left + tooltipWidth / 2 > windowWidth) {
        left = windowWidth - tooltipWidth / 2 - offset;
      }
    }

    setCoords({ top, left });
  };

  const getTransformValue = () => {
    switch (position) {
      case "top":
      case "bottom":
        return "translateX(-50%)";
      case "left":
      case "right":
        return "translateY(-50%)";
      default:
        return "translateX(-50%)";
    }
  };

  return (
    <span className="relative inline-flex align-middle" ref={triggerRef}>
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex cursor-help align-middle"
      >
        {children}
      </span>
      {isVisible &&
        mounted &&
        createPortal(
          <span
            ref={tooltipRef}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: getTransformValue(),
              zIndex: 99999,
            }}
            className={`px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm whitespace-nowrap ${className}`}
          >
            {content}
            <span
              className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
                position === "top"
                  ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                  : position === "bottom"
                    ? "top-[-4px] left-1/2 -translate-x-1/2"
                    : position === "left"
                      ? "right-[-4px] top-1/2 -translate-y-1/2"
                      : "left-[-4px] top-1/2 -translate-y-1/2"
              }`}
            />
          </span>,
          document.body
        )}
    </span>
  );
};

export default Tooltip;
