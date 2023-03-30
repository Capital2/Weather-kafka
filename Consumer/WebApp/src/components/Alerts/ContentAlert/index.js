import React from "react";
import { Alert } from "reactstrap";

const ContentAlert = (props) => {
  const { color, heading, messages } = props;
  return (
    <div>
      <Alert color={color}>
        <h4 className="alert-heading">{heading}</h4>
        {messages.map((message) => (
          <>
            <p>{message}</p>
            <hr />
          </>
        ))}
      </Alert>
    </div>
  );
};

export default ContentAlert;
