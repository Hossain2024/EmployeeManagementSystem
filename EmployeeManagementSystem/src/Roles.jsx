import React, { useState, useEffect } from 'react';

function Roles() {
    const [roles, setRoles] = useState([]);
  
    useEffect(() => {
      fetch('http://localhost:8081/roles')
        .then((res) => res.json())
        .then((data) => setRoles(data))
        .catch((err) => console.error('Error fetching roles:', err));
    }, []);
  
    return (
      <div>
        <h2>Roles</h2>
        <table>
          <thead>
            <tr>
              <th>Role ID</th>
              <th>Role Name</th>
              <th>Description</th>
              <th>Number of Employees</th>
              <th>Employees</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.RoleID}>
                <td>{role.RoleID}</td>
                <td>{role.RoleName}</td>
                <td>{role.Role_Description}</td>
                <td>{role.Num_Of_Employees}</td>
                <td>{role.EmployeeList || 'No employees assigned'}</td>
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

export default Roles;