import React, { useState, useEffect } from 'react';

function Managers() {
    const [managers, setManagers] = useState([]);
  
    useEffect(() => {
      fetch('http://localhost:8081/managers')
        .then((res) => res.json())
        .then((data) => setManagers(data))
        .catch((err) => console.error('Error fetching managers:', err));
    }, []);
  
    return (
      <div>
        <h2>Managers</h2>
        <table>
          <thead>
            <tr>
              <th>Manager ID</th>
              <th>Manager Name</th>
              <th>Department</th>
              <th>Employees</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.ManagerID}>
                <td>{manager.ManagerID}</td>
                <td>{manager.ManagerFirstName} {manager.ManagerLastName}</td>
                <td>{manager.DepartmentName}</td>
                <td>
                  <ul>
                    {manager.Employees.length > 0 ? (
                      manager.Employees.map((employee) => (
                        <li key={employee.EmployeeID}>
                          {employee.EmployeeFirstName} {employee.EmployeeLastName}
                        </li>
                      ))
                    ) : (
                      <li>No employees under this manager</li>
                    )}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <style>
          {`
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
          `}
        </style>
      </div>
    );
}

export default Managers;