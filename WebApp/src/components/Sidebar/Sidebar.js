import React, { useRef, useImperativeHandle } from "react";

// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import '../../styles/Sidebar.css'

//  import the card in which to display the alert notifications
import AlertNotification from '../../components/Alerts/AlertNotification'

export const Sidebar = React.forwardRef((props, ref) => {
  const sidebarRef = useRef();

  const [isOpen, setIsOpen] = React.useState(false);

  useImperativeHandle(ref, () => ({
    toggleDrawer() {
      setIsOpen((prevState) => !prevState);
    },
  }));

  return (
    <div ref={sidebarRef}>
      <Drawer
        open={isOpen}
        onClose={sidebarRef.current?.toggleDrawer}
        direction="left"
        className="drawer"
        size={400}
      >
        <div className="alert-notifications-sidebar">
          <h3>Alert Notifications</h3>
          <div className="alert-notifications">
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
              <AlertNotification />
          </div>
        </div>
      </Drawer>
    </div>
  );
});
