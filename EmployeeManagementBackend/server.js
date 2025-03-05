
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app= express()
app.use(cors())

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
 * 
 */