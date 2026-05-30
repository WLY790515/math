const { LowSync } = require('lowdb');
const { JSONFileSync } = require('lowdb/node');
const path = require('path');

const adapter = new JSONFileSync(path.join(__dirname, '../../data/db.json'));
const db = new LowSync(adapter, {
  users: [],
  logs: []
});

module.exports = db;
