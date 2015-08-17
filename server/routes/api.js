var express = require('express');
var router = express.Router();
var pg = require('pg');
// JS connect to a "real" remote db or our fake local one.
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/example_database';


router.post('/todos', function(req, res) {
    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, complete: false};

    // Get a Postgres client from the connection pool
    // JS connects to one db ...
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Insert Data
        // SJ we are doing a query to the db, adding to the table "items" in the columns "text" and "complete"
        // the contents of the text box and false respectively. they are inserted via "values($1, $2)" b/c
        // that refers to the position in the array like thing.
        // path e.g. "text" is far left, refers to "$1" also far left, refers to position 1 of the array.
        client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

        // SQL Query --> Select Data
        // SJ select everything from the table and sort lowest to highest by ID #
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        // SJ We think it takes data from teh DB one row at a time.
        // and pushes to the array results.
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        // SJ 'end' is emited by the query when all rows have been returned successfully.
        // client.end() sends a message to terminate the connection with teh db.
        // query is the db talking to us, client is us talking to them.
        // taking what we've been filling results with and making it a json that we return.
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        // if there's an error, console log it.
        if(err) {
            console.log(err);
        }

    });
});

router.get('/todos', function(req, res) {
    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });

});

router.put('/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;

    // Grab data from http request
    var data = {text: req.body.text, complete: req.body.complete};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Update Data
        client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });

});

router.delete('/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Delete Data
        client.query("DELETE FROM items WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });

});


module.exports = router;