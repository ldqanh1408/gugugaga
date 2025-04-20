import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import ViewInfor from "./ViewInfor";
import "./HistoryExpert.css";
import { setIsViewing } from "../../redux/historySlice";

function HistoryExpert() {
  const {isViewing} = useSelector((state) => state?.history);
  const dispatch = useDispatch();
  return (
    <Container className="history">
         <h1>History</h1>
         <hr className=""></hr>
      {isViewing === true ? (
        <ViewInfor></ViewInfor>
      ) : (
         
          <Table striped bordered hover responsive className="mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Description</th>
                <th>Status</th>
                <th>Time</th>
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
                <td>30/4/1975</td>
                <td>
                  <Button onClick={() => dispatch(setIsViewing(true))}>View</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Nguyễn Văn A</td>
                <td>0914997062</td>
                <td>xyz@gmail.abc</td>
                <td>ABC</td>
                <td>pending...</td>
                <td>30/4/1975</td>
                <td>
                  <Button onClick={() => dispatch(setIsViewing(true))}>View</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Nguyễn Văn A</td>
                <td>0914997062</td>
                <td>xyz@gmail.abc</td>
                <td>ABC</td>
                <td>pending...</td>
                <td>30/4/1975</td>
                <td>
                  <Button onClick={() => dispatch(setIsViewing(true))}>View</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Nguyễn Văn A</td>
                <td>0914997062</td>
                <td>xyz@gmail.abc</td>
                <td>ABC</td>
                <td>pending...</td>
                <td>30/4/1975</td>
                <td>
                  <Button onClick={() => dispatch(setIsViewing(true))}>View</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Nguyễn Văn A</td>
                <td>0914997062</td>
                <td>xyz@gmail.abc</td>
                <td>ABC</td>
                <td>pending...</td>
                <td>30/4/1975</td>
                <td>
                  <Button onClick={() => dispatch(setIsViewing(true))}>View</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Nguyễn Văn A</td>
                <td>0914997062</td>
                <td>xyz@gmail.abc</td>
                <td>ABC</td>
                <td>pending...</td>
                <td>30/4/1975</td>
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

export default HistoryExpert;
