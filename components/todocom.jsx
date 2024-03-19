import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskForm from './TaskForm';
import { Button, Table, Form, Modal, InputGroup, Tab, Tabs } from 'react-bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";
import '../src/app.scss';

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      submittedData: this.loadFromLocalStorage() || [],
      editedTaskData: null,
      editMode: false,
      checkedStatus: [],
      selectAllChecked: false,
      showModal: false,
      confirmIndex: null,
      search: '',
      showSuccessModal: false,
      showDeleteModal: false,
      deleteIndex: null,
      taskToDelete: null,
      showTaskDeletedModal: false,
      showCompleteDeleteModal: false,
      tasksToComplete: [],
      tasksToDelete: [],
      selectAllCompleteChecked: false,
      selectAllDeleteChecked: false,
    };
    this.handleTaskSubmit = this.handleTaskSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleCloseSuccessModal = this.handleCloseSuccessModal.bind(this);
    this.handleConfirmComplete = this.handleConfirmComplete.bind(this);
    this.handleModalCheckboxChange = this.handleModalCheckboxChange.bind(this);
    this.toggleTaskToComplete = this.toggleTaskToComplete.bind(this);
    this.handleConfirmCompleteAll = this.handleConfirmCompleteAll.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleTaskToDeleteChange = this.handleTaskToDeleteChange.bind(this);
    this.handleSelectAllComplete = this.handleSelectAllComplete.bind(this);
    this.handleSelectAllDelete = this.handleSelectAllDelete.bind(this);
  }

  updateTaskStatuses() {
    const updatedData = this.state.submittedData.map(task => {
      if (this.isTaskOverdueAndInProgress(task.endDate, task.status)) {
        return { ...task, status: 'Overdue' };
      } else if (this.isTaskInProgress(task.startDate, task.endDate, task.status)) {
        return { ...task, status: 'In Progress' };
      } else {
        return task;
      }
    });

    this.setState({
      submittedData: updatedData,
    });
  }

  componentDidMount() {
    this.intervalId = setInterval(() => this.updateTaskStatuses());
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  loadFromLocalStorage() {
    const storedData = localStorage.getItem('userProfile');
    return storedData ? JSON.parse(storedData) : null;
  }

  saveToLocalStorage(data) {
    localStorage.setItem('userProfile', JSON.stringify(data));
  }

  handleTaskSubmit(formData) {
    const currentDate = new Date();
    let completedDate = '';
    if (formData.status === 'Completed') {
      completedDate = currentDate.toLocaleString();
    }
  
    const taskWithStatus = {
      ...formData,
      completedDate: completedDate,
    };
  
    if (this.state.editMode) {
      const updatedSubmittedData = this.state.submittedData.map((data, index) =>
        (index === this.state.editIndex ? taskWithStatus : data)
      );
  
      this.setState({
        submittedData: updatedSubmittedData,
        editedTaskData: null,
        editMode: false,
      });
  
      this.saveToLocalStorage(updatedSubmittedData);
    } else {
      this.setState((prevState) => ({
        input: formData.task,
        submittedData: [...prevState.submittedData, taskWithStatus],
        showSuccessModal: true,
      }));
  
      this.saveToLocalStorage([...this.state.submittedData, taskWithStatus]);
    }
  }


  handleEdit(index) {
    const editedTaskData = this.state.submittedData[index];
    this.setState({
      editedTaskData,
      editMode: true,
      editIndex: index,
    });

    const tableRef = document.getElementById('table');
    if (tableRef) {
      tableRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  handleDelete(index) {
    const taskToDelete = this.state.submittedData[index].task;
    this.setState({
      showDeleteModal: true,
      deleteIndex: index,
      taskToDelete: taskToDelete
    });
  }

  confirmDelete = () => {
    const { deleteIndex, submittedData } = this.state;
    const taskToDelete = submittedData[deleteIndex].task;
    const updatedSubmittedData = [...submittedData];
    updatedSubmittedData.splice(deleteIndex, 1);
  
    this.setState({
      submittedData: updatedSubmittedData,
      showDeleteModal: false,
      deleteIndex: null,
      taskToDelete: taskToDelete,
      showTaskDeletedModal: true
    });
  
    this.saveToLocalStorage(updatedSubmittedData);
  
    setTimeout(() => {
      this.setState({ showTaskDeletedModal: false });
    }, 3000);
  };
  

  isTaskOverdueAndInProgress(dueDate, status) {
    const currentDate = new Date();
    const dueDateObject = new Date(dueDate);
    dueDateObject.setSeconds(59, 0);

    return dueDateObject < currentDate && status !== 'Completed';
  }

  isTaskInProgress(startDate, endDate, status) {
    const currentDate = new Date();
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);

    if (
      status === 'Not Started' &&
      currentDate >= startDateObject &&
      currentDate <= endDateObject
    ) {
      return true;
    }

    return false;
  }

  handleCheckboxChange(index) {
    console.log('Checkbox clicked:', index);
    const { showModal, confirmIndex, submittedData } = this.state;
    if (!showModal && confirmIndex === null) {
      const task = submittedData[index];
  
      if (task.status !== 'Completed') {
        this.setState({ showModal: true, confirmIndex: index });
      }
    }
  }
  

  handleCloseModal = () => {
    this.setState({ showModal: false, confirmIndex: null });
  };

  handleConfirmComplete = () => {
    const { confirmIndex } = this.state;
    if (confirmIndex !== null) {
      const currentDate = new Date();
      const formattedCompletionDate = currentDate.toLocaleString();

      const updatedData = this.state.submittedData.map((data, dataIndex) => {
        if (dataIndex === confirmIndex) {
          let status = 'Completed';
          if (data.status === 'Overdue') {
            status = 'Completed but Overdue';
          }
          return { ...data, status: status, completedDate: formattedCompletionDate };
        }
        return data;
      });

      this.saveToLocalStorage(updatedData);

      this.setState({
        submittedData: updatedData,
        showModal: false,
        confirmIndex: null,
      });
    }
  };

  isTaskOverdueAndCompleted(task) {
    const currentDate = new Date();
    const dueDate = new Date(task.endDate);
    return task.status === 'Overdue' && task.completedDate && new Date(task.completedDate) <= currentDate && new Date(task.completedDate) > dueDate;
  }

  handleCloseSuccessModal() {
    this.setState({ showSuccessModal: false }, () => {
      setTimeout(() => {
        const lastRow = document.querySelector('.custom-table tbody tr:last-child');
        if (lastRow) {
          lastRow.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 300); 
    });
  }

  handleModalCheckboxChange(taskId) {
    this.setState(prevState => {
      const tasksToComplete = [...prevState.tasksToComplete];
      const taskIndex = tasksToComplete.indexOf(taskId);
      if (taskIndex !== -1) {
        tasksToComplete.splice(taskIndex, 1); 
      } else {
        tasksToComplete.push(taskId); 
      }
      return { tasksToComplete };
    });
  }
  
  toggleTaskToComplete(index) {
    this.setState(prevState => {
      const tasksToComplete = [...prevState.tasksToComplete];
      const taskIndex = tasksToComplete.indexOf(index);
      if (taskIndex !== -1) {
        tasksToComplete.splice(taskIndex, 1); 
      } else {
        tasksToComplete.push(index); 
      }
      return { tasksToComplete };
    });
  }

  handleConfirmCompleteAll() {
    const currentDate = new Date().toLocaleString();
    const updatedData = this.state.submittedData.map((task, index) => {
        if (task.status === 'Overdue' && !task.completedDate) {
            return { ...task, status: 'Completed but Overdue', completedDate: currentDate };
        } else if (!task.completedDate) {
            return { ...task, status: 'Completed', completedDate: currentDate };
        }
        return task;
    });

    this.setState(prevState => ({
        selectAllChecked: false,
        checkedStatus: Array(updatedData.length).fill(false),
        showCompleteDeleteModal: false,
        submittedData: updatedData,
        tasksToComplete: [],
        selectAllCompleteChecked: false
    }), () => {
        this.saveToLocalStorage(updatedData);
    });
}

  handleTabSelect(key) {
  if (key === 'complete') {
    this.setState({ showCompleteDeleteModal: true });
  } else if (key === 'delete') {
    this.setState({ showCompleteDeleteModal: true });
  }
}

  handleTaskToDeleteChange(taskId) {
    this.setState(prevState => ({
      tasksToDelete: prevState.tasksToDelete.includes(taskId)
        ? prevState.tasksToDelete.filter(id => id !== taskId) 
        : [...prevState.tasksToDelete, taskId] 
    }));
  }

  handleDeleteAll = () => {
    const { submittedData, tasksToDelete } = this.state;
    const updatedSubmittedData = submittedData.filter((task, index) => !tasksToDelete.includes(index));
  
    this.setState({
      submittedData: updatedSubmittedData,
      showTaskDeletedModal: true,
      showCompleteDeleteModal: false,
      tasksToDelete: [],
      selectAllDeleteChecked: false
    });
  
    this.saveToLocalStorage(updatedSubmittedData);
  
    setTimeout(() => {
      this.setState({ showTaskDeletedModal: false });
    }, 3000);
  };

  handleSelectAllComplete() {
    this.setState(prevState => ({
      selectAllCompleteChecked: !prevState.selectAllCompleteChecked,
      tasksToComplete: !prevState.selectAllCompleteChecked
        ? this.state.submittedData
            .filter(task => (task.status !== 'Completed' && !task.completedDate) || task.status === 'Overdue')
            .map((_, index) => index)
        : [],
    }));
  }
  

  handleSelectAllDelete() {
    this.setState(prevState => ({
      selectAllDeleteChecked: !prevState.selectAllDeleteChecked,
      tasksToDelete: prevState.selectAllDeleteChecked
        ? []
        : this.state.submittedData.map((_, index) => index),
    }));
  }
  
  render() {
    const updatedData = this.state.submittedData.map(task => {
      if (this.isTaskOverdueAndInProgress(task.endDate, task.status)) {
        return { ...task, status: 'Overdue' };
      } else if (this.isTaskInProgress(task.startDate, task.endDate, task.status)) {
        return { ...task, status: 'In Progress' };
      } else {
        return task;
      }
    });

    return (
      <div>
        <Modal show={this.state.showDeleteModal} onHide={() => this.setState({ showDeleteModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete the task {this.state.taskToDelete}?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.setState({ showDeleteModal: false })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Did you really complete the task?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleConfirmComplete}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showTaskDeletedModal} onHide={() => this.setState({ showTaskDeletedModal: false })}>
          <Modal.Header closeButton>
              <Modal.Title>Task Deleted</Modal.Title>
          </Modal.Header>
          <Modal.Body>The task has been deleted.</Modal.Body>
      </Modal>

        <Modal show={this.state.showSuccessModal} onHide={() => this.setState({ showSuccessModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Your new task <strong>{this.state.input}</strong> has been added to the list.
          </Modal.Body>
          <Modal.Footer>
          <Button variant="primary" onClick={this.handleCloseSuccessModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showCompleteDeleteModal} onHide={() => this.setState({ showCompleteDeleteModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Complete/Delete All Tasks</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs defaultActiveKey="complete" onSelect={this.handleTabSelect}>
            <Tab eventKey="complete" title="Complete All">
                  <Form.Group controlId="completeAllCheckbox">
                      <Form.Check
                          type="checkbox"
                          label="Check All"
                          checked={this.state.selectAllCompleteChecked}
                          onChange={() => this.handleSelectAllComplete()}
                      />
                  </Form.Group>
                  <p>Are you sure you want to complete all remaining tasks?</p>
                  <ol>
                      {this.state.submittedData
                          .filter(task => task.status !== 'Completed' && !task.completedDate)
                          .map((task, index) => (
                              <li key={index}>{task.task}</li>
                          ))}
                  </ol>
                  <Button variant="primary" onClick={this.handleConfirmCompleteAll}>Complete All Tasks</Button>
              </Tab>
              <Tab eventKey="delete" title="Delete All">
                <Form.Group controlId="deleteAllCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Check All"
                    checked={this.state.selectAllDeleteChecked}
                    onChange={() => this.handleSelectAllDelete()}
                  />
                </Form.Group>
                <p>Are you sure you want to delete all tasks?</p>
                <Form>
                  {this.state.submittedData.map((task, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={task.task}
                      checked={this.state.tasksToDelete.includes(index)}
                      onChange={() => this.handleTaskToDeleteChange(index)}
                    />
                  ))}
                </Form>
                <Button variant="primary" onClick={this.handleDeleteAll}>
                  Delete All Tasks
                </Button>
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.setState({ showCompleteDeleteModal: false })}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <TaskForm onSubmit={this.handleTaskSubmit} editedData={this.state.editedTaskData} taskName={this.state.input} />

        <Form className='edit-font'>
          <InputGroup className='my-3'>
            <Form.Control style={{ color: '#F4512C'}} onChange={(e) => this.setState({ search: e.target.value })} placeholder='Search Status' />
          </InputGroup>
        </Form>


        <Table className="mt-3 custom-table" bordered hover responsive >
          <thead className='text-center'>
            <tr>
            <th className='edit-font'>
                <Form.Check
                  aria-label="Select all tasks"
                  checked={this.state.selectAllChecked}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (!checked) {
                      this.setState({ selectAllChecked: false });
                    } else {
                      this.setState({ showCompleteDeleteModal: true });
                    }
                  }}
                />
              </th>
              <th className='edit-font' style={{color:'#F8FFFE'}}>#</th>
              <th className='edit-font' style={{color:'#F8FFFE'}}>Task</th>
              <th className='edit-font' style={{color:'#F8FFFE'}}>Status</th>
              <th className='edit-font' style={{color:'#F8FFFE'}}>Start Date</th>
              <th className='edit-font' style={{color:'#F8FFFE'}}>Due by:</th>
              <th className='edit-font' style={{color:'#F8FFFE'}}>Actions</th>
              <th className='edit-font' style={{color:'#F8FFFE'}}>Completed by:</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {updatedData
              .filter(data => data.status.toLowerCase().includes(this.state.search.toLowerCase()))
              .map((data, index) => (
                <tr
                  key={index}
                  className={
                    this.isTaskOverdueAndInProgress(data.endDate, data.status)
                      ? 'table-danger'
                      : data.status === 'Completed'
                      ? 'table-success'
                      : data.status === 'Overdue'
                      ? 'table-danger'
                      : 'table-light'
                  }
                >
                  <td className='edit-font' >
                    <Form.Check
                      aria-label="option 1"
                      checked={this.state.checkedStatus[index] || false}
                      onChange={() => this.handleCheckboxChange(index)}
                      disabled={data.completedDate || data.status === 'Completed'}
                    />
                  </td>
                  <td className='edit-font' style={{color:'#5E1B89'}}>{index + 1}</td>
                  <td className='edit-font' style={{color:'#5E1B89'}}>{data.task}</td>
                  <td className='edit-font' style={{color:'#5E1B89'}}>{data.status}</td>
                  <td className='edit-font' style={{color:'#5E1B89'}}>{new Date(data.startDate).toLocaleString()}</td>
                  <td className='edit-font' style={{color:'#5E1B89'}}>{new Date(data.endDate).toLocaleString()}</td>
                  <td className='edit-font' style={{color:'#5E1B89'}}>
                    <Button className='ms-0 ms-md-3 ' onClick={() => this.handleEdit(index)} disabled={data.completedDate || data.status === 'Completed'}>
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button variant='danger' className='ms-0 ms-md-3 ' onClick={() => this.handleDelete(index)}>
                      <i className="bi bi-trash-fill"></i>
                    </Button>
                  </td>
                  <td className='edit-font' style={{color:'#5E1B89'}}>{data.completedDate}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Todo;