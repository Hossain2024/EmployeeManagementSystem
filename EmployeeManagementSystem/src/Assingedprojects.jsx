/**
 * Assignedproject component . shows a list of project assigned to people and 
 * when clicked shows the emplyees the project is assigned to 
 */

import { useState, useEffect } from 'react';

function AssignedProject() {
  const [assignedproject, setassignedproject] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8081/Assigned_Project')
      .then((response) => response.json())
      .then((data) => setassignedproject(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const handleButtonClick = (projectName) => {
    // Fetch employees for the clicked project
    fetch(`http://localhost:8081/employeesForProject/${projectName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const employeeList = data.map(employee => (
            <li key={employee.FirstName + employee.LastName}>
              {employee.FirstName} {employee.LastName}
            </li>
          ));
          setModalContent(
            <div>
              <h3>Employees for {projectName}</h3>
              <ul>{employeeList}</ul>
            </div>
          );
        } else {
          setModalContent(<p>No employees found for this project.</p>);
        }
        setIsModalOpen(true);
      })
      .catch((err) => {
        console.error('Error fetching employees:', err);
        setModalContent(<p>Error fetching employee data.</p>);
        setIsModalOpen(true);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div>
      <h2>Assigned Projects</h2>
      <div>
        {assignedproject.map((assignedproject) => (
          <button
            key={assignedproject.ProjectID}
            onClick={() => handleButtonClick(assignedproject.Name)}
            style={{ margin: '5px', padding: '10px', cursor: 'pointer' }}
          >
            {assignedproject.Name}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            {modalContent}
            <button onClick={closeModal} style={modalStyles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#ff5733',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
};

export default AssignedProject;
