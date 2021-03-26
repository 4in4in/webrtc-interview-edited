const connections = {};

module.exports = function (app) {
  if (app.get('clientsConnections')) {
    return null;
  }

  const transport = app.get('transport');

  transport((client) => {
    const { id } = client;

    console.log(`Create connection: ${id}`);

    connections[id] = client;

    client.on('disconnect', () => {
      delete connections[id];

      console.log(`Close connection: ${id}`);

      client.broadcast.emit('clientsChanged');
    });

    client.on('webrtc-request', ({ id, ...message }) => {
      connections[id].emit('webrtc-message', message);
    });

    client.broadcast.emit('clientsChanged');
  });

  app.set('clientsConnections', connections);

  return connections;
};
