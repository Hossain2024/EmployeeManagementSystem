import { useState, useEffect } from 'react';

function AssignProjectForm() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [selectedEmployeeFirstName, setSelectedEmployeeFirstName] = useState('');
  const [selectedEmployeeLastName, setSelectedEmployeeLastName] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [message, setMessage] = useState('');

  // Fetch projects and employees
  useEffect(() => {
    fetch('http://localhost:8081/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Error fetching projects:', err));

    fetch('http://localhost:8081/Employee')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error('Error fetching employees:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      FirstName: selectedEmployeeFirstName,  // Pass employee FirstName from the form
      LastName: selectedEmployeeLastName,    // Pass employee LastName from the form
      ProjectName: selectedProjectName,      // Pass project name from the form
      AssignedDate: assignedDate,             // Pass assigned date from the form
    };

    fetch('http://localhost:8081/assignProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),  // Send the data as a JSON payload
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        setMessage(data.message);  // Set success message from the server
        alert(data.message);  // Show success message as an alert
        // Reset form fields after success
        setSelectedProjectName('');
        setSelectedEmployeeFirstName('');
        setSelectedEmployeeLastName('');
        setAssignedDate('');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage('Failed to assign the project. Please try again later.');  // Set error message
    });
  };

  return (
    <div>
      {message && <p>{message}</p>} {/* Display success/error message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectName">Project:</label>
          <select
            id="projectName"
            value={selectedProjectName}
            onChange={(e) => setSelectedProjectName(e.target.value)}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.ProjectID} value={project.ProjectName}>
                {project.ProjectName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="employeeFirstName">Employee First Name:</label>
          <select
            id="employeeFirstName"
            value={selectedEmployeeFirstName}
            onChange={(e) => setSelectedEmployeeFirstName(e.target.value)}
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.EmployeeID} value={employee.FirstName}>
                {employee.FirstName} 
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="employeeLastName">Employee Last Name:</label>
          <select
            id="employeeLastName"
            value={selectedEmployeeLastName}
            onChange={(e) => setSelectedEmployeeLastName(e.target.value)}
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.EmployeeID} value={employee.LastName}>
                 {employee.LastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assignedDate">Assigned Date:</label>
          <input
            type="date"
            id="assignedDate"
            value={assignedDate}
            onChange={(e) => setAssignedDate(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit">Assign</button>
        </div>
      </form>
    </div>
  );
}

export default AssignProjectForm;
