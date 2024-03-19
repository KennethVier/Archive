import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import '../src/index.css';
import '../src/app.scss';

const TaskForm = ({ onSubmit, editedData, taskName }) => {
  const [task, setTask] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    if (editedData) {
      setTask(editedData.task || '');
      setStartDate(editedData.startDate || '');
      setEndDate(editedData.endDate || '');
      setStatus(editedData.status || '');
    }
  }, [editedData]);

  const handleSubmit = (e, isUpdate) => {
    e.preventDefault();
    if (!task.trim()) {
      alert('Please enter a task name.');
      return;
    }

    if (status === 'Completed') {
      setShowConfirmationModal(true);
      return;
    }

    handleSubmission();
  };

  const handleSubmission = () => {
    let formData = {
      task,
      startDate,
      endDate,
      status,
    };

    onSubmit(formData);

    setTask('');
    setStartDate('');
    setEndDate('');
    setStatus('');

    if (editedData) {
      setShowUpdateSuccessModal(true);
    }
  };

  const handleConfirmComplete = () => {
    setShowConfirmationModal(false);
    handleSubmission();
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    startDateRef.current.blur();
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    endDateRef.current.blur();
  };

  const handleUpdateSuccessModalClose = () => {
    setShowUpdateSuccessModal(false);
  };

  return (
    <Container fluid>
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Did you really complete the task? If yes, Confirm.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmComplete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateSuccessModal} onHide={handleUpdateSuccessModalClose}>
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
          <Form.Control type="text" value={task} onChange={(e) => setTask(e.target.value)} required placeholder="Enter Task Name"  style={{ color: '#F4512C', '::placeholder': { color: '#F4512C' } }}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="formLabel">Start Date:</Form.Label>
          <Form.Control type="datetime-local" value={startDate} onChange={handleStartDateChange} required className="edit-font " ref={startDateRef} style={{color: '#F4512C'}}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="formLabel">End Date:</Form.Label>
          <Form.Control type="datetime-local" value={endDate} onChange={handleEndDateChange} required={status !== 'Completed'} className="edit-font " ref={endDateRef} style={{color: '#F4512C'}}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="formLabel">Status:</Form.Label>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required  style={{color: '#F4512C'}}>
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
          </Form.Select>
        </Form.Group>

        <div className="text-center">
          <Button className="submitfont me-2" type="submit" variant="flat" hover style={{ backgroundColor: '#5E1B89', color: '#FF7F4D', fontSize: '23px', fontWeight: 'bold', fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
            {editedData ? 'Update' : 'Submit'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default TaskForm;
