require('dotenv').config();

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : '168.75.108.235',
    port : '3306',
    user : 'gerencie_os',
    password : '#Manasses2025',
    database : 'gerencie_os'
  },debug:false
});

module.exports = knex;

  