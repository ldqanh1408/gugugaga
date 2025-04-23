import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Table } from "react-bootstrap";
import ViewInfor from "./ViewInfor";
import { setIsViewing } from "../../redux/complaintSlice";

function Complaint() {
  const { isViewing } = useSelector((state) => state?.complaint);
  const dispatch = useDispatch();
  return (
    <Container className="wrapper">
      <h1 className="mt-4">Complaints</h1>
      <hr></hr>
      {isViewing === true ? (
        <ViewInfor></ViewInfor>
      ) : (
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>name</th>
              <th>date</th>
              <th>email</th>
              <th>gender</th>
              <th>phone</th>
              <th>describe</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Nguyễn Văn A</td>
              <td>0914997062</td>
              <td>xyz@gmail.abc</td>
              <td>ABC</td>
              <td>pending...</td>
              <td>ABC</td>

              <td>
                <Button onClick={() => dispatch(setIsViewing(true))}>View</Button>
              </td>
            </tr>
           
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Complaint;
