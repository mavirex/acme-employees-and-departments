const express = require('express');
const path = require('path');
const { Employee, Department, syncAndSeed } = require('./db')
const faker = require('faker')

const app = express();
app.use(require('body-parser').json());

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/departments', async (req, res, next)=> {
  try {
    res.send(await Department.findAll());
  }
  catch(err){
    next(err);
  }
});

app.get('/api/employees', async (req, res, next)=> {
  try {
    res.send(await Employee.findAll());
  }
  catch(err){
    next(err);
  }
});

app.post('/api/employees', async (req, res, next)=> {
  try {
    res.send(await Employee.create({ name: faker.name.firstName()}));
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/employees/:id', async (req, res, next)=> {
  try {
    const employee = await Employee.findByPk(req.params.id);
    await employee.update(req.body)
    res.send(employee)
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/employees/:id', async (req, res, next)=> {
  try {
    const employee = await Employee.findByPk(req.params.id);
    await employee.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
    res.status(500).send({ error: err.message });
});

const init = async()=> {
    try {
      syncAndSeed();
      const port = process.env.PORT || 3000;
      app.listen(port, ()=> console.log(`listening on port ${port}`));
    } catch(err) {console.log(err)};
};
  
init();