let mysql = require("mysql");
let util = require("util");

let connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "lawray12",
      database: "employees"
    })
    connection.connect();
    connection.query = util.promisify(connection.query);
    
    // connection.connect(function(err){
    //   if(err){
    //     throw err;
    //   }
    //   console.log("Connected to db as id " + connection.threadId);
    // });
    


class db {
    constructor(connection) {
        this.connection = connection;
    }
    
    findAllEmployees(){
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id"
        )
    }
    
    findAllDepartments() {
        return this.connection.query(
            "SELECT * FROM department"
        )
    }

    findAllEmployeesByDepartment(departmentId){
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department_id WHERE department.id = ?", departmentId
        )
    }

    findAllPossibleManagers(employeeId) {
        return this.connection.query(
            "SELECT * FROM employee WHERE id != ?", employeeId
        )
    }

    findAllEmployeesByManager(managerId){
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE manager_id = ?", managerId
        )
    }

    findAllRoles() {
        return this.connection.query(
            "SELECT * FROM role"
        )
    }
    
    createEmployee(employee) {
        return this.connection.query(
            "INSERT INTO employee SET ?", employee
        )
    }

    createRole(role) {
        return this.connection.query(
            "INSERT INTO role SET ?", role
        )
    }

    createDepartment(department) {
        return this.connection.query(
            "INSERT INTO department SET ?", department
        )
    }

    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            "UPDATE employee  SET role_id = ? WHERE employee.id = ?", [roleId, employeeId]
        )
    }

    updateEmployeeManager(employeeId, managerId) {
        return this.connection.query(
            "UPDATE employee SET manager_id = ? WHERE employee.id = ?", [managerId, employeeId]
        )
    }
}

module.exports = new db(connection);
