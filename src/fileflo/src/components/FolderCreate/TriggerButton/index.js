// Built-in imports
import React from 'react';

// Internal imports
const Trigger = ({ triggerText, buttonRef, showModal }) => {
  return (
    <button className="folder-button" ref={buttonRef} onClick={showModal}>
      {triggerText}
    </button>
  );
};
export default Trigger;
