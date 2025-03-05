
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app= express()
app.use(cors())

const db = mysql.createConnection({
    host: "db host",
    user : "db user",
    password:'db password',
    database:'your database name',
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

