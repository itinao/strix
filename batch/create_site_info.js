/** 
 * サイトの画像と説明文を取得
 */
var phantom = require('phantom');
var db = require('./db.js');

if (process.argv.length <= 2) {
    console.log("引数足らず");
    process.exit();
}
var site_id = process.argv[2];
var con = db.getConnection();

var main = function() {
    // site_idからURLを取得する
    var query = con.query('select * from m_site where id = ?', [site_id], function (err, results) {
        if (results.length <= 0) {
            console.log("URL見つからず");
            process.exit();
        }
        var url = results[0].url;

        // 画像保存とサイトの説明文を取得
        phantom.create(function(ph) {
            ph.createPage(function(page) {
                var title = null;
                var description = null;
                // ページが読み込まれたら page.onCallback を呼ぶ
                page.set('onInitialized', function() {
                    page.evaluate(function() {
                        var title = document.title;
                        var description = null;
                        var desc = document.getElementsByName("description");
                        if (desc.length <= 0) {
                            desc = document.getElementsByName("DESCRIPTION");
                        }
                        if (0 < desc.length) {
                            description = desc[0].content;
                        }
                        document.addEventListener('DOMContentLoaded', function() {
                            window.callPhantom(title, description);
                        }, false);
                    });
                });
                page.set('onCallback', function(_title, _description) {
                    title = _title;
                    description = _description;
                });

                var width = 1000;
                var height = 600;
                page.set('viewportSize', {width: width, height: height}, function() {
                    page.set('clipRect', {width: width, height: height}, function() {
                        page.open(url, function(status) {
                            console.log(status);
                            page.renderBase64('PNG', function(b64){
                                var query = con.query('replace into site_info (site_id, title, description, image_base64, updated) values (?, ?, ?, ?, now())',
                                                              [site_id, title, description, 'data:image/png;base64,' + b64], function(err, results) {
                                    console.log(err);
                                    console.log(results);
                                    con.destroy();
                                    ph.exit();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

main();

