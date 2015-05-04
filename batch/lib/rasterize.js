var page = require('webpage').create();
// argsは、phantom.argsでアクセスできる。
var address = phantom.args[0];
var output = phantom.args[1];
var width = phantom.args[2];
var height = phantom.args[3];
//console.log(address);
//console.log(output);
//console.log(width);
//console.log(height);
page.viewportSize = {width: width, height: height, margin:'0px'};
page.clipRect = {width: width, height: height};
page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36";
page.open(address,
    function(status) {
        console.log(status);
        
        if (status !== 'success') {
            console.log('error');
        } else{
            var title = page.evaluate(function(){
                return document.title;
            });
            var description = page.evaluate(function(){
                var desc = document.getElementsByName("description");
                if (desc.length <= 0) {
                    desc = document.getElementsByName("DESCRIPTION");
                }
                if (desc.length <= 0) {
                    return;
                }
                return desc[0].content;
            });
            console.log(title);
            console.log(description);
            // 出力
            page.render(output);
            // 終了
            phantom.exit();
        }
     }
);
