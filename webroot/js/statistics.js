var har_url = "harviewer/index.php?path=http://web-performance-watch-api.itinao.net/getHarp/%%SITE_ID%%";
var graph_width = 920;
var graph_height = 400;


var statistics = new Vue({
    el: '#statistics',
    data: {
        info: {
            site_name: "Yahoo!",
            url: "http://yahoo.co.jp",
            start_date: "2014-12-10 10:11:11",
            end_date: "2014-12-10 10:11:11"
        },
        profile: {
            description: '日本最大級のポータルサイト。検索、オークション、ニュース、天気、スポーツ、メール、ショッピングなど多数のサービスを展開。あなたの生活をより豊かにする「課題解決エンジン」を目指していきます。',
            screenshot: 'http://i.gzn.jp/img/2007/10/30/yahoo_japan_newtop/yahoo_japan_newtop0.png'
        },
        historys: [
            {
                id: 10,
                date: "2014-10-24 10:22:22"
            },
            {
                id: 12,
                date: "2014-12-24 10:22:22"
            }
        ],
        har_url: null,
        detail_dialog: null,
        loading: null
    },
    methods: {
        graphButton: function(type, event) {
            console.log(type);
        },
        detailButton: function(site_id, event) {
            console.log(site_id);
            this.$data.har_url = har_url.replace('%%SITE_ID%%', site_id);
            this.$data.detail_dialog.classList.add("on");
            this.$data.loading.classList.add("on");
            // 背景の色をかえる
            var scroll_height = document.body.scrollHeight;
            if (this.$data.detail_dialog.style.height < scroll_height) {// グレーアウト部分の高さを調整
                this.$data.detail_dialog.style.height = scroll_height + "px";
            }
            // ダイアログの位置を調整する
            var iframe = this.$data.detail_dialog.querySelector("iframe");
            var scroll_top = document.body.scrollTop || document.documentElement.scrollTop;
            iframe.style.marginTop = (scroll_top + 20) + "px";
            iframe.onload = (function() {
                this.$data.loading.classList.remove("on");// 読み込み完了でloadingを消す
            }).bind(this);
            this.$data.loading.style.marginTop = (scroll_top + 20) + "px";
        },
        dialogClick: function(event) {
            this.$data.detail_dialog.classList.remove("on");
            this.$data.har_url = null;
        }
    },
    ready: function() {
        var targetElm = document.querySelector(".draw_area");
        var dataset = [];
        dataset.push({'rank':  0, 'participant': 200 });
        dataset.push({'rank':  1, 'participant': 100 });
        dataset.push({'rank':  2, 'participant':  10 });
        dataset.push({'rank':  3, 'participant':  20 });
        dataset.push({'rank':  4, 'participant':  30 });
        dataset.push({'rank':  5, 'participant':  40 });
        dataset.push({'rank':  6, 'participant':  40 });
        dataset.push({'rank':  7, 'participant':  40 });
        dataset.push({'rank':  8, 'participant':  40 });
        dataset.push({'rank':  9, 'participant':  40 });
        dataset.push({'rank': 10, 'participant':  40 });
        dataset.push({'rank': 11, 'participant':  40 });
        dataset.push({'rank': 12, 'participant':  40 });
        dataset.push({'rank': 13, 'participant':  40 });
        dataset.push({'rank': 14, 'participant':  40 });
        dataset.push({'rank': 15, 'participant':  40 });
        dataset.push({'rank': 16, 'participant':  40 });
        dataset.push({'rank': 17, 'participant':  40 });
        dataset.push({'rank': 18, 'participant': 140 });
        dataset.push({'rank': 19, 'participant':  40 });
        dataset.push({'rank': 20, 'participant':  40 });
        dataset.push({'rank': 21, 'participant':  40 });
        dataset.push({'rank': 22, 'participant':  40 });
        dataset.push({'rank': 23, 'participant':  10 });
        drawGraph(targetElm, graph_width, graph_height, dataset);

        // 
        this.$data.detail_dialog = this.$el.querySelector(".detail-dialog");
        // 
        this.$data.loading = this.$el.querySelector("#loading");
    }
});

// グラフ描画処理
function drawGraph(targetElm, width, height, dataset) {
    var maxDataHeight = 0;// 人数の一番多いとこのバーの高さ
    dataset.forEach(function(data) {
      maxDataHeight = maxDataHeight > data.participant ? maxDataHeight : data.participant;
    })

    var margin = {top: 20, right: 54, bottom: 30, left: 64};
    width = width - margin.left - margin.right;
    height = height- margin.top - margin.bottom;

    var x = d3.scale
              .ordinal()
              .rangeRoundBands([0, width], .1);

    var y = d3.scale
              .linear()
              .range([height, 0]);

    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");

    var yAxis = d3.svg.axis()
                  .scale(y)
                  .ticks(5)
                  .orient("left");

    var svg = d3.select(targetElm)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    dataset.forEach(function(d) {
       d.participant = +d.participant;
    });
    // x軸の値を設定
    x.domain(dataset.map(function(d) {
        return d.rank;
    }));
    // y軸の値を設定
    y.domain([0, d3.max(dataset, function(d) {
        return d.participant;
    })]);
    // x軸を追加
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
    // y軸を追加
    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
       .attr("y", -15)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("onload time");
    // バーを追加
    svg.selectAll(".bar")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", function(d) {
           return x(d.rank);
       })
       .attr("width", x.rangeBand())
       .attr("y", function(d) {
           return y(d.participant);
        })
       .attr("height", function(d) {
           return height - y(d.participant);
       }).attr("fill", function(d) {
           var r = 140;
           var g = Math.ceil((d.participant / maxDataHeight) * 255);
           var b = 10;
           return "rgb(" + r + ", " + g + ", " + b + ")";
       });
}
