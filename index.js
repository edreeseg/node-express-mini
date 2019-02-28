// implement your API here
const express = require('express');
const db = require('./data/db');

const server = express();
server.use(express.json());

server.get('/api/users', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  db.find()
    .then(users => res.json({ users }))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.' })
    );
});

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }
  db.insert({ name, bio })
    .then(obj => db.findById(obj.id))
    .then(user => res.status(201).json(user))
    .catch(err =>
      res.status(500).json({
        error: 'There was an error while saving the user to the database',
      })
    );
});

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(result =>
      (result || []).length === 0
        ? res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist.' })
        : res.json(result)
    )
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The user information could not be retrieved.' })
    );
});

server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  let user;
  db.findById(id)
    .then(result => (user = result))
    .then(res => db.remove(id))
    .then(n =>
      n
        ? res.json({ user })
        : res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist.' })
    )
    .catch(err =>
      res.status(500).json({ error: 'The user could not be removed.' })
    );
});

server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const { name, bio } = req.body;
  if (!name || !bio)
    return res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  db.update(id, { name, bio })
    .then(n =>
      n
        ? db.findById(id)
        : res
            .status(404)
            .json({ error: 'The user with the specified ID does not exist.' })
    )
    .then(user => res.json({ user }))
    .catch(err => res.send(err));
});

server.listen(5000);
