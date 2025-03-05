
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
