
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app= express()
app.use(cors())
app.use(express.json())


const db = mysql.createConnection({
    host: "localhost",
    user : "root",
    password:'6042713138aR',
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

  

app.listen(8081, ()=>{
    console.log("listening")

})