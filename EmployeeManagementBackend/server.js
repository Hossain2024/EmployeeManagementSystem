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

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the process if the connection fails
    } else {
        console.log('Successfully connected to the database');
    }
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
 * get training
 */
app.get('/training', (req, res)=> {
    const sql = "SELECT* FROM TRAINING";
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
// assign project
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


// get all project
app.get('/projects', (req, res) => {
    const query = `
        SELECT 
            p.ProjectID, 
            p.Name AS ProjectName, 
            p.Start_Date, 
            p.Delivery_Date, 
            p.Status, 
            d.Dept_Name AS DepartmentName
        FROM 
            Project p
        JOIN 
            Department d ON p.DepartmentID = d.DepartmentID;
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching projects', err });
        }
        res.status(200).json(results);
    })
})
// assign a project 

//get all  assined projects
app.get('/Assigned_Project', (req, res) => {
    const sql = `
        SELECT 
            Assigned_Project.ProjectID, 
            Project.Name 
        FROM 
            Assigned_Project
        JOIN 
            Project 
        ON 
            Assigned_Project.ProjectID = Project.ProjectID
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


//get all the employees assinged to a particualr project 
app.get('/employeesForProject/:projectName', (req, res) => {
    const projectName = req.params.projectName;

    // SQL query to join Assigned_Project, Employee, and Project tables
    const query = `
        SELECT 
            e.FirstName, 
            e.LastName, 
            p.Name AS ProjectName
        FROM 
            Assigned_Project ap
        JOIN 
            Employee e ON ap.EmployeeID = e.EmployeeID
        JOIN 
            Project p ON ap.ProjectID = p.ProjectID
        WHERE 
            p.Name = ?
    `;
    
    db.query(query, [projectName], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching employees for the project' });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: 'No employees found for this project' });
        }
        res.status(200).json(results);
    });
});

//assign Training to certain employees 
app.post('/assign-training', (req, res) => {
    const { FirstName, LastName, Name, Title, Status } = req.body;

    if (!FirstName || !LastName || !Name || !Title || !Status) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = `
        INSERT INTO EmpTraining (EmployeeID, TrainingID, ProjectID, Status)
        VALUES (
            (SELECT EmployeeID FROM Employee WHERE FirstName = ? AND LastName = ?),
            (SELECT t.TrainingID FROM Training t 
             JOIN Project p ON t.ProjectID = p.ProjectID
             WHERE t.Title = ? AND p.Name = ?),
            (SELECT ProjectID FROM Project WHERE Name = ?),
            ?
        )
    `;

    db.query(query, [FirstName, LastName, Title, Name, Name, Status], (err, results) => {
        if (err) {
            console.error('Error assigning training:', err);
            return res.status(500).json({ error: 'Failed to assign training.' });
        }
        res.status(201).json({ message: 'Training assigned successfully!' });
    });
});



app.get('/assignedTraining', (req, res) => {
    const sql = `
        SELECT 
            t.Title, 
            p.Name, 
            e.FirstName, 
            e.LastName
        FROM 
            EmpTraining et
        JOIN
            TRAINING t ON et.TrainingID = t.TrainingID
        JOIN 
            Project p ON et.ProjectID = p.ProjectID
        JOIN 
            Employee e ON et.EmployeeID = e.EmployeeID
    `;
    
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});



/**
 * leave request
 */
app.get('/leave-requests', (req, res) => {
    const query = `
    SELECT 
      e.EmployeeID,
      e.FirstName,
      e.LastName,
      COUNT(lr.LeaveRequestID) AS TotalNumberOfRequests
    FROM LeaveRequest lr
    JOIN Employee e ON lr.EmployeeID = e.EmployeeID
     GROUP BY e.EmployeeID, e.FirstName, e.LastName
     ORDER BY TotalNumberOfRequests DESC;
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch total leave requests per employee' });
    } else {
      res.json(results);
    }
  });
});


app.get('/leave-requestslist', (req, res) => {
    const query = `
    SELECT 
      e.EmployeeID,
      e.FirstName,
      e.LastName,
      lr.Status
    FROM LeaveRequest lr
    JOIN Employee e ON lr.EmployeeID = e.EmployeeID
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch total leave requests per employee' });
    } else {
      res.json(results);
    }
  });
});
/**
 * get project and nubmer of emplyees for a particualr project 
 */
app.get('/departments', (req, res) => {
    const query = `
      SELECT 
        d.Dept_Name,
        d.Dept_Description,
        d.Num_Of_Employees,
        COUNT(p.ProjectID) AS TotalProjects,
        GROUP_CONCAT(p.Name SEPARATOR ', ') AS ProjectNames
      FROM Department d
      LEFT JOIN Project p ON d.DepartmentID = p.DepartmentID
      GROUP BY d.DepartmentID;
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch departments and projects' });
      } else {
        res.json(results);
      }
    });
  });
  