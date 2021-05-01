const Pool = require("pg").Pool;
const dotenv = require('dotenv');

dotenv.config();

const devConfig={
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
}
const proConfig={
  connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}
const pool = new Pool(process.env.NODE_ENV==="production"?proConfig:devConfig);

console.log(devConfig);

pool.on('connect', () => {
    console.log('connected to the db');
  });

pool.on('remove', () => {
  console.log('client removed');
  //process.exit(0);
});

pool.on('error', (err) => {
  console.log('Error');
  console.log(err);
});

module.exports = pool;

require('make-runnable');
