const express = require('express');
const mysql = require('mysql2');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password123@',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

db.query('SELECT * FROM employee', function (err, results) {

  if(results){
    results.forEach(function(employee){
    console.log(employee)
  })
  }
  
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});