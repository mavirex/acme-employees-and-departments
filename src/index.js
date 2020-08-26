import React from 'react'
import ReactDOM from 'react-dom';
const Axios = require ('axios');

class App extends React.Component {
    constructor() {
        super()
        this.state = {
          employees: [],
          departments: []
        }
    }
    async componentDidMount () {
        try{
        const deptResponse = await Axios.get('api/departments');
        const departments = deptResponse.data;
        this.setState({departments: departments});
        const empResponse = await Axios.get('api/employees');
        const employees = empResponse.data;
        this.setState({employees: employees})  
        } catch(err) {
            console.log(err)
        }
    }
    async removeDept(id) {
        const departmentId = null
        await Axios.put(`api/employees/${id}`, { departmentId: departmentId })
        const employeeArray = this.state.employees;
        const employee = employeeArray.find(item => item.id === id);
        employee.departmentId = departmentId
        this.setState({employees: employeeArray})
    }
    async deleteEmployee(id) {
        await Axios.delete(`api/employees/${id}`)
        const employees = this.state.employees.filter(employee => employee.id !== id)
        this.setState({employees: employees})
    }
    render() {
        const noDeptEmployees = this.state.employees.filter(employee => !employee.departmentId)
        return( 
        <div>
            <h1>Acme Employees and Departments</h1>
            <h2>{this.state.employees.length} Total Employees</h2>
            <div className="container">
                <div className="column">
                    <h2>Employees without Departments ({noDeptEmployees.length})</h2>
                    {
                    noDeptEmployees.map(employee => {
                        return (
                            <div key = {employee.name}>
                            <p>{employee.name}</p>
                            <button onClick = {() => this.deleteEmployee(employee.id)}>x</button>
                            </div>
                        )
                        })
                    }
                </div>
                {
                this.state.departments.map(department => {
                    const deptEmployees = this.state.employees.filter(employee => employee.departmentId === department.id);
                    return ( 
                        <div className="column dept" key = {department.name}>
                            <h2>{department.name} ({deptEmployees.length})</h2>
                            {
                            deptEmployees.map(employee => {
                                return (
                                <div key = {employee.name}>
                                <p>{employee.name}</p>
                                <button onClick = {() => this.deleteEmployee(employee.id)}>x</button>
                                <button onClick = {() => this.removeDept(employee.id)}>Remove From Department</button>
                                </div>
                                )
                            })
                            }
                        </div>
                    )
                })
                }
            </div>
        </div>
      )}
}

ReactDOM.render(<App />, document.getElementById("root"))