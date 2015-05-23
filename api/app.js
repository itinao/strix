/**
 * API
 */
var mysql = require('mysql');
var express = require('express');
var app = express();

app.get('/getSiteList', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var con = getConnection();
    var param = req.query;
    var query = con.query('select id, title, detail, url, updated, created from m_site',
        function (err, results) {
            res.send(results);
            con.destroy();
        }
    );
});

app.get('/getSite', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var con = getConnection();
    var param = req.query;
    var query = con.query('select id, title, detail, url, date_format(updated, "%Y-%m-%d %H:%i:%s") as updated, date_format(created, "%Y-%m-%d %H:%i:%s") as created from m_site where id = ?', [param.site_id], function (err, results) {
        res.send(results[0]);
        con.destroy();
    });
});

app.get('/getSiteInfo', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var con = getConnection();
    var param = req.query;
    var query = con.query('select site_id, title, description, image_base64, updated from site_info where site_id = ?', [param.site_id], function (err, results) {
        var _res = {};
        if (results[0]) {
            _res = results[0];
        }
        res.send(_res);
        con.destroy();
    });
});

app.get('/getTodayTimes', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var con = getConnection();
    var param = req.query;
    var query = con.query('select id, site_id, har, created, date_format(created, "%H") as hour from har_data where site_id = ? and date(now()) <= created', [param.site_id], function (err, results) {
        var onloadTimes = [];
        for (var i = 0, l = results.length; i < l; i++) {
            var hour = Number(results[i].hour);
            var har = JSON.parse(results[i].har);
            var onloadTime = har.log.pages[0].pageTimings.onLoad;
            onloadTimes[hour] = {"hour": hour, "onloadTime": onloadTime};
        }
        var _res = [];
        for (var i = 0, l = 24; i < l; i++) {
            _res[i] = onloadTimes[i] || {"hour": i, "onloadTime": 0};
        }
        res.send(_res);
        con.destroy();
    });
});

app.get('/getYesterdayTimes', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var con = getConnection();
    var param = req.query;
    var query = con.query('select id, site_id, har, created, date_format(created, "%H") as hour from har_data where site_id = ? and date(created) = DATE_SUB(CURRENT_DATE(), interval 1 day)', [param.site_id], function (err, results) {
        var onloadTimes = [];
        for (var i = 0, l = results.length; i < l; i++) {
            var hour = Number(results[i].hour);
            var har = JSON.parse(results[i].har);
            var onloadTime = har.log.pages[0].pageTimings.onLoad;
            onloadTimes[hour] = {"hour": hour, "onloadTime": onloadTime};
        }
        var _res = [];
        for (var i = 0, l = 24; i < l; i++) {
            _res[i] = onloadTimes[i] || {"hour": i, "onloadTime": 0};
        }
        res.send(_res);
        con.destroy();
    });
});

app.get('/getWeekTimes', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var con = getConnection();
    var param = req.query;
    var query = con.query('select date(created) as day, har from har_data where site_id = ? and DATE_SUB(CURRENT_DATE(), interval 7 day) < date(created) group by date(created);', [param.site_id], function (err, results) {
        var onloadTimes = [];
        for (var i = 0, l = results.length; i < l; i++) {
            var har = JSON.parse(results[i].har);
            var onloadTime = har.log.pages[0].pageTimings.onLoad;
            onloadTimes[i] = {"hour": results[i].day, "onloadTime": onloadTime};
        }
        res.send(onloadTimes);
        con.destroy();
    });
});

// TODO: あとで。。
app.get('/getMonth', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send([]);
});

// TODO: あとで。。
app.get('/getYear', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send([]);
});


app.get('/getNewHar', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var con = getConnection();
    var param = req.query;
    var query = con.query('select id, site_id, har, date_format(created, "%Y-%m-%d %H:%i:%s") as created from har_data where site_id = ? order by id desc limit 10', [param.site_id], function (err, results) {
        res.send(results);
        con.destroy();
    });
});

app.get('/getHistorys', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var con = getConnection();
    var param = req.query;
    var query = con.query('select har_data.id, har_data.site_id, har_data.har, yslow_data.yslow, date_format(yslow_data.created, "%Y-%m-%d %H:%i:%s") as created from har_data left join yslow_data on har_data.id = yslow_data.har_data_id where har_data.site_id = ? order by har_data.id desc limit 20', [param.site_id], function (err, results) {
        for (var i = 0, l = results.length; i < l; i++) {
            results[i].yslow = JSON.parse(results[i].yslow);
        }
        res.send(results);
        con.destroy();
    });
});

app.get('/getHarp/*', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var con = getConnection();
    var param = req.params;
    var query = con.query('select har from har_data where id = ?', [param[0]], function (err, results) {
        var har = JSON.parse(results[0].har);
        res.jsonp(har);
        con.destroy();
    });
});

var getConnection = function() {
    return mysql.createConnection({
        host: 'localhost',
        database: 'strix',
        user: 'root',
        password: ''
    });
};

app.listen(3001);
