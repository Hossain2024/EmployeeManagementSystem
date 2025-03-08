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
    <p>Due to time constraints, we were only able to implement a few UI features. To test the available functionality, you will need to manually insert data into some tables. Please follow the steps below to set up the project and run both the backend and frontend. Use the followig script to genrate data into the databse</p>

    <h3>Setting up the Backend</h3>
    <ol>
        <li>Navigate to the backend directory:
            <pre><code>cd EmployeeManagementBackend</code></pre>
        </li>
        <li>Ensure you are connected to your MySQL database by configuring the following in your database connection file:
            <pre><code>const db = mysql.createConnection({
    host: "your database host",
    user: "your database user",
    password: "your database password if any",
    database: "Emp_Management",
    port: database port
});</code></pre>
        </li>
        <li>Install dependencies:
            <pre><code>npm install</code></pre>
        </li>
        <li>Install Express:
            <pre><code>npm install express</code></pre>
        </li>
        <li>Install CORS:
            <pre><code>npm install cors</code></pre>
        </li>
        <li>Run the backend server:
            <pre><code>npm start</code></pre>
        </li>
    </ol>

    <h3>Setting up the Frontend</h3>
    <ol>
        <li>Navigate to the frontend directory:
            <pre><code>cd EmployeeManagementSystem</code></pre>
        </li>
        <li>Install dependencies:
            <pre><code>npm install</code></pre>
        </li>
        <li>Start the frontend server:
            <pre><code>npm run dev</code></pre>
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

