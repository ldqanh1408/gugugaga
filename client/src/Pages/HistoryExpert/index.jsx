import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import ViewInfor from "./ViewInfor";
import "./HistoryExpert.css";
import { setIsViewing } from "../../redux/historySlice";
import { getTreatmentsThunk } from "../../redux/expertSlice";

function HistoryExpert() {
  const { isViewing } = useSelector((state) => state?.history);
  const dispatch = useDispatch();
  const { treatments } = useSelector((state) => state?.expert);
  useEffect(() => {
    const fetchTreatments = async () => {
      dispatch(getTreatmentsThunk());
    };
    fetchTreatments();
  }, [dispatch]);
  console.log(treatments);
  return (
    <Container className="history">
      <h1>History</h1>
      <hr className=""></hr>
      {isViewing === true ? (
        <ViewInfor></ViewInfor>
      ) : (
        <div className="treatment-scroll-container">
        
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {treatments.length === 0 ? (
              <></>
            ) : (
              treatments.map((t, idx) => (
                <tr>
                  <td>{idx}</td>
                  <td>{t.user_id.userName}</td>
                  <td>{t.user_id.phone}</td>
                  <td>{t.user_id.email}</td>
                  <td>{t.treatmentStatus}</td>
                  <td>
                    <Button onClick={() => dispatch(setIsViewing(true))}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        </div>
      )}
    </Container>
  );
}

export default HistoryExpert;
