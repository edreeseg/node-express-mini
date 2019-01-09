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

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(result => {
            if ((result||[]).length === 0){
                res.status(404);
                res.json({ message: "The user with the specified ID does not exist." });
            } else {
                res.json(result);
            }
        })
        .catch(err => {
            res.status(500);
            res.json({ error: "The user information could not be retrieved." });
        });
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if ((user||[]).length === 0){
                res.status(404);
                res.json({ message: "The user with the specified ID does not exist." });
            } else {
                db.remove(id)
                    .then(n => res.json(user))
                    .catch(err => {
                        res.status(500);
                        res.json({ error: "The user could not be removed." });
                    });
            }
        })
        .catch(err => {
            res.status(500);
            res.json({ error: "The user could not be removed." });
        });
});

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const [name, bio] = [req.body.name, req.body.bio];
    if (!name || !bio){
        res.status(400);
        res.json({ errorMessage: "Please provide name and bio for the user." });
        return;
    }
    db.findById(id)
        .then(result => {
            if ((result||[]).length === 0){
                res.status(404);
                res.json({ message: "The user with the specified ID does not exist." });
            } else {
                db.update(id, { name, bio, updated_at: `${Date().substring(0, 33)} (EST)` })  // EST could need conversion to PST, would ideally like to use moment.js.
                    .then(() => {
                        db.findById(id).then(user => res.json({ user }))
                            .catch(() => {
                                res.status(500);
                                res.json({ error: "The user information could not be modified." 
                            });
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500);
                        res.json({ error: "The user information could not be modified." });
                    });
            }
        })
        .catch(err => {
            res.status(500);
            res.json({ error: "The user information could not be retrieved." });
        });
});

server.listen(5000);