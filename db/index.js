const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const faker = require('faker');
const databaseUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/friends-app'
const db = new Sequelize(databaseUrl, {
  logging: false,
  operatorsAliases: false
})

const Employee = db.define('employee', {
    name: {
      type: STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      unique: true
    },
});

const Department = db.define('department', {
    name: {
        type: STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        unique: true
      },
});

Employee.belongsTo(Department)
Department.hasMany(Employee)

const syncAndSeed = async()=> {
    await db.sync({ force: true });
    const [computers, shoes, movies, games, home] = await Promise.all([
      Department.create({ name: 'Computers' }),
      Department.create({ name: 'Shoes' }),
      Department.create({ name: 'Movies'}),
      Department.create({ name: 'Games'}),
      Department.create({ name: 'Home'}),
    ]);
    for (let id = 1; id <= 50; id++) {
      let deptId = Math.ceil(Math.random() * 5)
      const employee = await Employee.create({
        name: faker.name.firstName(),
        departmentId: deptId
      })
      }
  };

  module.exports = {
      Employee,
      Department,
      syncAndSeed
  };