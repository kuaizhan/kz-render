/*
 * node.js 渲染快站模板
 *
 * 依赖库
 *   mustache
 *   node-jquery
 *
 * */

var mustache = require("mustache");
var $ = require("node-jquery");

var SYS_VAR = {
    "container": "_containers_"
}


var SYS_RENDER_FN = {
    _sys_fn_container: function () {

        return function (template, render) {
            var container_name =render(template);
            var container = this[SYS_VAR.container][container_name];
            var text = [];
            for (var i = 0; i < container.components.length; i++) {
                var el = container.components[i];

                renderItem(el, text);
            }

            return render(text.join(''));
        }
    },
    _sys_fn_ref: function () {
        return function (args, render) {
            var _path = this[args];
            var html = [];
            var els = require(_path);

            els.forEach(function (_el) {
                renderItem(_el, html);
            });
            return render(html.join(','));
        }
    }

};

var getExtRender = function (el) {
    var s = el.ename.split("/");
    var path = "./config/" + s[0] + "/render";
    var fs = require("fs");
    try {
        if (fs.existsSync(path + ".js")) {
            var rendersSource = require(path);

            var renders = {};
            for (var n in rendersSource.render) {
                renders[n] = function () {
                    return rendersSource.render[n];
                }

            }

            return renders;
        } else {
            return {};
        }

    }
    catch (e) {
        console.log(e);
        return {};

    }
}

/*渲染一个组件*/
var renderItem = function (el, html) {
    var template = getTemplate(el),
        data = el.value;
    var render_data = $.extend(true, data, getExtRender(el), SYS_RENDER_FN);

    html.push(mustache.render(template, render_data));
}

/*获取组件模板HTML*/
var getTemplate = function (el) {
    var s = el.ename.split("/");
    var pkgPath = './config/' + s[0] + "/" + s[1] + ".json";

    var pkg = require(pkgPath);

    return  pkg && pkg.html;
}


/*入口函数，根据组件列表构建html 返回*/

var render = function (pageEls) {
    var html = [];
    pageEls.forEach(function (el) {
        renderItem(el, html);
    });
    return html.join('');
}


exports.render = render;
