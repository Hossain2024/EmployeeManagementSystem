import React, { useState, useEffect } from 'react';

// Employee info page
function Employees() {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
  
    const [newEmployee, setNewEmployee] = useState({
      FirstName: '',
      LastName: '',
      Gender: '',
      DOB: '',
      JoinDate: '',
      Ethnicity: '',
      Address: '',
      ZipCode: '',
      City: '',
      State: 'Washington',
      Country: 'USA',
    });
  
    const handleSearch = async (searchQuery) => {
      if (!searchQuery.trim()) {
          // If search query is empty, fetch all employees instead
          fetch('http://localhost:8081/employees')
              .then((res) => res.json())
              .then((data) => setEmployees(data))
              .catch((err) => console.error("Error fetching employees:", err));
          return;
      }
  
      try {
          const response = await fetch(`http://localhost:8081/search-employees?query=${encodeURIComponent(searchQuery)}`);
          if (!response.ok) throw new Error("Error searching employees");
          
          const data = await response.json();
          setEmployees(data);
      } catch (error) {
          console.error("Search error:", error);
      }
    };
    
    const handleAddEmployee = (e) => {
      e.preventDefault(); 
      console.log("Submitting employee:", newEmployee); 
    
      fetch('http://localhost:8081/add-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("Employee added successfully!");
          setEmployees((prevEmployees) => [
            ...prevEmployees,
            { ...newEmployee, EmployeeID: data.employeeId },
          ]);
          closeModal();
        } else {
          alert("Error adding employee");
        }
      })
      .catch((err) => console.error("Error adding employee:", err));
    };
  
    const openModal = (action) => {
      setModalTitle(action);
      if (action === 'Add Employee') {
        setNewEmployee({
          FirstName: '',
          LastName: '',
          Gender: '',
          DOB: '',
          JoinDate: '',
          Ethnicity: '',
          Address: '', 
          City: '',
          ZipCode: '',
          State: 'Washington', 
          Country: 'USA',      
        });
      }
      setShowModal(true);
  };
  
    const closeModal = () => setShowModal(false);
  
    useEffect(() => {
      fetch('http://localhost:8081/employees') 
        .then((res) => res.json())
        .then((data) => setEmployees(data))
        .catch((err) => console.error('Error fetching employees:', err));

      fetch('http://localhost:8081/roles')
        .then((res) => res.json())
        .then((data) => setRoles(data))
        .catch((err) => console.error('Error fetching roles:', err));
    }, []);


    // Handle employee actions (view, edit, update role)
    const handleAction = (employee, action) => {
      setSelectedEmployee(employee);
      setModalTitle(action.charAt(0).toUpperCase() + action.slice(1));
      setShowModal(true);
      if (action === 'view') {
        fetch(`http://localhost:8081/employee/${employee.EmployeeID}`)
          .then((res) => res.json())
          .then((data) => {
            setSelectedEmployee(data);
            setModalTitle("Employee Profile");
            setShowModal(true);
          })
          .catch((err) => console.error("Error fetching employee details:", err));
      } else if (action === 'edit') {
        fetch(`http://localhost:8081/employee/${employee.EmployeeID}`)
        .then((res) => res.json())
        .then((data) => {
          setSelectedEmployee({
            ...data,
            DOB: data.DOB ? data.DOB.split('T')[0] : '', 
            JoinDate: data.JoinDate ? data.JoinDate.split('T')[0] : ''
          });
          setModalTitle("Edit Employee");
          setShowModal(true);
        })
        .catch((err) => console.error("Error fetching employee details:", err));
      }
    };

    const handleEditEmployee = (e) => {
        e.preventDefault();
      
        fetch(`http://localhost:8081/update-employee/${selectedEmployee.EmployeeID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedEmployee),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            alert("Employee updated successfully!");
            fetch('http://localhost:8081/employees')
              .then((res) => res.json())
              .then((updatedEmployees) => {
                setEmployees(updatedEmployees); 
              })
              .catch((err) => console.error('Error fetching employees:', err));
      
            closeModal();
          } else {
            alert("Error updating employee");
          }
        })
        .catch((err) => console.error("Error updating employee:", err));
      };
  
    const toggleEmployeeStatus = () => {
    const updatedStatus = selectedEmployee.Emp_Status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
  
    fetch(`http://localhost:8081/update-employee-status/${selectedEmployee.EmployeeID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Emp_Status: updatedStatus }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        alert(`Employee ${updatedStatus === "ACTIVE" ? "activated" : "deactivated"} successfully!`);
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.EmployeeID === selectedEmployee.EmployeeID
              ? { ...emp, Emp_Status: updatedStatus }
              : emp
          )
        );
        setSelectedEmployee((prevSelectedEmployee) => ({
          ...prevSelectedEmployee,
          Emp_Status: updatedStatus,
        }));
      } else {
        alert("Error updating employee status");
      }
    })
    .catch((err) => console.error("Error updating employee status:", err));
    };
  
    return (
      <div>
        <h2>Employee Information</h2>
        <input
          type="text"
          placeholder="Search employees..."
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e.target.value);
            }
          }}
          style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
        />
        <button onClick={() => openModal("Add Employee")}>Add Employee</button>
  
        {/* Employee List */}
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.EmployeeID}>
                <td>{employee.EmployeeID}</td>
                <td>{employee.FirstName}</td>
                <td>{employee.LastName}</td>
                <td>
                  {employee.Skills ? (
                    <span style={{ fontSize: "12px", color: "gray" }}> ({employee.Skills})</span>
                  ) : "No Skills added yet"}
                </td>
                <td>
                  <div className="dropdown">
                    <button className="dropbtn">Options</button>
                    <div className="dropdown-content">
                      <button onClick={() => handleAction(employee, 'view')}>View</button>
                      <button onClick={() => handleAction(employee, 'edit')}>Edit</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closeModal}>X</button>
              <h2>{modalTitle}</h2> 
              {modalTitle === "Employee Profile" && selectedEmployee && (
                <div>
                  <p><strong>Employee ID:</strong> {selectedEmployee.EmployeeID}</p>
                  <p><strong>Name:</strong> {selectedEmployee.FirstName} {selectedEmployee.LastName}</p>
                  <p><strong>Role:</strong> {selectedEmployee.Role}</p>
                  <p><strong>Department:</strong> {selectedEmployee.Department}</p>
                  <p><strong>Work Schedule:</strong> {selectedEmployee.Schedule || "Not Assigned"}</p>
                  <p><strong>Gender:</strong> {selectedEmployee.Gender}</p>
                  <p><strong>Date of Birth:</strong> {selectedEmployee.DOB}</p>
                  <p><strong>Join Date:</strong> {selectedEmployee.JoinDate}</p>
                  <p><strong>Ethnicity:</strong> {selectedEmployee.Ethnicity}</p>
                 
                  <p><strong>Phone Numbers:</strong></p>
                  <ul>
                    {selectedEmployee.PhoneNumbers?.split(', ').map((phone, index) => (
                      <li key={index}>{phone} ({selectedEmployee.PhoneTypes?.split(', ')[index]})</li>
                    ))}
                  </ul>
                  <p><strong>Emails:</strong></p>
                  <ul>
                    {selectedEmployee.EmailAddresses?.split(', ').map((email, index) => (
                      <li key={index}>{email} ({selectedEmployee.EmailTypes?.split(', ')[index]})</li>
                    ))}
                  </ul>
                  <p><strong>Address:</strong> {selectedEmployee.FullAddress}</p>
  
                  <div className="account-status">
                    <p><strong>Account Status:</strong> {selectedEmployee.Emp_Status}</p>
                  </div>
  
                  <p><strong>Attendance Status: </strong> 
                    <span style={{ color: selectedEmployee.AttendanceStatus === 'ACTIVE' ? 'green' : 'red' }}>
                      {selectedEmployee.AttendanceStatus}
                    </span>
                  </p>
  
                  {/* Deactivate Button */}
                  <button
                    style={{
                      backgroundColor: selectedEmployee.Emp_Status === "ACTIVE" ? "red" : "green",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      position: "absolute",
                      bottom: "20px",
                      right: "20px",
                    }}
                    onClick={toggleEmployeeStatus}
                  >
                    {selectedEmployee.Emp_Status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              )}
              {modalTitle === "Edit Employee" && selectedEmployee && (
                <form onSubmit={handleEditEmployee}>
                  <div>
                    <label>First Name:</label>
                    <input
                      type="text"
                      value={selectedEmployee.FirstName}
                      onChange={(e) => setSelectedEmployee({ ...selectedEmployee, FirstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Last Name:</label>
                    <input
                      type="text"
                      value={selectedEmployee.LastName}
                      onChange={(e) => setSelectedEmployee({ ...selectedEmployee, LastName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Gender:</label>
                    <input
                      type="text"
                      value={selectedEmployee.Gender}
                      onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Gender: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Date of Birth:</label>
                    <input
                      type="date"
                      value={selectedEmployee.DOB}
                      onChange={(e) => setSelectedEmployee({ ...selectedEmployee, DOB: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Join Date:</label>
                    <input
                      type="date"
                      value={selectedEmployee.JoinDate}
                      onChange={(e) => setSelectedEmployee({ ...selectedEmployee, JoinDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Ethnicity:</label>
                    <input
                      type="text"
                      value={selectedEmployee.Ethnicity}
                      onChange={(e) => setSelectedEmployee({ ...selectedEmployee, Ethnicity: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit">Update Employee</button>
                </form>
              )}
  
              {modalTitle === "Add Employee" && (    
                <form onSubmit={handleAddEmployee}>
                  <div>
                    <label>First Name:</label>
                    <input
                      type="text"
                      value={newEmployee.FirstName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, FirstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Last Name:</label>
                    <input
                      type="text"
                      value={newEmployee.LastName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, LastName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Gender:</label>
                    <input
                      type="text"
                      value={newEmployee.Gender}
                      onChange={(e) => setNewEmployee({ ...newEmployee, Gender: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Date of Birth:</label>
                    <input
                      type="date"
                      value={newEmployee.DOB}
                      onChange={(e) => setNewEmployee({ ...newEmployee, DOB: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Join Date:</label>
                    <input
                      type="date"
                      value={newEmployee.JoinDate}
                      onChange={(e) => setNewEmployee({ ...newEmployee, JoinDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Ethnicity:</label>
                    <input
                      type="text"
                      value={newEmployee.Ethnicity}
                      onChange={(e) => setNewEmployee({ ...newEmployee, Ethnicity: e.target.value })}
                      required
                    />
                  </div>
                  {/* Add other fields (e.g., Street_ID, City_ID, etc.) here as needed */}
  
                  <button type="submit">Add Employee</button>
                </form>
              )}
            </div>
          </div>
        )}
        
        {/* Styling for Larger Modal */}
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
  
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
            }
            
            .modal-content {
              background: white;
              width: 600px; /* Adjust width */
              height: 600px; /* Adjust height */
              padding: 30px;
              border-radius: 10px;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            
            .modal-content h2 {
              position: absolute;
              top: 15px;
              left: 15px;
              margin: 0;
              font-size: 20px;
            }
  
            .close-button {
              position: absolute;
              top: 10px;
              right: 15px;
              background: none;
              border: none;
              font-size: 20px;
              cursor: pointer;
            }
  
            button {
              margin: 5px;
              padding: 5px 10px;
            }
            .dropdown {
              position: relative;
              display: inline-block;
            }
  
            .dropbtn {
              background-color: #3498db;
              color: white;
              padding: 8px;
              border: none;
              cursor: pointer;
            }
  
            .dropdown-content {
              display: none;
              position: absolute;
              background-color: white;
              min-width: 120px;
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
              z-index: 1;
            }
  
            .dropdown:hover .dropdown-content {
              display: block;
            }
  
            .dropdown-content button {
              background: none;
              border: none;
              padding: 8px;
              text-align: left;
              width: 100%;
              cursor: pointer;
            }
  
            .dropdown-content button:hover {
              background-color: #ddd;
            }
            
            .account-status {
              position: absolute;
              bottom: 15px;
              left: 15px;
              font-size: 14px;
              font-weight: bold;
              color: red;
            }
            
            .attendance-status {
              margin-top: 10px;
              font-size: 16px;
              font-weight: bold;
            }
          `}
        </style>
      </div>
    );
}

export default Employees;