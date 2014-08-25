exports.render = {
    fn_link: function (template, render) {

        var args = template.split(",");
        return render(args[0] + "/" + args[1]);
    }
}