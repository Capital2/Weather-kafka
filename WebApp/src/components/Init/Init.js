import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

// reactstrap components
import { Button, FormGroup, Input, Modal } from "reactstrap";

// Search component
import Search from "components/Search/Search";

// Alert component to display notes to the user
import ContentAlert from "components/Alerts/ContentAlert";

// Interact with the global app state
import { useAppState } from "hooks/useAppContext";

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

  // Access to the global state and functions to manipulate it
  const { data, pushData, setDefaultCity, setEmail } = useAppState();

  // The callback function that the Search component need
  const onSearchChange = (searchDataValue) => {
    setConfig({ ...config, defaultCity: searchDataValue });
  };

  const initialize = () => {
    // Write data to localstorage
    localStorage.setItem("defaultCity", JSON.stringify(config.defaultCity));
    localStorage.setItem("email", config.email);

    setDefaultCity(config.defaultCity);
    setEmail(config.email);
    setInitModal(false);
  };

  // Handle the changes in the HTML input fields
  const handleChange = (e) => {
    setConfig({ ...config, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    // Check if the user set a default city and an email address
    let defaultCity = localStorage.getItem("defaultCity");
    let email = localStorage.getItem("email");
    if (defaultCity === null) {
      // Launch the modal to force the user to setup the dafault city and his email address
      setInitModal(true);
    } else {
      setConfig({
        defaultCity: JSON.parse(defaultCity),
        email,
      });
      setDefaultCity(JSON.parse(defaultCity));
      setEmail(email);
    }
  }, []);
  return (
    <>
      <Modal
        isOpen={initModal}
        toggle={() => setInitModal(false)}
        modalClassName="modal-register"
        backdrop="static"
        size="lg"
        keyboard={false}
      >
        <div className="modal-header no-border-header text-center">
          {/* Modal close button */}
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
            <Search
              onSearchChange={onSearchChange}
              defaultCity={config.defaultCity}
            />
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
            color="danger"
            styles={{ color: "#fff" }}
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
