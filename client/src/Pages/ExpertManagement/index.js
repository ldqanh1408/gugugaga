import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Table } from "react-bootstrap";

function ExpertManagement() {

  return (
    <Container>
        <h1 className="mt-4">Expert Management</h1>
        <hr></hr>
    <Table striped bordered hover responsive className="mt-4">
      <thead>
        <tr className="">
          <th>#</th>
          <th>name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Rating</th>
          <th>Status</th>
          <th><button>add</button></th>
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
          <td>
            <Button>View</Button>
          </td>
        </tr>
        <tr>
          <td>1</td>
          <td>Nguyễn Văn A</td>
          <td>0914997062</td>
          <td>xyz@gmail.abc</td>
          <td>ABC</td>
          <td>pending...</td>
          <td>
          <Button>View</Button>
          </td>
        </tr>
        <tr>
          <td>1</td>
          <td>Nguyễn Văn A</td>
          <td>0914997062</td>
          <td>xyz@gmail.abc</td>
          <td>ABC</td>
          <td>pending...</td>
          <td>
          <Button>View</Button>
          </td>
        </tr>
        <tr>
          <td>1</td>
          <td>Nguyễn Văn A</td>
          <td>0914997062</td>
          <td>xyz@gmail.abc</td>
          <td>ABC</td>
          <td>pending...</td>
          <td>
          <Button>View</Button>
          </td>
        </tr>
        <tr>
          <td>1</td>
          <td>Nguyễn Văn A</td>
          <td>0914997062</td>
          <td>xyz@gmail.abc</td>
          <td>ABC</td>
          <td>pending...</td>
          <td>
          <Button>View</Button>
          </td>
        </tr>
        <tr>
          <td>1</td>
          <td>Nguyễn Văn A</td>
          <td>0914997062</td>
          <td>xyz@gmail.abc</td>
          <td>ABC</td>
          <td>pending...</td>
          <td>
          <Button>View</Button>
          </td>
        </tr>
      </tbody>
    </Table>
    </Container>

  );
}

export default ExpertManagement;