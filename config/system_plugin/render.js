exports.render = {
    fn_link: function () {
        return function (template, render,opts) {
            var args = template.split(",");
            return render(args[0] + "/" + args[1]);
        }
    }
}