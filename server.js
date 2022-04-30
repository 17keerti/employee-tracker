const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password123@',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

function userPrompts() {
  inquirer.prompt([{
            type: "list",
            name: "userChoices",
            message: "What would you like to do ?",
            choices: ["View All Employees", 
                      "View All Employees By Department", 
                      "View All Employees By Manager", 
                      "Add Emplyee", 
                      "Remove Employee", 
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

function viewAllEmployees() {
  const sql =`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id, department.name
  FROM employee
  JOIN role ON employee.role_id = role.id 
  JOIN department ON role.department_id = department.id;`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
   console.log("Showing ALL Employees \n");
   console.table(result);
   userPrompts();
    });
}

function viewByDepartment() {
  const sql = `SELECT employee.first_name, employee.last_name, department.name AS Deparment_Name
  From employee
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id;`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Showing Employees By Department \n");
    console.table(result);
    userPrompts();
    });
}

function viewByManager() {
  const sql = `SELECT employee.first_name, employee.last_name, employee.manager_id 
  FROM employee;`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Showing Employees By Manager \n");
    console.table(result);
    userPrompts();
    });
}

function addDepartment() {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDept',
      message: "What department do you want to add?"
    }
]).then(function(answer) {
  const sql = `INSERT into department(name) VALUES (?)`;
  const dept = answer.addDept;
  db.query(sql, dept, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    viewAllDepartments();
    userPrompts();
  })
});
}

function addRole() {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addRole',
      message: "What role do you want to add?"
    },
    {
      type: 'input', 
      name: 'salary',
      message: "What is the salary of this role?",
    }
]).then(function(answer) {
  const sql = `INSERT INTO role(title, salary) VALUES (?,?)`;
  const role = [answer.addRole, answer.salary];
  db.query(sql, role, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    viewAllRoles();
    userPrompts();
  })
});
}

function viewAllRoles() {
  const sql = `SELECT role.id, role.title, role.salary, department.name AS department
  From role
  LEFT JOIN department ON role.department_id = department.id; `
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Showing ALL Roles \n");
    console.table(result);
    userPrompts();
    });
}

function viewAllDepartments() {
  const sql = `SELECT * FROM department;`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Showing ALL Departments \n");
    console.table(result);
    userPrompts();
    });
}


function removeRole() {
  const sql = `SELECT * FROM role;`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(result);
    inquirer.prompt([{
        name: 'role',
        message: "What role do you want to delete?",
    }]).then(function(answer) {
      const sql = `DELETE FROM role where id= ?`
      const id = answer.role;
      db.query(sql, id, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        viewAllRoles();
        userPrompts();
      })
    })
    });
}

function removeDepartment() {
  const sql = `SELECT * FROM department;`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(result);
    inquirer.prompt([{
      name: 'department',
      message: "What department do you want to delete?",
  }]).then(function(answer) {
    const sql = `DELETE FROM department where id= ?`
    const id = answer.department;
    db.query(sql, id, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      viewAllDepartments();
      userPrompts();
    })
  })
  });
}

function removeEmployee() {
  const sql = `SELECT id,first_name, last_name FROM employee;`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(result);
    inquirer.prompt([{
      name: 'employee',
      message: "Which employee do you want to delete?",
  }]).then(function(answer) {
    const sql = `DELETE FROM employee where id= ?`
    const id = answer.employee;
    db.query(sql, id, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      viewAllEmployees();
      userPrompts();
    })
  })
  });
}


function quit() {
  db.end();
}

userPrompts();