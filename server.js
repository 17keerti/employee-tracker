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
                      "Add Employee", 
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

    case "Add Employee":
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
  const sql =`SELECT employee.id, 
                     employee.first_name, 
                     employee.last_name, 
                     role.title, 
                     role.salary,
                     department.name AS department ,
                     CONCAT (manager.first_name, " ", manager.last_name) AS manager
              FROM employee
                     JOIN role ON employee.role_id = role.id 
                     JOIN department ON role.department_id = department.id
                     LEFT JOIN employee manager ON employee.manager_id = manager.id
                     ORDER BY id;`
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
  const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS Deparment_Name
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
  const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employee
                      JOIN employee manager ON employee.manager_id = manager.id;`
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


function addEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the first name of employee ?'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the last name of employee ?'
    }
]).then(function(answers) {
  const param = [answers.firstName, answers.lastName];
  const sql = 'SELECT id,title FROM role';

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    const roleTitle = [];
    for (var i=0; i<result.length; i++) {
      roleTitle.push(result[i].title);
    }
 

    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's role ?", 
        choices: roleTitle
      }
    ]).then(function(answer) {
      const indexOfSelectedRole = roleTitle.findIndex((element) => element === answer.role);
      const idOfRoleName = result[indexOfSelectedRole].id;
      param.push(idOfRoleName);

      const sql = 'SELECT * FROM employee';
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        }
        const manager = [];
        for (var i=0; i<result.length; i++) {
          manager.push(result[i].first_name);
        }
      inquirer.prompt([
        {
          type: 'list',
          name: 'manager',
          message: "Who is employee's manager ?",
          choices: manager
        }
      ]).then(function(answer) {
        const indexOfSelectedManager = manager.findIndex((element) => element === answer.manager);
        const idOfManager = result[indexOfSelectedManager].id;
        param.push(idOfManager);
      
      const sql =  `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      db.query(sql, param, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Successfully added!");
        viewAllEmployees();
    })
  })
})
})
})
})
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
    const param = answer.employee;
    db.query(sql, param, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      viewAllEmployees();
    })
  })
  });
}


function updateRole() {
  const sql = 'SELECT * FROM employee';
  const param = [];
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    const empList = [];
    for (var i=0; i<result.length; i++) {
      empList.push(result[i].first_name);
    }
    
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee has a new role ?',
        choices: empList 
      }
    ]).then(function(answer) {
        const indexOfSelectedEmp = empList.findIndex((element) => element === answer.employee);
        const idOfEmp = result[indexOfSelectedEmp].id;
        param.push(idOfEmp);

        const sql = 'SELECT title FROM role';
        db.query(sql, (err,result) => {
          if (err) {
            console.log(err);
          }
        const roleList = [];
        for (var i=0; i<result.length; i++) {
        roleList.push(result[i].title);
         }
        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: 'What is their new role ?',
            choices: roleList
          }
        ]).then(function(answer) {
          const indexOfSelectedRole = roleList.findIndex((element) => element === answer.role);
          // const idOfRole = result[indexOfSelectedRole].id;
          param.unshift(indexOfSelectedRole);
          console.log("HERE");
        console.log(param);
      const sql = 'UPDATE employee SET role_id= ? where id = ?';
      db.query(sql, param, (err,result) => {
        if (err){
          console.log(err);
          return;
        }
        console.log("SUccessfully Updated!");
        viewAllEmployees();
      })
    })
    })
    })
  })
}


function updateManager() {
  db.query('SELECT employee.id, employee.first_name, employee.last_name  FROM employee', (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(result);
 
  inquirer.prompt([
    {
      type: 'input',
      name: 'employee',
      message: 'Which employee has a new manager?' // give list
    },
    {
      type: 'input',
      name: 'manager',
      message: 'Who is their manager?'
    }
  ]).then(function(answers) {
    const param = [answers.manager, answers.employee];
    const sql = 'UPDATE employee SET manager_id = ? where id = ?';
    db.query(sql, param, (err, result) => {
      if (err){
        console.log(err);
      }
      console.log("SUccesfully updated!");
      viewByManager();
    })
  })
})
}


function viewAllRoles() {
  const sql = `SELECT role.id,
                      role.title,
                      role.salary,
                      department.name AS department
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


function addRole() {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addRole',
      message: "What is the name of the role?"
    },
    {
      type: 'input', 
      name: 'salary',
      message: "What is the salary of this role?"
    }
]).then(function(answers) {
  const param = [answers.addRole, answers.salary];
  const sql = `SELECT id,name FROM department`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    const deptNames = [];
    for (var i=0; i<result.length; i++) {
      deptNames.push(result[i].name);
    }
  inquirer.prompt([
    {
      type: 'list',
      name: 'dept',
      message: 'Select the department:',
      choices: deptNames
    }
  ]).then(function(answer) {
    const indexOfSelectedDept = deptNames.findIndex((element) => element === answer.dept);
    const idOfDeptName = result[indexOfSelectedDept].id;
    const sql = `INSERT INTO role(title, salary, department_id) VALUES (?,?,?)`;   
    param.push(idOfDeptName);

    db.query(sql, param, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    viewAllRoles();
  })
  })
  })
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
      })
    })
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


function addDepartment() {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDept',
      message: "What is the name of the department?"
    }
]).then(function(answer) {
  const sql = `INSERT into department(name) VALUES (?)`;
  const dept = answer.addDept;
  db.query(sql, dept, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Succesfully added Department!");
    viewAllDepartments();
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
      console.log("Succesfully deleted!");
      viewAllDepartments();
    })
  })
  });
}


function quit() {
  db.end();
}

userPrompts();