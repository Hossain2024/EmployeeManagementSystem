
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app= express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user : "root",
    password:'Roza2002',
    database:'Emp_Management',
    port:3306
})

app.get('/', (re, res)=>{
    return res.json("from backend side");
})

/**
 * retrieve email data
 */
app.get('/Email', (req, res)=> {
    const sql = "SELECT* FROM Email";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})


app.listen(8081, ()=>{
    console.log("listening")

})

/**
 * Add
 */
app.post('/Employee', (req, res) => {
    const {
        FirstName,
        LastName,
        Gender,
        DOB,
        JoinDate,
        Ethnicity,
        Street_ID,
        City_ID,
        ZipCodeID,
        Schedule_ID,
        Role_ID,
        CountryID,
        AttendanceID,
        Emp_Status
    } = req.body;

    // SQL query to insert data
    const sql = `INSERT INTO Employee (FirstName, LastName, Gender, DOB, JoinDate, Ethnicity, 
        Street_ID, City_ID, ZipCodeID, Schedule_ID, Role_ID, CountryID, AttendanceID, Emp_Status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    
    const values = [FirstName, LastName, Gender, DOB, JoinDate, Ethnicity, Street_ID, City_ID, 
                    ZipCodeID, Schedule_ID, Role_ID, CountryID, AttendanceID, Emp_Status];

    // Execute the query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: err.message });
        }

        return res.status(201).json({ message: 'Employee created successfully!', data: result });
    });
});

app.get('/Employee', (req, res)=> {
    const sql = "SELECT* FROM Employee";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

/**
 * edit an emplyee
 */

app.put('/Employee/:id', (req, res) => {
    const employeeId = req.params.id; 
    const {
        FirstName,
        LastName,
        Gender,
        DOB,
        JoinDate,
        Ethnicity,
        Street_ID,
        City_ID,
        ZipCodeID,
        Schedule_ID,
        Role_ID,
        CountryID,
        AttendanceID,
        Emp_Status
    } = req.body;

    // Create the SQL query to update the data
    const sql = `UPDATE Employee 
                 SET FirstName = ?, 
                     LastName = ?, 
                     Gender = ?, 
                     DOB = ?, 
                     JoinDate = ?, 
                     Ethnicity = ?, 
                     Street_ID = ?, 
                     City_ID = ?, 
                     ZipCodeID = ?, 
                     Schedule_ID = ?, 
                     Role_ID = ?, 
                     CountryID = ?, 
                     AttendanceID = ?, 
                     Emp_Status = ? 
                 WHERE EmployeeID = ?`;

    // Values to update
    const values = [FirstName, LastName, Gender, DOB, JoinDate, Ethnicity, Street_ID, City_ID,
                    ZipCodeID, Schedule_ID, Role_ID, CountryID, AttendanceID, Emp_Status, employeeId];

    // Execute the query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json({ message: 'Employee updated successfully!', data: result });
    });
});

// Get attendance status by employee name
app.get('/attendance', (req, res) => {
    const { FirstName, LastName } = req.query;

    if (!FirstName || !LastName) {
        return res.status(400).json({ error: "FirstName and LastName are required" });
    }

    const sql = `
        SELECT e.FirstName, e.LastName, a.Status 
        FROM Employee e 
        JOIN AttendanceStatus a ON e.AttendanceID = a.AttendanceID 
        WHERE e.FirstName = ? AND e.LastName = ?;
    `;

    db.query(sql, [FirstName, LastName], (err, result) => {
        if (err) {
            console.error('Error fetching attendance:', err);
            return res.status(500).json({ error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(result[0]);
    });
});

app.post('/assignProject', (req, res) => {
    const { FirstName, LastName, ProjectName, AssignedDate } = req.body;

    // SQL query to assign the project
    const sql = `
        INSERT INTO Assigned_Project (EmployeeID, ProjectID, Assigned_Date)
        VALUES (
            (SELECT EmployeeID FROM Employee WHERE FirstName = ? AND LastName = ?),
            (SELECT ProjectID FROM Project WHERE Name = ?),
            ?
        );
    `;

    db.query(sql, [FirstName, LastName, ProjectName, AssignedDate], (err, result) => {
        if (err) {
            console.error('Error assigning project:', err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee or project not found' });
        }

        return res.status(201).json({ message: 'Project assigned successfully!', data: result });
    });
});


// get all the assinged project
app.get('/projects', (req, res) => {
    const query = 'SELECT * FROM Project;';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching projects' });
        }
        res.status(200).json(results);
    })
})
//get all projects
app.get('/Assigned_Project', (req, res)=> {
    const sql = "SELECT* FROM Assigned_Project";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

//get all the employees assinged to a particualr project 
app.get('/employeesForProject/:projectID', (req, res) => {
    const projectID = req.params.projectID;
    
    // SQL query to join Assigned_Project with Employee to get first and last names
    const query = `
        SELECT e.FirstName, e.LastName
        FROM Assigned_Project ap
        JOIN Employee e ON ap.EmployeeID = e.EmployeeID
        WHERE ap.ProjectID = ?
    `;
    
    db.query(query, [projectID], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching employees for the project' });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: 'No employees found for this project' });
        }
        res.status(200).json(results);
    });
});
