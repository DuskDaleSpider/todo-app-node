const monk = require('monk');
const url = `${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/todo-app?authSource=admin`;
const db = monk(url);

module.exports = db;
