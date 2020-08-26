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
    this.removeDept = this.removeDept.bind(this)
    this.deleteEmployee = this.deleteEmployee.bind(this)
    this.hire = this.hire.bind(this)
    this.giveDept = this.giveDept.bind(this)
    }
    async componentDidMount () {
        this.setState({ employees: (await Axios.get('api/employees')).data })
        this.setState({ departments: (await Axios.get('api/departments')).data })
    }
    async hire(event) {
        event.preventDefault();
        const employee = (await Axios.post(`api/employees/`)).data;
        const employees = this.state.employees;
        employees.push(employee)
        this.setState({ employees })
    }
    async removeDept(employee) {
        employee = (await Axios.put(`api/employees/${employee.id}`, { departmentId: null })).data;
        const employees = this.state.employees.map(e => e.id === employee.id ? employee : e)
        this.setState({employees})
    }
    async giveDept(employee) {
        employee = (await Axios.put(`api/employees/${employee.id}`, { departmentId: Math.ceil(Math.random() * this.state.departments.length) })).data;
        const employees = this.state.employees.map(e => e.id === employee.id ? employee : e)
        this.setState({employees})
    }
    async deleteEmployee(employee) {
        await Axios.delete(`api/employees/${employee.id}`)
        const employees = this.state.employees.filter(e => e.id !== employee.id)
        this.setState({ employees })
    }
    render() {
        const { employees, departments } = this.state;
        const { deleteEmployee, removeDept, hire, giveDept } = this
        const noDeptEmployees = employees.filter(employee => !employee.departmentId)
        return( 
        <div>
            <h1>Acme Employees and Departments</h1>
            <h2>{employees.length} Total Employees</h2>
            <form onSubmit = { hire }>
                <button>Hire a New Employee</button>
            </form>
            <div className="container">
                <div className="column">
                    <h2>Employees without Departments ({noDeptEmployees.length})</h2>
                    {
                    noDeptEmployees.map(employee => {
                        return (
                            <div key = {employee.name}>
                            <p>{employee.name}</p>
                            <button onClick = {() => deleteEmployee(employee)}>x</button>
                            <button onClick = {() => giveDept(employee)}>Assign Department</button>
                            </div>
                        )
                        })
                    }
                </div>
                {
                departments.map(department => {
                    const deptEmployees = employees.filter(employee => employee.departmentId === department.id);
                    return ( 
                        <div className="column dept" key = {department.name}>
                            <h2>{department.name} ({deptEmployees.length})</h2>
                            {
                            deptEmployees.map(employee => {
                                return (
                                <div key = {employee.name}>
                                <p>{employee.name}</p>
                                <button onClick = { () => deleteEmployee(employee)}>x</button>
                                <button onClick = { () => removeDept(employee) }>Remove From Department</button>
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