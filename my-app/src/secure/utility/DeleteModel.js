import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export const DeleteModel = (props) => {
  return <Modal isOpen={props.danger} toggle={props.toggleDanger} style={{ paddingTop: "20%" }} backdrop={true}>
      <ModalHeader toggle={props.toggleDanger}>{props.headerMessage}</ModalHeader>
      <ModalBody>Are you sure want to delete <b>{props.bodyMessage}</b> {props.children}?
        <br />
        {props.recurDeleteStatus && props.loadDeleteOptions()}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={props.delete}>Remove</Button>
        <Button color="secondary" onClick={props.cancel}>Cancel</Button>
      </ModalFooter>
    </Modal>
}