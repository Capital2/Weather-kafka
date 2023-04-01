import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
// reactstrap components
import { Button, FormGroup, Input, Modal } from "reactstrap";

// Alert component to display notes to the user
import ContentAlert from "components/Alerts/ContentAlert";

const Init = forwardRef((props, ref) => {
  // The init modal state
  const [initModal, setInitModal] = useState(false);
  // The config object that will hold all the data needed (default city, user email, ...)
  const [config, setConfig] = useState({});

  // Creating the toggleInitModal function to make it possible to toggle the init modal from outisde this component
  useImperativeHandle(ref, () => ({
    toggleInitModal() {
      setInitModal(!initModal);
    },
  }));

  const initialize = () => {
    // Write data to localstorage

    // ...
    setInitModal(false);
  };

  // Handle the changes in the HTML input fields
  const handleChange = (e) => {
    setConfig({ ...config, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    // Check if the user set a default city and an email address
    let defaultCity = localStorage.getItem("defaultCity");
    console.log("default city detected");
    console.log(defaultCity);
    if (defaultCity === null) {
      // Launch the modal to force the user to setup the dafault city and his email address
      setInitModal(true);
    }
  }, []);
  return (
    <>
      {/* <Button
        className="btn-round"
        color="primary"
        type="button"
        onClick={() => setLoginModal(true)}
      >
        Login modal
      </Button> */}
      <Modal
        isOpen={initModal}
        toggle={() => setInitModal(false)}
        modalClassName="modal-register"
        backdrop="static"
        size="lg"
      >
        <div className="modal-header no-border-header text-center">
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setInitModal(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
          <h3 className="modal-title text-center">Initial Configuration</h3>
        </div>
        <div className="modal-body">
          <FormGroup>
            <label>Default City</label>
            <Input defaultValue="" placeholder="Email" type="text" />
          </FormGroup>
          <FormGroup>
            <label>Email</label>
            <Input
              value={config.email}
              id="email"
              placeholder="Email"
              type="email"
              onChange={handleChange}
            />
          </FormGroup>
          <Button
            block
            className="btn-round"
            color="default"
            onClick={initialize}
          >
            Confirm
          </Button>
        </div>
        <div className="p-4">
          <ContentAlert
            color="warning"
            styles={{"color": "#fff"}}
            heading="Notes"
            messages={[
              "The email will be used by the application so that you will receive emails in case of extreme weather",
              "You shoud lprovide a default city that the applciation will use to diplay data in the landing page",
            ]}
          />
        </div>
      </Modal>
    </>
  );
});

export default Init;
