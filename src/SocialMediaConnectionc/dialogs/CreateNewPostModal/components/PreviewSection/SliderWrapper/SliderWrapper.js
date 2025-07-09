import React from "react";

import styles from "./sliderWrapper.module.css";

const SliderWrapper = ({ slides, current, direction, className = "" }) => {
  const directionClassName = direction ? styles[`slide-in-${direction}`] : "";
  return (
    <div className={`${styles.slider} ${className}`}>
      {slides.map((item, index) => {
        return (
          <div
            className={
              index === current
                ? `${styles.slide} ${styles.active} ${directionClassName}`
                : styles.slide
            }
            key={index}
          >
            {index === current ? item : null}
          </div>
        );
      })}
    </div>
  );
};

export default SliderWrapper;
