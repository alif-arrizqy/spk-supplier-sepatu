require('dotenv').config();

let PORT;
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  PORT = process.env[`${env.toUpperCase()}_DB_PORT`] || 5432;
} else if (env === 'production') {
  PORT = process.env[`${env.toUpperCase()}_DB_PORT_EXPOSE`] || 5433;
} 

const baseConfig = {
  username: process.env[`${env.toUpperCase()}_POSTGRES_USER`],
  password: process.env[`${env.toUpperCase()}_POSTGRES_PASSWORD`],
  database: process.env[`${env.toUpperCase()}_POSTGRES_DB`],
  host: process.env[`${env.toUpperCase()}_DB_HOST`],
  port: PORT,
  dialect: 'postgres',
};


module.exports = {
  development: { ...baseConfig },
  test: { ...baseConfig },
  production: { ...baseConfig },
};