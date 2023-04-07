import React, { useRef, useImperativeHandle } from "react";

// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import "../../styles/Sidebar.css";

//  import the card in which to display the alert notifications
import AlertNotification from "../../components/Alerts/AlertNotification";

import { useAppState } from "hooks/useAppContext";
import { useEffect } from "react";

export const Sidebar = React.forwardRef((props, ref) => {
  const sidebarRef = useRef();

  const [isOpen, setIsOpen] = React.useState(false);

  useImperativeHandle(ref, () => ({
    toggleDrawer() {
      setIsOpen((prevState) => !prevState);
    },
  }));

  const seen = (index) => {
    let notificationTarget = {}
    const updatedNotifications = notifications.filter(
      (notification, notificationIndex) => {
        if(notificationIndex === index){
          notificationTarget = notification
        }
        return(
          notificationIndex !== index
        )
      }
    );
    setNotifications([...updatedNotifications, {...notificationTarget, seen: true}]);
  };

  const remove = (index) => {
    const filtredNotifications = notifications.filter(
      (notification, notificationIndex) => notificationIndex !== index
    );

    setNotifications(filtredNotifications);
  };

  const { notifications, setNotifications } = useAppState();
  let displayNotifications = notifications.map((notification, index) => (
    <div className="notification-wrapper" key={index}>
      <AlertNotification data={notification} seen={seen} index={index} remove={remove} />
    </div>
  ));

  return (
    <div ref={sidebarRef}>
      <Drawer
        open={isOpen}
        onClose={sidebarRef.current?.toggleDrawer}
        direction="left"
        className="drawer"
        size={400}
        style={{ overflowY: "scroll" }}
      >
        <div className="alert-notifications-sidebar">
          <h3 style={{ marginBottom: "50px" }}>Alert Notifications</h3>
          <div className="alert-notifications">{displayNotifications}</div>
        </div>
      </Drawer>
    </div>
  );
});
