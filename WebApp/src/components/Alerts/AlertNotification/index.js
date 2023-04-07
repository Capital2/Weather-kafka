import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  CardHeader,
} from "reactstrap";

import Description from "./Description";
export default function AlertNotification({ data, index, seen, remove }) {
  const [isOpen, setIsOpen] = useState(false)
 
  const start = new Date(data.start * 1000);
  const end = new Date(data.end * 1000);
  return (
    <Card style={{ width: "20rem" }}>
      <CardHeader style={data.seen ? { backgroundColor: "#51cbce" } : null}>
        <span className={data.seen && "text-white"}>{data.event}</span>
        <button
          aria-label="Close"
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={() => { remove(index) }}
        >
          <span aria-hidden={true}>×</span>
        </button>
        <button
          className="close"
          type="button"
          onClick={() => {
            seen(index);
          }}
        >
          <i
            className="fa fa-check"
            style={{
              fontSize: "14px",
              position: "relative  ",
              top: "-2.5px",
              left: "-2px",
            }}
          ></i>
        </button>
      </CardHeader>
      <CardBody>
        <CardTitle>Sender Name: {data.sender_name}</CardTitle><br />
        <CardText>Start: {start.toLocaleDateString()}</CardText>
        <CardText>End: {end.toLocaleDateString()}</CardText>
        <Button type="button" color="primary" onClick={() => {setIsOpen(true)}}>
          Expand
        </Button>
        <Description descriptionText={data.description} isOpen={isOpen} setIsOpen={setIsOpen}  />
      </CardBody>
    </Card>
  );
}
