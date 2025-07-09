import React, { useState } from "react";

import { ArrowDownIcon } from "../../../../../assets/icons";
import SliderWrapper from "./SliderWrapper";
import {
  FacebookPreviewCard,
  LinkedinPreviewCard,
  InstagramPreviewCard,
  TwitterPreviewCard,
} from "./PreviewCards";

import styles from "./previewSection.module.css";
import previewCardStyles from "./PreviewCards/previewCard.module.css";
const PreviewSection = ({ providersForPreview }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("");
  //   const providerNames = providersForPreview.map((preview) => preview.name);

  const providerNames = ["Facebook", "Instagram", "LinkedIn", "Twitter"];

  const uniqueProviderNames = [...new Set(providerNames)];

  const length = uniqueProviderNames.length;

  const nextSlide = () => {
    setDirection("right");
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  //   if (!Array.isArray(uniqueProviderNames) || uniqueProviderNames.length <= 0) {
  //     return null;
  //   }
  const previewCards = [
    <FacebookPreviewCard styles={previewCardStyles} />,
    <InstagramPreviewCard styles={previewCardStyles} />,
    <LinkedinPreviewCard styles={previewCardStyles} />,
    <TwitterPreviewCard styles={previewCardStyles} />,
  ];
  return (
    <div className={styles.postPreviewSection}>
      <div className={styles.previewHeaderSection}>
        <div>Preview</div>
        <div className={styles.providerNames}>
          <span className={styles.arrowLeft} onClick={prevSlide}>
            <ArrowDownIcon />
          </span>

          <SliderWrapper
            slides={uniqueProviderNames}
            current={current}
            direction={direction}
          />
          <span className={styles.arrowRight} onClick={nextSlide}>
            <ArrowDownIcon />
          </span>
        </div>
      </div>
      <SliderWrapper
        slides={previewCards}
        current={current}
        direction={direction}
        className={styles.previewCardSlider}
      />
    </div>
  );
};

export default PreviewSection;
