/**
 * API to fetch data 
 */
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app= express()
app.use(cors())
app.use(express.json())




/**
 * connecting to db 
 */

const db = mysql.createConnection({
    host: "localhost",
    user : "root",
    password:'Roza2002',
    database:'Emp_Management',
    port:3306,
    connectTimeout: 100000

})

app.get('/', (re, res)=>{
    return res.json("from backend side");
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    } else {
        console.log('Successfully connected to the database');
    }
})

/**
 * retrieve employee data for list
 */
app.get('/employees', (req, res) => {
    const sql = `
      SELECT e.EmployeeID, e.FirstName, e.LastName, 
             COALESCE(GROUP_CONCAT(DISTINCT rd.Skill SEPARATOR ', '), 'No Skills') AS Skills
      FROM Employee e
      LEFT JOIN Role r ON e.Role_ID = r.RoleID
      LEFT JOIN RoleDepartment rd ON r.RoleID = rd.RoleID
      GROUP BY e.EmployeeID, e.FirstName, e.LastName;
    `;
  
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error fetching employees: ", err);
        return res.status(500).json({ error: err.message });
      }
      return res.json(data);
    });
});

/**

 * retreive employee data for profile view

 */
app.get('/employee/:id', (req, res) => {
    const employeeId = req.params.id;

    const sql = `
        SELECT e.*,
               a.Status AS AttendanceStatus,
               CONCAT(r.RoleName, ' ', IFNULL(ep.Level, '')) AS Role, 
               d.Dept_Name AS Department, 
               GROUP_CONCAT(DISTINCT p.PhoneNumber SEPARATOR ', ') AS PhoneNumbers, 
               GROUP_CONCAT(DISTINCT p.Type SEPARATOR ', ') AS PhoneTypes, 
               GROUP_CONCAT(DISTINCT em.EmailAdress SEPARATOR ', ') AS EmailAddresses, 
               GROUP_CONCAT(DISTINCT em.Type SEPARATOR ', ') AS EmailTypes,
               CONCAT(s.Address, ', ', c.Name, ', ', st.StateName, ', ', z.zip, ', ', co.Name) AS FullAddress,
               CONCAT(sc.StartDay, '-', sc.EndDay, ' from ', TIME_FORMAT(sc.StartShift, '%h:%i %p'), ' - ', TIME_FORMAT(sc.EndShift, '%h:%i %p')) AS Schedule
        FROM Employee e
        LEFT JOIN AttendanceStatus a ON e.AttendanceID = a.AttendanceID
        LEFT JOIN Role r ON e.Role_ID = r.RoleID
        LEFT JOIN Emp_Position ep ON r.RoleID = ep.RoleID
        LEFT JOIN RoleDepartment rd ON r.RoleID = rd.RoleID
        LEFT JOIN Department d ON rd.DepartmentID = d.DepartmentID
        LEFT JOIN Phone p ON e.EmployeeID = p.EmployeeID 
        LEFT JOIN Email em ON e.EmployeeID = em.EmployeeID
        LEFT JOIN Street s ON e.Street_ID = s.StreetID 
        LEFT JOIN City c ON e.City_ID = c.CityID 
        LEFT JOIN State st ON c.StateID = st.StateID 
        LEFT JOIN ZipCode z ON e.ZipCodeID = z.ZipCodeID 
        LEFT JOIN Country co ON e.CountryID = co.CountryID
        LEFT JOIN Schedule sc ON e.Schedule_ID = sc.ScheduleID
        WHERE e.EmployeeID = ? 
        GROUP BY e.EmployeeID, s.Address, c.Name, st.StateName, z.zip, co.Name, r.RoleName, ep.Level, d.Dept_Name, sc.StartDay, sc.EndDay, sc.StartShift, sc.EndShift;
    `;

    db.query(sql, [employeeId], (err, data) => {
        if (err) {
            console.error("Error fetching employee details:", err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(data[0]);
    });
});


/**
 * Deactivate/Activate  employee
 */
app.put('/update-employee-status/:id', (req, res) => {
    const employeeId = req.params.id;
    const { Emp_Status } = req.body;
  
    const sql = `UPDATE Employee SET Emp_Status = ? WHERE EmployeeID = ?`;
  
    db.query(sql, [Emp_Status, employeeId], (err, result) => {
      if (err) {
        console.error("Error updating employee status:", err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows > 0) {
        res.json({ message: 'Employee status updated successfully' });
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    });
  });

/**
 * Add new employee

/**
 * Get employees
 */
app.get('/Employee', (req, res)=> {
    const sql = "SELECT* FROM Employee";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

/**
 * get trainings data 
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

app.post('/add-employee', (req, res) => {
    const { FirstName, LastName, Gender, DOB, JoinDate, Ethnicity, Street_ID, City_ID, ZipCodeID, Schedule_ID, Role_ID, CountryID } = req.body;

    const sql = `INSERT INTO Employee (FirstName, LastName, Gender, DOB, JoinDate, Ethnicity, Street_ID, City_ID, ZipCodeID, Schedule_ID, Role_ID, CountryID) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [FirstName, LastName, Gender, DOB, JoinDate, Ethnicity, Street_ID, City_ID, ZipCodeID, Schedule_ID, Role_ID, CountryID], (err, result) => {
        if (err) {
            console.error("Error inserting employee:", err);
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ message: "Employee added successfully", employeeId: result.insertId });
    });
});

/**
 * edit employee information
 */
app.get('/employee/:id', (req, res) => {
    const employeeId = req.params.id;

    const query = `
        SELECT Employee.EmployeeID, Employee.FirstName, Employee.LastName, Employee.Gender, 
               Employee.DOB, Employee.JoinDate, Employee.Ethnicity, 
               Street, City, State, Country, ZipCode,
               Email.EmailID, Email.EmailAdress, Email.Type as EmailType
        FROM Employee
        LEFT JOIN Email ON Employee.EmployeeID = Email.EmployeeID
        WHERE Employee.EmployeeID = ?
    `;

    db.query(query, [employeeId], (err, result) => {
        if (err) {
            console.error("Error fetching employee details:", err);
            res.status(500).json({ error: "Database error" });
        } else if (result.length === 0) {
            res.status(404).json({ error: "Employee not found" });
        } else {
            res.json(result);
        }
    });
});

/**
 * edit employee info
 */
app.put('/update-employee/:id', (req, res) => {
    const employeeId = req.params.id;
    const { FirstName, LastName, Gender, DOB, JoinDate, Ethnicity } = req.body;
  
    const sql = `
      UPDATE Employee
      SET FirstName = ?, LastName = ?, Gender = ?, DOB = ?, JoinDate = ?, Ethnicity = ?
      WHERE EmployeeID = ?
    `;
    db.query(sql, [FirstName, LastName, Gender, DOB, JoinDate, Ethnicity, employeeId], (err, result) => {
      if (err) {
        console.error("Error updating employee:", err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
      return res.json({ message: "Employee updated successfully" });
    });
});


/**
 * search employees based on first name, last name, employee id, and or skills.
 */
app.get('/search-employees', (req, res) => {
    const searchQuery = req.query.query;
    if (!searchQuery) {
        return res.status(400).json({ error: "Search query is required" });
    }

// assign project to an employee
app.post('/assignProject', (req, res) => {
    const { FirstName, LastName, ProjectName, AssignedDate } = req.body;


    const sql = `
        SELECT e.EmployeeID, e.FirstName, e.LastName, 
               COALESCE(GROUP_CONCAT(DISTINCT rd.Skill SEPARATOR ', '), 'No Skills') AS Skills
        FROM Employee e
        LEFT JOIN Role r ON e.Role_ID = r.RoleID
        LEFT JOIN RoleDepartment rd ON r.RoleID = rd.RoleID
        WHERE e.FirstName LIKE ? 
           OR e.LastName LIKE ? 
           OR e.EmployeeID LIKE ? 
           OR rd.Skill LIKE ?
        GROUP BY e.EmployeeID, e.FirstName, e.LastName;
    `;
    
    const values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error("Error searching employees:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

/**
 * Departments in database
 */
app.get('/departments', (req, res) => {
    const query = `
      SELECT 
          d.DepartmentID, 
          d.Dept_Name, 
          d.Dept_Description, 
          COUNT(e.EmployeeID) AS Num_Of_Employees
      FROM Department d
      LEFT JOIN RoleDepartment rd ON d.DepartmentID = rd.DepartmentID
      LEFT JOIN Employee e ON rd.RoleID = e.Role_ID
      GROUP BY d.DepartmentID, d.Dept_Name, d.Dept_Description
    `;


    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching department data:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(results);
      }
    });
});


/**
 * Roles in database
 */
app.get('/roles', (req, res) => { 
    const query = `
      SELECT 
          r.RoleID, 
          r.RoleName, 
          r.Role_Description, 
          COUNT(e.EmployeeID) AS Num_Of_Employees,
          GROUP_CONCAT(CONCAT(e.FirstName, ' ', e.LastName) ORDER BY e.EmployeeID SEPARATOR ', ') AS EmployeeList
      FROM Role r
      LEFT JOIN Employee e ON r.RoleID = e.Role_ID
      GROUP BY r.RoleID, r.RoleName, r.Role_Description
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching role data:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(results);
      }
    });
});

/**
 * Managers
 */
app.get('/managers', (req, res) => {
    const query = `
        SELECT 
            mgr.EmployeeID AS ManagerID,
            mgr.FirstName AS ManagerFirstName,
            mgr.LastName AS ManagerLastName,
            d.Dept_Name AS DepartmentName,
            emp.EmployeeID AS EmployeeID,
            emp.FirstName AS EmployeeFirstName,
            emp.LastName AS EmployeeLastName
        FROM 
            Employee mgr
        JOIN 
            Role r ON mgr.Role_ID = r.RoleID
        JOIN 
            RoleDepartment rd ON r.RoleID = rd.RoleID
        JOIN 
            Department d ON rd.DepartmentID = d.DepartmentID
        JOIN 
            Employee emp ON emp.Role_ID != mgr.Role_ID AND emp.Role_ID IN (
                SELECT RoleID FROM RoleDepartment WHERE DepartmentID = d.DepartmentID
            )
        WHERE 
            r.RoleName = 'Manager';
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        const managers = results.reduce((acc, row) => {
            const managerKey = `${row.ManagerID}`;

            if (!acc[managerKey]) {
                acc[managerKey] = {
                    ManagerID: row.ManagerID,
                    ManagerFirstName: row.ManagerFirstName,
                    ManagerLastName: row.ManagerLastName,
                    DepartmentName: row.DepartmentName,
                    Employees: []
                };
            }

            acc[managerKey].Employees.push({
                EmployeeID: row.EmployeeID,
                EmployeeFirstName: row.EmployeeFirstName,
                EmployeeLastName: row.EmployeeLastName
            });

            return acc;
        }, {});

        res.json(Object.values(managers));
    });
});

  

// get all projects available
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


/*
get all the employees assinged to a particualr project 
*/
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

/**
 * Assign training to certain employees
 */
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


/**
 * get list of assigned training 
 */
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



app.listen(8081, ()=>{
    console.log("listening")


})

/**
 * get a list of leave requests with count per employee 
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

/**
 * get each leave request details 
 */

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
 * get Department information and project by department, 
 * and number of employees in the depatment 
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
  

