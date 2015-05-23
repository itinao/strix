/**
 *
 */
var site = new Vue({
    el: '#site',
    data: {
        site_list: [],
        loading: null
    },
    methods: {},
    ready: function() {
        this.$data.loading = this.$el.querySelector("#loading");

        this.$data.loading.classList.add("on");
        request.get("getSiteList", {}, function(site_list) {
            console.log(site_list);
            this.$data.site_list = site_list;
            this.$data.loading.classList.remove("on");
        }.bind(this));
    }
});
