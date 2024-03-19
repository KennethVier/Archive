import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import '../src/index.css';

const TaskForm = ({ onSubmit, editedData, taskName }) => {
  const [task, setTask] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [rowClass, setRowClass] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    if (editedData) {
      setTask(editedData.task || '');
      setStartDate(editedData.startDate || '');
      setEndDate(editedData.endDate || '');
      setStatus(editedData.status || '');
      setRowClass(getRowClass(editedData.status));
      setEditMode(true);
    }
  }, [editedData]);

  const handleAlertClose = () => {
    setShowAlert(false);
    setAlertShown(true);
  };

  const handleSubmit = (e, isUpdate) => {
    e.preventDefault();
    if (!task.trim()) {
      alert('Please enter a task name.');
      return;
    }

    if (alertShown && new Date(endDate) < new Date()) {
      setShowAlert(true);
      return;
    }
  
    let formData = {
      task,
      startDate,
      endDate,
      status,
    };
  
    if (editedData && status === 'Completed') {
      formData = {
        ...formData,
        completedDate: new Date().toLocaleString(),
      };
  
      const dueDateObject = new Date(endDate);
      const completedDateObject = new Date();
  
      if (completedDateObject > dueDateObject) {
        setRowClass('table-danger');
      } else {
        setRowClass('table-success');
      }
    } else {
      const dueDateObject = new Date(endDate);
      if (dueDateObject < new Date() || dueDateObject.getTime() === new Date().getTime()) {
        setShowAlert(true);
        return;
      }
    }
  
    onSubmit(formData);
    setTask('');
    setStartDate('');
    setEndDate('');
    setStatus('');
    setEditMode(false);

    if (isUpdate) {
      setUpdateSuccess(true);
    }
  };
  
  const handleUpdateSuccessModalClose = () => {
    setUpdateSuccess(false);
    if (taskRef.current) {
      taskRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getRowClass = (status) => {
    switch (status) {
      case 'Overdue':
        return 'table-danger';
      case 'Completed':
        return 'table-success';
      default:
        return 'table-light';
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    startDateRef.current.blur(); // Automatically blur the start date input after selecting the start date
  };
  

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    endDateRef.current.blur(); // Automatically blur the end date input after selecting the end date
  };

  return (
    <Container fluid>
      {showAlert && status !== 'Overdue' && (
        <Modal show={showAlert} onHide={handleAlertClose}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>Due date should be in the future.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleAlertClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal show={updateSuccess} onHide={handleUpdateSuccessModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your Task was successfully updated.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdateSuccessModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Form onSubmit={handleSubmit} id="table">
        <Form.Group className="mb-3">
          <Form.Label className="formLabel">Task:</Form.Label>
          <Form.Control type="text" value={task} onChange={(e) => setTask(e.target.value)} required placeholder="Enter Task Name" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="formLabel">Start Date:</Form.Label>
          <Form.Control 
            type="datetime-local" 
            value={startDate} 
            onChange={handleStartDateChange} 
            required 
            className="edit-font" 
            ref={startDateRef} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="formLabel">End Date:</Form.Label>
          <Form.Control 
            type="datetime-local" 
            value={endDate} 
            onChange={handleEndDateChange} 
            required={status !== 'Completed'} 
            className="edit-font" 
            ref={endDateRef} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="formLabel">Status:</Form.Label>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option className="edit-font" value="">
              Select Task Status
            </option>
            <option className="edit-font" value="Completed">
              Completed
            </option>
            <option className="edit-font" value="In Progress">
              In Progress
            </option>
            {new Date(startDate) > new Date() && <option className="edit-font" value="Not Started">Not Started</option>}
            {status === 'Overdue' && <option className="edit-font" value="Overdue">Overdue</option>}
          </Form.Select>
        </Form.Group>

        <div className="text-center">
          {!editMode && (
            <Button className="submitfont me-2" type="submit" variant="flat" hover style={{ backgroundColor: '#5E1B89', color: '#FF7F4D', fontSize: '23px', fontWeight: 'bold', fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
              Submit
            </Button>
          )}
          {editMode && (
            <Button className="submitfont me-2" type="submit" variant="flat" hover style={{ backgroundColor: '#5E1B89', color: '#FF7F4D', fontSize: '23px', fontWeight: 'bold', fontFamily: "Georgia, 'Times New Roman', Times, serif" }} onClick={(e) => handleSubmit(e, true)}>
              Update
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
};

export default TaskForm;
