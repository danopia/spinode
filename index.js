var net = require('net');

var time = 0;
setInterval(function () { time += 0.1; }, 100);
setInterval(function () { time  = 0;   }, 407000);

var server = net.createServer(function (conn) {
  console.log('client connected', conn._handle.fd);
  conn.on('end', function() {
    console.log('client disconnected');
  });

  conn.on('data', function (packet) {
    console.log(conn._handle.fd, packet);

    if (packet == 'password "this one time at band camp"\n') {
      conn.write('OK\n');
    } else if (packet == 'status\n') {
      conn.write('volume: 100\n');
      conn.write('repeat: 0\n');
      conn.write('random: 0\n');
      conn.write('single: 0\n');
      conn.write('consume: 1\n');
      conn.write('playlist: 1\n'); // playlist version number
      conn.write('playlistlength: 500\n');
      conn.write('state: play\n');
      conn.write('song: 0\n'); // playlist song number
      conn.write('songid: 0\n'); // playlist songid
      conn.write('nextsong: 1\n');
      conn.write('nextsongid: 1\n');
      conn.write('time: ' + Math.round(time) + ':407\n');
      conn.write('elapsed: ' + time + '\n');
      //conn.write('bitrate: 320\n');
      //conn.write('xfade: 0\n');
      //conn.write('mixrampdb: mixramp threshold in dB\n');
      //conn.write('mixrampdelay: mixrampdelay in seconds\n');
      //conn.write('audio: sampleRate:bits:channels\n');
      //conn.write('updating_db: job id\n');
      //conn.write('error: if there is an error, returns message here\n');
      conn.write('OK\n');
    } else if (packet == 'stats\n') {
      conn.write('artists: 10\n');
      conn.write('songs: 10\n');
      conn.write('uptime: 10\n'); // in seconds
      conn.write('db_playtime: 407\n'); // sum of song length
      conn.write('db_update: 0\n'); // timestamp of db update
      conn.write('playtime: 123\n'); // time music has been played
      conn.write('OK\n');
    } else if (packet == 'outputs\n') {
      conn.write('outputid: 0\n');
      conn.write('outputname: Living room\n');
      conn.write('outputenabled: 1\n');
      conn.write('outputid: 1\n');
      conn.write('outputname: Anthony\'s room\n');
      conn.write('outputenabled: 0\n');
      conn.write('outputid: 2\n');
      conn.write('outputname: Daniel\'s room\n');
      conn.write('outputenabled: 0\n');
      conn.write('OK\n');
    } else if (packet == 'plchanges "-1"\n' || packet == 'plchanges "0"\n' || packet == 'playlistinfo "-1"\n') {
      conn.write('file: lovedowned.mp3\n');
      //conn.write('Last-Modified: 2014-04-15T04:50:09Z\n');
      conn.write('Time: 407\n');
      conn.write('Title: Love Downed\n');
      conn.write('Artist: Midnite Jackers\n');
      conn.write('Album: The Witching Hour EP\n');
      conn.write('Date: 2013\n');
      conn.write('Genre: Jackin\' House\n');
      conn.write('Pos: 0\n');
      conn.write('Id: 0\n');
      conn.write('OK\n');
    } else if (packet == 'lsinfo ""\n') {
      conn.write('file: lovedowned.mp3\n');
      //conn.write('Last-Modified: 2014-04-15T04:50:09Z\n');
      conn.write('Time: 407\n');
      conn.write('Title: Love Downed\n');
      conn.write('Artist: Midnite Jackers\n');
      conn.write('Album: The Witching Hour EP\n');
      conn.write('Date: 2013\n');
      conn.write('Genre: Jackin\' House\n');
      conn.write('Pos: 0\n');
      conn.write('Id: 0\n');
      conn.write('OK\n');
    } else if (packet == 'currentsong\n' || packet == 'playlistid "0"\n') {
      conn.write('file: lovedowned.mp3\n');
      //conn.write('Last-Modified: 2014-04-15T04:50:09Z\n');
      conn.write('Time: 407\n');
      conn.write('Title: Love Downed\n');
      conn.write('Artist: Midnite Jackers\n');
      conn.write('Album: The Witching Hour EP\n');
      conn.write('Date: 2013\n');
      conn.write('Genre: Jackin\' House\n');
      conn.write('Pos: 0\n');
      conn.write('Id: 0\n');
      conn.write('OK\n');
    } else if (packet == 'idle\n') {
      console.log('idling client');
    } else {
      console.log('----- FAKING IT');
      conn.write('OK\n');
    }
  }).setEncoding('utf8');

  conn.write('OK MPD 0.25.1\n');
});

server.listen(6600, function () {
  console.log('MPD server listening');
});
