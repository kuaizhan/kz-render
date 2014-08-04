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
var renderFn =require("./render_ext_fn");
var comp_lib_file = './component-lib.json';

/*全部组件配置数据*/
var comps = (function () {

    var _lib = require(comp_lib_file);
    var _comps = {};
    _lib.forEach(function (p) {
        p.components.forEach(function (c) {
            _comps[c.ename] = c;
        })
    });
    return _comps;
})();

var _getClosestContainer = function ($dom, containerName) {
    if ($dom.is("[data-container='" + containerName + "']")) {
        return $dom;
    }
    var children = $dom.children();
    var tmp =[];
    for (var n = 0; n < children.length; n++) {
        var _child =$(children[n]);
        if (_child.is("[data-container='" + containerName + "']")) {
            return _child;
        } else {
            tmp.push(_child);
        }
    }
    for(var i=0;i<tmp.length;i++){
        return _getClosestContainer(tmp[i],containerName);
    }
}

/*渲染一个组件*/
var renderItem = function (template, data) {
    var render_data = $.extend(true,data,renderFn.renderExtFn);

    var html = mustache.render(template, render_data);

    if (data["_containers_"]) {
        var $dom = $(html);
        for (var n in data["_containers_"]) {
            var els = data["_containers_"][n].components;
            var $container = _getClosestContainer($dom, n);
            $container && $container.html(render(els));
        }
        html = "";
        for (var i = 0; i < $dom.length; i++) {
            html += $dom[i].outerHTML;
        }
    }

    return html;
}

/*获取组件模板HTML*/
var getTemplate = function (el) {
    var pkg = comps[el.ename];

    return  pkg && pkg.html;
}


/*入口函数，根据组件列表构建html 返回*/

var render = function (pageEls) {
    var html = "";
    pageEls.forEach(function (el) {

        //TODO: 当一个组件是引用组件时，可以获取这个引用组件对应JSON数据
        /*
         * if(el.is("引用组件")){
         *
         *     var els = 获取引用组件数据(el);
         *     els.forEach(function(_el){
         *         html += renderItem(getTemplate(_el), _el.value);
         *     });
         *
         * }
         */
        if (isRefComp(el)) {
            var els = getRefComps(el);
            els.forEach(function (_el) {
                html += renderItem(getTemplate(_el), _el.value);
            });
        }
        html += renderItem(getTemplate(el), el.value);
    });
    return html;
}

var isRefComp = function (el) {
    return el.type && el.type === "refer";
}
var getRefComps = function (el) {
    return require(el.value.path);
}


var _pageTemplate = (function () {
    var fs = require('fs');
    return fs.readFileSync("templates/default.html", 'utf-8')
})();

/*构建整个网页*/
var renderPage = function (pageData) {
    var headHTML = render(pageData.head);
    var headerHTML = render(pageData.header);
    var bodyHTML = render(pageData.body);
    var footerHTML = render(pageData.footer);
    return mustache.render(_pageTemplate, {head: headHTML, header: headerHTML, body: bodyHTML, footer: footerHTML});
}


exports.render = render;
exports.renderItem = renderItem;
exports.renderPage = renderPage;