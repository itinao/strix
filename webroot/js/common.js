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
