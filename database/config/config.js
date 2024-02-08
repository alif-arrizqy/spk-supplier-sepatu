require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  username: process.env[`${env.toUpperCase()}_POSTGRES_USER`],
  password: process.env[`${env.toUpperCase()}_POSTGRES_PASSWORD`],
  database: process.env[`${env.toUpperCase()}_POSTGRES_DB`],
  host: process.env[`${env.toUpperCase()}_DB_HOST`],
  port: process.env[`${env.toUpperCase()}_DB_PORT`] || 5432,
  dialect: 'postgres',
};

module.exports = {
  development: { ...baseConfig },
  test: { ...baseConfig },
  production: { ...baseConfig },
};