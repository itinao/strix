/** 
 * harを取得してDBに突っ込む + harをyslowに投げて結果をDBに突っ込む
 */
var exec = require('child_process').exec;
var cmd = "phantomjs " + __dirname + "/lib/netsniff.js";
//var cmd = "/usr/local/bin/phantomjs " + __dirname + "/lib/netsniff.js";
var mysql = require('mysql');
var async = require('async');
var YSLOW = require('yslow').YSLOW;
var doc = require('jsdom').jsdom();
var db = require('./db.js');

var tasks = [];

var connection = db.getConnection();
var createHar = function(site_id, url, callback) {
    var _cmd = cmd + " " + url;
    console.log(_cmd);
  
    var child = exec(_cmd, function(err, stdout, stderr) {
        if (!err && stdout && !stderr) {
            try {
                var harStr = stdout.match(/^\{[\s\S]*\}/);// 行末に意図しないコードが入ってもパースできるようにする
                var har = JSON.parse(harStr);
  
                // HAR
                var query = connection.query('insert into har_data (site_id, har, created) values (?, ?, now())',
                                              [site_id, JSON.stringify(har)], function (err, results) {
                    var insertId = results.insertId;
                    if (err) {
                        console.log('insert error');
                        connection.destroy();
                        callback && callback();
                        return;
                    }
  
                  // YSLOW
                  var res = YSLOW.harImporter.run(doc, har, 'yslow1');
                  var content = YSLOW.util.getResults(res.context, 'grade');
                  var query = connection.query('insert into yslow_data (site_id, har_data_id, yslow, created) values (?, ?, ?, now())',
                                                [site_id, insertId, JSON.stringify(content)], function (err, results) {
                      if (err) {
                          console.log('insert error');
                          connection.destroy();
                      }
                      callback && callback();
                  });
                });
  
            } catch(e) {
                console.log(e);
                callback && callback();
            }
        } else if (stdout) {
            console.log('stderr: ' + stderr)
            callback && callback();
        } else {
            console.log(err);
            callback && callback();
        }
    });
};

var end = function(err, results) {
    connection.end(function() {
        console.log(' --- connection end ---');
    });
};

var main = function() {
    var query = connection.query('select * from m_site', function (err, results) {
        results.forEach(function(result) {
            tasks.push(function(callback) {
                createHar(result.id, result.url, callback);
            });
        });
        async.series(tasks, end);
    });
};

main();
