import React, { useState, useRef, useEffect } from "react";

import { ArrowDownIcon } from "../../../assets/icons";

import styles from "./accordion.module.css";

const Accordion = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [scrollHeight, setScrollHeight] = useState(0);
  const contentRef = useRef(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const updateScrollHeight = () => {
      if (contentRef.current) {
        setScrollHeight(contentRef.current.scrollHeight);
      }
    };

    updateScrollHeight();

    window.addEventListener("resize", updateScrollHeight);

    return () => window.removeEventListener("resize", updateScrollHeight);
  }, [children]);

  return (
    <div className={styles.accordionWidget}>
      <div className={styles.accordionHeader} onClick={toggleAccordion}>
        <p className={styles.accordionTitle}>Accounts</p>
        <div className={`${styles.toggleIcon} ${isOpen ? styles.open : ""}`}>
          <ArrowDownIcon />
        </div>
      </div>

      <div
        className={styles.accordionContent}
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${scrollHeight || 0}px` : "0px",
        }}
      >
        <div className={styles.accordionInnerContent}>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
