// Built-in Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import { Modal } from '../Modal';
import TriggerButton from '../TriggerButton';

// Exported Upload Component
export class UploadContainer extends Component {
  state = { isShown: false };

  // Display Modal
  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
    });
    this.toggleScrollLock();
  };

  // Close Modal
  closeModal = () => {
    this.setState({ isShown: false });
    this.TriggerButton.focus();
    this.toggleScrollLock();
  };

  // Modal escape on "esc" key
  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  // Modal escape on click outside
  onClickOutside = (event) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  // Toggle scroll lock
  toggleScrollLock = () => {
    document.querySelector('html').classList.toggle('scroll-lock');
  };
  // Render Modal
  render() {
    return (
      <React.Fragment>
        <TriggerButton
          showModal={this.showModal}
          buttonRef={(n) => (this.TriggerButton = n)}
          triggerText={this.props.triggerText}
          setInFolder={this.props.setInFolder}
        />
        {this.state.isShown ? (
          <Modal
            onSubmit={this.props.onSubmit}
            modalRef={(n) => (this.modal = n)}
            buttonRef={(n) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
            setInFolder={this.props.setInFolder}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default UploadContainer;
