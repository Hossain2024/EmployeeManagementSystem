import { useState, useEffect } from 'react';

function AssignTrainingForm() {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Name: '',
    Title: '',
    Status: 'ongoing'
  });

  useEffect(() => {
    fetch('http://localhost:8081/Employee')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error('Error fetching employees:', err));

    fetch('http://localhost:8081/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error fetching projects:', err));

    fetch('http://localhost:8081/training')
      .then(res => res.json())
      .then(data => setTrainings(data))
      .catch(err => console.error('Error fetching trainings:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/assign-training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => console.error('Error submitting form:', err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Assign Training to Employee</h2>
      
      <label>Employee:</label>
      <select name="FirstName" onChange={handleChange} required>
        <option value="">Select First Name</option>
        {employees.map(emp => (
          <option key={emp.EmployeeID} value={emp.FirstName}>{emp.FirstName}</option>
        ))}
      </select>

      <select name="LastName" onChange={handleChange} required>
        <option value="">Select Last Name</option>
        {employees.map(emp => (
          <option key={emp.EmployeeID} value={emp.LastName}>{emp.LastName}</option>
        ))}
      </select>

      <label>Project:</label>
      <select name="Name" onChange={handleChange} required>
        <option value="">Select Project</option>
        {projects.map(proj => (
          <option key={proj.ProjectID} value={proj.ProjectName}>{proj.ProjectName}</option>
        ))}
      </select>

      <label>Training:</label>
      <select name="Title" onChange={handleChange} required>
        <option value="">Select Training</option>
        {trainings.map(train => (
          <option key={train.TrainingID} value={train.Title}>{train.Title}</option>
        ))}
      </select>

      <label>Status:</label>
      <input type="text" name="Status" value={formData.Status} onChange={handleChange} required />

      <button type="submit">Assign Training</button>
    </form>
  );
}

export default AssignTrainingForm;
