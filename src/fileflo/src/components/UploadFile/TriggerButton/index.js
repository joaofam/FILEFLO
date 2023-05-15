// Built-in Dependencies
import React from 'react';
// Internal Dependencies
import '../../../utils/CSS/Container.css';

// TriggerButton Component
const Trigger = ({ triggerText, buttonRef, showModal, setInFolder }) => {
  return (
    <button
      className="upload-button2"
      ref={buttonRef}
      onClick={showModal}
      setInFolder={setInFolder}
    >
      {triggerText}
    </button>
  );
};
export default Trigger;
