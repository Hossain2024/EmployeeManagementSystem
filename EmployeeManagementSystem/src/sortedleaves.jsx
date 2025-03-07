import React, { useState, useEffect } from 'react';
import './analysis.css'; 

const LeavesRequestList = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8081/leave-requests')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setLeaveRequests(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h1 className="header">Leave Requests</h1>
            <table className="leave-table">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Total Number of Requests</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveRequests.map((request, index) => (
                        <tr key={index}>
                            <td>{request.FirstName} {request.LastName}</td>
                            <td>{request.TotalNumberOfRequests}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeavesRequestList;
