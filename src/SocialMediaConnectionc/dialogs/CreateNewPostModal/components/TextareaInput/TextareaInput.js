import React from "react";

function TextareaInput({ value, onChange, ...props }) {
  return (
    <textarea
      name="content"
      value={value}
      onChange={onChange}
      placeholder="Your post message text here"
      {...props}
    />
  );
}

export default TextareaInput;
