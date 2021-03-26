const NodeMediaServer = require('node-media-server'),
    config = require('./config/default').rtmp_server;

nms = new NodeMediaServer(config);
nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKetFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

const getStreamKetFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
}

module.exports = nms;