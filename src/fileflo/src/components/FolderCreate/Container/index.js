// Built-in Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import { Modal } from '../Modal';
import TriggerButton from '../TriggerButton';

// FolderCreate Component
export class FolderCreate extends Component {
  state = { isShown: false };
  // Display the modal
  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
    });
    this.toggleScrollLock();
  };

  // Close the modal
  closeModal = () => {
    this.setState({ isShown: false });
    this.TriggerButton.focus();
    this.toggleScrollLock();
  };

  // Handle the "esc" keydown event
  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  // Handle the click outside the modal
  onClickOutside = (event) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };
  // Toggle the scroll lock on the html element
  toggleScrollLock = () => {
    document.querySelector('html').classList.toggle('scroll-lock');
  };
  // Render FolderCreate
  render() {
    return (
      <React.Fragment>
        <TriggerButton
          showModal={this.showModal}
          buttonRef={(n) => (this.TriggerButton = n)}
          triggerText={this.props.triggerText}
        />
        {this.state.isShown ? (
          <Modal
            onSubmit={this.props.onSubmit}
            modalRef={(n) => (this.modal = n)}
            buttonRef={(n) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default FolderCreate;
