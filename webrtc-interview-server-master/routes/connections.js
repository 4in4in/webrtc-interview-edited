const express = require('express');
const { v4: uuid } = require('uuid');
const router = express.Router();

router.get('/', function (req, res) {
  const clientsConnections = req.clientsConnections;

  res.send({ clients: Object.keys(clientsConnections) });
});

router.get('/:id', function (req, res) {
  const id = req.params[0];

  const clientConnection = req.clientsConnections[id];

  res.send(clientConnection ? 'Found' : 'Not Found');
});

router.put('/', function (req, res) {
  const { caller, called } = req.query;

  const callerConnection = req.clientsConnections[caller];
  const calledConnection = req.clientsConnections[called];

  if (callerConnection && calledConnection) {
    const roomId = uuid();

    callerConnection.join(roomId);
    calledConnection.join(roomId);

    callerConnection.emit('createConnection', called);
    calledConnection.emit('createConnection', caller);

    res.send('Соединение установлено');
  } else {
    res.send('Не удалось соединиться');
  }
});

module.exports = router;
