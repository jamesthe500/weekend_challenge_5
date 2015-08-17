// the app never uses this. It only sets up the database.

// Brings in Postgress so we can use those methods.
var pg = require('pg');

// set a var that is the connection to either remote db or local db.
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/example_database';

// Defining the relation to the db and client-side which is us.
var client = new pg.Client(connectionString);

// executing the connection.
client.connect();

// this next line is in essence a schema

// setting the var that is the new db, defining its columns and their rules.
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');

// when the db sends back end, we sever the connection.
query.on('end', function() { client.end(); });

