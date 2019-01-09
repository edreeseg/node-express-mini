// implement your API here
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./data/db');

const server = express();
server.use(bodyParser.json());

const STATUS_USER_ERROR = 422;

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.json({ users });
        })
        .catch(err => {
            res.status(500);
            res.json({ error: "The users information could not be retrieved." });
        });
});

server.post('/api/users', (req, res) => {
    const [ name, bio ] = [ req.body.name, req.body.bio ];
    if (!name || !bio){
        res.status(400);
        res.json({ errorMessage: 'Please provide name and bio for the user.' });
        return;
    }
    db.insert({ name, bio })
        .then(obj => {
            db.findById(obj.id)
                .then(user => {
                    res.status(201);
                    res.json(user);
                })
                .catch(err => {
                    res.status(500);
                    res.json({ error: "There was an error while saving the user to the database" });
                });
        })
        .catch(err => {
            res.status(500);
            res.json({ error: "There was an error while saving the user to the database" });
        });
});

server.listen(5000);