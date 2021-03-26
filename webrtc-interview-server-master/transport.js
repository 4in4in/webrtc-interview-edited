const createConnection = require('socket.io');

const createDataTransport = function (httpServer, options = {}) {
  const io = createConnection(httpServer, options);

  return function (handleConnection) {
    io.on('connection', (socket) => {
      handleConnection(socket);
    });
  };
};

module.exports = function (httpServer, options = {}) {
  return createDataTransport(httpServer, options);
};
