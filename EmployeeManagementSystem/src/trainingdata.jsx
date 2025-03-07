import React, { useState, useEffect } from 'react';
import './assinedtraining.css'
const AssignedTrainingTable = () => {
    const [assignedTrainings, setAssignedTrainings] = useState([]);

    useEffect(() => {
        // Fetch assigned training data using fetch
        fetch('http://localhost:8081/assignedTraining')
            .then((response) => response.json())  // Parse JSON response
            .then((data) => {
                setAssignedTrainings(data);  // Set data to state
            })
            .catch((err) => console.error('Error fetching assigned training data:', err));
    }, []);

    return (
        <div className="assigned-training-container">
            <h1>Assigned Trainings</h1>
            <table className="assigned-training-table">
                <thead>
                    <tr>
                        <th>Training Title</th>
                        <th>Project Name</th>
                        <th>Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedTrainings.map((training, index) => (
                        <tr key={index}>
                            <td>{training.Title}</td>
                            <td>{training.Name}</td>
                            <td>{training.FirstName} {training.LastName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignedTrainingTable;
