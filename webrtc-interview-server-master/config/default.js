const config = {
    server: {
        secret: 'kjVkuti2xAyF3JGCzSZTk0YWM5JhI9mgQW4rytXc'   
    },

    rtmp_server: {
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            // ping: 60,
            ping: 30,
            ping_timeout: 30
        }
    },

    http: {
        port: 8888,
        mediaroot: '/home/alex/Downloads/webrtc-interview/webrtc-interview-server-master/media',
        allow_origin: '*'
    },
    trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        tasks: [
            {
                // app: 'live',
                // vc: "copy",
                // vcParam: ['-preset','slow','-crf','22'],
                // mp4: true,
                // mp4Flags: '[movflags=frag_keyframe+empty_moov]',
                // hls: true,
                // hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                // dash: true,
                // dashFlags: '[f=dash:window_size=3:extra_window_size=5]'

                // app: 'live',
                // mp4: true,
                // mp4Flags: '[movflags=frag_keyframe+empty_moov]',

                // app: 'live',
                // hls: true,
                // hlsFlags: '[hls_time=2:hls_list_size=3]',
                // mp4: true,
                // mp4Flags: '[movflags=frag_keyframe+empty_moov]',

                app: 'live',
                ac: 'aac',
                mp4: true,
                mp4Flags: '[movflags=faststart]',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
            }
        ]
    }
};
module.exports = config;