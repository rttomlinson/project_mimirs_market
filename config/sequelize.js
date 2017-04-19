require('dotenv').config();
var username = process.env.POSTGRESS_USERNAME;
var password = process.env.POSTGRESS_PASSWORD;

module.exports = {
  "development": {
    "username": username,
    "password": password,
    "database": "mimirs_market_dev",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "davehail",
    "password": null,
    "database": "mimirs_market_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "POSTGRES_URL",
    "dialect": "postgres"
  }
}