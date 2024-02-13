"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowArea = void 0;
var React = require("react");
var react_dom_1 = require("react-dom");
var styles_1 = require("./styles");
var ARROWMASTER_CLASS = "__react_arrowmaster";
var requireLocation = function (input) {
    return typeof input == "string"
        ? { id: input, posX: "middle", posY: "middle" }
        : {
            id: input.id,
            posX: input.posX || "middle",
            posY: input.posY || "middle",
        };
};
var getPoint = function (holder, location) {
    var loc = requireLocation(location);
    var el = holder.querySelector("#" + loc.id);
    if (!(el instanceof HTMLElement)) {
        return null;
    }
    var x, y, dx, dy;
    if (loc.posX === "left") {
        x = el.offsetLeft;
        dx = -1;
    }
    else if (loc.posX === "middle") {
        x = el.offsetLeft + el.offsetWidth / 2;
        dx = 0;
    }
    else if (loc.posX === "right") {
        x = el.offsetLeft + el.offsetWidth;
        dx = 1;
    }
    if (loc.posY === "top") {
        y = el.offsetTop;
        dy = -1;
    }
    else if (loc.posY === "middle") {
        y = el.offsetTop + el.offsetHeight / 2;
        dy = 0;
    }
    else if (loc.posY === "bottom") {
        y = el.offsetTop + el.offsetHeight;
        dy = 1;
    }
    var parent = el.offsetParent;
    while (parent && !parent.className.includes(ARROWMASTER_CLASS)) {
        x += parent.offsetLeft;
        y += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return x !== undefined &&
        y !== undefined &&
        dx !== undefined &&
        dy !== undefined
        ? { point: [x, y], direction: [dx, dy] }
        : null;
};
var diff = function (a, b) { return [b[0] - a[0], b[1] - a[1]]; };
var len = function (a) { return Math.sqrt(a[0] * a[0] + a[1] * a[1]); };
var buildPath = function (holder, arrow, defaultArrowStyle) {
    var _a, _b, _c, _d, _e;
    var from = getPoint(holder, arrow.from);
    var to = getPoint(holder, arrow.to);
    if (!from || !to) {
        return null;
    }
    var dx = to.point[0] - from.point[0];
    var dy = to.point[1] - from.point[1];
    if (from.direction[0] === 0 && from.direction[1] === 0) {
        from.direction[0] = Math.abs(dx) >= Math.abs(dy) ? dx : 0;
        from.direction[1] = Math.abs(dy) >= Math.abs(dx) ? dy : 0;
    }
    else {
        from.direction[0] = from.direction[0] * Math.abs(dx);
        from.direction[1] = from.direction[1] * Math.abs(dy);
    }
    if (to.direction[0] === 0 && to.direction[1] === 0) {
        to.direction[0] = Math.abs(dx) >= Math.abs(dy) ? -dx : 0;
        to.direction[1] = Math.abs(dy) >= Math.abs(dx) ? -dy : 0;
    }
    else {
        to.direction[0] = to.direction[0] * Math.abs(dx);
        to.direction[1] = to.direction[1] * Math.abs(dy);
    }
    var style = (_a = arrow.style) !== null && _a !== void 0 ? _a : defaultArrowStyle;
    var width = (_b = style.width) !== null && _b !== void 0 ? _b : defaultArrowStyle.width;
    var color = (_c = style.color) !== null && _c !== void 0 ? _c : defaultArrowStyle.color;
    var headStyle = (_d = style.head) !== null && _d !== void 0 ? _d : defaultArrowStyle.head;
    var midPointSpec = (_e = style.arrow) !== null && _e !== void 0 ? _e : defaultArrowStyle.arrow;
    var midPoints = typeof midPointSpec == "string"
        ? styles_1.arrowStyleAliases[midPointSpec]
        : midPointSpec;
    var headPoints = typeof headStyle == "string" ? styles_1.headStyleAliases[headStyle] : headStyle;
    var curved = midPoints.curved;
    var coordAbs = {
        o: from.point,
        v: [to.point[0] - from.point[0], 0],
        w: [0, to.point[1] - from.point[1]],
    };
    var coordRel = {
        o: from.point,
        v: [to.point[0] - from.point[0], to.point[1] - from.point[1]],
        w: [to.point[1] - from.point[1], from.point[0] - to.point[0]],
    };
    var extraPoints = typeof midPoints.points == "function"
        ? midPoints.points(from, to)
        : midPoints.points;
    var others = extraPoints.map(function (p) {
        var _a = p.absolute ? coordAbs : coordRel, o = _a.o, v = _a.v, w = _a.w;
        var fx = p.x.value / (p.x.unit == "%" ? 100 : len(v));
        var fy = p.y.value / (p.y.unit == "%" ? 100 : len(w));
        return [
            o[0] + v[0] * fx + w[0] * fy,
            o[1] + v[1] * fx + w[1] * fy,
        ];
    });
    var points = __spreadArray(__spreadArray([from.point], others, true), [to.point], false);
    if (headPoints === null || headPoints === void 0 ? void 0 : headPoints.adjust) {
        var adj = headPoints.adjust;
        var b = points.pop();
        var a = points.pop();
        var d = diff(a, b);
        var dl = len(d);
        var mw = width * adj;
        var f = dl > mw ? (dl - mw) / dl : 0.001;
        b[0] = a[0] + d[0] * f;
        b[1] = a[1] + d[1] * f;
        points.push(a);
        points.push(b);
    }
    return { points: points, curved: curved, width: width, color: color, headPoints: headPoints };
};
function notNull(value) {
    return value !== null;
}
var update = function (el) {
    var arrows = JSON.parse(el.dataset.arrows);
    var holder = el.closest(".".concat(ARROWMASTER_CLASS));
    var paths = arrows.arrows
        .map(function (a) { return buildPath(holder, a, arrows.defaultArrowStyle); })
        .filter(notNull);
    var prefix = "p".concat(Math.random().toString(16).substr(2, 8));
    var pathElements = paths.map(function (path, i) {
        var d;
        var s = path.points.shift().join(" ");
        if (path.curved && path.points.length > 1) {
            var c = path.points.length > 2
                ? "C ".concat(path.points.shift().join(" "), ", ").concat(path.points
                    .shift()
                    .join(" "), ",")
                : "Q ".concat(path.points.shift().join(" "), ",");
            var e = path.points.map(function (p) { return p.join(" "); }).join(" T ");
            d = "M ".concat(s, " ").concat(c, " ").concat(e);
        }
        else {
            var e = path.points.map(function (p) { return p.join(" "); }).join(" L ");
            d = "M ".concat(s, " L ").concat(e);
        }
        return (React.createElement("path", { key: "path-".concat(prefix, "-").concat(i), d: d, stroke: path.color, strokeWidth: path.width, fill: "none", markerEnd: path.headPoints ? "url(#".concat(prefix, "-").concat(i, ")") : undefined }));
    });
    var markerElements = paths.map(function (path, i) {
        return path.headPoints && (React.createElement("marker", { key: "marker-".concat(prefix, "-").concat(i), id: "".concat(prefix, "-").concat(i), markerWidth: path.headPoints.size, markerHeight: path.headPoints.size, refX: path.headPoints.size - path.headPoints.adjust, refY: path.headPoints.size / 2, orient: "auto" },
            React.createElement("path", { d: path.headPoints.svgPath, fill: path.headPoints.hollow ? "none" : path.color, stroke: path.headPoints.hollow ? path.color : "none" })));
    });
    (0, react_dom_1.render)(React.createElement(React.Fragment, null,
        React.createElement("defs", null, markerElements),
        pathElements), holder.firstChild);
};
var attach = function (el, arrows) {
    if (!el) {
        return;
    }
    // TODO: make this better... maybe just one global listening... should also cleanup...
    if (!el.dataset.arrows) {
        new MutationObserver(function () { return update(el); }).observe(el, {
            attributes: true,
            childList: true,
            subtree: true,
        });
        window.addEventListener("resize", function () { return update(el); });
    }
    el.dataset.arrows = JSON.stringify(arrows);
};
var ArrowArea = function (_a) {
    var arrows = _a.arrows, children = _a.children, _b = _a.defaultArrowStyle, defaultArrowStyle = _b === void 0 ? {} : _b;
    return (React.createElement("div", { className: ARROWMASTER_CLASS, style: { position: "relative" } },
        React.createElement("svg", { style: {
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                pointerEvents: "none",
            } }),
        React.createElement("div", { ref: function (el) {
                return attach(el, {
                    arrows: arrows,
                    defaultArrowStyle: __assign({ color: "#000000", width: 1, head: "default", arrow: "none" }, defaultArrowStyle),
                });
            } }, children)));
};
exports.ArrowArea = ArrowArea;
exports.default = exports.ArrowArea;
