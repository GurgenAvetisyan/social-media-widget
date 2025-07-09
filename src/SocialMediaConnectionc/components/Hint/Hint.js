import React, { useEffect, useRef, useState } from "react";
import "./hint.css";

function Hint({ children, tooltipText }) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const triggerRef = useRef(null);

  const showTooltip = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    setAnchorRect(rect);
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };
  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
      })}

      <Tooltip
        visible={tooltipVisible}
        hintText={tooltipText}
        anchorRect={anchorRect}
      />
    </>
  );
}

export default Hint;

function Tooltip({ visible, hintText, anchorRect }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let timeoutId;
    if (anchorRect) {
      timeoutId = setTimeout(() => setOpacity(1), 200);

      if (tooltipRef.current) {
        const tooltipHeight = tooltipRef.current.offsetHeight;
        const x = anchorRect.left - anchorRect.width / 2;
        const y = anchorRect.top - tooltipHeight - 8;

        setPosition({ x, y });
      }
    } else {
      setOpacity(0);
    }

    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [anchorRect]);

  if (!visible) return null;

  return (
    <div
      ref={tooltipRef}
      className="tooltip"
      role="tooltip"
      aria-label={hintText}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        opacity,
        transition: "opacity 0.3s ease, transform 0.2s ease-out",
      }}
    >
      {hintText}
    </div>
  );
}
