import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import ViewInfor from "./ViewInfor";
import "./HistoryExpert.css";
import { setIsViewing, setSelectedTreatment } from "../../redux/historySlice";
import { getTreatmentsThunk } from "../../redux/expertSlice";

function HistoryExpert() {
  const { isViewing, selectedTreatment } = useSelector(
    (state) => state?.history
  );
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
    <Container className="history container mt-4">
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
                <th>User name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Rating</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {treatments.length === 0 ? (
                <></>
              ) : (
                treatments
                  // .filter((t) => {
                  //   const startTime = new Date(t.schedule_id.start_time).getTime();
                  //   const nowMinus2Hours = Date.now() - 2 * 60 * 60 * 1000; // current time - 2 hours
                  //   return startTime >= nowMinus2Hours;
                  // })
                  .map((t, idx) => (
                    <tr>
                      <td className="shell-infor">{idx}</td>
                      <td>{t.user_id.userName}</td>
                      <td>{t.user_id.phone}</td>
                      <td>{t.user_id.email}</td>
                      <td>{t.rating}</td>
                      <td className="d-flex justify-content-center">
                        <Button
                          onClick={() => {
                            dispatch(setSelectedTreatment(t));
                            dispatch(setIsViewing(true));
                          }}
                        >
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
