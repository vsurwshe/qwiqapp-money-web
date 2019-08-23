import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export const DeleteModel = (props) => {
  return (
    <Modal isOpen={props.danger} toggle={props.toggleDanger} style={{ paddingTop: "20%" }} backdrop={true}>
      <ModalHeader toggle={props.toggleDanger}>{props.headerMessage}</ModalHeader>
      <ModalBody>{props.bodyMessage}</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={props.delete}>Remove</Button>
        <Button color="secondary" onClick={props.cancel}>Cancel</Button>
      </ModalFooter>
    </Modal>)
}