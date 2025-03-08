<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Management System</title>
</head>
<body>
    <h1>Employee Management System</h1>

    <h2>How to Run the Project</h2>
    <p>Due to time constraints, we were only able to implement a few UI features. To test the available functionality, you will need to manually insert data into some tables. Please follow the steps below to set up the project and run both the backend and frontend. Use the following script to generate data into the database.</p>

    <h3>Setting up the Backend</h3>
    <ol>
        <li>Navigate to the backend directory:
            <p>cd EmployeeManagementBackend</p>
        </li>
        <li>Ensure you are connected to your MySQL database by configuring the following in your database connection file:
            <p>const db = mysql.createConnection({</p>
            <p>host: "your database host",</p>
            <p>user: "your database user",</p>
            <p>password: "your database password if any",</p>
            <p>database: "Emp_Management",</p>
            <p>port: database port</p>
            <p>});</p>
        </li>
        <li>Install dependencies:
            <p>npm install</p>
        </li>
        <li>Install Express:
            <p>npm install express</p>
        </li>
        <li>Install CORS:
            <p>npm install cors</p>
        </li>
        <li>Run the backend server:
            <p>npm start</p>
        </li>
    </ol>

    <h3>Setting up the Frontend</h3>
    <ol>
        <li>Navigate to the frontend directory:
            <p>cd EmployeeManagementSystem</p>
        </li>
        <li>Install dependencies:
            <p>npm install</p>
        </li>
        <li>Start the frontend server:
            <p>npm run dev</p>
        </li>
        <li>Open your browser and navigate to the link displayed in the terminal to view the application.</li>
    </ol>

    <hr>

    <h2>Video Demonstration</h2>
    <p>A video clip demonstrating how to test the project is available.</p>

    <hr>
    <p>Thank you for exploring our Employee Management System!</p>
</body>
</html>
