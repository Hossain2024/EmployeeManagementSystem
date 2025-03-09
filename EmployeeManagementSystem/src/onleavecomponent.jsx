/**
 * pending leave request component , shows first and last nae of employees whos leave requests are pending 
 */

import { useState, useEffect } from 'react';

function PendingLeaveRequests() {
  const [pendingRequests, setPendingRequests] = useState([]);
 
  useEffect(() => {
    fetch('http://localhost:8081/leave-requestslist')
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(request => request.Status === 'Pending');
        setPendingRequests(filteredData);
      })
      .catch((err) => console.error('Error fetching pending leave requests:', err));
  }, []);

  return (
    <div>
      <ul>
        {pendingRequests.map((request, index) => (
          <li key={index}>
            {request.FirstName} {request.LastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingLeaveRequests;