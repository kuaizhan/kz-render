exports.render = {
    fn_dynamic_container: function (template, render) {
        if (this._containers_) {
            var html = "";
            for (var n in this._containers_) {
                var opts =this["container_opts"][n];
                var classes="";
                classes+=opts["md-width"]?" col-md-"+opts["md-width"]:"";
                classes+=opts["lg-width"]?" col-lg-"+opts["lg-width"]:"";
                classes+=opts["sm-width"]?" col-sm-"+opts["sm-width"]:"";
                classes+=" "+(opts["classess"]||"");
                classes = classes.replace(/^\s*|\s*$/ig,'');
                html += '<div class=\"'+classes+'\">{{#_sys_fn_container}}' + n + '{{/_sys_fn_container}}<\/div>';
            }
            return render(html);
        }
        return render("");

    }
}