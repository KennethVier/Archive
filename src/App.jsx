import { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Modal, Button, Form, Navbar } from 'react-bootstrap';
import Todo from '../components/todocom';
import { useMediaQuery } from 'react-responsive';
import './app.scss';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const containerRef = useRef(null); 

  const isMediumScreen = useMediaQuery({ maxWidth: 768 }); 
  const isSmallScreen = useMediaQuery({maxWidth: 576});
  

  const handleCloseModal = () => {
    setShowModal(false);
    setShowConfirmation(false);
  };

  const handleSaveNotificationInfo = () => {
    console.log('Email:', email);
    console.log('Contact Number:', contactNumber);
    
    setShowModal(false);
    setShowConfirmation(false);
  };

  const handleConfirmNotification = () => {
    setShowConfirmation(false);
    setShowModal(true);
  };

  const handleCancelNotification = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    const updateMousePosition = (ev) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = ev;
      containerRef.current.style.setProperty("--x", `${clientX}px`);
      containerRef.current.style.setProperty("--y", `${clientY}px`);
    };
  
    if (!isMediumScreen) {
      document.addEventListener('mousemove', updateMousePosition);
    }
  
    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
    };
  }, [isMediumScreen]); 
 
  return (
    <>
    <Container fluid ref={containerRef} className="hero">
    <Navbar className={`justify-content-${isSmallScreen ? 'around' : 'between'}`}>
      <Navbar.Brand>
        <h2 className='edit-size'>ToDo List <i className="bi bi-list-task"></i></h2>
      </Navbar.Brand>
  <Navbar.Brand>
    {isSmallScreen ? (
      <img 
        alt="Lexmeet Logo for small screens"
        src="/src/assets/smaller.png"
        height={40}
      />
    ) : (
      <img 
        alt="Lexmeet Logo"
        src="/src/assets/logo.png"
        height={40}
      />
    )}
  </Navbar.Brand>
</Navbar>
      
        <Row>
          <Col>
            <h3 className='text-center py-5 task'>
              ADD TASK
            </h3>
            <Todo />
          </Col>
        </Row>

        <Modal show={showConfirmation} onHide={handleCancelNotification}>
          <Modal.Header closeButton>
            <Modal.Title>Notification Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to get notified?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelNotification}>
              No
            </Button>
            <Button variant="primary" onClick={handleConfirmNotification}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Notification Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address:</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group controlId="formContactNumber">
                <Form.Label>Contact Number:</Form.Label>
                <Form.Control type="text" placeholder="Enter your contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveNotificationInfo}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default App;
