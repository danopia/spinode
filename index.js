var net = require('net');
var crypto = require('crypto');

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


function signSongId(song_id) {
  var s1 = new Buffer('VzeC4H4h+T2f0VI180nVX8x+Mb5HiTtGnKgH52Otj8ZCGDz9jRWyHb6QXK0JskSiOgzQfwTY5xgLLSdUSreaLVMsVVWfxfa8Rw==', 'base64')
  var s2 = new Buffer('ZAPnhUkYwQ6y5DdQxWThbvhJHN8msQ1rqJw0ggKdufQjelrKuiGGJI30aswkgCWTDyHkTGK9ynlqTkJ5L4CiGGUabGeo8M6JTQ==', 'base64')
  var s3 = new Buffer(s1.length);
  for (var i = 0; i < s1.length; i++) {
    s3[i] = s1[i] ^ s2[i];
  }

  var key = s3.toString()
  var salt = +new Date()+'';

  var sig = crypto.createHmac('sha1', key).update(song_id).update(salt).digest('base64');
  return [sig.replace('/', '_').replace('+', '-').replace('=', ''), salt];
}

function gotTracks() {
  var track = tracks[800];
  var devid = settings.devices[0].id.substr(2);

  var sig = signSongId(track.id);
  var gett = '?opt=hi&net=wifi&pt=e&slt=' + sig[1] + '&sig=' + sig[0] + '&songid=' + track.id;

var opts = {
  host: 'android.clients.google.com',
  port: 443,
  path: '/music/mplay' + gett,
  method: 'GET',
  headers: {
    'Authorization': 'GoogleLogin auth=' + authId,
    'X-Device-ID': devid
  }
};
console.log(opts);
              var req = require('https').request(opts, function(res) {
                console.log("statusCode:", res.statusCode);
                console.log("headers:", res.headers);

                var buff = '';
                res.on('data', function(d) {
                  buff += d;
                }).setEncoding('utf8');

                res.on('end', function () {
                console.log('got song', buff.length);
                  playUrl(res.headers.location);
                });
              });

              req.on('error', function(e) {
                console.error(e);
              });
              req.end();
}



function playUrl(url) {
  console.log('playing from', url);


                var req = require('http').get(url, function(res) {
                  console.log("mstatusCode:", res.statusCode);
                  console.log("mheaders:", res.headers);

                  var lame = require('lame');
                  var Speaker = require('speaker');

                  res
                    .pipe(new lame.Decoder)
                    .on('format', console.log)
                    .pipe(new Speaker);


                  res.on('end', function () {
                    console.log('done grabbing song');
                  });
                });

                req.on('error', function(e) {
                  console.error(e);
                });


}





var authId, xt;
var tracks, settings;

var GoogleClientLogin = require('googleclientlogin').GoogleClientLogin;
var googleAuth = new GoogleClientLogin({
  email: 'dan@danopia.net',
  password: '',
  service: 'sj'
});
googleAuth.on(GoogleClientLogin.events.login, function(){
  console.log(googleAuth.getAuthId());
  /*
  require('https').request({
    host: 'play.google.com',
    port: 443,
    path: '/music/services/loadsettings',
    method: 'POST',
    headers: {
      'Authorization': 'GoogleLogin auth=' + googleAuth.getAuthId(),
      ... // also getSID, getLSID
    }
  });*/


  var req = require('https').request({
    host: 'play.google.com',
    port: 443,
    path: '/music/listen',
    method: 'HEAD',
    headers: {
      'Authorization': 'GoogleLogin auth=' + googleAuth.getAuthId(),
      //...  also getSID, getLSID
    }
  }, function(res) {
    console.log("statusCode:", res.statusCode);
    console.log("headers:", res.headers);

    authId = res.headers['update-client-auth'] || googleAuth.getAuthId();
    xt     = res.headers['set-cookie'].filter(function (h) {return h.indexOf('xt=')===0})[0].substring(3).split(';')[0];

    res.on('data', function(d) {
      process.stdout.write(d);
    });


    var reqq = require('https').request({
      host: 'music.google.com',
      port: 443,
      path: '/music/services/loadsettings?xt=' + xt,
      method: 'POST',
      headers: {
        'Authorization': 'GoogleLogin auth=' + authId,
        // ... also getSID, getLSID
      }
    }, function(res) {
      console.log("statusCode:", res.statusCode);
      console.log("headers:", res.headers);

      authId = res.headers['update-client-auth'] || authId;

      var biff = '';
      res.on('data', function(d) {
        biff += d;
      }).setEncoding('utf8');

      res.on('end', function () {
        console.log('got settings');

        var json = JSON.parse(biff);
        settings = json.settings;



            var reqq = require('https').request({
              host: 'www.googleapis.com',
              port: 443,
              path: '/sj/v1.1/trackfeed?alt=json&include-tracks=true',
              method: 'POST',
              headers: {
                'Authorization': 'GoogleLogin auth=' + authId,
                // ... also getSID, getLSID
              }
            }, function(res) {
              console.log("statusCode:", res.statusCode);
              console.log("headers:", res.headers);

              var buff = '';
              res.on('data', function(d) {
                buff += d;
              }).setEncoding('utf8');

              res.on('end', function () {
                console.log('got tracks');
                var json = JSON.parse(buff);
                tracks = json.data.items;
                gotTracks();
              });
            });

            reqq.on('error', function(e) {
              console.error(e);
            });
            reqq.end();




      });
    });

    reqq.on('error', function(e) {
      console.error(e);
    });
    reqq.end();
  });

  req.on('error', function(e) {
    console.error(e);
  });
  req.end();
});
googleAuth.on(GoogleClientLogin.events.error, function(e) {
    switch(e.message) {
      case GoogleClientLogin.errors.loginFailed:
        if (this.isCaptchaRequired()) {
          requestCaptchaFromUser(this.getCaptchaUrl(), this.getCaptchaToken());
        } else {
          console.log(e.data);
        }
        break;
      case GoogleClientLogin.errors.tokenMissing:
      case GoogleClientLogin.errors.captchaMissing:
        throw new Error('You must pass the both captcha token and the captcha')
        break;
    }
    throw new Error('Unknown error');
  // damn..
});
googleAuth.login();
