var graph_width = 800;
var graph_height = 400;
var graph_types = {
    TODAY    : 'TODAY',
    YESTERDAY: 'YESTERDAY',
    WEEK     : 'WEEK',
    MONTH    : 'MONTH',
    YEAR     : 'YEAR',
};
var default_graph_type = graph_types['TODAY'];



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
        graph_data: {},
        historys: [],
        score: null,
        har_url: null,
        detail_dialog: null,
        score_dialog: null,
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
            } else if (type === "WEEK") {
                request.get("getWeekTimes", {site_id: site_id}, function(times) {
                    console.log(times);
                    targetElm.childNodes[0].remove();// TODO: 一旦消すよ
                    drawGraph(targetElm, graph_width, graph_height, times);
                }.bind(this));
            } else if (type === "MONTH") {
                request.get("getMonth", {site_id: site_id}, function(times) {
                    console.log(times);
                    targetElm.childNodes[0].remove();// TODO: 一旦消すよ
                    drawGraph(targetElm, graph_width, graph_height, times);
                }.bind(this));
            } else if (type === "YEAR") {
                request.get("getYear", {site_id: site_id}, function(times) {
                    console.log(times);
                    targetElm.childNodes[0].remove();// TODO: 一旦消すよ
                    drawGraph(targetElm, graph_width, graph_height, times);
                }.bind(this));
            }
        },
        detailButton: function(har_data_id, event) {
            console.log(har_data_id);
            this.$data.har_url = Constant.har_url.replace('%%HAR_DATA_ID%%', har_data_id);
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
        scoreButton: function(index, event) {
            var history = this.$data.historys[index];
            this.$data.score = history;
            this.$data.score_dialog.classList.add("on");
            // 背景の色をかえる
            var scroll_height = document.body.scrollHeight;
            if (this.$data.score_dialog.style.height < scroll_height) {// グレーアウト部分の高さを調整
                this.$data.score_dialog.style.height = scroll_height + "px";
            }
            // ダイアログの位置を調整する
            var score_div = this.$data.score_dialog.querySelector("div");
            var scroll_top = document.body.scrollTop || document.documentElement.scrollTop;
            score_div.style.marginTop = (scroll_top + 20) + "px";
        },
        dialogClick: function(event) {
            this.$data.detail_dialog.classList.remove("on");
            this.$data.score_dialog.classList.remove("on");
            this.$data.har_url = null;
            this.$data.score = null;
        }
    },
    ready: function() {

        var vars = getVars();
        var site_id = vars.site_id;

        // 
        this.$data.detail_dialog = this.$el.querySelector(".detail-dialog");
        this.$data.score_dialog = this.$el.querySelector(".score-dialog");
        this.$data.loading = this.$el.querySelector("#loading");

        //
        if (site_id) {
            this.$data.loading.classList.add("on");
            var task = new Task(4, function(err) {
                this.$data.loading.classList.remove("on");
            }.bind(this));

            request.get("getSite", {site_id: site_id}, function(site) {
                console.log(site);
                this.$data.info.url = site.url;
                this.$data.info.start_date = site.created;
                task.pass();
            }.bind(this));

            request.get("getSiteInfo", {site_id: site_id}, function(site_info) {
                console.log(site_info);
                this.$data.info.site_name = site_info.title;
                this.$data.profile.description = site_info.description;
                this.$data.profile.image_base64 = site_info.image_base64;
                task.pass();
            }.bind(this));

            var targetElm = document.querySelector(".draw_area");
            request.get("getTodayTimes", {site_id: site_id}, function(times) {
                console.log(times);
                drawGraph(targetElm, graph_width, graph_height, times);
                task.pass();
            }.bind(this));

            request.get("getHistorys", {site_id: site_id}, function(hars) {
                console.log(hars);
                this.$data.historys = hars;
                if (hars[0]) {
                    this.$data.info.end_date = hars[0].created;
                }
                task.pass();
            }.bind(this));
        }
    }
});

