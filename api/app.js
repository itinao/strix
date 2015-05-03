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
  var query = con.query('\
select m_site.*, count(*) as cnt, date(min(har_data.created)) as start_date, date(max(har_data.created)) as end_date \
from m_site left join har_data on m_site.id = har_data.site_id group by m_site.id',
    function (err, results) {
      res.send(results);
      con.destroy();
    }
  );
});


var getConnection = function() {
  return mysql.createConnection({
    host: 'localhost',
    database: 'webp',
    user: 'root',
    password: ''
  });
};

app.listen(3000);
