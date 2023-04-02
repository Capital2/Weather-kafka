import React from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";

export default function index() {
  return (
    <Card style={{ width: "20rem" }}>
      <CardBody>
        <CardTitle>23-02-1999</CardTitle>
        <CardText>
          7ri9a fi tounes
        </CardText>
        <Button href="/#" color="primary">
          Seen
        </Button>
      </CardBody>
    </Card>
  );
}
