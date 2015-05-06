var graph_width = 920;
var graph_height = 400;

var statistics = new Vue({
    el: '#statistics',
    data: {
        info: {
            site_name: null,
            url: null,
            start_date: null,
            end_date: null
        },
        profile: {
            description: null,
            image_base64: null
        },
        historys: [],
        har_url: null,
        detail_dialog: null,
        loading: null
    },
    methods: {
        graphButton: function(type, event) {
            console.log(type);
            var vars = getVars();
            var site_id = vars.site_id;
            var targetElm = document.querySelector(".draw_area");
            if (type === "YESTERDAY")  {
                request.get("getYesterdayTimes", {site_id: site_id}, function(times) {
                    console.log(times);
                    targetElm.childNodes[0].remove();// TODO: 一旦消すよ
                    drawGraph(targetElm, graph_width, graph_height, times);
                }.bind(this));
            } else if (type === "TODAY") {
                request.get("getTodayTimes", {site_id: site_id}, function(times) {
                    console.log(times);
                    targetElm.childNodes[0].remove();// TODO: 一旦消すよ
                    drawGraph(targetElm, graph_width, graph_height, times);
                }.bind(this));
            }
        },
        detailButton: function(site_id, event) {
            console.log(site_id);
            this.$data.har_url = Constant.har_url.replace('%%SITE_ID%%', site_id);
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

        var vars = getVars();
        var site_id = vars.site_id;

        //
        if (site_id) {
            request.get("getSite", {site_id: site_id}, function(site) {
                console.log(site);
                this.$data.info.url = site.url;
                this.$data.info.start_date = site.created;
            }.bind(this));

            request.get("getSiteInfo", {site_id: site_id}, function(site_info) {
                console.log(site_info);
                this.$data.info.site_name = site_info.title;
                this.$data.profile.description = site_info.description;
                this.$data.profile.image_base64 = site_info.image_base64;
            }.bind(this));

            var targetElm = document.querySelector(".draw_area");
            request.get("getTodayTimes", {site_id: site_id}, function(today_times) {
                console.log(today_times);
                drawGraph(targetElm, graph_width, graph_height, today_times);
            }.bind(this));

            request.get("getNewHar", {site_id: site_id}, function(hars) {
                console.log(hars);
                this.$data.historys = hars;
                if (hars[0]) {
                    this.$data.info.end_date = hars[0].created;
                }
            }.bind(this));
        }

        // 
        this.$data.detail_dialog = this.$el.querySelector(".detail-dialog");
        // 
        this.$data.loading = this.$el.querySelector("#loading");
    }
});

// グラフ描画処理
function drawGraph(targetElm, width, height, dataset) {
    var maxDataHeight = 0;// 一番多いとこのバーの高さ
    dataset.forEach(function(data) {
        maxDataHeight = maxDataHeight > data.onloadTime ? maxDataHeight : data.onloadTime;
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
       d.onloadTime = +d.onloadTime;
    });
    // x軸の値を設定
    x.domain(dataset.map(function(d) {
        return d.hour;
    }));
    // y軸の値を設定
    y.domain([0, d3.max(dataset, function(d) {
        return d.onloadTime;
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
           return x(d.hour);
       })
       .attr("width", x.rangeBand())
       .attr("y", function(d) {
           return y(d.onloadTime);
        })
       .attr("height", function(d) {
           return height - y(d.onloadTime);
       }).attr("fill", function(d) {
           var r = 140;
           var g = Math.ceil((d.onloadTime / maxDataHeight) * 255);
           var b = 10;
           return "rgb(" + r + ", " + g + ", " + b + ")";
       });
}

function getVars() {
    var hashs = window.location.search.slice(1).split('&');
    var vars = {};
    for (var i = 0, l = hashs.length; i < l; i++) {
        var hash = hashs[i];
        if (!hash) {
            continue;
        }
        var kay_values = hash.split('=');
        vars[kay_values[0]] = kay_values[1];
    }
    return vars;
}
