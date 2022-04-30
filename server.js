const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password123@',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

function userOptions() {
  inquirer.prompt([{
            type: "list",
            name: "userChoices",
            message: "What would you like to do ?",
            choices: ["View All Employees", 
                      "View All Employees By Department", 
                      "View All Employees By Manager", 
                      "Add Emplyee", "Remove Employee", 
                      "Update Employee Role", 
                      "Update Employee Manager", 
                      "View All Roles", 
                      "Add Role", 
                      "Remove Role", 
                      "View All Departments", 
                      "Add Department", 
                      "Remove Department", 
                      "Quit"]

  }]).then(function(answer) {

    switch (answer.userChoices){
    case "View All Employees":
      viewAllEmployees();
      break;

    case "View All Employees By Department":
      viewByDepartment();
      break;

    case "View All Employees By Manager":
      viewByManager();
      break;

    case "Add Emplyee":
      addEmployee();
      break;

    case "Remove Employee":
      removeEmployee();
      break;
      
    case "Update Employee Role":
      updateRole();
      break;
      
    case "Update Employee Manager":
      updateManager();
      break;

    case "View All Roles":
      viewAllRoles();
      break;

    case "Add Role":
      addRole();
      break;

    case "Remove Role":
      removeRole();
      break;

    case "View All Departments":
      viewAllDepartments();
      break;
      
    case "Add Department":
      addDepartment();
      break;
      
    case "Remove Department":
      removeDepartment();
      break;
      
    case "Quit":
      quit();
      break; 
    }

  })
}

userOptions();

function viewAllEmployees() {
  const sql =`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id, department.name
  FROM employee
  JOIN role ON employee.role_id = role.id 
  JOIN department ON role.department_id = department.id;`
  db.query(sql, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
   console.log(result);
    });
}

function viewByDepartment() {
  const sql = ``
}
