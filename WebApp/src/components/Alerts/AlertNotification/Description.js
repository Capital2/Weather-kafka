import React from "react";
// reactstrap components
import { Button, FormGroup, Input, Modal } from "reactstrap";

function Description({ descriptionText, isOpen, setIsOpen }) {  
  return(
    <>
      <Modal isOpen={isOpen} toggle={() => setIsOpen(false)}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLongTitle">
            Description
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
            <p>
                {descriptionText}
            </p>
        </div>
      
      </Modal>
    </>
  );
}

export default Description;