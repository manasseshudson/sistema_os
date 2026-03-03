require('dotenv').config();

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : process.env.HOST,
    port : process.env.PORT_BANCO,
    user : process.env.USER,
    password : '#Manasses2025',
    database : process.env.DATABASE
  },debug:false
});

module.exports = knex;

  