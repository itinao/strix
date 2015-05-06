/**
 *
 */
var site = new Vue({
    el: '#site',
    data: {
        site_list: []
    },
    methods: {},
    ready: function() {
        request.get("getSiteList", {}, function(site_list) {
            console.log(site_list);
            this.$data.site_list = site_list;
        }.bind(this));
    }
});
