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



var getExtRender =function(el){
    var s =el.ename.split("/");
    try{
        var renders = require("./config/"+s[0]+"/render");
        return renders.render;
    }
    catch(e){
        return {};
    }
}

/*渲染一个组件*/
var renderItem = function (el,html) {
    var template=getTemplate(el),
        data=el.value;
    var render_data = $.extend(true, data, getExtRender(el), {
        _sys_fn_container: function () {

            return function (container_name, render) {

                var container = this[SYS_VAR.container][container_name];
                var text = [];
                for (var i = 0; i < container.components.length; i++) {
                    var el = container.components[i];
                    if (isRefComp(el)) {
                        var els = getRefComps(el);
                        els.forEach(function (el) {
                            renderItem(el,text);
                        });
                    }
                    renderItem(el,text);
                }

                return render(text.join(''));
            }
        }

    });

    html.push(mustache.render(template, render_data));
}

/*获取组件模板HTML*/
var getTemplate = function (el) {
    var s =el.ename.split("/");
    var pkgPath = './config/'+s[0]+"/"+s[1]+".json";

    var pkg = require(pkgPath);

    return  pkg && pkg.html;
}


/*入口函数，根据组件列表构建html 返回*/

var render = function (pageEls) {
    var html = [];
    pageEls.forEach(function (el) {

        if (isRefComp(el)) {
            var els = getRefComps(el);
            els.forEach(function (_el) {
                 renderItem( _el,html);
            });
        }
        renderItem(el,html);
    });
    return html.join('');
}

var isRefComp = function (el) {
    return el.type && el.type === "refer";
}
var getRefComps = function (el) {
    return require(el.value.path);
}


exports.render = render;
