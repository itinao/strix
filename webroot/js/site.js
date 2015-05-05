var api_url = "http://localhost:3000/";
var har_url = "harviewer/index.php?path=http://localhost:3000/getHarp/%%SITE_ID%%";

var site = new Vue({
    el: '#site',
    data: {
        site_list: []
    },
    methods: {},
    ready: function() {
        request.setBaseURL(api_url);
        request.get("getSiteList", {}, function(site_list) {
            console.log(site_list);
            this.$data.site_list = site_list;
        }.bind(this));
    }
});
