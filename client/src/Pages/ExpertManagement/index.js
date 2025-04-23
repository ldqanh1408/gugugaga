import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Table } from "react-bootstrap";
import { getExpertsThunk } from "../../redux/businessSlice";
import ViewAdd from "./ViewAdd";
import { setIsAddView, setIsViewDetail } from "../../redux/businessSlice";
import ViewDetail from "./ViewDetail"
function ExpertManagement() {
  const { experts, isAddView, isViewDetail } = useSelector((state) => state?.business);
  console.log(isViewDetail)
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchExperts = async () => {
      dispatch(getExpertsThunk());
    };
    fetchExperts();
  }, [dispatch]);
  return (
    <Container className="wrapper">
      <h1 className="mt-4">Expert Management</h1>
      <hr />
      {isAddView ? (
        <ViewAdd />
      ) : isViewDetail ? (
        <ViewDetail/>
      ) : (
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>expert_name</th>
              <th>gender</th>
              <th>account</th>
              <th>
                <button onClick={() => dispatch(setIsAddView(true))}>
                  add
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {experts && experts.length > 0 ? (
              experts.map((expert, index) => (
                <tr key={expert._id || index}>
                  <td>{index + 1}</td>
                  <td>{expert.expert_name || ""}</td>
                  <td>{expert.gendar || ""}</td>
                  <td>{expert.account || ""}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        dispatch(setIsViewDetail({ status: true, expert }))
                      }
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No experts found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
export default ExpertManagement;
