/**
 * Approved leaverequest component, shows the first name and last name of emplyess that 
 * are on leave 
 */

import { useState, useEffect } from 'react';

function ApprovedLeaveRequests() {
  const [approvedRequests, setApprovedRequests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/leave-requestslist')
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data
          .filter(request => request.Status === 'Approved')
          .reduce((acc, current) => {
            if (!acc.find(item => item.EmployeeID === current.EmployeeID)) {
              acc.push(current);
            }
            return acc;
          }, []);
        setApprovedRequests(filteredData);
      })
      .catch((err) => console.error('Error fetching approved leave requests:', err));
  }, []);

  return (
    <div>
      <h2>Approved Leave Requests</h2>
      <ul>
        {approvedRequests.map((request) => (
          <li key={request.EmployeeID}>
            {request.FirstName} {request.LastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApprovedLeaveRequests;
