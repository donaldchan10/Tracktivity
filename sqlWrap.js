'use strict'

const sql = require('sqlite3');
const util = require('util');


// old-fashioned database creation code 

// creates a new database object, not a 
// new database. 
const db = new sql.Database("activities.db");
//const profileDB = new sql.Database("profile.db");

// check if database exists
let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='ActivityTable' ";

db.get(cmd, function (err, val) {
  if (val == undefined) {
        console.log("No database file - creating one");
        createActivityTable();
        createProfileTable();
  } else {
        console.log("Database file found");
  }
});


//check if profile database exists
//Step 7
let profileCmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='ProfileTable' ";

db.get(profileCmd, function (err, val) {
  if (val == undefined) {
        console.log("No Profile database file - creating one");
        createProfileTable();
  } else {
        console.log("Profile Database file found");
  }
});




// called to create table if needed
function createActivityTable() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE ActivityTable (rowIdNum INTEGER PRIMARY KEY, activity TEXT, date INTEGER, amount FLOAT, userId INTEGER)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("ActivityTable creation failure",err.message);
    } else {
      console.log("Created ActivityTable");
    }
  });
}

//called to create Profile table if needed
//Step 7
function createProfileTable(){
  const cmd = 'CREATE TABLE ProfileTable (rowIdNum INTEGER PRIMARY KEY, userId INTEGER, firstName TEXT)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("ProfileTable failure ",err.message);
    } else {
      console.log("Created ProfileTable");
    }
  });
}

// wrap all database commands in promises
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

// empty all data from db
db.deleteEverything = async function() {
  await db.run("delete from ActivityTable");
  db.run("vacuum");
}

/*
//wrap all profileDB database commands in promises
//Step 7
profileDB.run = util.promisify(profileDB.run);
profileDB.get = util.promisify(profileDB.get);
profileDB.all = util.promisify(profileDB.all);
*/


// allow code in index.js to use the db object
module.exports = db;
//module.exports = profileDB;
