module.exports = function (app) {
  return function (req, res, next) {
    const connections = app.get('clientsConnections');
    req.clientsConnections = connections;
    next();
  };
};
