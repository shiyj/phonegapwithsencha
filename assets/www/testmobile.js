

/*********************************OpenLayers***********************************/
var OpenLayers = {
    VERSION_NUMBER: "$Revision: 10995 $",
    singleFile: true,
    _getScriptLocation: function() {
        for (var a = /(^|(.*?\/))(OpenLayers.js)(\?|$)/, b = document.getElementsByTagName("script"), c, d = "", e = 0, f = b.length; e < f; e++) if (c = b[e].getAttribute("src")) if (c = c.match(a)) {
            d = c[1];
            break
        }
        return function() {
            return d
        }
    } ()
};
OpenLayers.Class = function() {
    var a = arguments.length,
    b = arguments[0],
    c = arguments[a - 1],
    d = typeof c.initialize == "function" ? c.initialize: function() {
        b.apply(this, arguments)
    };
    if (a > 1) {
        a = [d, b].concat(Array.prototype.slice.call(arguments).slice(1, a - 1), c);
        OpenLayers.inherit.apply(null, a)
    } else d.prototype = c;
    return d
};
OpenLayers.Class.isPrototype = function() {};
OpenLayers.Class.create = function() {
    return function() {
        arguments && arguments[0] != OpenLayers.Class.isPrototype && this.initialize.apply(this, arguments)
    }
};
OpenLayers.Class.inherit = function(a) {
    var b = function() {
        a.call(this)
    },
    c = [b].concat(Array.prototype.slice.call(arguments));
    OpenLayers.inherit.apply(null, c);
    return b.prototype
};
OpenLayers.inherit = function(a, b) {
    var c = function() {};
    c.prototype = b.prototype;
    a.prototype = new c;
    var d,
    e;
    c = 2;
    for (d = arguments.length; c < d; c++) {
        e = arguments[c];
        if (typeof e === "function") e = e.prototype;
        OpenLayers.Util.extend(a.prototype, e)
    }
};
OpenLayers.Util = OpenLayers.Util || {};
OpenLayers.Util.extend = function(a, b) {
    a = a || {};
    if (b) {
        for (var c in b) {
            var d = b[c];
            if (d !== undefined) a[c] = d
        }
        if (! (typeof window.Event == "function" && b instanceof window.Event) && b.hasOwnProperty && b.hasOwnProperty("toString")) a.toString = b.toString
    }
    return a
};
OpenLayers.Console = {
    log: function() {},
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {},
    userError: function(a) {
        alert(a)
    },
    assert: function() {},
    dir: function() {},
    dirxml: function() {},
    trace: function() {},
    group: function() {},
    groupEnd: function() {},
    time: function() {},
    timeEnd: function() {},
    profile: function() {},
    profileEnd: function() {},
    count: function() {},
    CLASS_NAME: "OpenLayers.Console"
};
 (function() {
    for (var a = document.getElementsByTagName("script"), b = 0, c = a.length; b < c; ++b) if (a[b].src.indexOf("firebug.js") != -1) if (console) {
        OpenLayers.Util.extend(OpenLayers.Console, console);
        break
    }
})();
OpenLayers.Control = OpenLayers.Class({
    id: null,
    map: null,
    div: null,
    type: null,
    allowSelection: false,
    displayClass: "",
    title: "",
    autoActivate: false,
    active: null,
    handler: null,
    eventListeners: null,
    events: null,
    EVENT_TYPES: ["activate", "deactivate"],
    initialize: function(a) {
        this.displayClass = this.CLASS_NAME.replace("OpenLayers.", "ol").replace(/\./g, "");
        OpenLayers.Util.extend(this, a);
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
        if (this.eventListeners instanceof Object) this.events.on(this.eventListeners);
        if (this.id == null) this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_")
    },
    destroy: function() {
        if (this.events) {
            this.eventListeners && this.events.un(this.eventListeners);
            this.events.destroy();
            this.events = null
        }
        this.eventListeners = null;
        if (this.handler) {
            this.handler.destroy();
            this.handler = null
        }
        if (this.handlers) {
            for (var a in this.handlers) this.handlers.hasOwnProperty(a) && typeof this.handlers[a].destroy == "function" && this.handlers[a].destroy();
            this.handlers = null
        }
        if (this.map) {
            this.map.removeControl(this);
            this.map = null
        }
        this.div = null
    },
    setMap: function(a) {
        this.map = a;
        this.handler && this.handler.setMap(a)
    },
    draw: function(a) {
        if (this.div == null) {
            this.div = OpenLayers.Util.createDiv(this.id);
            this.div.className = this.displayClass;
            if (!this.allowSelection) {
                this.div.className += " olControlNoSelect";
                this.div.setAttribute("unselectable", "on", 0);
                this.div.onselectstart = OpenLayers.Function.False
            }
            if (this.title != "") this.div.title = this.title
        }
        if (a != null) this.position = a.clone();
        this.moveTo(this.position);
        return this.div
    },
    moveTo: function(a) {
        if (a != 
        null && this.div != null) {
            this.div.style.left = a.x + "px";
            this.div.style.top = a.y + "px"
        }
    },
    activate: function() {
        if (this.active) return false;
        this.handler && this.handler.activate();
        this.active = true;
        this.map && OpenLayers.Element.addClass(this.map.viewPortDiv, this.displayClass.replace(/ /g, "") + "Active");
        this.events.triggerEvent("activate");
        return true
    },
    deactivate: function() {
        if (this.active) {
            this.handler && this.handler.deactivate();
            this.active = false;
            this.map && OpenLayers.Element.removeClass(this.map.viewPortDiv, this.displayClass.replace(/ /g, 
            "") + "Active");
            this.events.triggerEvent("deactivate");
            return true
        }
        return false
    },
    CLASS_NAME: "OpenLayers.Control"
});
OpenLayers.Control.TYPE_BUTTON = 1;
OpenLayers.Control.TYPE_TOGGLE = 2;
OpenLayers.Control.TYPE_TOOL = 3;
OpenLayers.Control.Panel = OpenLayers.Class(OpenLayers.Control, {
    controls: null,
    autoActivate: true,
    defaultControl: null,
    saveState: false,
    allowDepress: false,
    activeState: null,
    initialize: function(a) {
        OpenLayers.Control.prototype.initialize.apply(this, [a]);
        this.controls = [];
        this.activeState = {}
    },
    destroy: function() {
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
        for (var a, b = this.controls.length - 1; b >= 0; b--) {
            a = this.controls[b];
            a.events && a.events.un({
                activate: this.iconOn,
                deactivate: this.iconOff
            });
            OpenLayers.Event.stopObservingElement(a.panel_div);
            a.panel_div = null
        }
        this.activeState = null
    },
    activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            for (var a, b = 0, c = this.controls.length; b < c; b++) {
                a = this.controls[b];
                if (a === this.defaultControl || this.saveState && this.activeState[a.id]) a.activate()
            }
            if (this.saveState === true) this.defaultControl = null;
            this.redraw();
            return true
        } else return false
    },
    deactivate: function() {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            for (var a, b = 0, c = this.controls.length; b < c; b++) {
                a = this.controls[b];
                this.activeState[a.id] = a.deactivate()
            }
            this.redraw();
            return true
        } else return false
    },
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.addControlsToMap(this.controls);
        return this.div
    },
    redraw: function() {
        for (var a = this.div.childNodes.length - 1; a >= 0; a--) this.div.removeChild(this.div.childNodes[a]);
        this.div.innerHTML = "";
        if (this.active) {
            a = 0;
            for (var b = this.controls.length; a < b; a++) this.div.appendChild(this.controls[a].panel_div)
        }
    },
    activateControl: function(a) {
        if (!this.active) return false;
        if (a.type == OpenLayers.Control.TYPE_BUTTON) a.trigger();
        else if (a.type == OpenLayers.Control.TYPE_TOGGLE) a.active ? a.deactivate() : a.activate();
        else if (this.allowDepress && a.active) a.deactivate();
        else {
            for (var b, c = 0, d = this.controls.length; c < d; c++) {
                b = this.controls[c];
                if (b != a && (b.type === OpenLayers.Control.TYPE_TOOL || b.type == null)) b.deactivate()
            }
            a.activate()
        }
    },
    addControls: function(a) {
        OpenLayers.Util.isArray(a) || (a = [a]);
        this.controls = this.controls.concat(a);
        for (var b = 0, c = a.length; b < c; b++) {
            var d = document.createElement("div");
            d.className = a[b].displayClass + "ItemInactive";
            a[b].panel_div = d;
            if (a[b].title != "") a[b].panel_div.title = a[b].title;
            OpenLayers.Event.observe(a[b].panel_div, "click", OpenLayers.Function.bind(this.onClick, this, a[b]));
            OpenLayers.Event.observe(a[b].panel_div, "dblclick", OpenLayers.Function.bind(this.onDoubleClick, this, a[b]));
            OpenLayers.Event.observe(a[b].panel_div, "mousedown", OpenLayers.Function.bindAsEventListener(OpenLayers.Event.stop))
        }
        if (this.map) {
            this.addControlsToMap(a);
            this.redraw()
        }
    },
    addControlsToMap: function(a) {
        for (var b, 
        c = 0, d = a.length; c < d; c++) {
            b = a[c];
            if (b.autoActivate === true) {
                b.autoActivate = false;
                this.map.addControl(b);
                b.autoActivate = true
            } else {
                this.map.addControl(b);
                b.deactivate()
            }
            b.events.on({
                activate: this.iconOn,
                deactivate: this.iconOff
            })
        }
    },
    iconOn: function() {
        var a = this.panel_div;
        a.className = a.className.replace(/ItemInactive$/, "ItemActive")
    },
    iconOff: function() {
        var a = this.panel_div;
        a.className = a.className.replace(/ItemActive$/, "ItemInactive")
    },
    onClick: function(a, b) {
        OpenLayers.Event.stop(b ? b: window.event);
        this.activateControl(a)
    },
    onDoubleClick: function(a, b) {
        OpenLayers.Event.stop(b ? b: window.event)
    },
    getControlsBy: function(a, b) {
        var c = typeof b.test == "function";
        return OpenLayers.Array.filter(this.controls, 
        function(d) {
            return d[a] == b || c && b.test(d[a])
        })
    },
    getControlsByName: function(a) {
        return this.getControlsBy("name", a)
    },
    getControlsByClass: function(a) {
        return this.getControlsBy("CLASS_NAME", a)
    },
    CLASS_NAME: "OpenLayers.Control.Panel"
});
OpenLayers.Control.ZoomIn = OpenLayers.Class(OpenLayers.Control, {
    type: OpenLayers.Control.TYPE_BUTTON,
    trigger: function() {
        this.map.zoomIn()
    },
    CLASS_NAME: "OpenLayers.Control.ZoomIn"
});
OpenLayers.Control.ZoomOut = OpenLayers.Class(OpenLayers.Control, {
    type: OpenLayers.Control.TYPE_BUTTON,
    trigger: function() {
        this.map.zoomOut()
    },
    CLASS_NAME: "OpenLayers.Control.ZoomOut"
});
OpenLayers.Control.ZoomToMaxExtent = OpenLayers.Class(OpenLayers.Control, {
    type: OpenLayers.Control.TYPE_BUTTON,
    trigger: function() {
        this.map && this.map.zoomToMaxExtent()
    },
    CLASS_NAME: "OpenLayers.Control.ZoomToMaxExtent"
});
OpenLayers.Control.ZoomPanel = OpenLayers.Class(OpenLayers.Control.Panel, {
    initialize: function(a) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [a]);
        this.addControls([new OpenLayers.Control.ZoomIn, new OpenLayers.Control.ZoomToMaxExtent, new OpenLayers.Control.ZoomOut])
    },
    CLASS_NAME: "OpenLayers.Control.ZoomPanel"
});
OpenLayers.Lang = {
    code: null,
    defaultCode: "en",
    getCode: function() {
        OpenLayers.Lang.code || OpenLayers.Lang.setCode();
        return OpenLayers.Lang.code
    },
    setCode: function(a) {
        var b;
        a || (a = OpenLayers.BROWSER_NAME == "msie" ? navigator.userLanguage: navigator.language);
        a = a.split("-");
        a[0] = a[0].toLowerCase();
        if (typeof OpenLayers.Lang[a[0]] == "object") b = a[0];
        if (a[1]) {
            var c = a[0] + "-" + a[1].toUpperCase();
            if (typeof OpenLayers.Lang[c] == "object") b = c
        }
        if (!b) {
            OpenLayers.Console.warn("Failed to find OpenLayers.Lang." + a.join("-") + " dictionary, falling back to default language");
            b = OpenLayers.Lang.defaultCode
        }
        OpenLayers.Lang.code = b
    },
    translate: function(a, b) {
        var c = OpenLayers.Lang[OpenLayers.Lang.getCode()]; (c = c && c[a]) || (c = a);
        if (b) c = OpenLayers.String.format(c, b);
        return c
    }
};
OpenLayers.i18n = OpenLayers.Lang.translate;
OpenLayers.String = {
    startsWith: function(a, b) {
        return a.indexOf(b) == 0
    },
    contains: function(a, b) {
        return a.indexOf(b) != -1
    },
    trim: function(a) {
        return a.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    },
    camelize: function(a) {
        a = a.split("-");
        for (var b = a[0], c = 1, d = a.length; c < d; c++) {
            var e = a[c];
            b += e.charAt(0).toUpperCase() + e.substring(1)
        }
        return b
    },
    format: function(a, b, c) {
        b || (b = window);
        return a.replace(OpenLayers.String.tokenRegEx, 
        function(d, e) {
            for (var f, g = e.split(/\.+/), h = 0; h < g.length; h++) {
                if (h == 0) f = b;
                f = f[g[h]]
            }
            if (typeof f == 
            "function") f = c ? f.apply(null, c) : f();
            return typeof f == "undefined" ? "undefined": f
        })
    },
    tokenRegEx: /\$\{([\w.]+?)\}/g,
    numberRegEx: /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/,
    isNumeric: function(a) {
        return OpenLayers.String.numberRegEx.test(a)
    },
    numericIf: function(a) {
        return OpenLayers.String.isNumeric(a) ? parseFloat(a) : a
    }
};
if (!String.prototype.startsWith) String.prototype.startsWith = function(a) {
    OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
        newMethod: "OpenLayers.String.startsWith"
    }));
    return OpenLayers.String.startsWith(this, a)
};
if (!String.prototype.contains) String.prototype.contains = function(a) {
    OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
        newMethod: "OpenLayers.String.contains"
    }));
    return OpenLayers.String.contains(this, a)
};
if (!String.prototype.trim) String.prototype.trim = function() {
    OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
        newMethod: "OpenLayers.String.trim"
    }));
    return OpenLayers.String.trim(this)
};
if (!String.prototype.camelize) String.prototype.camelize = function() {
    OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
        newMethod: "OpenLayers.String.camelize"
    }));
    return OpenLayers.String.camelize(this)
};
OpenLayers.Number = {
    decimalSeparator: ".",
    thousandsSeparator: ",",
    limitSigDigs: function(a, b) {
        var c = 0;
        if (b > 0) c = parseFloat(a.toPrecision(b));
        return c
    },
    format: function(a, b, c, d) {
        b = typeof b != "undefined" ? b: 0;
        c = typeof c != "undefined" ? c: OpenLayers.Number.thousandsSeparator;
        d = typeof d != "undefined" ? d: OpenLayers.Number.decimalSeparator;
        if (b != null) a = parseFloat(a.toFixed(b));
        var e = a.toString().split(".");
        if (e.length == 1 && b == null) b = 0;
        a = e[0];
        if (c) for (var f = /(-?[0-9]+)([0-9]{3})/; f.test(a);) a = a.replace(f, "$1" + c + "$2");
        if (b == 0) b = a;
        else {
            c = e.length > 1 ? e[1] : "0";
            if (b != null) c += Array(b - c.length + 1).join("0");
            b = a + d + c
        }
        return b
    }
};
if (!Number.prototype.limitSigDigs) Number.prototype.limitSigDigs = function(a) {
    OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
        newMethod: "OpenLayers.Number.limitSigDigs"
    }));
    return OpenLayers.Number.limitSigDigs(this, a)
};
OpenLayers.Function = {
    bind: function(a, b) {
        var c = Array.prototype.slice.apply(arguments, [2]);
        return function() {
            var d = c.concat(Array.prototype.slice.apply(arguments, [0]));
            return a.apply(b, d)
        }
    },
    bindAsEventListener: function(a, b) {
        return function(c) {
            return a.call(b, c || window.event)
        }
    },
    False: function() {
        return false
    },
    True: function() {
        return true
    },
    Void: function() {}
};
if (!Function.prototype.bind) Function.prototype.bind = function() {
    OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
        newMethod: "OpenLayers.Function.bind"
    }));
    Array.prototype.unshift.apply(arguments, [this]);
    return OpenLayers.Function.bind.apply(null, arguments)
};
if (!Function.prototype.bindAsEventListener) Function.prototype.bindAsEventListener = function(a) {
    OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
        newMethod: "OpenLayers.Function.bindAsEventListener"
    }));
    return OpenLayers.Function.bindAsEventListener(this, a)
};
OpenLayers.Array = {
    filter: function(a, b, c) {
        var d = [];
        if (Array.prototype.filter) d = a.filter(b, c);
        else {
            var e = a.length;
            if (typeof b != "function") throw new TypeError;
            for (var f = 0; f < e; f++) if (f in a) {
                var g = a[f];
                b.call(c, g, f, a) && d.push(g)
            }
        }
        return d
    }
};
OpenLayers.Date = {
    toISOString: function() {
        if ("toISOString" in Date.prototype) return function(b) {
            return b.toISOString()
        };
        else {
            var a = function(b, c) {
                for (var d = b + ""; d.length < c;) d = "0" + d;
                return d
            };
            return function(b) {
                return isNaN(b.getTime()) ? "Invalid Date": b.getUTCFullYear() + "-" + a(b.getUTCMonth() + 1, 2) + "-" + a(b.getUTCDate(), 2) + "T" + a(b.getUTCHours(), 2) + ":" + a(b.getUTCMinutes(), 2) + ":" + a(b.getUTCSeconds(), 2) + "." + a(b.getUTCMilliseconds(), 3) + "Z"
            }
        }
    } (),
    parse: function(a) {
        var b;
        if ((a = a.match(/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(?:[+-]\d{1,2}(?::(\d{2}))?)))?$/)) && 
        (a[1] || a[7])) {
            b = parseInt(a[1], 10) || 0;
            var c = parseInt(a[2], 10) - 1 || 0,
            d = parseInt(a[3], 10) || 1;
            b = new Date(Date.UTC(b, c, d));
            if (c = a[7]) {
                d = parseInt(a[4], 10);
                var e = parseInt(a[5], 10),
                f = parseFloat(a[6]),
                g = f | 0;
                b.setUTCHours(d, e, g, Math.round(1E3 * (f - g)));
                if (c !== "Z") {
                    c = parseInt(c, 10);
                    a = parseInt(a[8], 10) || 0;
                    b = new Date(b.getTime() + -1E3 * (60 * c * 60 + a * 60))
                }
            }
        } else b = new Date("invalid");
        return b
    }
};
OpenLayers.Bounds = OpenLayers.Class({
    left: null,
    bottom: null,
    right: null,
    top: null,
    centerLonLat: null,
    initialize: function(a, b, c, d) {
        if (a != null) this.left = OpenLayers.Util.toFloat(a);
        if (b != null) this.bottom = OpenLayers.Util.toFloat(b);
        if (c != null) this.right = OpenLayers.Util.toFloat(c);
        if (d != null) this.top = OpenLayers.Util.toFloat(d)
    },
    clone: function() {
        return new OpenLayers.Bounds(this.left, this.bottom, this.right, this.top)
    },
    equals: function(a) {
        var b = false;
        if (a != null) b = this.left == a.left && this.right == a.right && this.top == 
        a.top && this.bottom == a.bottom;
        return b
    },
    toString: function() {
        return [this.left, this.bottom, this.right, this.top].join(",")
    },
    toArray: function(a) {
        return a === true ? [this.bottom, this.left, this.top, this.right] : [this.left, this.bottom, this.right, this.top]
    },
    toBBOX: function(a, b) {
        if (a == null) a = 6;
        var c = Math.pow(10, a),
        d = Math.round(this.left * c) / c,
        e = Math.round(this.bottom * c) / c,
        f = Math.round(this.right * c) / c;
        c = Math.round(this.top * c) / c;
        return b === true ? e + "," + d + "," + c + "," + f: d + "," + e + "," + f + "," + c
    },
    toGeometry: function() {
        return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(this.left, 
        this.bottom), new OpenLayers.Geometry.Point(this.right, this.bottom), new OpenLayers.Geometry.Point(this.right, this.top), new OpenLayers.Geometry.Point(this.left, this.top)])])
    },
    getWidth: function() {
        return this.right - this.left
    },
    getHeight: function() {
        return this.top - this.bottom
    },
    getSize: function() {
        return new OpenLayers.Size(this.getWidth(), this.getHeight())
    },
    getCenterPixel: function() {
        return new OpenLayers.Pixel((this.left + this.right) / 2, (this.bottom + this.top) / 2)
    },
    getCenterLonLat: function() {
        if (!this.centerLonLat) this.centerLonLat = 
        new OpenLayers.LonLat((this.left + this.right) / 2, (this.bottom + this.top) / 2);
        return this.centerLonLat
    },
    scale: function(a, b) {
        if (b == null) b = this.getCenterLonLat();
        var c,
        d;
        if (b.CLASS_NAME == "OpenLayers.LonLat") {
            c = b.lon;
            d = b.lat
        } else {
            c = b.x;
            d = b.y
        }
        return new OpenLayers.Bounds((this.left - c) * a + c, (this.bottom - d) * a + d, (this.right - c) * a + c, (this.top - d) * a + d)
    },
    add: function(a, b) {
        if (a == null || b == null) {
            var c = OpenLayers.i18n("boundsAddError");
            OpenLayers.Console.error(c);
            return null
        }
        return new OpenLayers.Bounds(this.left + a, this.bottom + 
        b, this.right + a, this.top + b)
    },
    extend: function(a) {
        var b = null;
        if (a) {
            switch (a.CLASS_NAME) {
            case "OpenLayers.LonLat":
                b = new OpenLayers.Bounds(a.lon, a.lat, a.lon, a.lat);
                break;
            case "OpenLayers.Geometry.Point":
                b = new OpenLayers.Bounds(a.x, a.y, a.x, a.y);
                break;
            case "OpenLayers.Bounds":
                b = a
            }
            if (b) {
                this.centerLonLat = null;
                if (this.left == null || b.left < this.left) this.left = b.left;
                if (this.bottom == null || b.bottom < this.bottom) this.bottom = b.bottom;
                if (this.right == null || b.right > this.right) this.right = b.right;
                if (this.top == null || b.top > 
                this.top) this.top = b.top
            }
        }
    },
    containsLonLat: function(a, b) {
        return this.contains(a.lon, a.lat, b)
    },
    containsPixel: function(a, b) {
        return this.contains(a.x, a.y, b)
    },
    contains: function(a, b, c) {
        if (c == null) c = true;
        if (a == null || b == null) return false;
        a = OpenLayers.Util.toFloat(a);
        b = OpenLayers.Util.toFloat(b);
        var d = false;
        return d = c ? a >= this.left && a <= this.right && b >= this.bottom && b <= this.top: a > this.left && a < this.right && b > this.bottom && b < this.top
    },
    intersectsBounds: function(a, b) {
        if (b == null) b = true;
        var c = false,
        d = this.left == a.right || 
        this.right == a.left || this.top == a.bottom || this.bottom == a.top;
        if (b || !d) {
            c = a.top >= this.bottom && a.top <= this.top || this.top > a.bottom && this.top < a.top;
            d = a.left >= this.left && a.left <= this.right || this.left >= a.left && this.left <= a.right;
            var e = a.right >= this.left && a.right <= this.right || this.right >= a.left && this.right <= a.right;
            c = (a.bottom >= this.bottom && a.bottom <= this.top || this.bottom >= a.bottom && this.bottom <= a.top || c) && (d || e)
        }
        return c
    },
    containsBounds: function(a, b, c) {
        if (b == null) b = false;
        if (c == null) c = true;
        var d = this.contains(a.left, 
        a.bottom, c),
        e = this.contains(a.right, a.bottom, c),
        f = this.contains(a.left, a.top, c);
        a = this.contains(a.right, a.top, c);
        return b ? d || e || f || a: d && e && f && a
    },
    determineQuadrant: function(a) {
        var b = "",
        c = this.getCenterLonLat();
        b += a.lat < c.lat ? "b": "t";
        b += a.lon < c.lon ? "l": "r";
        return b
    },
    transform: function(a, b) {
        this.centerLonLat = null;
        var c = OpenLayers.Projection.transform({
            x: this.left,
            y: this.bottom
        },
        a, b),
        d = OpenLayers.Projection.transform({
            x: this.right,
            y: this.bottom
        },
        a, b),
        e = OpenLayers.Projection.transform({
            x: this.left,
            y: this.top
        },
        a, b),
        f = OpenLayers.Projection.transform({
            x: this.right,
            y: this.top
        },
        a, b);
        this.left = Math.min(c.x, e.x);
        this.bottom = Math.min(c.y, d.y);
        this.right = Math.max(d.x, f.x);
        this.top = Math.max(e.y, f.y);
        return this
    },
    wrapDateLine: function(a, b) {
        b = b || {};
        var c = b.leftTolerance || 0,
        d = b.rightTolerance || 0,
        e = this.clone();
        if (a) {
            for (; e.left < a.left && e.right - d <= a.left;) e = e.add(a.getWidth(), 0);
            for (; e.left + c >= a.right && e.right > a.right;) e = e.add( - a.getWidth(), 0)
        }
        return e
    },
    CLASS_NAME: "OpenLayers.Bounds"
});
OpenLayers.Bounds.fromString = function(a, b) {
    var c = a.split(",");
    return OpenLayers.Bounds.fromArray(c, b)
};
OpenLayers.Bounds.fromArray = function(a, b) {
    return b === true ? new OpenLayers.Bounds(parseFloat(a[1]), parseFloat(a[0]), parseFloat(a[3]), parseFloat(a[2])) : new OpenLayers.Bounds(parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]), parseFloat(a[3]))
};
OpenLayers.Bounds.fromSize = function(a) {
    return new OpenLayers.Bounds(0, a.h, a.w, 0)
};
OpenLayers.Bounds.oppositeQuadrant = function(a) {
    var b = "";
    b += a.charAt(0) == "t" ? "b": "t";
    b += a.charAt(1) == "l" ? "r": "l";
    return b
};
OpenLayers.Element = {
    visible: function(a) {
        return OpenLayers.Util.getElement(a).style.display != "none"
    },
    toggle: function() {
        for (var a = 0, b = arguments.length; a < b; a++) {
            var c = OpenLayers.Util.getElement(arguments[a]),
            d = OpenLayers.Element.visible(c) ? "hide": "show";
            OpenLayers.Element[d](c)
        }
    },
    hide: function() {
        OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
            newMethod: "element.style.display = 'none';"
        }));
        for (var a = 0, b = arguments.length; a < b; a++) {
            var c = OpenLayers.Util.getElement(arguments[a]);
            if (c) c.style.display = 
            "none"
        }
    },
    show: function() {
        OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
            newMethod: "element.style.display = '';"
        }));
        for (var a = 0, b = arguments.length; a < b; a++) {
            var c = OpenLayers.Util.getElement(arguments[a]);
            if (c) c.style.display = ""
        }
    },
    remove: function(a) {
        a = OpenLayers.Util.getElement(a);
        a.parentNode.removeChild(a)
    },
    getHeight: function(a) {
        a = OpenLayers.Util.getElement(a);
        return a.offsetHeight
    },
    getDimensions: function(a) {
        a = OpenLayers.Util.getElement(a);
        if (OpenLayers.Element.getStyle(a, "display") != 
        "none") return {
            width: a.offsetWidth,
            height: a.offsetHeight
        };
        var b = a.style,
        c = b.visibility,
        d = b.position,
        e = b.display;
        b.visibility = "hidden";
        b.position = "absolute";
        b.display = "";
        var f = a.clientWidth;
        a = a.clientHeight;
        b.display = e;
        b.position = d;
        b.visibility = c;
        return {
            width: f,
            height: a
        }
    },
    hasClass: function(a, b) {
        var c = a.className;
        return !! c && RegExp("(^|\\s)" + b + "(\\s|$)").test(c)
    },
    addClass: function(a, b) {
        OpenLayers.Element.hasClass(a, b) || (a.className += (a.className ? " ": "") + b);
        return a
    },
    removeClass: function(a, b) {
        var c = a.className;
        if (c) a.className = OpenLayers.String.trim(c.replace(RegExp("(^|\\s+)" + b + "(\\s+|$)"), " "));
        return a
    },
    toggleClass: function(a, b) {
        OpenLayers.Element.hasClass(a, b) ? OpenLayers.Element.removeClass(a, b) : OpenLayers.Element.addClass(a, b);
        return a
    },
    getStyle: function(a, b) {
        a = OpenLayers.Util.getElement(a);
        var c = null;
        if (a && a.style) {
            c = a.style[OpenLayers.String.camelize(b)];
            if (!c) if (document.defaultView && document.defaultView.getComputedStyle) c = (c = document.defaultView.getComputedStyle(a, null)) ? c.getPropertyValue(b) : 
            null;
            else if (a.currentStyle) c = a.currentStyle[OpenLayers.String.camelize(b)];
            var d = ["left", "top", "right", "bottom"];
            if (window.opera && OpenLayers.Util.indexOf(d, b) != -1 && OpenLayers.Element.getStyle(a, "position") == "static") c = "auto"
        }
        return c == "auto" ? null: c
    }
};
OpenLayers.LonLat = OpenLayers.Class({
    lon: 0,
    lat: 0,
    initialize: function(a, b) {
        this.lon = OpenLayers.Util.toFloat(a);
        this.lat = OpenLayers.Util.toFloat(b)
    },
    toString: function() {
        return "lon=" + this.lon + ",lat=" + this.lat
    },
    toShortString: function() {
        return this.lon + ", " + this.lat
    },
    clone: function() {
        return new OpenLayers.LonLat(this.lon, this.lat)
    },
    add: function(a, b) {
        if (a == null || b == null) {
            var c = OpenLayers.i18n("lonlatAddError");
            OpenLayers.Console.error(c);
            return null
        }
        return new OpenLayers.LonLat(this.lon + OpenLayers.Util.toFloat(a), 
        this.lat + OpenLayers.Util.toFloat(b))
    },
    equals: function(a) {
        var b = false;
        if (a != null) b = this.lon == a.lon && this.lat == a.lat || isNaN(this.lon) && isNaN(this.lat) && isNaN(a.lon) && isNaN(a.lat);
        return b
    },
    transform: function(a, b) {
        var c = OpenLayers.Projection.transform({
            x: this.lon,
            y: this.lat
        },
        a, b);
        this.lon = c.x;
        this.lat = c.y;
        return this
    },
    wrapDateLine: function(a) {
        var b = this.clone();
        if (a) {
            for (; b.lon < a.left;) b.lon += a.getWidth();
            for (; b.lon > a.right;) b.lon -= a.getWidth()
        }
        return b
    },
    CLASS_NAME: "OpenLayers.LonLat"
});
OpenLayers.LonLat.fromString = function(a) {
    a = a.split(",");
    return new OpenLayers.LonLat(a[0], a[1])
};
OpenLayers.Pixel = OpenLayers.Class({
    x: 0,
    y: 0,
    initialize: function(a, b) {
        this.x = parseFloat(a);
        this.y = parseFloat(b)
    },
    toString: function() {
        return "x=" + this.x + ",y=" + this.y
    },
    clone: function() {
        return new OpenLayers.Pixel(this.x, this.y)
    },
    equals: function(a) {
        var b = false;
        if (a != null) b = this.x == a.x && this.y == a.y || isNaN(this.x) && isNaN(this.y) && isNaN(a.x) && isNaN(a.y);
        return b
    },
    distanceTo: function(a) {
        return Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2))
    },
    add: function(a, b) {
        if (a == null || b == null) {
            var c = OpenLayers.i18n("pixelAddError");
            OpenLayers.Console.error(c);
            return null
        }
        return new OpenLayers.Pixel(this.x + a, this.y + b)
    },
    offset: function(a) {
        var b = this.clone();
        if (a) b = this.add(a.x, a.y);
        return b
    },
    CLASS_NAME: "OpenLayers.Pixel"
});
OpenLayers.Size = OpenLayers.Class({
    w: 0,
    h: 0,
    initialize: function(a, b) {
        this.w = parseFloat(a);
        this.h = parseFloat(b)
    },
    toString: function() {
        return "w=" + this.w + ",h=" + this.h
    },
    clone: function() {
        return new OpenLayers.Size(this.w, this.h)
    },
    equals: function(a) {
        var b = false;
        if (a != null) b = this.w == a.w && this.h == a.h || isNaN(this.w) && isNaN(this.h) && isNaN(a.w) && isNaN(a.h);
        return b
    },
    CLASS_NAME: "OpenLayers.Size"
});
OpenLayers.Util = OpenLayers.Util || {};
OpenLayers.Util.getElement = function() {
    for (var a = [], b = 0, c = arguments.length; b < c; b++) {
        var d = arguments[b];
        if (typeof d == "string") d = document.getElementById(d);
        if (arguments.length == 1) return d;
        a.push(d)
    }
    return a
};
OpenLayers.Util.isElement = function(a) {
    return !! (a && a.nodeType === 1)
};
OpenLayers.Util.isArray = function(a) {
    return Object.prototype.toString.call(a) === "[object Array]"
};
if (typeof window.$ === "undefined") window.$ = OpenLayers.Util.getElement;
OpenLayers.Util.removeItem = function(a, b) {
    for (var c = a.length - 1; c >= 0; c--) a[c] == b && a.splice(c, 1);
    return a
};
OpenLayers.Util.clearArray = function(a) {
    OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
        newMethod: "array = []"
    }));
    a.length = 0
};
OpenLayers.Util.indexOf = function(a, b) {
    if (typeof a.indexOf == "function") return a.indexOf(b);
    else {
        for (var c = 0, d = a.length; c < d; c++) if (a[c] == b) return c;
        return - 1
    }
};
OpenLayers.Util.modifyDOMElement = function(a, b, c, d, e, f, g, h) {
    if (b) a.id = b;
    if (c) {
        a.style.left = c.x + "px";
        a.style.top = c.y + "px"
    }
    if (d) {
        a.style.width = d.w + "px";
        a.style.height = d.h + "px"
    }
    if (e) a.style.position = e;
    if (f) a.style.border = f;
    if (g) a.style.overflow = g;
    if (parseFloat(h) >= 0 && parseFloat(h) < 1) {
        a.style.filter = "alpha(opacity=" + h * 100 + ")";
        a.style.opacity = h
    } else if (parseFloat(h) == 1) {
        a.style.filter = "";
        a.style.opacity = ""
    }
};
OpenLayers.Util.createDiv = function(a, b, c, d, e, f, g, h) {
    var i = document.createElement("div");
    if (d) i.style.backgroundImage = "url(" + d + ")";
    a || (a = OpenLayers.Util.createUniqueID("OpenLayersDiv"));
    e || (e = "absolute");
    OpenLayers.Util.modifyDOMElement(i, a, b, c, e, f, g, h);
    return i
};
OpenLayers.Util.createImage = function(a, b, c, d, e, f, g, h) {
    var i = document.createElement("img");
    a || (a = OpenLayers.Util.createUniqueID("OpenLayersDiv"));
    e || (e = "relative");
    OpenLayers.Util.modifyDOMElement(i, a, b, c, e, f, null, g);
    if (h) {
        i.style.display = "none";
        OpenLayers.Event.observe(i, "load", OpenLayers.Function.bind(OpenLayers.Util.onImageLoad, i));
        OpenLayers.Event.observe(i, "error", OpenLayers.Function.bind(OpenLayers.Util.onImageLoadError, i))
    }
    i.style.alt = a;
    i.galleryImg = "no";
    if (d) i.src = d;
    return i
};
OpenLayers.Util.setOpacity = function(a, b) {
    OpenLayers.Util.modifyDOMElement(a, null, null, null, null, null, null, b)
};
OpenLayers.Util.onImageLoad = function() {
    if (!this.viewRequestID || this.map && this.viewRequestID == this.map.viewRequestID) this.style.display = "";
    OpenLayers.Element.removeClass(this, "olImageLoadError")
};
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 0;
OpenLayers.Util.onImageLoadError = function() {
    this._attempts = this._attempts ? this._attempts + 1: 1;
    if (this._attempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
        var a = this.urls;
        if (a && OpenLayers.Util.isArray(a) && a.length > 1) {
            var b = this.src.toString(),
            c,
            d;
            for (d = 0; c = a[d]; d++) if (b.indexOf(c) != -1) break;
            var e = Math.floor(a.length * Math.random());
            e = a[e];
            for (d = 0; e == c && d++<4;) {
                e = Math.floor(a.length * Math.random());
                e = a[e]
            }
            this.src = b.replace(c, e)
        } else this.src = this.src
    } else OpenLayers.Element.addClass(this, "olImageLoadError");
    this.style.display = ""
};
OpenLayers.Util.alphaHackNeeded = null;
OpenLayers.Util.alphaHack = function() {
    if (OpenLayers.Util.alphaHackNeeded == null) {
        var a = navigator.appVersion.split("MSIE");
        a = parseFloat(a[1]);
        var b = false;
        try {
            b = !!document.body.filters
        } catch(c) {}
        OpenLayers.Util.alphaHackNeeded = b && a >= 5.5 && a < 7
    }
    return OpenLayers.Util.alphaHackNeeded
};
OpenLayers.Util.modifyAlphaImageDiv = function(a, b, c, d, e, f, g, h, i) {
    OpenLayers.Util.modifyDOMElement(a, b, c, d, f, null, null, i);
    b = a.childNodes[0];
    if (e) b.src = e;
    OpenLayers.Util.modifyDOMElement(b, a.id + "_innerImage", null, d, "relative", g);
    if (OpenLayers.Util.alphaHack()) {
        if (a.style.display != "none") a.style.display = "inline-block";
        if (h == null) h = "scale";
        a.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + b.src + "', sizingMethod='" + h + "')";
        if (parseFloat(a.style.opacity) >= 0 && parseFloat(a.style.opacity) < 
        1) a.style.filter += " alpha(opacity=" + a.style.opacity * 100 + ")";
        b.style.filter = "alpha(opacity=0)"
    }
};
OpenLayers.Util.createAlphaImageDiv = function(a, b, c, d, e, f, g, h, i) {
    var j = OpenLayers.Util.createDiv(),
    k = OpenLayers.Util.createImage(null, null, null, null, null, null, null, false);
    j.appendChild(k);
    if (i) {
        k.style.display = "none";
        OpenLayers.Event.observe(k, "load", OpenLayers.Function.bind(OpenLayers.Util.onImageLoad, j));
        OpenLayers.Event.observe(k, "error", OpenLayers.Function.bind(OpenLayers.Util.onImageLoadError, j))
    }
    OpenLayers.Util.modifyAlphaImageDiv(j, a, b, c, d, e, f, g, h);
    return j
};
OpenLayers.Util.upperCaseObject = function(a) {
    var b = {},
    c;
    for (c in a) b[c.toUpperCase()] = a[c];
    return b
};
OpenLayers.Util.applyDefaults = function(a, b) {
    a = a || {};
    var c = typeof window.Event == "function" && b instanceof window.Event,
    d;
    for (d in b) if (a[d] === undefined || !c && b.hasOwnProperty && b.hasOwnProperty(d) && !a.hasOwnProperty(d)) a[d] = b[d];
    if (!c && b && b.hasOwnProperty && b.hasOwnProperty("toString") && !a.hasOwnProperty("toString")) a.toString = b.toString;
    return a
};
OpenLayers.Util.getParameterString = function(a) {
    var b = [],
    c;
    for (c in a) {
        var d = a[c];
        if (d != null && typeof d != "function") {
            if (typeof d == "object" && d.constructor == Array) {
                for (var e = [], f, g = 0, h = d.length; g < h; g++) {
                    f = d[g];
                    e.push(encodeURIComponent(f === null || f === undefined ? "": f))
                }
                d = e.join(",")
            } else d = encodeURIComponent(d);
            b.push(encodeURIComponent(c) + "=" + d)
        }
    }
    return b.join("&")
};
OpenLayers.Util.urlAppend = function(a, b) {
    var c = a;
    if (b) {
        var d = (a + " ").split(/[?&]/);
        c += d.pop() === " " ? b: d.length ? "&" + b: "?" + b
    }
    return c
};
OpenLayers.ImgPath = "";
OpenLayers.Util.getImagesLocation = function() {
    return OpenLayers.ImgPath || OpenLayers._getScriptLocation() + "img/"
};
OpenLayers.Util.Try = function() {
    for (var a = null, b = 0, c = arguments.length; b < c; b++) {
        var d = arguments[b];
        try {
            a = d();
            break
        } catch(e) {}
    }
    return a
};
OpenLayers.Util.getNodes = function(a, b) {
    return OpenLayers.Util.Try(function() {
        return OpenLayers.Util._getNodes(a.documentElement.childNodes, b)
    },
    function() {
        return OpenLayers.Util._getNodes(a.childNodes, b)
    })
};
OpenLayers.Util._getNodes = function(a, b) {
    for (var c = [], d = 0, e = a.length; d < e; d++) a[d].nodeName == b && c.push(a[d]);
    return c
};
OpenLayers.Util.getTagText = function(a, b, c) {
    if ((a = OpenLayers.Util.getNodes(a, b)) && a.length > 0) {
        c || (c = 0);
        if (a[c].childNodes.length > 1) return a.childNodes[1].nodeValue;
        else if (a[c].childNodes.length == 1) return a[c].firstChild.nodeValue
    } else return ""
};
OpenLayers.Util.getXmlNodeValue = function(a) {
    var b = null;
    OpenLayers.Util.Try(function() {
        b = a.text;
        if (!b) b = a.textContent;
        if (!b) b = a.firstChild.nodeValue
    },
    function() {
        b = a.textContent
    });
    return b
};
OpenLayers.Util.mouseLeft = function(a, b) {
    for (var c = a.relatedTarget ? a.relatedTarget: a.toElement; c != b && c != null;) c = c.parentNode;
    return c != b
};
OpenLayers.Util.DEFAULT_PRECISION = 14;
OpenLayers.Util.toFloat = function(a, b) {
    if (b == null) b = OpenLayers.Util.DEFAULT_PRECISION;
    if (typeof a !== "number") a = parseFloat(a);
    return b === 0 ? a: parseFloat(a.toPrecision(b))
};
OpenLayers.Util.rad = function(a) {
    return a * Math.PI / 180
};
OpenLayers.Util.deg = function(a) {
    return a * 180 / Math.PI
};
OpenLayers.Util.VincentyConstants = {
    a: 6378137,
    b: 6356752.3142,
    f: 1 / 298.257223563
};
OpenLayers.Util.distVincenty = function(a, b) {
    var c = OpenLayers.Util.VincentyConstants,
    d = c.a,
    e = c.b;
    c = c.f;
    var f = OpenLayers.Util.rad(b.lon - a.lon),
    g = Math.atan((1 - c) * Math.tan(OpenLayers.Util.rad(a.lat))),
    h = Math.atan((1 - c) * Math.tan(OpenLayers.Util.rad(b.lat))),
    i = Math.sin(g);
    g = Math.cos(g);
    var j = Math.sin(h);
    h = Math.cos(h);
    for (var k = f, l = 2 * Math.PI, m = 20; Math.abs(k-l)>1.0E-12&& --m > 0;) {
        var n = Math.sin(k),
        o = Math.cos(k),
        p = Math.sqrt(h * n * h * n + (g * j - i * h * o) * (g * j - i * h * o));
        if (p == 0) return 0;
        o = i * j + g * h * o;
        var q = Math.atan2(p, o),
        r = 
        Math.asin(g * h * n / p),
        s = Math.cos(r) * Math.cos(r);
        n = o - 2 * i * j / s;
        var t = c / 16 * s * (4 + c * (4 - 3 * s));
        l = k;
        k = f + (1 - t) * c * Math.sin(r) * (q + t * p * (n + t * o * ( - 1 + 2 * n * n)))
    }
    if (m == 0) return NaN;
    d = s * (d * d - e * e) / (e * e);
    c = d / 1024 * (256 + d * ( - 128 + d * (74 - 47 * d)));
    return (e * (1 + d / 16384 * (4096 + d * ( - 768 + d * (320 - 175 * d)))) * (q - c * p * (n + c / 4 * (o * ( - 1 + 2 * n * n) - c / 6 * n * ( - 3 + 4 * p * p) * ( - 3 + 4 * n * n))))).toFixed(3) / 1E3
};
OpenLayers.Util.destinationVincenty = function(a, b, c) {
    var d = OpenLayers.Util,
    e = d.VincentyConstants,
    f = e.a,
    g = e.b;
    e = e.f;
    var h = a.lon,
    i = a.lat;
    a = d.rad(b);
    b = Math.sin(a);
    a = Math.cos(a);
    var j = (1 - e) * Math.tan(d.rad(i));
    i = 1 / Math.sqrt(1 + j * j);
    var k = j * i,
    l = Math.atan2(j, a);
    j = i * b;
    var m = 1 - j * j;
    f = m * (f * f - g * g) / (g * g);
    var n = 1 + f / 16384 * (4096 + f * ( - 768 + f * (320 - 175 * f))),
    o = f / 1024 * (256 + f * ( - 128 + f * (74 - 47 * f)));
    f = c / (g * n);
    for (var p = 2 * Math.PI; Math.abs(f - p) > 1.0E-12;) {
        var q = Math.cos(2 * l + f),
        r = Math.sin(f),
        s = Math.cos(f),
        t = o * r * (q + o / 4 * (s * ( - 1 + 2 * q * 
        q) - o / 6 * q * ( - 3 + 4 * r * r) * ( - 3 + 4 * q * q)));
        p = f;
        f = c / (g * n) + t
    }
    c = k * r - i * s * a;
    c = Math.atan2(k * s + i * r * a, (1 - e) * Math.sqrt(j * j + c * c));
    g = e / 16 * m * (4 + e * (4 - 3 * m));
    return new OpenLayers.LonLat(h + d.deg(Math.atan2(r * b, i * s - k * r * a) - (1 - g) * e * j * (f + g * r * (q + g * s * ( - 1 + 2 * q * q)))), d.deg(c))
};
OpenLayers.Util.getParameters = function(a) {
    a = a || window.location.href;
    var b = "";
    if (OpenLayers.String.contains(a, "?")) {
        b = a.indexOf("?") + 1;
        var c = OpenLayers.String.contains(a, "#") ? a.indexOf("#") : a.length;
        b = a.substring(b, c)
    }
    a = {};
    b = b.split(/[&;]/);
    c = 0;
    for (var d = b.length; c < d; ++c) {
        var e = b[c].split("=");
        if (e[0]) {
            var f = e[0];
            try {
                f = decodeURIComponent(f)
            } catch(g) {
                f = unescape(f)
            }
            e = (e[1] || "").replace(/\+/g, " ");
            try {
                e = decodeURIComponent(e)
            } catch(h) {
                e = unescape(e)
            }
            e = e.split(",");
            if (e.length == 1) e = e[0];
            a[f] = e
        }
    }
    return a
};
OpenLayers.Util.getArgs = function(a) {
    OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated", {
        newMethod: "OpenLayers.Util.getParameters"
    }));
    return OpenLayers.Util.getParameters(a)
};
OpenLayers.Util.lastSeqID = 0;
OpenLayers.Util.createUniqueID = function(a) {
    if (a == null) a = "id_";
    OpenLayers.Util.lastSeqID += 1;
    return a + OpenLayers.Util.lastSeqID
};
OpenLayers.INCHES_PER_UNIT = {
    inches: 1,
    ft: 12,
    mi: 63360,
    m: 39.3701,
    km: 39370.1,
    dd: 4374754,
    yd: 36
};
OpenLayers.INCHES_PER_UNIT["in"] = OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT.degrees = OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.INCHES_PER_UNIT.nmi = 1852 * OpenLayers.INCHES_PER_UNIT.m;
OpenLayers.METERS_PER_INCH = 0.0254000508001016;
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    Inch: OpenLayers.INCHES_PER_UNIT.inches,
    Meter: 1 / OpenLayers.METERS_PER_INCH,
    Foot: 0.3048006096012192 / OpenLayers.METERS_PER_INCH,
    IFoot: 0.3048 / OpenLayers.METERS_PER_INCH,
    ClarkeFoot: 0.3047972651151 / OpenLayers.METERS_PER_INCH,
    SearsFoot: 0.30479947153867626 / OpenLayers.METERS_PER_INCH,
    GoldCoastFoot: 0.3047997101815088 / OpenLayers.METERS_PER_INCH,
    IInch: 0.0254 / OpenLayers.METERS_PER_INCH,
    MicroInch: 2.54E-5 / OpenLayers.METERS_PER_INCH,
    Mil: 2.54E-8 / OpenLayers.METERS_PER_INCH,
    Centimeter: 0.01 / OpenLayers.METERS_PER_INCH,
    Kilometer: 1E3 / OpenLayers.METERS_PER_INCH,
    Yard: 0.9144018288036576 / OpenLayers.METERS_PER_INCH,
    SearsYard: 0.914398414616029 / OpenLayers.METERS_PER_INCH,
    IndianYard: 0.9143985307444408 / OpenLayers.METERS_PER_INCH,
    IndianYd37: 0.91439523 / OpenLayers.METERS_PER_INCH,
    IndianYd62: 0.9143988 / OpenLayers.METERS_PER_INCH,
    IndianYd75: 0.9143985 / OpenLayers.METERS_PER_INCH,
    IndianFoot: 0.30479951 / OpenLayers.METERS_PER_INCH,
    IndianFt37: 0.30479841 / OpenLayers.METERS_PER_INCH,
    IndianFt62: 0.3047996 / 
    OpenLayers.METERS_PER_INCH,
    IndianFt75: 0.3047995 / OpenLayers.METERS_PER_INCH,
    Mile: 1609.3472186944373 / OpenLayers.METERS_PER_INCH,
    IYard: 0.9144 / OpenLayers.METERS_PER_INCH,
    IMile: 1609.344 / OpenLayers.METERS_PER_INCH,
    NautM: 1852 / OpenLayers.METERS_PER_INCH,
    "Lat-66": 110943.31648893273 / OpenLayers.METERS_PER_INCH,
    "Lat-83": 110946.25736872235 / OpenLayers.METERS_PER_INCH,
    Decimeter: 0.1 / OpenLayers.METERS_PER_INCH,
    Millimeter: 0.001 / OpenLayers.METERS_PER_INCH,
    Dekameter: 10 / OpenLayers.METERS_PER_INCH,
    Decameter: 10 / OpenLayers.METERS_PER_INCH,
    Hectometer: 100 / OpenLayers.METERS_PER_INCH,
    GermanMeter: 1.0000135965 / OpenLayers.METERS_PER_INCH,
    CaGrid: 0.999738 / OpenLayers.METERS_PER_INCH,
    ClarkeChain: 20.1166194976 / OpenLayers.METERS_PER_INCH,
    GunterChain: 20.11684023368047 / OpenLayers.METERS_PER_INCH,
    BenoitChain: 20.116782494375872 / OpenLayers.METERS_PER_INCH,
    SearsChain: 20.11676512155 / OpenLayers.METERS_PER_INCH,
    ClarkeLink: 0.201166194976 / OpenLayers.METERS_PER_INCH,
    GunterLink: 0.2011684023368047 / OpenLayers.METERS_PER_INCH,
    BenoitLink: 0.20116782494375873 / OpenLayers.METERS_PER_INCH,
    SearsLink: 0.2011676512155 / OpenLayers.METERS_PER_INCH,
    Rod: 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    IntnlChain: 20.1168 / OpenLayers.METERS_PER_INCH,
    IntnlLink: 0.201168 / OpenLayers.METERS_PER_INCH,
    Perch: 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    Pole: 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    Furlong: 201.1684023368046 / OpenLayers.METERS_PER_INCH,
    Rood: 3.778266898 / OpenLayers.METERS_PER_INCH,
    CapeFoot: 0.3047972615 / OpenLayers.METERS_PER_INCH,
    Brealey: 375 / OpenLayers.METERS_PER_INCH,
    ModAmFt: 0.304812252984506 / 
    OpenLayers.METERS_PER_INCH,
    Fathom: 1.8288 / OpenLayers.METERS_PER_INCH,
    "NautM-UK": 1853.184 / OpenLayers.METERS_PER_INCH,
    "50kilometers": 5E4 / OpenLayers.METERS_PER_INCH,
    "150kilometers": 15E4 / OpenLayers.METERS_PER_INCH
});
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    mm: OpenLayers.INCHES_PER_UNIT.Meter / 1E3,
    cm: OpenLayers.INCHES_PER_UNIT.Meter / 100,
    dm: OpenLayers.INCHES_PER_UNIT.Meter * 100,
    km: OpenLayers.INCHES_PER_UNIT.Meter * 1E3,
    kmi: OpenLayers.INCHES_PER_UNIT.nmi,
    fath: OpenLayers.INCHES_PER_UNIT.Fathom,
    ch: OpenLayers.INCHES_PER_UNIT.IntnlChain,
    link: OpenLayers.INCHES_PER_UNIT.IntnlLink,
    "us-in": OpenLayers.INCHES_PER_UNIT.inches,
    "us-ft": OpenLayers.INCHES_PER_UNIT.Foot,
    "us-yd": OpenLayers.INCHES_PER_UNIT.Yard,
    "us-ch": OpenLayers.INCHES_PER_UNIT.GunterChain,
    "us-mi": OpenLayers.INCHES_PER_UNIT.Mile,
    "ind-yd": OpenLayers.INCHES_PER_UNIT.IndianYd37,
    "ind-ft": OpenLayers.INCHES_PER_UNIT.IndianFt37,
    "ind-ch": 20.11669506 / OpenLayers.METERS_PER_INCH
});
OpenLayers.DOTS_PER_INCH = 72;
OpenLayers.Util.normalizeScale = function(a) {
    return a > 1 ? 1 / a: a
};
OpenLayers.Util.getResolutionFromScale = function(a, b) {
    var c;
    if (a) {
        if (b == null) b = "degrees";
        c = 1 / (OpenLayers.Util.normalizeScale(a) * OpenLayers.INCHES_PER_UNIT[b] * OpenLayers.DOTS_PER_INCH)
    }
    return c
};
OpenLayers.Util.getScaleFromResolution = function(a, b) {
    if (b == null) b = "degrees";
    return a * OpenLayers.INCHES_PER_UNIT[b] * OpenLayers.DOTS_PER_INCH
};
OpenLayers.Util.safeStopPropagation = function(a) {
    OpenLayers.Event.stop(a, true)
};
OpenLayers.Util.pagePosition = function(a) {
    var b = [0, 0],
    c = OpenLayers.Util.getViewportElement();
    if (!a || a == window || a == c) return b;
    var d = OpenLayers.IS_GECKO && document.getBoxObjectFor && OpenLayers.Element.getStyle(a, "position") == "absolute" && (a.style.top == "" || a.style.left == ""),
    e = null;
    if (a.getBoundingClientRect) {
        a = a.getBoundingClientRect();
        e = c.scrollTop;
        b[0] = a.left + c.scrollLeft;
        b[1] = a.top + e
    } else if (document.getBoxObjectFor && !d) {
        a = document.getBoxObjectFor(a);
        c = document.getBoxObjectFor(c);
        b[0] = a.screenX - c.screenX;
        b[1] = a.screenY - c.screenY
    } else {
        b[0] = a.offsetLeft;
        b[1] = a.offsetTop;
        e = a.offsetParent;
        if (e != a) for (; e;) {
            b[0] += e.offsetLeft;
            b[1] += e.offsetTop;
            e = e.offsetParent
        }
        c = OpenLayers.BROWSER_NAME;
        if (c == "opera" || c == "safari" && OpenLayers.Element.getStyle(a, "position") == "absolute") b[1] -= document.body.offsetTop;
        for (e = a.offsetParent; e && e != document.body;) {
            b[0] -= e.scrollLeft;
            if (c != "opera" || e.tagName != "TR") b[1] -= e.scrollTop;
            e = e.offsetParent
        }
    }
    return b
};
OpenLayers.Util.getViewportElement = function() {
    var a = arguments.callee.viewportElement;
    if (a == undefined) {
        a = OpenLayers.BROWSER_NAME == "msie" && document.compatMode != "CSS1Compat" ? document.body: document.documentElement;
        arguments.callee.viewportElement = a
    }
    return a
};
OpenLayers.Util.isEquivalentUrl = function(a, b, c) {
    c = c || {};
    OpenLayers.Util.applyDefaults(c, {
        ignoreCase: true,
        ignorePort80: true,
        ignoreHash: true
    });
    a = OpenLayers.Util.createUrlObject(a, c);
    b = OpenLayers.Util.createUrlObject(b, c);
    for (var d in a) if (d !== "args") if (a[d] != b[d]) return false;
    for (d in a.args) {
        if (a.args[d] != b.args[d]) return false;
        delete b.args[d]
    }
    for (d in b.args) return false;
    return true
};
OpenLayers.Util.createUrlObject = function(a, b) {
    b = b || {};
    if (!/^\w+:\/\//.test(a)) {
        var c = window.location,
        d = c.port ? ":" + c.port: "";
        d = c.protocol + "//" + c.host.split(":").shift() + d;
        if (a.indexOf("/") === 0) a = d + a;
        else {
            c = c.pathname.split("/");
            c.pop();
            a = d + c.join("/") + "/" + a
        }
    }
    if (b.ignoreCase) a = a.toLowerCase();
    c = document.createElement("a");
    c.href = a;
    d = {};
    d.host = c.host.split(":").shift();
    d.protocol = c.protocol;
    d.port = b.ignorePort80 ? c.port == "80" || c.port == "0" ? "": c.port: c.port == "" || c.port == "0" ? "80": c.port;
    d.hash = b.ignoreHash || 
    c.hash === "#" ? "": c.hash;
    var e = c.search;
    if (!e) {
        e = a.indexOf("?");
        e = e != -1 ? a.substr(e) : ""
    }
    d.args = OpenLayers.Util.getParameters(e);
    d.pathname = c.pathname.charAt(0) == "/" ? c.pathname: "/" + c.pathname;
    return d
};
OpenLayers.Util.removeTail = function(a) {
    var b = null;
    b = a.indexOf("?");
    var c = a.indexOf("#");
    return b = b == -1 ? c != -1 ? a.substr(0, c) : a: c != -1 ? a.substr(0, Math.min(b, c)) : a.substr(0, b)
};
OpenLayers.IS_GECKO = function() {
    var a = navigator.userAgent.toLowerCase();
    return a.indexOf("webkit") == -1 && a.indexOf("gecko") != -1
} ();
OpenLayers.BROWSER_NAME = function() {
    var a = "",
    b = navigator.userAgent.toLowerCase();
    if (b.indexOf("opera") != -1) a = "opera";
    else if (b.indexOf("msie") != -1) a = "msie";
    else if (b.indexOf("safari") != -1) a = "safari";
    else if (b.indexOf("mozilla") != -1) a = b.indexOf("firefox") != -1 ? "firefox": "mozilla";
    return a
} ();
OpenLayers.Util.getBrowserName = function() {
    return OpenLayers.BROWSER_NAME
};
OpenLayers.Util.getRenderedDimensions = function(a, b, c) {
    var d,
    e,
    f = document.createElement("div");
    f.style.visibility = "hidden";
    var g = c && c.containerElement ? c.containerElement: document.body;
    if (b) if (b.w) {
        d = b.w;
        f.style.width = d + "px"
    } else if (b.h) {
        e = b.h;
        f.style.height = e + "px"
    }
    if (c && c.displayClass) f.className = c.displayClass;
    b = document.createElement("div");
    b.innerHTML = a;
    b.style.overflow = "visible";
    if (b.childNodes) {
        a = 0;
        for (c = b.childNodes.length; a < c; a++) if (b.childNodes[a].style) b.childNodes[a].style.overflow = "visible"
    }
    f.appendChild(b);
    g.appendChild(f);
    a = false;
    for (c = f.parentNode; c && c.tagName.toLowerCase() != "body";) {
        var h = OpenLayers.Element.getStyle(c, "position");
        if (h == "absolute") {
            a = true;
            break
        } else if (h && h != "static") break;
        c = c.parentNode
    }
    if (!a) f.style.position = "absolute";
    if (!d) {
        d = parseInt(b.scrollWidth);
        f.style.width = d + "px"
    }
    e || (e = parseInt(b.scrollHeight));
    f.removeChild(b);
    g.removeChild(f);
    return new OpenLayers.Size(d, e)
};
OpenLayers.Util.getScrollbarWidth = function() {
    var a = OpenLayers.Util._scrollbarWidth;
    if (a == null) {
        var b = null,
        c = null;
        b = a = 0;
        b = document.createElement("div");
        b.style.position = "absolute";
        b.style.top = "-1000px";
        b.style.left = "-1000px";
        b.style.width = "100px";
        b.style.height = "50px";
        b.style.overflow = "hidden";
        c = document.createElement("div");
        c.style.width = "100%";
        c.style.height = "200px";
        b.appendChild(c);
        document.body.appendChild(b);
        a = c.offsetWidth;
        b.style.overflow = "scroll";
        b = c.offsetWidth;
        document.body.removeChild(document.body.lastChild);
        OpenLayers.Util._scrollbarWidth = a - b;
        a = OpenLayers.Util._scrollbarWidth
    }
    return a
};
OpenLayers.Util.getFormattedLonLat = function(a, b, c) {
    c || (c = "dms");
    a = (a + 540) % 360 - 180;
    var d = Math.abs(a),
    e = Math.floor(d),
    f = d = (d - e) / (1 / 60);
    d = Math.floor(d);
    f = Math.round((f - d) / (1 / 60) * 10);
    f /= 10;
    if (f >= 60) {
        f -= 60;
        d += 1;
        if (d >= 60) {
            d -= 60;
            e += 1
        }
    }
    if (e < 10) e = "0" + e;
    e += "\u00b0";
    if (c.indexOf("dm") >= 0) {
        if (d < 10) d = "0" + d;
        e += d + "'";
        if (c.indexOf("dms") >= 0) {
            if (f < 10) f = "0" + f;
            e += f + '"'
        }
    }
    e += b == "lon" ? a < 0 ? OpenLayers.i18n("W") : OpenLayers.i18n("E") : a < 0 ? OpenLayers.i18n("S") : OpenLayers.i18n("N");
    return e
};
OpenLayers.Format = OpenLayers.Class({
    options: null,
    externalProjection: null,
    internalProjection: null,
    data: null,
    keepData: false,
    initialize: function(a) {
        OpenLayers.Util.extend(this, a);
        this.options = a
    },
    destroy: function() {},
    read: function() {
        OpenLayers.Console.userError(OpenLayers.i18n("readNotImplemented"))
    },
    write: function() {
        OpenLayers.Console.userError(OpenLayers.i18n("writeNotImplemented"))
    },
    CLASS_NAME: "OpenLayers.Format"
});
OpenLayers.Feature = OpenLayers.Class({
    layer: null,
    id: null,
    lonlat: null,
    data: null,
    marker: null,
    popupClass: null,
    popup: null,
    initialize: function(a, b, c) {
        this.layer = a;
        this.lonlat = b;
        this.data = c != null ? c: {};
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_")
    },
    destroy: function() {
        this.layer != null && this.layer.map != null && this.popup != null && this.layer.map.removePopup(this.popup);
        this.layer != null && this.marker != null && this.layer.removeMarker(this.marker);
        this.data = this.lonlat = this.id = this.layer = null;
        if (this.marker != 
        null) {
            this.destroyMarker(this.marker);
            this.marker = null
        }
        if (this.popup != null) {
            this.destroyPopup(this.popup);
            this.popup = null
        }
    },
    onScreen: function() {
        var a = false;
        if (this.layer != null && this.layer.map != null) a = this.layer.map.getExtent().containsLonLat(this.lonlat);
        return a
    },
    createMarker: function() {
        if (this.lonlat != null) this.marker = new OpenLayers.Marker(this.lonlat, this.data.icon);
        return this.marker
    },
    destroyMarker: function() {
        this.marker.destroy()
    },
    createPopup: function(a) {
        if (this.lonlat != null) {
            if (!this.popup) this.popup = 
            new(this.popupClass ? this.popupClass: OpenLayers.Popup.AnchoredBubble)(this.id + "_popup", this.lonlat, this.data.popupSize, this.data.popupContentHTML, this.marker ? this.marker.icon: null, a);
            if (this.data.overflow != null) this.popup.contentDiv.style.overflow = this.data.overflow;
            this.popup.feature = this
        }
        return this.popup
    },
    destroyPopup: function() {
        if (this.popup) {
            this.popup.feature = null;
            this.popup.destroy();
            this.popup = null
        }
    },
    CLASS_NAME: "OpenLayers.Feature"
});
OpenLayers.State = {
    UNKNOWN: "Unknown",
    INSERT: "Insert",
    UPDATE: "Update",
    DELETE: "Delete"
};
OpenLayers.Feature.Vector = OpenLayers.Class(OpenLayers.Feature, {
    fid: null,
    geometry: null,
    attributes: null,
    bounds: null,
    state: null,
    style: null,
    url: null,
    renderIntent: "default",
    modified: null,
    initialize: function(a, b, c) {
        OpenLayers.Feature.prototype.initialize.apply(this, [null, null, b]);
        this.lonlat = null;
        this.geometry = a ? a: null;
        this.state = null;
        this.attributes = {};
        if (b) this.attributes = OpenLayers.Util.extend(this.attributes, b);
        this.style = c ? c: null
    },
    destroy: function() {
        if (this.layer) {
            this.layer.removeFeatures(this);
            this.layer = 
            null
        }
        this.modified = this.geometry = null;
        OpenLayers.Feature.prototype.destroy.apply(this, arguments)
    },
    clone: function() {
        return new OpenLayers.Feature.Vector(this.geometry ? this.geometry.clone() : null, this.attributes, this.style)
    },
    onScreen: function(a) {
        var b = false;
        if (this.layer && this.layer.map) {
            b = this.layer.map.getExtent();
            if (a) {
                a = this.geometry.getBounds();
                b = b.intersectsBounds(a)
            } else b = b.toGeometry().intersects(this.geometry)
        }
        return b
    },
    getVisibility: function() {
        return ! (this.style && this.style.display == "none" || 
        !this.layer || this.layer && this.layer.styleMap && this.layer.styleMap.createSymbolizer(this, this.renderIntent).display == "none" || this.layer && !this.layer.getVisibility())
    },
    createMarker: function() {
        return null
    },
    destroyMarker: function() {},
    createPopup: function() {
        return null
    },
    atPoint: function(a, b, c) {
        var d = false;
        if (this.geometry) d = this.geometry.atPoint(a, b, c);
        return d
    },
    destroyPopup: function() {},
    move: function(a) {
        if (this.layer && this.geometry.move) {
            a = a.CLASS_NAME == "OpenLayers.LonLat" ? this.layer.getViewPortPxFromLonLat(a) : 
            a;
            var b = this.layer.getViewPortPxFromLonLat(this.geometry.getBounds().getCenterLonLat()),
            c = this.layer.map.getResolution();
            this.geometry.move(c * (a.x - b.x), c * (b.y - a.y));
            this.layer.drawFeature(this);
            return b
        }
    },
    toState: function(a) {
        if (a == OpenLayers.State.UPDATE) switch (this.state) {
        case OpenLayers.State.UNKNOWN:
        case OpenLayers.State.DELETE:
            this.state = a
        } else if (a == OpenLayers.State.INSERT) switch (this.state) {
        case OpenLayers.State.UNKNOWN:
            break;
        default:
            this.state = a
        } else if (a == OpenLayers.State.DELETE) switch (this.state) {
        case OpenLayers.State.UNKNOWN:
        case OpenLayers.State.UPDATE:
            this.state = 
            a
        } else if (a == OpenLayers.State.UNKNOWN) this.state = a
    },
    CLASS_NAME: "OpenLayers.Feature.Vector"
});
OpenLayers.Feature.Vector.style = {
    "default": {
        fillColor: "#ee9900",
        fillOpacity: 0.4,
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#ee9900",
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit"
    },
    select: {
        fillColor: "blue",
        fillOpacity: 0.4,
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "pointer"
    },
    temporary: {
        fillColor: "#66cccc",
        fillOpacity: 0.2,
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#66cccc",
        strokeOpacity: 1,
        strokeLinecap: "round",
        strokeWidth: 2,
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit"
    },
    "delete": {
        display: "none"
    }
};
OpenLayers.Format.WKT = OpenLayers.Class(OpenLayers.Format, {
    initialize: function(a) {
        this.regExes = {
            typeStr: /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
            spaces: /\s+/,
            parenComma: /\)\s*,\s*\(/,
            doubleParenComma: /\)\s*\)\s*,\s*\(\s*\(/,
            trimParens: /^\s*\(?(.*?)\)?\s*$/
        };
        OpenLayers.Format.prototype.initialize.apply(this, [a])
    },
    read: function(a) {
        var b,
        c;
        a = a.replace(/[\n\r]/g, " ");
        if (c = this.regExes.typeStr.exec(a)) {
            a = c[1].toLowerCase();
            c = c[2];
            if (this.parse[a]) b = this.parse[a].apply(this, [c]);
            if (this.internalProjection && this.externalProjection) if (b && 
            b.CLASS_NAME == "OpenLayers.Feature.Vector") b.geometry.transform(this.externalProjection, this.internalProjection);
            else if (b && a != "geometrycollection" && typeof b == "object") {
                a = 0;
                for (c = b.length; a < c; a++) b[a].geometry.transform(this.externalProjection, this.internalProjection)
            }
        }
        return b
    },
    write: function(a) {
        var b,
        c;
        if (a.constructor == Array) c = true;
        else {
            a = [a];
            c = false
        }
        var d = [];
        c && d.push("GEOMETRYCOLLECTION(");
        for (var e = 0, f = a.length; e < f; ++e) {
            c && e > 0 && d.push(",");
            b = a[e].geometry;
            d.push(this.extractGeometry(b))
        }
        c && d.push(")");
        return d.join("")
    },
    extractGeometry: function(a) {
        var b = a.CLASS_NAME.split(".")[2].toLowerCase();
        if (!this.extract[b]) return null;
        if (this.internalProjection && this.externalProjection) {
            a = a.clone();
            a.transform(this.internalProjection, this.externalProjection)
        }
        return (b == "collection" ? "GEOMETRYCOLLECTION": b.toUpperCase()) + "(" + this.extract[b].apply(this, [a]) + ")"
    },
    extract: {
        point: function(a) {
            return a.x + " " + a.y
        },
        multipoint: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push("(" + this.extract.point.apply(this, 
            [a.components[c]]) + ")");
            return b.join(",")
        },
        linestring: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push(this.extract.point.apply(this, [a.components[c]]));
            return b.join(",")
        },
        multilinestring: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push("(" + this.extract.linestring.apply(this, [a.components[c]]) + ")");
            return b.join(",")
        },
        polygon: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push("(" + this.extract.linestring.apply(this, [a.components[c]]) + ")");
            return b.join(",")
        },
        multipolygon: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push("(" + this.extract.polygon.apply(this, [a.components[c]]) + ")");
            return b.join(",")
        },
        collection: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push(this.extractGeometry.apply(this, [a.components[c]]));
            return b.join(",")
        }
    },
    parse: {
        point: function(a) {
            a = OpenLayers.String.trim(a).split(this.regExes.spaces);
            return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(a[0], a[1]))
        },
        multipoint: function(a) {
            for (var b = 
            OpenLayers.String.trim(a).split(","), c = [], d = 0, e = b.length; d < e; ++d) {
                a = b[d].replace(this.regExes.trimParens, "$1");
                c.push(this.parse.point.apply(this, [a]).geometry)
            }
            return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPoint(c))
        },
        linestring: function(a) {
            a = OpenLayers.String.trim(a).split(",");
            for (var b = [], c = 0, d = a.length; c < d; ++c) b.push(this.parse.point.apply(this, [a[c]]).geometry);
            return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(b))
        },
        multilinestring: function(a) {
            for (var b = 
            OpenLayers.String.trim(a).split(this.regExes.parenComma), c = [], d = 0, e = b.length; d < e; ++d) {
                a = b[d].replace(this.regExes.trimParens, "$1");
                c.push(this.parse.linestring.apply(this, [a]).geometry)
            }
            return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(c))
        },
        polygon: function(a) {
            var b;
            a = OpenLayers.String.trim(a).split(this.regExes.parenComma);
            for (var c = [], d = 0, e = a.length; d < e; ++d) {
                b = a[d].replace(this.regExes.trimParens, "$1");
                b = this.parse.linestring.apply(this, [b]).geometry;
                b = new OpenLayers.Geometry.LinearRing(b.components);
                c.push(b)
            }
            return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(c))
        },
        multipolygon: function(a) {
            for (var b = OpenLayers.String.trim(a).split(this.regExes.doubleParenComma), c = [], d = 0, e = b.length; d < e; ++d) {
                a = b[d].replace(this.regExes.trimParens, "$1");
                c.push(this.parse.polygon.apply(this, [a]).geometry)
            }
            return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon(c))
        },
        geometrycollection: function(a) {
            a = a.replace(/,\s*([A-Za-z])/g, "|$1");
            a = OpenLayers.String.trim(a).split("|");
            for (var b = 
            [], c = 0, d = a.length; c < d; ++c) b.push(OpenLayers.Format.WKT.prototype.read.apply(this, [a[c]]));
            return b
        }
    },
    CLASS_NAME: "OpenLayers.Format.WKT"
});
OpenLayers.Geometry = OpenLayers.Class({
    id: null,
    parent: null,
    bounds: null,
    initialize: function() {
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_")
    },
    destroy: function() {
        this.bounds = this.id = null
    },
    clone: function() {
        return new OpenLayers.Geometry
    },
    setBounds: function(a) {
        if (a) this.bounds = a.clone()
    },
    clearBounds: function() {
        this.bounds = null;
        this.parent && this.parent.clearBounds()
    },
    extendBounds: function(a) {
        this.getBounds() ? this.bounds.extend(a) : this.setBounds(a)
    },
    getBounds: function() {
        this.bounds == null && this.calculateBounds();
        return this.bounds
    },
    calculateBounds: function() {},
    distanceTo: function() {},
    getVertices: function() {},
    atPoint: function(a, b, c) {
        var d = false;
        if (this.getBounds() != null && a != null) {
            b = b != null ? b: 0;
            c = c != null ? c: 0;
            d = (new OpenLayers.Bounds(this.bounds.left - b, this.bounds.bottom - c, this.bounds.right + b, this.bounds.top + c)).containsLonLat(a)
        }
        return d
    },
    getLength: function() {
        return 0
    },
    getArea: function() {
        return 0
    },
    getCentroid: function() {
        return null
    },
    toString: function() {
        return OpenLayers.Format.WKT.prototype.write(new OpenLayers.Feature.Vector(this))
    },
    CLASS_NAME: "OpenLayers.Geometry"
});
OpenLayers.Geometry.fromWKT = function(a) {
    var b = arguments.callee.format;
    if (!b) {
        b = new OpenLayers.Format.WKT;
        arguments.callee.format = b
    }
    var c;
    b = b.read(a);
    if (b instanceof OpenLayers.Feature.Vector) c = b.geometry;
    else if (OpenLayers.Util.isArray(b)) {
        c = b.length;
        for (var d = Array(c), e = 0; e < c; ++e) d[e] = b[e].geometry;
        c = new OpenLayers.Geometry.Collection(d)
    }
    return c
};
OpenLayers.Geometry.segmentsIntersect = function(a, b, c) {
    var d = c && c.point;
    c = c && c.tolerance;
    var e = false,
    f = a.x1 - b.x1,
    g = a.y1 - b.y1,
    h = a.x2 - a.x1,
    i = a.y2 - a.y1,
    j = b.y2 - b.y1,
    k = b.x2 - b.x1,
    l = j * h - k * i;
    j = k * g - j * f;
    g = h * g - i * f;
    if (l == 0) {
        if (j == 0 && g == 0) e = true
    } else {
        f = j / l;
        l = g / l;
        if (f >= 0 && f <= 1 && l >= 0 && l <= 1) if (d) {
            h = a.x1 + f * h;
            l = a.y1 + f * i;
            e = new OpenLayers.Geometry.Point(h, l)
        } else e = true
    }
    if (c) if (e) {
        if (d) {
            a = [a, b];
            b = 0;
            a: for (; b < 2; ++b) {
                f = a[b];
                for (i = 1; i < 3; ++i) {
                    h = f["x" + i];
                    l = f["y" + i];
                    d = Math.sqrt(Math.pow(h - e.x, 2) + Math.pow(l - e.y, 2));
                    if (d < c) {
                        e.x = 
                        h;
                        e.y = l;
                        break a
                    }
                }
            }
        }
    } else {
        a = [a, b];
        b = 0;
        a: for (; b < 2; ++b) {
            h = a[b];
            l = a[(b + 1) % 2];
            for (i = 1; i < 3; ++i) {
                f = {
                    x: h["x" + i],
                    y: h["y" + i]
                };
                g = OpenLayers.Geometry.distanceToSegment(f, l);
                if (g.distance < c) {
                    e = d ? new OpenLayers.Geometry.Point(f.x, f.y) : true;
                    break a
                }
            }
        }
    }
    return e
};
OpenLayers.Geometry.distanceToSegment = function(a, b) {
    var c = a.x,
    d = a.y,
    e = b.x1,
    f = b.y1,
    g = b.x2,
    h = b.y2,
    i = g - e,
    j = h - f,
    k = (i * (c - e) + j * (d - f)) / (Math.pow(i, 2) + Math.pow(j, 2));
    if (! (k <= 0)) if (k >= 1) {
        e = g;
        f = h
    } else {
        e += k * i;
        f += k * j
    }
    return {
        distance: Math.sqrt(Math.pow(e - c, 2) + Math.pow(f - d, 2)),
        x: e,
        y: f
    }
};
OpenLayers.Geometry.Collection = OpenLayers.Class(OpenLayers.Geometry, {
    components: null,
    componentTypes: null,
    initialize: function(a) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.components = [];
        a != null && this.addComponents(a)
    },
    destroy: function() {
        this.components.length = 0;
        this.components = null;
        OpenLayers.Geometry.prototype.destroy.apply(this, arguments)
    },
    clone: function() {
        for (var a = eval("new " + this.CLASS_NAME + "()"), b = 0, c = this.components.length; b < c; b++) a.addComponent(this.components[b].clone());
        OpenLayers.Util.applyDefaults(a, this);
        return a
    },
    getComponentsString: function() {
        for (var a = [], b = 0, c = this.components.length; b < c; b++) a.push(this.components[b].toShortString());
        return a.join(",")
    },
    calculateBounds: function() {
        this.bounds = null;
        var a = new OpenLayers.Bounds,
        b = this.components;
        if (b) for (var c = 0, d = b.length; c < d; c++) a.extend(b[c].getBounds());
        a.left != null && a.bottom != null && a.right != null && a.top != null && this.setBounds(a)
    },
    addComponents: function(a) {
        OpenLayers.Util.isArray(a) || (a = [a]);
        for (var b = 0, c = a.length; b < 
        c; b++) this.addComponent(a[b])
    },
    addComponent: function(a, b) {
        var c = false;
        if (a) if (this.componentTypes == null || OpenLayers.Util.indexOf(this.componentTypes, a.CLASS_NAME) > -1) {
            if (b != null && b < this.components.length) {
                c = this.components.slice(0, b);
                var d = this.components.slice(b, this.components.length);
                c.push(a);
                this.components = c.concat(d)
            } else this.components.push(a);
            a.parent = this;
            this.clearBounds();
            c = true
        }
        return c
    },
    removeComponents: function(a) {
        var b = false;
        OpenLayers.Util.isArray(a) || (a = [a]);
        for (var c = a.length - 
        1; c >= 0; --c) b = this.removeComponent(a[c]) || b;
        return b
    },
    removeComponent: function(a) {
        OpenLayers.Util.removeItem(this.components, a);
        this.clearBounds();
        return true
    },
    getLength: function() {
        for (var a = 0, b = 0, c = this.components.length; b < c; b++) a += this.components[b].getLength();
        return a
    },
    getArea: function() {
        for (var a = 0, b = 0, c = this.components.length; b < c; b++) a += this.components[b].getArea();
        return a
    },
    getGeodesicArea: function(a) {
        for (var b = 0, c = 0, d = this.components.length; c < d; c++) b += this.components[c].getGeodesicArea(a);
        return b
    },
    getCentroid: function(a) {
        if (!a) return this.components.length && this.components[0].getCentroid();
        a = this.components.length;
        if (!a) return false;
        for (var b = [], c = [], d = 0, e = Number.MAX_VALUE, f, g = 0; g < a; ++g) {
            f = this.components[g];
            var h = f.getArea();
            f = f.getCentroid(true);
            if (! (isNaN(h) || isNaN(f.x) || isNaN(f.y))) {
                b.push(h);
                d += h;
                e = h < e && h > 0 ? h: e;
                c.push(f)
            }
        }
        a = b.length;
        if (d === 0) {
            for (g = 0; g < a; ++g) b[g] = 1;
            d = b.length
        } else {
            for (g = 0; g < a; ++g) b[g] /= e;
            d /= e
        }
        var i = e = 0;
        for (g = 0; g < a; ++g) {
            f = c[g];
            h = b[g];
            e += f.x * h;
            i += f.y * h
        }
        return new OpenLayers.Geometry.Point(e / 
        d, i / d)
    },
    getGeodesicLength: function(a) {
        for (var b = 0, c = 0, d = this.components.length; c < d; c++) b += this.components[c].getGeodesicLength(a);
        return b
    },
    move: function(a, b) {
        for (var c = 0, d = this.components.length; c < d; c++) this.components[c].move(a, b)
    },
    rotate: function(a, b) {
        for (var c = 0, d = this.components.length; c < d; ++c) this.components[c].rotate(a, b)
    },
    resize: function(a, b, c) {
        for (var d = 0; d < this.components.length; ++d) this.components[d].resize(a, b, c);
        return this
    },
    distanceTo: function(a, b) {
        for (var c = !(b && b.edge === false) && b && 
        b.details, d, e, f, g = Number.POSITIVE_INFINITY, h = 0, i = this.components.length; h < i; ++h) {
            d = this.components[h].distanceTo(a, b);
            f = c ? d.distance: d;
            if (f < g) {
                g = f;
                e = d;
                if (g == 0) break
            }
        }
        return e
    },
    equals: function(a) {
        var b = true;
        if (!a || !a.CLASS_NAME || this.CLASS_NAME != a.CLASS_NAME) b = false;
        else if (!OpenLayers.Util.isArray(a.components) || a.components.length != this.components.length) b = false;
        else for (var c = 0, d = this.components.length; c < d; ++c) if (!this.components[c].equals(a.components[c])) {
            b = false;
            break
        }
        return b
    },
    transform: function(a, 
    b) {
        if (a && b) {
            for (var c = 0, d = this.components.length; c < d; c++) this.components[c].transform(a, b);
            this.bounds = null
        }
        return this
    },
    intersects: function(a) {
        for (var b = false, c = 0, d = this.components.length; c < d; ++c) if (b = a.intersects(this.components[c])) break;
        return b
    },
    getVertices: function(a) {
        for (var b = [], c = 0, d = this.components.length; c < d; ++c) Array.prototype.push.apply(b, this.components[c].getVertices(a));
        return b
    },
    CLASS_NAME: "OpenLayers.Geometry.Collection"
});
OpenLayers.Geometry.Point = OpenLayers.Class(OpenLayers.Geometry, {
    x: null,
    y: null,
    initialize: function(a, b) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.x = parseFloat(a);
        this.y = parseFloat(b)
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Geometry.Point(this.x, this.y);
        OpenLayers.Util.applyDefaults(a, this);
        return a
    },
    calculateBounds: function() {
        this.bounds = new OpenLayers.Bounds(this.x, this.y, this.x, this.y)
    },
    distanceTo: function(a, b) {
        var c = !(b && b.edge === false) && b && b.details,
        d,
        e,
        f,
        g,
        h;
        if (a instanceof
        OpenLayers.Geometry.Point) {
            e = this.x;
            f = this.y;
            g = a.x;
            h = a.y;
            d = Math.sqrt(Math.pow(e - g, 2) + Math.pow(f - h, 2));
            d = !c ? d: {
                x0: e,
                y0: f,
                x1: g,
                y1: h,
                distance: d
            }
        } else {
            d = a.distanceTo(this, b);
            if (c) d = {
                x0: d.x1,
                y0: d.y1,
                x1: d.x0,
                y1: d.y0,
                distance: d.distance
            }
        }
        return d
    },
    equals: function(a) {
        var b = false;
        if (a != null) b = this.x == a.x && this.y == a.y || isNaN(this.x) && isNaN(this.y) && isNaN(a.x) && isNaN(a.y);
        return b
    },
    toShortString: function() {
        return this.x + ", " + this.y
    },
    move: function(a, b) {
        this.x += a;
        this.y += b;
        this.clearBounds()
    },
    rotate: function(a, 
    b) {
        a *= Math.PI / 180;
        var c = this.distanceTo(b),
        d = a + Math.atan2(this.y - b.y, this.x - b.x);
        this.x = b.x + c * Math.cos(d);
        this.y = b.y + c * Math.sin(d);
        this.clearBounds()
    },
    getCentroid: function() {
        return new OpenLayers.Geometry.Point(this.x, this.y)
    },
    resize: function(a, b, c) {
        this.x = b.x + a * (c == undefined ? 1: c) * (this.x - b.x);
        this.y = b.y + a * (this.y - b.y);
        this.clearBounds();
        return this
    },
    intersects: function(a) {
        var b = false;
        return b = a.CLASS_NAME == "OpenLayers.Geometry.Point" ? this.equals(a) : a.intersects(this)
    },
    transform: function(a, b) {
        if (a && 
        b) {
            OpenLayers.Projection.transform(this, a, b);
            this.bounds = null
        }
        return this
    },
    getVertices: function() {
        return [this]
    },
    CLASS_NAME: "OpenLayers.Geometry.Point"
});
OpenLayers.Geometry.MultiPoint = OpenLayers.Class(OpenLayers.Geometry.Collection, {
    componentTypes: ["OpenLayers.Geometry.Point"],
    initialize: function() {
        OpenLayers.Geometry.Collection.prototype.initialize.apply(this, arguments)
    },
    addPoint: function(a, b) {
        this.addComponent(a, b)
    },
    removePoint: function(a) {
        this.removeComponent(a)
    },
    CLASS_NAME: "OpenLayers.Geometry.MultiPoint"
});
OpenLayers.Geometry.Curve = OpenLayers.Class(OpenLayers.Geometry.MultiPoint, {
    componentTypes: ["OpenLayers.Geometry.Point"],
    initialize: function() {
        OpenLayers.Geometry.MultiPoint.prototype.initialize.apply(this, arguments)
    },
    getLength: function() {
        var a = 0;
        if (this.components && this.components.length > 1) for (var b = 1, c = this.components.length; b < c; b++) a += this.components[b - 1].distanceTo(this.components[b]);
        return a
    },
    getGeodesicLength: function(a) {
        var b = this;
        if (a) {
            var c = new OpenLayers.Projection("EPSG:4326");
            c.equals(a) || 
            (b = this.clone().transform(a, c))
        }
        a = 0;
        if (b.components && b.components.length > 1) for (var d, e = 1, f = b.components.length; e < f; e++) {
            c = b.components[e - 1];
            d = b.components[e];
            a += OpenLayers.Util.distVincenty({
                lon: c.x,
                lat: c.y
            },
            {
                lon: d.x,
                lat: d.y
            })
        }
        return a * 1E3
    },
    CLASS_NAME: "OpenLayers.Geometry.Curve"
});
OpenLayers.Geometry.LineString = OpenLayers.Class(OpenLayers.Geometry.Curve, {
    initialize: function() {
        OpenLayers.Geometry.Curve.prototype.initialize.apply(this, arguments)
    },
    removeComponent: function() {
        var a = this.components && this.components.length > 2;
        a && OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, arguments);
        return a
    },
    intersects: function(a) {
        var b = false,
        c = a.CLASS_NAME;
        if (c == "OpenLayers.Geometry.LineString" || c == "OpenLayers.Geometry.LinearRing" || c == "OpenLayers.Geometry.Point") {
            var d = this.getSortedSegments();
            a = c == "OpenLayers.Geometry.Point" ? [{
                x1: a.x,
                y1: a.y,
                x2: a.x,
                y2: a.y
            }] : a.getSortedSegments();
            var e,
            f,
            g,
            h,
            i,
            j,
            k,
            l = 0,
            m = d.length;
            a: for (; l < m; ++l) {
                c = d[l];
                e = c.x1;
                f = c.x2;
                g = c.y1;
                h = c.y2;
                var n = 0,
                o = a.length;
                for (; n < o; ++n) {
                    i = a[n];
                    if (i.x1 > f) break;
                    if (! (i.x2 < e)) {
                        j = i.y1;
                        k = i.y2;
                        if (! (Math.min(j, k) > Math.max(g, h))) if (! (Math.max(j, k) < Math.min(g, h))) if (OpenLayers.Geometry.segmentsIntersect(c, i)) {
                            b = true;
                            break a
                        }
                    }
                }
            }
        } else b = a.intersects(this);
        return b
    },
    getSortedSegments: function() {
        for (var a = this.components.length - 1, b = Array(a), c, 
        d, e = 0; e < a; ++e) {
            c = this.components[e];
            d = this.components[e + 1];
            b[e] = c.x < d.x ? {
                x1: c.x,
                y1: c.y,
                x2: d.x,
                y2: d.y
            }: {
                x1: d.x,
                y1: d.y,
                x2: c.x,
                y2: c.y
            }
        }
        return b.sort(function(f, g) {
            return f.x1 - g.x1
        })
    },
    splitWithSegment: function(a, b) {
        for (var c = !(b && b.edge === false), d = b && b.tolerance, e = [], f = this.getVertices(), g = [], h = [], i = false, j, k, l, m = {
            point: true,
            tolerance: d
        },
        n = null, o = 0, p = f.length - 2; o <= p; ++o) {
            d = f[o];
            g.push(d.clone());
            j = f[o + 1];
            k = {
                x1: d.x,
                y1: d.y,
                x2: j.x,
                y2: j.y
            };
            k = OpenLayers.Geometry.segmentsIntersect(a, k, m);
            if (k instanceof OpenLayers.Geometry.Point) if ((l = 
            k.x === a.x1 && k.y === a.y1 || k.x === a.x2 && k.y === a.y2 || k.equals(d) || k.equals(j) ? true: false) || c) {
                k.equals(h[h.length - 1]) || h.push(k.clone());
                if (o === 0) if (k.equals(d)) continue;
                if (!k.equals(j)) {
                    i = true;
                    k.equals(d) || g.push(k);
                    e.push(new OpenLayers.Geometry.LineString(g));
                    g = [k.clone()]
                }
            }
        }
        if (i) {
            g.push(j.clone());
            e.push(new OpenLayers.Geometry.LineString(g))
        }
        if (h.length > 0) {
            var q = a.x1 < a.x2 ? 1: -1,
            r = a.y1 < a.y2 ? 1: -1;
            n = {
                lines: e,
                points: h.sort(function(s, t) {
                    return q * s.x - q * t.x || r * s.y - r * t.y
                })
            }
        }
        return n
    },
    split: function(a, b) {
        var c = 
        null,
        d = b && b.mutual,
        e,
        f,
        g,
        h;
        if (a instanceof OpenLayers.Geometry.LineString) {
            var i = this.getVertices(),
            j,
            k,
            l,
            m,
            n,
            o = [];
            g = [];
            for (var p = 0, q = i.length - 2; p <= q; ++p) {
                j = i[p];
                k = i[p + 1];
                l = {
                    x1: j.x,
                    y1: j.y,
                    x2: k.x,
                    y2: k.y
                };
                h = h || [a];
                d && o.push(j.clone());
                for (var r = 0; r < h.length; ++r) if (m = h[r].splitWithSegment(l, b)) {
                    n = m.lines;
                    if (n.length > 0) {
                        n.unshift(r, 1);
                        Array.prototype.splice.apply(h, n);
                        r += n.length - 2
                    }
                    if (d) for (var s = 0, t = m.points.length; s < t; ++s) {
                        n = m.points[s];
                        if (!n.equals(j)) {
                            o.push(n);
                            g.push(new OpenLayers.Geometry.LineString(o));
                            o = n.equals(k) ? [] : [n.clone()]
                        }
                    }
                }
            }
            if (d && g.length > 0 && o.length > 0) {
                o.push(k.clone());
                g.push(new OpenLayers.Geometry.LineString(o))
            }
        } else c = a.splitWith(this, b);
        if (h && h.length > 1) f = true;
        else h = [];
        if (g && g.length > 1) e = true;
        else g = [];
        if (f || e) c = d ? [g, h] : h;
        return c
    },
    splitWith: function(a, b) {
        return a.split(this, b)
    },
    getVertices: function(a) {
        return a === true ? [this.components[0], this.components[this.components.length - 1]] : a === false ? this.components.slice(1, this.components.length - 1) : this.components.slice()
    },
    distanceTo: function(a, 
    b) {
        var c = !(b && b.edge === false) && b && b.details,
        d,
        e = {},
        f = Number.POSITIVE_INFINITY;
        if (a instanceof OpenLayers.Geometry.Point) {
            for (var g = this.getSortedSegments(), h = a.x, i = a.y, j, k = 0, l = g.length; k < l; ++k) {
                j = g[k];
                d = OpenLayers.Geometry.distanceToSegment(a, j);
                if (d.distance < f) {
                    f = d.distance;
                    e = d;
                    if (f === 0) break
                } else if (j.x2 > h && (i > j.y1 && i < j.y2 || i < j.y1 && i > j.y2)) break
            }
            e = c ? {
                distance: e.distance,
                x0: e.x,
                y0: e.y,
                x1: h,
                y1: i
            }: e.distance
        } else if (a instanceof OpenLayers.Geometry.LineString) {
            g = this.getSortedSegments();
            h = a.getSortedSegments();
            var m,
            n,
            o = h.length,
            p = {
                point: true
            };
            k = 0;
            l = g.length;
            a: for (; k < l; ++k) {
                i = g[k];
                j = i.x1;
                n = i.y1;
                for (var q = 0; q < o; ++q) {
                    d = h[q];
                    if (m = OpenLayers.Geometry.segmentsIntersect(i, d, p)) {
                        f = 0;
                        e = {
                            distance: 0,
                            x0: m.x,
                            y0: m.y,
                            x1: m.x,
                            y1: m.y
                        };
                        break a
                    } else {
                        d = OpenLayers.Geometry.distanceToSegment({
                            x: j,
                            y: n
                        },
                        d);
                        if (d.distance < f) {
                            f = d.distance;
                            e = {
                                distance: f,
                                x0: j,
                                y0: n,
                                x1: d.x,
                                y1: d.y
                            }
                        }
                    }
                }
            }
            if (!c) e = e.distance;
            if (f !== 0) if (i) {
                d = a.distanceTo(new OpenLayers.Geometry.Point(i.x2, i.y2), b);
                k = c ? d.distance: d;
                if (k < f) e = c ? {
                    distance: f,
                    x0: d.x1,
                    y0: d.y1,
                    x1: d.x0,
                    y1: d.y0
                }: k
            }
        } else {
            e = a.distanceTo(this, b);
            if (c) e = {
                distance: e.distance,
                x0: e.x1,
                y0: e.y1,
                x1: e.x0,
                y1: e.y0
            }
        }
        return e
    },
    simplify: function(a) {
        if (this && this !== null) {
            var b = this.getVertices();
            if (b.length < 3) return this;
            var c = function(f, g, h, i) {
                for (var j = 0, k = 0, l = g, m; l < h; l++) {
                    m = Math.abs(0.5 * (f[g].x * f[h].y + f[h].x * f[l].y + f[l].x * f[g].y - f[h].x * f[g].y - f[l].x * f[h].y - f[g].x * f[l].y)) / Math.sqrt(Math.pow(f[g].x - f[h].x, 2) + Math.pow(f[g].y - f[h].y, 2)) * 2;
                    if (m > j) {
                        j = m;
                        k = l
                    }
                }
                if (j > i && k != g) {
                    e.push(k);
                    c(f, g, k, i);
                    c(f, k, h, i)
                }
            },
            d = b.length - 
            1,
            e = [];
            e.push(0);
            for (e.push(d); b[0].equals(b[d]);) {
                d--;
                e.push(d)
            }
            c(b, 0, d, a);
            a = [];
            e.sort(function(f, g) {
                return f - g
            });
            for (d = 0; d < e.length; d++) a.push(b[e[d]]);
            return new OpenLayers.Geometry.LineString(a)
        } else return this
    },
    CLASS_NAME: "OpenLayers.Geometry.LineString"
});
OpenLayers.Geometry.LinearRing = OpenLayers.Class(OpenLayers.Geometry.LineString, {
    componentTypes: ["OpenLayers.Geometry.Point"],
    initialize: function() {
        OpenLayers.Geometry.LineString.prototype.initialize.apply(this, arguments)
    },
    addComponent: function(a, b) {
        var c = false,
        d = this.components.pop();
        if (b != null || !a.equals(d)) c = OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, arguments);
        OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, [this.components[0]]);
        return c
    },
    removeComponent: function() {
        var a = 
        this.components && this.components.length > 3;
        if (a) {
            this.components.pop();
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, arguments);
            OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, [this.components[0]])
        }
        return a
    },
    move: function(a, b) {
        for (var c = 0, d = this.components.length; c < d - 1; c++) this.components[c].move(a, b)
    },
    rotate: function(a, b) {
        for (var c = 0, d = this.components.length; c < d - 1; ++c) this.components[c].rotate(a, b)
    },
    resize: function(a, b, c) {
        for (var d = 0, e = this.components.length; d < 
        e - 1; ++d) this.components[d].resize(a, b, c);
        return this
    },
    transform: function(a, b) {
        if (a && b) {
            for (var c = 0, d = this.components.length; c < d - 1; c++) this.components[c].transform(a, b);
            this.bounds = null
        }
        return this
    },
    getCentroid: function() {
        if (this.components && this.components.length > 2) {
            for (var a = 0, b = 0, c = 0; c < this.components.length - 1; c++) {
                var d = this.components[c],
                e = this.components[c + 1];
                a += (d.x + e.x) * (d.x * e.y - e.x * d.y);
                b += (d.y + e.y) * (d.x * e.y - e.x * d.y)
            }
            c = -1 * this.getArea();
            return new OpenLayers.Geometry.Point(a / (6 * c), b / (6 * c))
        } else return null
    },
    getArea: function() {
        var a = 0;
        if (this.components && this.components.length > 2) {
            for (var b = a = 0, c = this.components.length; b < c - 1; b++) {
                var d = this.components[b],
                e = this.components[b + 1];
                a += (d.x + e.x) * (e.y - d.y)
            }
            a = -a / 2
        }
        return a
    },
    getGeodesicArea: function(a) {
        var b = this;
        if (a) {
            var c = new OpenLayers.Projection("EPSG:4326");
            c.equals(a) || (b = this.clone().transform(a, c))
        }
        a = 0;
        c = b.components && b.components.length;
        if (c > 2) {
            for (var d, e, f = 0; f < c - 1; f++) {
                d = b.components[f];
                e = b.components[f + 1];
                a += OpenLayers.Util.rad(e.x - d.x) * (2 + Math.sin(OpenLayers.Util.rad(d.y)) + 
                Math.sin(OpenLayers.Util.rad(e.y)))
            }
            a = a * 40680631590769 / 2
        }
        return a
    },
    containsPoint: function(a) {
        var b = OpenLayers.Number.limitSigDigs,
        c = b(a.x, 14);
        a = b(a.y, 14);
        for (var d = this.components.length - 1, e, f, g, h, i, j = 0, k = 0; k < d; ++k) {
            e = this.components[k];
            g = b(e.x, 14);
            e = b(e.y, 14);
            f = this.components[k + 1];
            h = b(f.x, 14);
            f = b(f.y, 14);
            if (e == f) {
                if (a == e) if (g <= h && c >= g && c <= h || g >= h && c <= g && c >= h) {
                    j = -1;
                    break
                }
            } else {
                i = b(((g - h) * a + (h * e - g * f)) / (e - f), 14);
                if (i == c) if (e < f && a >= e && a <= f || e > f && a <= e && a >= f) {
                    j = -1;
                    break
                }
                if (! (i <= c)) if (! (g != h && (i < Math.min(g, 
                h) || i > Math.max(g, h)))) if (e < f && a >= e && a < f || e > f && a < e && a >= f)++j
            }
        }
        return j == -1 ? 1: !!(j & 1)
    },
    intersects: function(a) {
        var b = false;
        if (a.CLASS_NAME == "OpenLayers.Geometry.Point") b = this.containsPoint(a);
        else if (a.CLASS_NAME == "OpenLayers.Geometry.LineString") b = a.intersects(this);
        else if (a.CLASS_NAME == "OpenLayers.Geometry.LinearRing") b = OpenLayers.Geometry.LineString.prototype.intersects.apply(this, [a]);
        else for (var c = 0, d = a.components.length; c < d; ++c) if (b = a.components[c].intersects(this)) break;
        return b
    },
    getVertices: function(a) {
        return a === 
        true ? [] : this.components.slice(0, this.components.length - 1)
    },
    CLASS_NAME: "OpenLayers.Geometry.LinearRing"
});
OpenLayers.Event = {
    observers: false,
    KEY_BACKSPACE: 8,
    KEY_TAB: 9,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_DELETE: 46,
    element: function(a) {
        return a.target || a.srcElement
    },
    isSingleTouch: function(a) {
        return a.touches && a.touches.length == 1
    },
    isMultiTouch: function(a) {
        return a.touches && a.touches.length > 1
    },
    isLeftClick: function(a) {
        return a.which && a.which == 1 || a.button && a.button == 1
    },
    isRightClick: function(a) {
        return a.which && a.which == 3 || a.button && a.button == 2
    },
    stop: function(a, b) {
        if (!b) if (a.preventDefault) a.preventDefault();
        else a.returnValue = false;
        if (a.stopPropagation) a.stopPropagation();
        else a.cancelBubble = true
    },
    findElement: function(a, b) {
        for (var c = OpenLayers.Event.element(a); c.parentNode && (!c.tagName || c.tagName.toUpperCase() != b.toUpperCase());) c = c.parentNode;
        return c
    },
    observe: function(a, b, c, d) {
        a = OpenLayers.Util.getElement(a);
        d = d || false;
        if (b == "keypress" && (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || a.attachEvent)) b = "keydown";
        if (!this.observers) this.observers = {};
        if (!a._eventCacheID) {
            var e = "eventCacheID_";
            if (a.id) e = 
            a.id + "_" + e;
            a._eventCacheID = OpenLayers.Util.createUniqueID(e)
        }
        e = a._eventCacheID;
        this.observers[e] || (this.observers[e] = []);
        this.observers[e].push({
            element: a,
            name: b,
            observer: c,
            useCapture: d
        });
        if (a.addEventListener) a.addEventListener(b, c, d);
        else a.attachEvent && a.attachEvent("on" + b, c)
    },
    stopObservingElement: function(a) {
        a = OpenLayers.Util.getElement(a)._eventCacheID;
        this._removeElementObservers(OpenLayers.Event.observers[a])
    },
    _removeElementObservers: function(a) {
        if (a) for (var b = a.length - 1; b >= 0; b--) {
            var c = a[b];
            OpenLayers.Event.stopObserving.apply(this, [c.element, c.name, c.observer, c.useCapture])
        }
    },
    stopObserving: function(a, b, c, d) {
        d = d || false;
        a = OpenLayers.Util.getElement(a);
        var e = a._eventCacheID;
        if (b == "keypress") if (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || a.detachEvent) b = "keydown";
        var f = false,
        g = OpenLayers.Event.observers[e];
        if (g) for (var h = 0; ! f && h < g.length;) {
            var i = g[h];
            if (i.name == b && i.observer == c && i.useCapture == d) {
                g.splice(h, 1);
                g.length == 0 && delete OpenLayers.Event.observers[e];
                f = true;
                break
            }
            h++
        }
        if (f) if (a.removeEventListener) a.removeEventListener(b, 
        c, d);
        else a && a.detachEvent && a.detachEvent("on" + b, c);
        return f
    },
    unloadCache: function() {
        if (OpenLayers.Event && OpenLayers.Event.observers) {
            for (var a in OpenLayers.Event.observers) OpenLayers.Event._removeElementObservers.apply(this, [OpenLayers.Event.observers[a]]);
            OpenLayers.Event.observers = false
        }
    },
    CLASS_NAME: "OpenLayers.Event"
};
OpenLayers.Event.observe(window, "unload", OpenLayers.Event.unloadCache, false);
if (window.Event) OpenLayers.Util.applyDefaults(window.Event, OpenLayers.Event);
else var Event = OpenLayers.Event;
OpenLayers.Events = OpenLayers.Class({
    BROWSER_EVENTS: ["mouseover", "mouseout", "mousedown", "mouseup", "mousemove", "click", "dblclick", "rightclick", "dblrightclick", "resize", "focus", "blur", "touchstart", "touchmove", "touchend"],
    listeners: null,
    object: null,
    element: null,
    eventTypes: null,
    eventHandler: null,
    fallThrough: null,
    includeXY: false,
    clearMouseListener: null,
    initialize: function(a, b, c, d, e) {
        OpenLayers.Util.extend(this, e);
        this.object = a;
        this.fallThrough = d;
        this.listeners = {};
        this.eventHandler = OpenLayers.Function.bindAsEventListener(this.handleBrowserEvent, 
        this);
        this.clearMouseListener = OpenLayers.Function.bind(this.clearMouseCache, this);
        this.eventTypes = [];
        if (c != null) {
            a = 0;
            for (d = c.length; a < d; a++) this.addEventType(c[a])
        }
        b != null && this.attachToElement(b)
    },
    destroy: function() {
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
            this.element.hasScrollEvent && OpenLayers.Event.stopObserving(window, "scroll", this.clearMouseListener)
        }
        this.eventHandler = this.fallThrough = this.eventTypes = this.object = this.listeners = this.element = null
    },
    addEventType: function(a) {
        if (!this.listeners[a]) {
            this.eventTypes.push(a);
            this.listeners[a] = []
        }
    },
    attachToElement: function(a) {
        this.element && OpenLayers.Event.stopObservingElement(this.element);
        this.element = a;
        for (var b = 0, c = this.BROWSER_EVENTS.length; b < c; b++) {
            var d = this.BROWSER_EVENTS[b];
            this.addEventType(d);
            OpenLayers.Event.observe(a, d, this.eventHandler)
        }
        OpenLayers.Event.observe(a, "dragstart", OpenLayers.Event.stop)
    },
    on: function(a) {
        for (var b in a) b != "scope" && this.register(b, a.scope, a[b])
    },
    register: function(a, b, c) {
        if (c != null && OpenLayers.Util.indexOf(this.eventTypes, a) != -1) {
            if (b == 
            null) b = this.object;
            this.listeners[a].push({
                obj: b,
                func: c
            })
        }
    },
    registerPriority: function(a, b, c) {
        if (c != null) {
            if (b == null) b = this.object;
            a = this.listeners[a];
            a != null && a.unshift({
                obj: b,
                func: c
            })
        }
    },
    un: function(a) {
        for (var b in a) b != "scope" && this.unregister(b, a.scope, a[b])
    },
    unregister: function(a, b, c) {
        if (b == null) b = this.object;
        a = this.listeners[a];
        if (a != null) for (var d = 0, e = a.length; d < e; d++) if (a[d].obj == b && a[d].func == c) {
            a.splice(d, 1);
            break
        }
    },
    remove: function(a) {
        if (this.listeners[a] != null) this.listeners[a] = []
    },
    triggerEvent: function(a, 
    b) {
        var c = this.listeners[a];
        if (! (!c || c.length == 0)) {
            if (b == null) b = {};
            b.object = this.object;
            b.element = this.element;
            if (!b.type) b.type = a;
            c = c.slice();
            for (var d, e = 0, f = c.length; e < f; e++) {
                d = c[e];
                d = d.func.apply(d.obj, [b]);
                if (d != undefined && d == false) break
            }
            this.fallThrough || OpenLayers.Event.stop(b, true);
            return d
        }
    },
    handleBrowserEvent: function(a) {
 		//debugger
		//浏览器监听事件。
        var b = a.type,
        c = this.listeners[b];
        if (! (!c || c.length == 0)) {
            if ((c = a.touches) && c[0]) {
                for (var d = 0, e = 0, f = c.length, g, h = 0; h < f; ++h) {
                    g = c[h];
                    d += g.clientX;
                    e += g.clientY
                }
                a.clientX = d / f;
                a.clientY = 
                e / f
            }
            if (this.includeXY) a.xy = this.getMousePosition(a);
            this.triggerEvent(b, a)
        }
    },
    clearMouseCache: function() {
        this.element.scrolls = null;
        this.element.lefttop = null;
        var a = document.body;
        if (a && !((a.scrollTop != 0 || a.scrollLeft != 0) && navigator.userAgent.match(/iPhone/i))) this.element.offsets = null
    },
    getMousePosition: function(a) {
        if (this.includeXY) {
            if (!this.element.hasScrollEvent) {
                OpenLayers.Event.observe(window, "scroll", this.clearMouseListener);
                this.element.hasScrollEvent = true
            }
        } else this.clearMouseCache();
        if (!this.element.scrolls) {
            var b = 
            OpenLayers.Util.getViewportElement();
            this.element.scrolls = [b.scrollLeft, b.scrollTop]
        }
        if (!this.element.lefttop) this.element.lefttop = [document.documentElement.clientLeft || 0, document.documentElement.clientTop || 0];
        if (!this.element.offsets) this.element.offsets = OpenLayers.Util.pagePosition(this.element);
        return new OpenLayers.Pixel(a.clientX + this.element.scrolls[0] - this.element.offsets[0] - this.element.lefttop[0], a.clientY + this.element.scrolls[1] - this.element.offsets[1] - this.element.lefttop[1])
    },
    CLASS_NAME: "OpenLayers.Events"
});
OpenLayers.Handler = OpenLayers.Class({
    id: null,
    control: null,
    map: null,
    keyMask: null,
    active: false,
    evt: null,
    initialize: function(a, b, c) {
        OpenLayers.Util.extend(this, c);
        this.control = a;
        this.callbacks = b; (a = this.map || a.map) && this.setMap(a);
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_")
    },
    setMap: function(a) {
        this.map = a
    },
    checkModifiers: function(a) {
        if (this.keyMask == null) return true;
        return ((a.shiftKey ? OpenLayers.Handler.MOD_SHIFT: 0) | (a.ctrlKey ? OpenLayers.Handler.MOD_CTRL: 0) | (a.altKey ? OpenLayers.Handler.MOD_ALT: 
        0)) == this.keyMask
    },
    activate: function() {
        if (this.active) return false;
        for (var a = OpenLayers.Events.prototype.BROWSER_EVENTS, b = 0, c = a.length; b < c; b++) this[a[b]] && this.register(a[b], this[a[b]]);
        return this.active = true
    },
    deactivate: function() {
        if (!this.active) return false;
        for (var a = OpenLayers.Events.prototype.BROWSER_EVENTS, b = 0, c = a.length; b < c; b++) this[a[b]] && this.unregister(a[b], this[a[b]]);
        this.active = false;
        return true
    },
    callback: function(a, b) {
        a && this.callbacks[a] && this.callbacks[a].apply(this.control, b)
    },
    register: function(a, 
    b) {
        this.map.events.registerPriority(a, this, b);
        this.map.events.registerPriority(a, this, this.setEvent)
    },
    unregister: function(a, b) {
        this.map.events.unregister(a, this, b);
        this.map.events.unregister(a, this, this.setEvent)
    },
    setEvent: function(a) {
        this.evt = a;
        return true
    },
    destroy: function() {
        this.deactivate();
        this.control = this.map = null
    },
    CLASS_NAME: "OpenLayers.Handler"
});
OpenLayers.Handler.MOD_NONE = 0;
OpenLayers.Handler.MOD_SHIFT = 1;
OpenLayers.Handler.MOD_CTRL = 2;
OpenLayers.Handler.MOD_ALT = 4;
OpenLayers.Handler.Point = OpenLayers.Class(OpenLayers.Handler, {
    point: null,
    layer: null,
    multi: false,
    mouseDown: false,
    stoppedDown: null,
    lastDown: null,
    lastUp: null,
    persist: false,
    stopDown: false,
    stopUp: false,
    layerOptions: null,
    pixelTolerance: 5,
    touch: false,
    lastTouchPx: null,
    initialize: function(a, b, c) {
        if (! (c && c.layerOptions && c.layerOptions.styleMap)) this.style = OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"], {});
        OpenLayers.Handler.prototype.initialize.apply(this, arguments)
    },
    activate: function() {
        if (!OpenLayers.Handler.prototype.activate.apply(this, 
        arguments)) return false;
        var a = OpenLayers.Util.extend({
            displayInLayerSwitcher: false,
            calculateInRange: OpenLayers.Function.True
        },
        this.layerOptions);
        this.layer = new OpenLayers.Layer.Vector(this.CLASS_NAME, a);
        this.map.addLayer(this.layer);
        return true
    },
    createFeature: function(a) {
				debugger;
        a = this.map.getLonLatFromPixel(a);
        a = new OpenLayers.Geometry.Point(a.lon, a.lat);
        this.point = new OpenLayers.Feature.Vector(a);
        this.callback("create", [this.point.geometry, this.point]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.point], 
        {
            silent: true
        })
    },
    deactivate: function() {
        if (!OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) return false;
        this.cancel();
        if (this.layer.map != null) {
            this.destroyFeature(true);
            this.layer.destroy(false)
        }
        this.layer = null;
        this.touch = false;
        return true
    },
    destroyFeature: function(a) {
        if (this.layer && (a || !this.persist)) this.layer.destroyFeatures();
        this.point = null
    },
    destroyPersistedFeature: function() {
        var a = this.layer;
        a && a.features.length > 1 && this.layer.features[0].destroy()
    },
    finalize: function(a) {
        this.mouseDown = 
        false;
        this.lastTouchPx = this.lastUp = this.lastDown = null;
        this.callback(a ? "cancel": "done", [this.geometryClone()]);
        this.destroyFeature(a)
    },
    cancel: function() {
        this.finalize(true)
    },
    click: function(a) {
        OpenLayers.Event.stop(a);
        return false
    },
    dblclick: function(a) {
        OpenLayers.Event.stop(a);
        return false
    },
    modifyFeature: function(a) {
        this.point || this.createFeature(a);
        a = this.map.getLonLatFromPixel(a);
        this.point.geometry.x = a.lon;
        this.point.geometry.y = a.lat;
        this.callback("modify", [this.point.geometry, this.point, false]);
        this.point.geometry.clearBounds();
        this.drawFeature()
    },
    drawFeature: function() {
        this.layer.drawFeature(this.point, this.style)
    },
    getGeometry: function() {
        var a = this.point && this.point.geometry;
        if (a && this.multi) a = new OpenLayers.Geometry.MultiPoint([a]);
        return a
    },
    geometryClone: function() {
        var a = this.getGeometry();
        return a && a.clone()
    },
    mousedown: function(a) {
        return this.down(a)
    },
    touchstart: function(a) {
        if (!this.touch) {
            this.touch = true;
            this.map.events.un({
                mousedown: this.mousedown,
                mouseup: this.mouseup,
                mousemove: this.mousemove,
                click: this.click,
                dblclick: this.dblclick,
                scope: this
            })
        }
        this.lastTouchPx = a.xy;
        return this.down(a)
    },
    mousemove: function(a) {
        return this.move(a)
    },
    touchmove: function(a) {
        this.lastTouchPx = a.xy;
        return this.move(a)
    },
    mouseup: function(a) {
        return this.up(a)
    },
    touchend: function(a) {
        a.xy = this.lastTouchPx;
        return this.up(a)
    },
    down: function(a) {
        this.mouseDown = true;
        this.lastDown = a.xy;
        this.touch || this.modifyFeature(a.xy);
        this.stoppedDown = this.stopDown;
        return ! this.stopDown
    },
    move: function(a) {
        if (!this.touch && (!this.mouseDown || 
        this.stoppedDown)) this.modifyFeature(a.xy);
        return true
    },
    up: function(a) {
        this.mouseDown = false;
        this.stoppedDown = this.stopDown;
        if (!this.checkModifiers(a)) return true;
        if (this.lastUp && this.lastUp.equals(a.xy)) return true;
        if (this.lastDown && this.passesTolerance(this.lastDown, a.xy, this.pixelTolerance)) {
            this.touch && this.modifyFeature(a.xy);
            this.persist && this.destroyPersistedFeature();
            this.lastUp = a.xy;
            this.finalize();
            return ! this.stopUp
        } else return true
    },
    mouseout: function(a) {
        if (OpenLayers.Util.mouseLeft(a, this.map.eventsDiv)) {
            this.stoppedDown = 
            this.stopDown;
            this.mouseDown = false
        }
    },
    passesTolerance: function(a, b, c) {
        var d = true;
        if (c != null && a && b) if (a.distanceTo(b) > c) d = false;
        return d
    },
    CLASS_NAME: "OpenLayers.Handler.Point"
});
OpenLayers.Handler.Path = OpenLayers.Class(OpenLayers.Handler.Point, {
    line: null,
    maxVertices: null,
    doubleTouchTolerance: 20,
    freehand: false,
    freehandToggle: "shiftKey",
    timerId: null,
    redoStack: null,
    initialize: function() {
	////////////////////////////////////////////////////
	/*var tmpmap=document.getElementById("map");
	tmpmap.style.height="90%";
	var container = document.getElementById("panel");
	container.style.display="block";*/
        OpenLayers.Handler.Point.prototype.initialize.apply(this, arguments)
    },
    createFeature: function(a) {
        a = this.map.getLonLatFromPixel(a);
        a = new OpenLayers.Geometry.Point(a.lon, a.lat);
        this.point = new OpenLayers.Feature.Vector(a);
        this.line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([this.point.geometry]));
        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.line, this.point], {
            silent: true
        })
    },
    destroyFeature: function(a) {
        OpenLayers.Handler.Point.prototype.destroyFeature.call(this, a);
        this.line = null
    },
    destroyPersistedFeature: function() {
        var a = this.layer;
        a && a.features.length > 2 && this.layer.features[0].destroy()
    },
    removePoint: function() {
        this.point && this.layer.removeFeatures([this.point])
    },
    addPoint: function(a) {
        this.layer.removeFeatures([this.point]);
        a = this.control.map.getLonLatFromPixel(a);
        this.point = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(a.lon, a.lat));
        this.line.geometry.addComponent(this.point.geometry, this.line.geometry.components.length);
        this.layer.addFeatures([this.point]);
        this.callback("point", [this.point.geometry, this.getGeometry()]);
        this.callback("modify", [this.point.geometry, this.getSketch()]);
        this.drawFeature();
        delete this.redoStack
    },
    insertXY: function(a, b) {
        this.line.geometry.addComponent(new OpenLayers.Geometry.Point(a, 
        b), this.getCurrentPointIndex());
        this.drawFeature();
        delete this.redoStack
    },
    insertDeltaXY: function(a, b) {
        var c = this.line.geometry.components[this.getCurrentPointIndex() - 1];
        c && !isNaN(c.x) && !isNaN(c.y) && this.insertXY(c.x + a, c.y + b)
    },
    insertDirectionLength: function(a, b) {
        a *= Math.PI / 180;
        this.insertDeltaXY(b * Math.cos(a), b * Math.sin(a))
    },
    insertDeflectionLength: function(a, b) {
        var c = this.getCurrentPointIndex() - 1;
        if (c > 0) {
            var d = this.line.geometry.components[c];
            c = this.line.geometry.components[c - 1];
            this.insertDirectionLength(Math.atan2(d.y - 
            c.y, d.x - c.x) * 180 / Math.PI + a, b)
        }
    },
    getCurrentPointIndex: function() {
        return this.line.geometry.components.length - 1
    },
    undo: function() {
        var a = this.line.geometry,
        b = a.components,
        c = this.getCurrentPointIndex() - 1;
        b = b[c];
        if (a = a.removeComponent(b)) {
            if (!this.redoStack) this.redoStack = [];
            this.redoStack.push(b);
            this.drawFeature()
        }
        return a
    },
    redo: function() {
        var a = this.redoStack && this.redoStack.pop();
        if (a) {
            this.line.geometry.addComponent(a, this.getCurrentPointIndex());
            this.drawFeature()
        }
        return !! a
    },
    freehandMode: function(a) {
        return this.freehandToggle && 
        a[this.freehandToggle] ? !this.freehand: this.freehand
    },
    modifyFeature: function(a, b) {
        this.line || this.createFeature(a);
        var c = this.control.map.getLonLatFromPixel(a);
        this.point.geometry.x = c.lon;
        this.point.geometry.y = c.lat;
        this.callback("modify", [this.point.geometry, this.getSketch(), b]);
        this.point.geometry.clearBounds();
        this.drawFeature()
    },
    drawFeature: function() {
        this.layer.drawFeature(this.line, this.style);
        this.layer.drawFeature(this.point, this.style)
    },
    getSketch: function() {
        return this.line
    },
    getGeometry: function() {
        var a = 
        this.line && this.line.geometry;
        if (a && this.multi) a = new OpenLayers.Geometry.MultiLineString([a]);
        return a
    },
    
     touchstart: function(a) {
        if (this.timerId && this.passesTolerance(this.lastTouchPx, a.xy, this.doubleTouchTolerance)) {
            this.finishGeometry();
            window.clearTimeout(this.timerId);
            this.timerId = null;
            return false
        } else {
            if (this.timerId) {
                window.clearTimeout(this.timerId);
                this.timerId = null
            }
            this.timerId = window.setTimeout(OpenLayers.Function.bind(function() {
                this.timerId = null
            },
            this), 300);
            return OpenLayers.Handler.Point.prototype.touchstart.call(this, 
            a)
        }
    },
    down: function(a) {
        var b = this.stopDown;
        if (this.freehandMode(a)) b = true;
        if (!this.touch && (!this.lastDown || !this.passesTolerance(this.lastDown, a.xy, this.pixelTolerance))) this.modifyFeature(a.xy, !!this.lastUp);
        this.mouseDown = true;
        this.lastDown = a.xy;
        this.stoppedDown = b;
        return ! b
    },
    move: function(a) {
        if (this.stoppedDown && this.freehandMode(a)) {
            this.persist && this.destroyPersistedFeature();
            this.addPoint(a.xy);
            return false
        }
        if (!this.touch && (!this.mouseDown || this.stoppedDown)) this.modifyFeature(a.xy, !!this.lastUp);
        return true
    },
    up: function(a) {
        if (this.mouseDown && (!this.lastUp || !this.lastUp.equals(a.xy))) if (this.stoppedDown && this.freehandMode(a)) {
            this.persist && this.destroyPersistedFeature();
            this.removePoint();
            this.finalize()
        } else if (this.passesTolerance(this.lastDown, a.xy, this.pixelTolerance)) {
            this.touch && this.modifyFeature(a.xy);
            this.lastUp == null && this.persist && this.destroyPersistedFeature();
            this.addPoint(a.xy);
            this.lastUp = a.xy;
            this.line.geometry.components.length === this.maxVertices + 1 && this.finishGeometry()
        }
        this.stoppedDown = 
        this.stopDown;
        this.mouseDown = false;
        return ! this.stopUp
    },
    
   
    finishGeometry: function() {
        this.line.geometry.removeComponent(this.line.geometry.components[this.line.geometry.components.length - 1]);
        this.removePoint();
        this.finalize()
    },
    dblclick: function(a) {
        this.freehandMode(a) || this.finishGeometry();
        return false
    },
    CLASS_NAME: "OpenLayers.Handler.Path"
});
OpenLayers.Geometry.Polygon = OpenLayers.Class(OpenLayers.Geometry.Collection, {
    componentTypes: ["OpenLayers.Geometry.LinearRing"],
    initialize: function() {
        OpenLayers.Geometry.Collection.prototype.initialize.apply(this, arguments)
    },
    getArea: function() {
        var a = 0;
        if (this.components && this.components.length > 0) {
            a += Math.abs(this.components[0].getArea());
            for (var b = 1, c = this.components.length; b < c; b++) a -= Math.abs(this.components[b].getArea())
        }
        return a
    },
    getGeodesicArea: function(a) {
        var b = 0;
        if (this.components && this.components.length > 
        0) {
            b += Math.abs(this.components[0].getGeodesicArea(a));
            for (var c = 1, d = this.components.length; c < d; c++) b -= Math.abs(this.components[c].getGeodesicArea(a))
        }
        return b
    },
    containsPoint: function(a) {
        var b = this.components.length,
        c = false;
        if (b > 0) {
            c = this.components[0].containsPoint(a);
            if (c !== 1) if (c && b > 1) for (var d, e = 1; e < b; ++e) if (d = this.components[e].containsPoint(a)) {
                c = d === 1 ? 1: false;
                break
            }
        }
        return c
    },
    intersects: function(a) {
        var b = false,
        c,
        d;
        if (a.CLASS_NAME == "OpenLayers.Geometry.Point") b = this.containsPoint(a);
        else if (a.CLASS_NAME == 
        "OpenLayers.Geometry.LineString" || a.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            c = 0;
            for (d = this.components.length; c < d; ++c) if (b = a.intersects(this.components[c])) break;
            if (!b) {
                c = 0;
                for (d = a.components.length; c < d; ++c) if (b = this.containsPoint(a.components[c])) break
            }
        } else {
            c = 0;
            for (d = a.components.length; c < d; ++c) if (b = this.intersects(a.components[c])) break
        }
        if (!b && a.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
            var e = this.components[0];
            c = 0;
            for (d = e.components.length; c < d; ++c) if (b = a.containsPoint(e.components[c])) break
        }
        return b
    },
    distanceTo: function(a, b) {
        return b && b.edge === false && this.intersects(a) ? 0: OpenLayers.Geometry.Collection.prototype.distanceTo.apply(this, [a, b])
    },
    CLASS_NAME: "OpenLayers.Geometry.Polygon"
});
OpenLayers.Geometry.Polygon.createRegularPolygon = function(a, b, c, d) {
    var e = Math.PI * (1 / c - 0.5);
    if (d) e += d / 180 * Math.PI;
    for (var f, g = [], h = 0; h < c; ++h) {
        f = e + h * 2 * Math.PI / c;
        d = a.x + b * Math.cos(f);
        f = a.y + b * Math.sin(f);
        g.push(new OpenLayers.Geometry.Point(d, f))
    }
    a = new OpenLayers.Geometry.LinearRing(g);
    return new OpenLayers.Geometry.Polygon([a])
};
OpenLayers.Handler.Polygon = OpenLayers.Class(OpenLayers.Handler.Path, {
    holeModifier: null,
    drawingHole: false,
    polygon: null,
    initialize: function() {
debugger
        OpenLayers.Handler.Path.prototype.initialize.apply(this, arguments)
    },
    createFeature: function(a) {
        a = this.map.getLonLatFromPixel(a);
        a = new OpenLayers.Geometry.Point(a.lon, a.lat);
        this.point = new OpenLayers.Feature.Vector(a);
        this.line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LinearRing([this.point.geometry]));
        this.polygon = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([this.line.geometry]));
        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.polygon, this.point], {
            silent: true
        })
    },
    addPoint: function() {
        if (!this.drawingHole && this.holeModifier && this.evt && this.evt[this.holeModifier]) for (var a = this.point.geometry, b = this.control.layer.features, c, d = b.length - 1; d >= 0; --d) {
            c = b[d].geometry;
            if ((c instanceof OpenLayers.Geometry.Polygon || c instanceof OpenLayers.Geometry.MultiPolygon) && c.intersects(a)) {
                a = b[d];
                this.control.layer.removeFeatures([a], 
                {
                    silent: true
                });
                this.control.layer.events.registerPriority("sketchcomplete", this, this.finalizeInteriorRing);
                this.control.layer.events.registerPriority("sketchmodified", this, this.enforceTopology);
                a.geometry.addComponent(this.line.geometry);
                this.polygon = a;
                this.drawingHole = true;
                break
            }
        }
        OpenLayers.Handler.Path.prototype.addPoint.apply(this, arguments)
    },
    getCurrentPointIndex: function() {
        return this.line.geometry.components.length - 2
    },
    enforceTopology: function(a) {
        a = a.vertex;
        var b = this.line.geometry.components;
        if (!this.polygon.geometry.intersects(a)) {
            b = b[b.length - 3];
            a.x = b.x;
            a.y = b.y
        }
    },
    finishGeometry: function() {
        this.line.geometry.removeComponent(this.line.geometry.components[this.line.geometry.components.length - 2]);
        this.removePoint();
        this.finalize()
    },
    finalizeInteriorRing: function() {
        var a = this.line.geometry,
        b = a.getArea() !== 0;
        if (b) {
            for (var c = this.polygon.geometry.components, d = c.length - 2; d >= 0; --d) if (a.intersects(c[d])) {
                b = false;
                break
            }
            if (b) {
                d = c.length - 2;
                a: for (; d > 0; --d) for (var e = c[d].components, f = 0, g = e.length; f < 
                g; ++f) if (a.containsPoint(e[f])) {
                    b = false;
                    break a
                }
            }
        }
        if (b) {
            if (this.polygon.state !== OpenLayers.State.INSERT) this.polygon.state = OpenLayers.State.UPDATE
        } else this.polygon.geometry.removeComponent(a);
        this.restoreFeature();
        return false
    },
    cancel: function() {
        if (this.drawingHole) {
            this.polygon.geometry.removeComponent(this.line.geometry);
            this.restoreFeature(true)
        }
        return OpenLayers.Handler.Path.prototype.cancel.apply(this, arguments)
    },
    restoreFeature: function(a) {
        this.control.layer.events.unregister("sketchcomplete", 
        this, this.finalizeInteriorRing);
        this.control.layer.events.unregister("sketchmodified", this, this.enforceTopology);
        this.layer.removeFeatures([this.polygon], {
            silent: true
        });
        this.control.layer.addFeatures([this.polygon], {
            silent: true
        });
        this.drawingHole = false;
        a || this.control.layer.events.triggerEvent("sketchcomplete", {
            feature: this.polygon
        })
    },
    destroyFeature: function(a) {
        OpenLayers.Handler.Path.prototype.destroyFeature.call(this, a);
        this.polygon = null
    },
    drawFeature: function() {
        this.layer.drawFeature(this.polygon, 
        this.style);
        this.layer.drawFeature(this.point, this.style)
    },
    getSketch: function() {
        return this.polygon
    },
    getGeometry: function() {
        var a = this.polygon && this.polygon.geometry;
        if (a && this.multi) a = new OpenLayers.Geometry.MultiPolygon([a]);
        return a
    },
    createPoint: function(a,b) {
        a = new OpenLayers.Geometry.Point(a, b);
        this.point = new OpenLayers.Feature.Vector(a);
        this.line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LinearRing([this.point.geometry]));
        this.polygon = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([this.line.geometry]));
        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.polygon, this.point], {
            silent: true
        })
    },
    drawLocation: function(a,b){
    	this.line || this.createPoint(a,b);
        this.point.geometry.x = a;
        this.point.geometry.y = b;
        this.callback("modify", [this.point.geometry, this.getSketch(), false]);
        this.point.geometry.clearBounds();
    	this.point.geometry.x=a;
    	this.point.geometry.y=b;
    	this.layer.drawFeature(this.polygon,this.style);
    	this.layer.drawFeature(this.point, this.style)
    },
    CLASS_NAME: "OpenLayers.Handler.Polygon"
});
OpenLayers.Renderer = OpenLayers.Class({
    container: null,
    root: null,
    extent: null,
    locked: false,
    size: null,
    resolution: null,
    map: null,
    initialize: function(a, b) {
        this.container = OpenLayers.Util.getElement(a);
        OpenLayers.Util.extend(this, b)
    },
    destroy: function() {
        this.map = this.resolution = this.size = this.extent = this.container = null
    },
    supported: function() {
        return false
    },
    setExtent: function(a, b) {
        this.extent = a.clone();
        if (b) this.resolution = null
    },
    setSize: function(a) {
        this.size = a.clone();
        this.resolution = null
    },
    getResolution: function() {
        return this.resolution = 
        this.resolution || this.map.getResolution()
    },
    drawFeature: function(a, b) {
        if (b == null) b = a.style;
        if (a.geometry) {
            var c = a.geometry.getBounds();
            if (c) {
                c.intersectsBounds(this.extent) || (b = {
                    display: "none"
                });
                c = this.drawGeometry(a.geometry, b, a.id);
                if (b.display != "none" && b.label && c !== false) {
                    var d = a.geometry.getCentroid();
                    if (b.labelXOffset || b.labelYOffset) {
                        var e = isNaN(b.labelXOffset) ? 0: b.labelXOffset,
                        f = isNaN(b.labelYOffset) ? 0: b.labelYOffset,
                        g = this.getResolution();
                        d.move(e * g, f * g)
                    }
                    this.drawText(a.id, b, d)
                } else this.removeText(a.id);
                return c
            }
        }
    },
    drawGeometry: function() {},
    drawText: function() {},
    removeText: function() {},
    clear: function() {},
    getFeatureIdFromEvent: function() {},
    eraseFeatures: function(a) {
        OpenLayers.Util.isArray(a) || (a = [a]);
        for (var b = 0, c = a.length; b < c; ++b) {
            var d = a[b];
            this.eraseGeometry(d.geometry, d.id);
            this.removeText(d.id)
        }
    },
    eraseGeometry: function() {},
    moveRoot: function() {},
    getRenderLayerId: function() {
        return this.container.id
    },
    applyDefaultSymbolizer: function(a) {
        var b = OpenLayers.Util.extend({},
        OpenLayers.Renderer.defaultSymbolizer);
        if (a.stroke === false) {
            delete b.strokeWidth;
            delete b.strokeColor
        }
        a.fill === false && delete b.fillColor;
        OpenLayers.Util.extend(b, a);
        return b
    },
    CLASS_NAME: "OpenLayers.Renderer"
});
OpenLayers.Renderer.defaultSymbolizer = {
    fillColor: "#000000",
    strokeColor: "#000000",
    strokeWidth: 2,
    fillOpacity: 1,
    strokeOpacity: 1,
    pointRadius: 0
};
OpenLayers.Renderer.Canvas = OpenLayers.Class(OpenLayers.Renderer, {
    hitDetection: true,
    hitOverflow: 0,
    canvas: null,
    features: null,
    pendingRedraw: false,
    initialize: function() {
        OpenLayers.Renderer.prototype.initialize.apply(this, arguments);
        this.root = document.createElement("canvas");
        this.container.appendChild(this.root);
        this.canvas = this.root.getContext("2d");
        this.features = {};
        if (this.hitDetection) {
            this.hitCanvas = document.createElement("canvas");
            this.hitContext = this.hitCanvas.getContext("2d")
        }
    },
    eraseGeometry: function(a, 
    b) {
        this.eraseFeatures(this.features[b][0])
    },
    supported: function() {
        return !! document.createElement("canvas").getContext
    },
    setSize: function(a) {
        this.size = a.clone();
        var b = this.root;
        b.style.width = a.w + "px";
        b.style.height = a.h + "px";
        b.width = a.w;
        b.height = a.h;
        this.resolution = null;
        if (this.hitDetection) {
            b = this.hitCanvas;
            b.style.width = a.w + "px";
            b.style.height = a.h + "px";
            b.width = a.w;
            b.height = a.h
        }
    },
    drawFeature: function(a, b) {
        var c;
        if (a.geometry) {
            b = this.applyDefaultSymbolizer(b || a.style);
            if (c = b.display !== "none" && a.geometry.getBounds().intersectsBounds(this.extent)) this.features[a.id] = 
            [a, b];
            else delete this.features[a.id];
            this.pendingRedraw = true
        }
        if (this.pendingRedraw && !this.locked) {
            this.redraw();
            this.pendingRedraw = false
        }
        return c
    },
    drawGeometry: function(a, b, c) {
        var d = a.CLASS_NAME;
        if (d == "OpenLayers.Geometry.Collection" || d == "OpenLayers.Geometry.MultiPoint" || d == "OpenLayers.Geometry.MultiLineString" || d == "OpenLayers.Geometry.MultiPolygon") for (d = 0; d < a.components.length; d++) this.drawGeometry(a.components[d], b, c);
        else switch (a.CLASS_NAME) {
        case "OpenLayers.Geometry.Point":
            this.drawPoint(a, 
            b, c);
            break;
        case "OpenLayers.Geometry.LineString":
            this.drawLineString(a, b, c);
            break;
        case "OpenLayers.Geometry.LinearRing":
            this.drawLinearRing(a, b, c);
            break;
        case "OpenLayers.Geometry.Polygon":
            this.drawPolygon(a, b, c)
        }
    },
    drawExternalGraphic: function(a, b, c) {
        var d = new Image;
        if (b.graphicTitle) d.title = b.graphicTitle;
        var e = b.graphicWidth || b.graphicHeight,
        f = b.graphicHeight || b.graphicWidth;
        e = e ? e: b.pointRadius * 2;
        f = f ? f: b.pointRadius * 2;
        var g = b.graphicXOffset != undefined ? b.graphicXOffset: -(0.5 * e),
        h = b.graphicYOffset != 
        undefined ? b.graphicYOffset: -(0.5 * f),
        i = b.graphicOpacity || b.fillOpacity;
        d.onload = OpenLayers.Function.bind(function() {
            if (this.features[c]) {
                var j = this.getLocalXY(a),
                k = j[0];
                j = j[1];
                if (!isNaN(k) && !isNaN(j)) {
                    k = k + g | 0;
                    j = j + h | 0;
                    var l = this.canvas;
                    l.globalAlpha = i;
                    var m = OpenLayers.Renderer.Canvas.drawImageScaleFactor || (OpenLayers.Renderer.Canvas.drawImageScaleFactor = /android 2.1/.test(navigator.userAgent.toLowerCase()) ? 320 / window.screen.width: 1);
                    l.drawImage(d, k * m, j * m, e * m, f * m);
                    if (this.hitDetection) {
                        this.setHitContextStyle("fill", 
                        c);
                        this.hitContext.fillRect(k, j, e, f)
                    }
                }
            }
        },
        this);
        d.src = b.externalGraphic
    },
    setCanvasStyle: function(a, b) {
        if (a === "fill") {
            this.canvas.globalAlpha = b.fillOpacity;
            this.canvas.fillStyle = b.fillColor
        } else if (a === "stroke") {
            this.canvas.globalAlpha = b.strokeOpacity;
            this.canvas.strokeStyle = b.strokeColor;
            this.canvas.lineWidth = b.strokeWidth
        } else {
            this.canvas.globalAlpha = 0;
            this.canvas.lineWidth = 1
        }
    },
    featureIdToHex: function(a) {
        a = Number(a.split("_").pop()) + 1;
        if (a >= 16777216) {
            this.hitOverflow = a - 16777215;
            a = a % 16777216 + 1
        }
        a = "000000" + 
        a.toString(16);
        var b = a.length;
        return a = "#" + a.substring(b - 6, b)
    },
    setHitContextStyle: function(a, b, c) {
        b = this.featureIdToHex(b);
        if (a == "fill") {
            this.hitContext.globalAlpha = 1;
            this.hitContext.fillStyle = b
        } else if (a == "stroke") {
            this.hitContext.globalAlpha = 1;
            this.hitContext.strokeStyle = b;
            this.hitContext.lineWidth = c.strokeWidth + 2
        } else {
            this.hitContext.globalAlpha = 0;
            this.hitContext.lineWidth = 1
        }
    },
    drawPoint: function(a, b, c) {
        if (b.graphic !== false) if (b.externalGraphic) this.drawExternalGraphic(a, b, c);
        else {
            var d = this.getLocalXY(a);
            a = d[0];
            d = d[1];
            if (!isNaN(a) && !isNaN(d)) {
                var e = Math.PI * 2,
                f = b.pointRadius;
                if (b.fill !== false) {
                    this.setCanvasStyle("fill", b);
                    this.canvas.beginPath();
                    this.canvas.arc(a, d, f, 0, e, true);
                    this.canvas.fill();
                    if (this.hitDetection) {
                        this.setHitContextStyle("fill", c, b);
                        this.hitContext.beginPath();
                        this.hitContext.arc(a, d, f, 0, e, true);
                        this.hitContext.fill()
                    }
                }
                if (b.stroke !== false) {
                    this.setCanvasStyle("stroke", b);
                    this.canvas.beginPath();
                    this.canvas.arc(a, d, f, 0, e, true);
                    this.canvas.stroke();
                    if (this.hitDetection) {
                        this.setHitContextStyle("stroke", 
                        c, b);
                        this.hitContext.beginPath();
                        this.hitContext.arc(a, d, f, 0, e, true);
                        this.hitContext.stroke()
                    }
                    this.setCanvasStyle("reset")
                }
            }
        }
    },
    drawLineString: function(a, b, c) {
        b = OpenLayers.Util.applyDefaults({
            fill: false
        },
        b);
        this.drawLinearRing(a, b, c)
    },
    drawLinearRing: function(a, b, c) {
        if (b.fill !== false) {
            this.setCanvasStyle("fill", b);
            this.renderPath(this.canvas, a, b, c, "fill");
            if (this.hitDetection) {
                this.setHitContextStyle("fill", c, b);
                this.renderPath(this.hitContext, a, b, c, "fill")
            }
        }
        if (b.stroke !== false) {
            this.setCanvasStyle("stroke", 
            b);
            this.renderPath(this.canvas, a, b, c, "stroke");
            if (this.hitDetection) {
                this.setHitContextStyle("stroke", c, b);
                this.renderPath(this.hitContext, a, b, c, "stroke")
            }
        }
        this.setCanvasStyle("reset")
    },
    renderPath: function(a, b, c, d, e) {
        b = b.components;
        c = b.length;
        a.beginPath();
        d = this.getLocalXY(b[0]);
        var f = d[1];
        if (!isNaN(d[0]) && !isNaN(f)) {
            a.moveTo(d[0], d[1]);
            for (d = 1; d < c; ++d) {
                f = this.getLocalXY(b[d]);
                a.lineTo(f[0], f[1])
            }
            e === "fill" ? a.fill() : a.stroke()
        }
    },
    drawPolygon: function(a, b, c) {
        a = a.components;
        var d = a.length;
        this.drawLinearRing(a[0], 
        b, c);
        for (var e = 1; e < d; ++e) {
            this.canvas.globalCompositeOperation = "destination-out";
            if (this.hitDetection) this.hitContext.globalCompositeOperation = "destination-out";
            this.drawLinearRing(a[e], OpenLayers.Util.applyDefaults({
                stroke: false,
                fillOpacity: 1
            },
            b), c);
            this.canvas.globalCompositeOperation = "source-over";
            if (this.hitDetection) this.hitContext.globalCompositeOperation = "source-over";
            this.drawLinearRing(a[e], OpenLayers.Util.applyDefaults({
                fill: false
            },
            b), c)
        }
    },
    drawText: function(a, b) {
        b = OpenLayers.Util.extend({
            fontColor: "#000000",
            labelAlign: "cm"
        },
        b);
        var c = this.getLocalXY(a);
        this.setCanvasStyle("reset");
        this.canvas.fillStyle = b.fontColor;
        this.canvas.globalAlpha = b.fontOpacity || 1;
        var d = [b.fontStyle ? b.fontStyle: "normal", "normal", b.fontWeight ? b.fontWeight: "normal", b.fontSize ? b.fontSize: "1em", b.fontFamily ? b.fontFamily: "sans-serif"].join(" "),
        e = b.label.split("\n"),
        f = e.length;
        if (this.canvas.fillText) {
            this.canvas.font = d;
            this.canvas.textAlign = OpenLayers.Renderer.Canvas.LABEL_ALIGN[b.labelAlign[0]] || "center";
            this.canvas.textBaseline = 
            OpenLayers.Renderer.Canvas.LABEL_ALIGN[b.labelAlign[1]] || "middle";
            var g = OpenLayers.Renderer.Canvas.LABEL_FACTOR[b.labelAlign[1]];
            if (g == null) g = -0.5;
            d = this.canvas.measureText("Mg").height || this.canvas.measureText("xx").width;
            c[1] += d * g * (f - 1);
            for (g = 0; g < f; g++) this.canvas.fillText(e[g], c[0], c[1] + d * g)
        } else if (this.canvas.mozDrawText) {
            this.canvas.mozTextStyle = d;
            var h = OpenLayers.Renderer.Canvas.LABEL_FACTOR[b.labelAlign[0]];
            if (h == null) h = -0.5;
            g = OpenLayers.Renderer.Canvas.LABEL_FACTOR[b.labelAlign[1]];
            if (g == 
            null) g = -0.5;
            d = this.canvas.mozMeasureText("xx");
            c[1] += d * (1 + g * f);
            for (g = 0; g < f; g++) {
                var i = c[0] + h * this.canvas.mozMeasureText(e[g]),
                j = c[1] + g * d;
                this.canvas.translate(i, j);
                this.canvas.mozDrawText(e[g]);
                this.canvas.translate( - i, -j)
            }
        }
        this.setCanvasStyle("reset")
    },
    getLocalXY: function(a) {
        var b = this.getResolution(),
        c = this.extent;
        return [a.x / b + -c.left / b, c.top / b - a.y / b]
    },
    clear: function() {
        var a = this.root.height,
        b = this.root.width;
        this.canvas.clearRect(0, 0, b, a);
        this.features = {};
        this.hitDetection && this.hitContext.clearRect(0, 
        0, b, a)
    },
    getFeatureIdFromEvent: function(a) {
        var b = null;
        if (this.hitDetection) if (!this.map.dragging) {
            a = a.xy;
            a = this.hitContext.getImageData(a.x | 0, a.y | 0, 1, 1).data;
            if (a[3] === 255) if (a = a[2] + 256 * (a[1] + 256 * a[0])) b = this.features["OpenLayers.Feature.Vector_" + (a - 1 + this.hitOverflow)][0]
        }
        return b
    },
    eraseFeatures: function(a) {
        OpenLayers.Util.isArray(a) || (a = [a]);
        for (var b = 0; b < a.length; ++b) delete this.features[a[b].id];
        this.redraw()
    },
    redraw: function() {
        if (!this.locked) {
            var a = this.root.height,
            b = this.root.width;
            this.canvas.clearRect(0, 
            0, b, a);
            this.hitDetection && this.hitContext.clearRect(0, 0, b, a);
            a = [];
            var c,
            d;
            for (d in this.features) if (this.features.hasOwnProperty(d)) {
                b = this.features[d][0];
                c = this.features[d][1];
                this.drawGeometry(b.geometry, c, b.id);
                c.label && a.push([b, c])
            }
            b = 0;
            for (c = a.length; b < c; ++b) {
                d = a[b];
                this.drawText(d[0].geometry.getCentroid(), d[1])
            }
        }
    },
    CLASS_NAME: "OpenLayers.Renderer.Canvas"
});
OpenLayers.Renderer.Canvas.LABEL_ALIGN = {
    l: "left",
    r: "right",
    t: "top",
    b: "bottom"
};
OpenLayers.Renderer.Canvas.LABEL_FACTOR = {
    l: 0,
    r: -1,
    t: 0,
    b: -1
};
OpenLayers.Renderer.Canvas.drawImageScaleFactor = null;
OpenLayers.Handler.Drag = OpenLayers.Class(OpenLayers.Handler, {
    started: false,
    stopDown: true,
    dragging: false,
    touch: false,
    last: null,
    start: null,
    lastMoveEvt: null,
    oldOnselectstart: null,
    interval: 0,
    timeoutId: null,
    documentDrag: false,
    documentEvents: null,
    initialize: function() {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        if (this.documentDrag === true) {
            var a = this;
            this._docMove = function(b) {
                a.mousemove({
                    xy: {
                        x: b.clientX,
                        y: b.clientY
                    },
                    element: document
                })
            };
            this._docUp = function(b) {
                a.mouseup({
                    xy: {
                        x: b.clientX,
                        y: b.clientY
                    }
                })
            }
        }
    },
    dragstart: function(a) {
        var b = true;
        this.dragging = false;
        if (this.checkModifiers(a) && (OpenLayers.Event.isLeftClick(a) || OpenLayers.Event.isSingleTouch(a))) {
            this.started = true;
            this.last = this.start = a.xy;
            OpenLayers.Element.addClass(this.map.viewPortDiv, "olDragDown");
            this.down(a);
            this.callback("down", [a.xy]);
            OpenLayers.Event.stop(a);
            if (!this.oldOnselectstart) this.oldOnselectstart = document.onselectstart ? document.onselectstart: OpenLayers.Function.True;
            document.onselectstart = OpenLayers.Function.False;
            b = !this.stopDown
        } else {
            this.started = false;
            this.last = this.start = null
        }
        return b
    },
    dragmove: function(a) {
        this.lastMoveEvt = a;
        if (this.started && !this.timeoutId && (a.xy.x != this.last.x || a.xy.y != this.last.y)) {
            if (this.documentDrag === true && this.documentEvents) if (a.element === document) {
                this.adjustXY(a);
                this.setEvent(a)
            } else this.removeDocumentEvents();
            if (this.interval > 0) this.timeoutId = setTimeout(OpenLayers.Function.bind(this.removeTimeout, this), this.interval);
            this.dragging = true;
            this.move(a);
            this.callback("move", [a.xy]);
            if (!this.oldOnselectstart) {
                this.oldOnselectstart = document.onselectstart;
                document.onselectstart = OpenLayers.Function.False
            }
            this.last = a.xy
        }
        return true
    },
    dragend: function(a) {
        if (this.started) {
            if (this.documentDrag === true && this.documentEvents) {
                this.adjustXY(a);
                this.removeDocumentEvents()
            }
            var b = this.start != this.last;
            this.dragging = this.started = false;
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olDragDown");
            this.up(a);
            this.callback("up", [a.xy]);
            b && this.callback("done", [a.xy]);
            document.onselectstart = 
            this.oldOnselectstart
        }
        return true
    },
    down: function() {},
    move: function() {},
    up: function() {},
    out: function() {},
    mousedown: function(a) {
        return this.dragstart(a)
    },
    touchstart: function(a) {
        if (!this.touch) {
            this.touch = true;
            this.map.events.un({
                mousedown: this.mousedown,
                mouseup: this.mouseup,
                mousemove: this.mousemove,
                click: this.click,
                scope: this
            })
        }
        return this.dragstart(a)
    },
    mousemove: function(a) {
        return this.dragmove(a)
    },
    touchmove: function(a) {
        return this.dragmove(a)
    },
    removeTimeout: function() {
        this.timeoutId = null;
        this.dragging && 
        this.mousemove(this.lastMoveEvt)
    },
    mouseup: function(a) {
        return this.dragend(a)
    },
    touchend: function(a) {
        a.xy = this.last;
        return this.dragend(a)
    },
    mouseout: function(a) {
        if (this.started && OpenLayers.Util.mouseLeft(a, this.map.eventsDiv)) if (this.documentDrag === true) this.addDocumentEvents();
        else {
            var b = this.start != this.last;
            this.dragging = this.started = false;
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olDragDown");
            this.out(a);
            this.callback("out", []);
            b && this.callback("done", [a.xy]);
            if (document.onselectstart) document.onselectstart = 
            this.oldOnselectstart
        }
        return true
    },
    click: function() {
        return this.start == this.last
    },
    activate: function() {
        var a = false;
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragging = false;
            a = true
        }
        return a
    },
    deactivate: function() {
        var a = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.dragging = this.started = this.touch = false;
            this.last = this.start = null;
            a = true;
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olDragDown")
        }
        return a
    },
    adjustXY: function(a) {
        var b = OpenLayers.Util.pagePosition(this.map.viewPortDiv);
        a.xy.x -= b[0];
        a.xy.y -= b[1]
    },
    addDocumentEvents: function() {
        OpenLayers.Element.addClass(document.body, "olDragDown");
        this.documentEvents = true;
        OpenLayers.Event.observe(document, "mousemove", this._docMove);
        OpenLayers.Event.observe(document, "mouseup", this._docUp)
    },
    removeDocumentEvents: function() {
        OpenLayers.Element.removeClass(document.body, "olDragDown");
        this.documentEvents = false;
        OpenLayers.Event.stopObserving(document, "mousemove", this._docMove);
        OpenLayers.Event.stopObserving(document, "mouseup", this._docUp)
    },
    CLASS_NAME: "OpenLayers.Handler.Drag"
});
OpenLayers.Handler.Feature = OpenLayers.Class(OpenLayers.Handler, {
    EVENTMAP: {
        click: {
            "in": "click",
            out: "clickout"
        },
        mousemove: {
            "in": "over",
            out: "out"
        },
        dblclick: {
            "in": "dblclick",
            out: null
        },
        mousedown: {
            "in": null,
            out: null
        },
        mouseup: {
            "in": null,
            out: null
        },
        touchstart: {
            "in": "click",
            out: "clickout"
        }
    },
    feature: null,
    lastFeature: null,
    down: null,
    up: null,
    touch: false,
    clickTolerance: 4,
    geometryTypes: null,
    stopClick: true,
    stopDown: true,
    stopUp: false,
    initialize: function(a, b, c, d) {
        OpenLayers.Handler.prototype.initialize.apply(this, [a, 
        c, d]);
        this.layer = b
    },
    touchstart: function(a) {
        if (!this.touch) {
            this.touch = true;
            this.map.events.un({
                mousedown: this.mousedown,
                mouseup: this.mouseup,
                mousemove: this.mousemove,
                click: this.click,
                dblclick: this.dblclick,
                scope: this
            })
        }
        return OpenLayers.Event.isMultiTouch(a) ? true: this.mousedown(a)
    },
    touchmove: function(a) {
        OpenLayers.Event.stop(a)
    },
    mousedown: function(a) {
        this.down = a.xy;
        return this.handle(a) ? !this.stopDown: true
    },
    mouseup: function(a) {
        this.up = a.xy;
        return this.handle(a) ? !this.stopUp: true
    },
    click: function(a) {
        return this.handle(a) ? 
        !this.stopClick: true
    },
    mousemove: function(a) {
        if (!this.callbacks.over && !this.callbacks.out) return true;
        this.handle(a);
        return true
    },
    dblclick: function(a) {
        return ! this.handle(a)
    },
    geometryTypeMatches: function(a) {
        return this.geometryTypes == null || OpenLayers.Util.indexOf(this.geometryTypes, a.geometry.CLASS_NAME) > -1
    },
    handle: function(a) {
        if (this.feature && !this.feature.layer) this.feature = null;
        var b = a.type,
        c = false,
        d = !!this.feature,
        e = b == "click" || b == "dblclick" || b == "touchstart";
        if ((this.feature = this.layer.getFeatureFromEvent(a)) && 
        !this.feature.layer) this.feature = null;
        if (this.lastFeature && !this.lastFeature.layer) this.lastFeature = null;
        if (this.feature) {
            b === "touchstart" && OpenLayers.Event.stop(a);
            a = this.feature != this.lastFeature;
            if (this.geometryTypeMatches(this.feature)) {
                if (d && a) {
                    this.lastFeature && this.triggerCallback(b, "out", [this.lastFeature]);
                    this.triggerCallback(b, "in", [this.feature])
                } else if (!d || e) this.triggerCallback(b, "in", [this.feature]);
                this.lastFeature = this.feature;
                c = true
            } else {
                if (this.lastFeature && (d && a || e)) this.triggerCallback(b, 
                "out", [this.lastFeature]);
                this.feature = null
            }
        } else if (this.lastFeature && (d || e)) this.triggerCallback(b, "out", [this.lastFeature]);
        return c
    },
    triggerCallback: function(a, b, c) {
        if (b = this.EVENTMAP[a][b]) if (a == "click" && this.up && this.down) Math.sqrt(Math.pow(this.up.x - this.down.x, 2) + Math.pow(this.up.y - this.down.y, 2)) <= this.clickTolerance && this.callback(b, c);
        else this.callback(b, c)
    },
    activate: function() {
        var a = false;
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.moveLayerToTop();
            this.map.events.on({
                removelayer: this.handleMapEvents,
                changelayer: this.handleMapEvents,
                scope: this
            });
            a = true
        }
        return a
    },
    deactivate: function() {
        var a = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.moveLayerBack();
            this.up = this.down = this.lastFeature = this.feature = null;
            this.touch = false;
            this.map.events.un({
                removelayer: this.handleMapEvents,
                changelayer: this.handleMapEvents,
                scope: this
            });
            a = true
        }
        return a
    },
    handleMapEvents: function(a) {
        if (a.type == "removelayer" || a.property == "order") this.moveLayerToTop()
    },
    moveLayerToTop: function() {
        this.layer.setZIndex(Math.max(this.map.Z_INDEX_BASE.Feature - 
        1, this.layer.getZIndex()) + 1)
    },
    moveLayerBack: function() {
        var a = this.layer.getZIndex() - 1;
        a >= this.map.Z_INDEX_BASE.Feature ? this.layer.setZIndex(a) : this.map.setLayerZIndex(this.layer, this.map.getLayerIndex(this.layer))
    },
    CLASS_NAME: "OpenLayers.Handler.Feature"
});
OpenLayers.Control.DragFeature = OpenLayers.Class(OpenLayers.Control, {
    geometryTypes: null,
    onStart: function() {},
    onDrag: function() {},
    onComplete: function() {},
    onEnter: function() {},
    onLeave: function() {},
    documentDrag: false,
    layer: null,
    feature: null,
    dragCallbacks: {},
    featureCallbacks: {},
    lastPixel: null,
    initialize: function(a, b) {
        OpenLayers.Control.prototype.initialize.apply(this, [b]);
        this.layer = a;
        this.handlers = {
            drag: new OpenLayers.Handler.Drag(this, OpenLayers.Util.extend({
                down: this.downFeature,
                move: this.moveFeature,
                up: this.upFeature,
                out: this.cancel,
                done: this.doneDragging
            },
            this.dragCallbacks), {
                documentDrag: this.documentDrag
            }),
            feature: new OpenLayers.Handler.Feature(this, this.layer, OpenLayers.Util.extend({
                click: this.clickFeature,
                clickout: this.clickoutFeature,
                over: this.overFeature,
                out: this.outFeature
            },
            this.featureCallbacks), {
                geometryTypes: this.geometryTypes
            })
        }
    },
    clickFeature: function(a) {
        if (!this.over && this.overFeature(a)) {
            this.handlers.drag.dragstart(this.handlers.feature.evt);
            this.handlers.drag.stopDown = false
        }
    },
    clickoutFeature: function(a) {
        if (this.over) {
            this.outFeature(a);
            this.handlers.drag.stopDown = true
        }
    },
    destroy: function() {
        this.layer = null;
        OpenLayers.Control.prototype.destroy.apply(this, [])
    },
    activate: function() {
        return this.handlers.feature.activate() && OpenLayers.Control.prototype.activate.apply(this, arguments)
    },
    deactivate: function() {
        this.handlers.drag.deactivate();
        this.handlers.feature.deactivate();
        this.feature = null;
        this.dragging = false;
        this.lastPixel = null;
        OpenLayers.Element.removeClass(this.map.viewPortDiv, 
        this.displayClass + "Over");
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments)
    },
    overFeature: function(a) {
        var b = false;
        if (this.handlers.drag.dragging) this.over = this.feature.id == a.id ? true: false;
        else {
            this.feature = a;
            this.handlers.drag.activate();
            this.over = b = true;
            OpenLayers.Element.addClass(this.map.viewPortDiv, this.displayClass + "Over");
            this.onEnter(a)
        }
        return b
    },
    downFeature: function(a) {
        this.lastPixel = a;
        this.onStart(this.feature, a)
    },
    moveFeature: function(a) {
        var b = this.map.getResolution();
        this.feature.geometry.move(b * 
        (a.x - this.lastPixel.x), b * (this.lastPixel.y - a.y));
        this.layer.drawFeature(this.feature);
        this.lastPixel = a;
        this.onDrag(this.feature, a)
    },
    upFeature: function() {
        this.over || this.handlers.drag.deactivate()
    },
    doneDragging: function(a) {
        this.onComplete(this.feature, a)
    },
    outFeature: function(a) {
        if (this.handlers.drag.dragging) {
            if (this.feature.id == a.id) this.over = false
        } else {
            this.over = false;
            this.handlers.drag.deactivate();
            OpenLayers.Element.removeClass(this.map.viewPortDiv, this.displayClass + "Over");
            this.onLeave(a);
            this.feature = 
            null
        }
    },
    cancel: function() {
        this.handlers.drag.deactivate();
        this.over = false
    },
    setMap: function(a) {
        this.handlers.drag.setMap(a);
        this.handlers.feature.setMap(a);
        OpenLayers.Control.prototype.setMap.apply(this, arguments)
    },
    CLASS_NAME: "OpenLayers.Control.DragFeature"
});
OpenLayers.Tween = OpenLayers.Class({
    INTERVAL: 10,
    easing: null,
    begin: null,
    finish: null,
    duration: null,
    callbacks: null,
    time: null,
    interval: null,
    playing: false,
    initialize: function(a) {
        this.easing = a ? a: OpenLayers.Easing.Expo.easeOut
    },
    start: function(a, b, c, d) {
        this.playing = true;
        this.begin = a;
        this.finish = b;
        this.duration = c;
        this.callbacks = d.callbacks;
        this.time = 0;
        if (this.interval) {
            window.clearInterval(this.interval);
            this.interval = null
        }
        this.callbacks && this.callbacks.start && this.callbacks.start.call(this, this.begin);
        this.interval = 
        window.setInterval(OpenLayers.Function.bind(this.play, this), this.INTERVAL)
    },
    stop: function() {
        if (this.playing) {
            this.callbacks && this.callbacks.done && this.callbacks.done.call(this, this.finish);
            window.clearInterval(this.interval);
            this.interval = null;
            this.playing = false
        }
    },
    play: function() {
        var a = {},
        b;
        for (b in this.begin) {
            var c = this.begin[b],
            d = this.finish[b];
            if (c == null || d == null || isNaN(c) || isNaN(d)) OpenLayers.Console.error("invalid value for Tween");
            a[b] = this.easing.apply(this, [this.time, c, d - c, this.duration])
        }
        this.time++;
        this.callbacks && this.callbacks.eachStep && this.callbacks.eachStep.call(this, a);
        this.time > this.duration && this.stop()
    },
    CLASS_NAME: "OpenLayers.Tween"
});
OpenLayers.Easing = {
    CLASS_NAME: "OpenLayers.Easing"
};
OpenLayers.Easing.Linear = {
    easeIn: function(a, b, c, d) {
        return c * a / d + b
    },
    easeOut: function(a, b, c, d) {
        return c * a / d + b
    },
    easeInOut: function(a, b, c, d) {
        return c * a / d + b
    },
    CLASS_NAME: "OpenLayers.Easing.Linear"
};
OpenLayers.Easing.Expo = {
    easeIn: function(a, b, c, d) {
        return a == 0 ? b: c * Math.pow(2, 10 * (a / d - 1)) + b
    },
    easeOut: function(a, b, c, d) {
        return a == d ? b + c: c * ( - Math.pow(2, -10 * a / d) + 1) + b
    },
    easeInOut: function(a, b, c, d) {
        if (a == 0) return b;
        if (a == d) return b + c;
        if ((a /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (a - 1)) + b;
        return c / 2 * ( - Math.pow(2, -10 * --a) + 2) + b
    },
    CLASS_NAME: "OpenLayers.Easing.Expo"
};
OpenLayers.Easing.Quad = {
    easeIn: function(a, b, c, d) {
        return c * (a /= d) * a + b
    },
    easeOut: function(a, b, c, d) {
        return - c * (a /= d) * (a - 2) + b
    },
    easeInOut: function(a, b, c, d) {
        if ((a /= d / 2) < 1) return c / 2 * a * a + b;
        return - c / 2 * (--a * (a - 2) - 1) + b
    },
    CLASS_NAME: "OpenLayers.Easing.Quad"
};
OpenLayers.Map = OpenLayers.Class({
    Z_INDEX_BASE: {
        BaseLayer: 100,
        Overlay: 325,
        Feature: 725,
        Popup: 750,
        Control: 1E3
    },
    EVENT_TYPES: ["preaddlayer", "addlayer", "preremovelayer", "removelayer", "changelayer", "movestart", "move", "moveend", "zoomend", "popupopen", "popupclose", "addmarker", "removemarker", "clearmarkers", "mouseover", "mouseout", "mousemove", "dragstart", "drag", "dragend", "changebaselayer","cellphoneup","cellphonedown","cellphonemove"],
    id: null,
    fractionalZoom: false,
    events: null,
    allOverlays: false,
    div: null,
    dragging: false,
    size: null,
    viewPortDiv: null,
    layerContainerOrigin: null,
    layerContainerDiv: null,
    layers: null,
    controls: null,
    popups: null,
    baseLayer: null,
    center: null,
    resolution: null,
    zoom: 0,
    panRatio: 1.5,
    viewRequestID: 0,
    tileSize: null,
    projection: "EPSG:4326",
    units: "degrees",
    resolutions: null,
    maxResolution: 1.40625,
    minResolution: null,
    maxScale: null,
    minScale: null,
    maxExtent: null,
    minExtent: null,
    restrictedExtent: null,
    numZoomLevels: 16,
    theme: null,
    displayProjection: null,
    fallThrough: true,
    panTween: null,
    eventListeners: null,
    panMethod: OpenLayers.Easing.Expo.easeOut,
    panDuration: 50,
    paddingForPopups: null,
    minPx: null,
    maxPx: null,
    initialize: function(a, b) {
        if (arguments.length === 1 && typeof a === "object") a = (b = a) && b.div;
        this.tileSize = new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH, OpenLayers.Map.TILE_HEIGHT);
        this.maxExtent = new OpenLayers.Bounds( - 180, -90, 180, 90);
        this.paddingForPopups = new OpenLayers.Bounds(15, 15, 15, 15);
        this.theme = OpenLayers._getScriptLocation() + "theme/default/style.css";
        OpenLayers.Util.extend(this, b);
        this.layers = [];
        this.id = OpenLayers.Util.createUniqueID("OpenLayers.Map_");
        this.div = OpenLayers.Util.getElement(a);
        if (!this.div) {
            this.div = document.createElement("div");
            this.div.style.height = "1px";
            this.div.style.width = "1px"
        }
        OpenLayers.Element.addClass(this.div, "olMap");
        var c = this.id + "_OpenLayers_ViewPort";
        this.viewPortDiv = OpenLayers.Util.createDiv(c, null, null, null, "relative", null, "hidden");
        this.viewPortDiv.style.width = "100%";
        this.viewPortDiv.style.height = "100%";
        this.viewPortDiv.className = "olMapViewport";
        this.div.appendChild(this.viewPortDiv);
        c = document.createElement("div");
        c.id = this.id + "_events";
        c.style.position = 
        "absolute";
        c.style.width = "100%";
        c.style.height = "100%";
        c.style.zIndex = this.Z_INDEX_BASE.Control - 1;
        this.viewPortDiv.appendChild(c);
        this.eventsDiv = c;
        this.events = new OpenLayers.Events(this, this.eventsDiv, this.EVENT_TYPES, this.fallThrough, {
            includeXY: true
        });
        c = this.id + "_OpenLayers_Container";
        this.layerContainerDiv = OpenLayers.Util.createDiv(c);
        this.layerContainerDiv.style.zIndex = this.Z_INDEX_BASE.Popup - 1;
        this.eventsDiv.appendChild(this.layerContainerDiv);
        this.updateSize();
        if (this.eventListeners instanceof
        Object) this.events.on(this.eventListeners);
        this.events.register("movestart", this, this.updateSize);
        if (OpenLayers.String.contains(navigator.appName, "Microsoft")) this.events.register("resize", this, this.updateSize);
        else {
            this.updateSizeDestroy = OpenLayers.Function.bind(this.updateSize, this);
            OpenLayers.Event.observe(window, "resize", this.updateSizeDestroy)
        }
        if (this.theme) {
            c = true;
            for (var d = document.getElementsByTagName("link"), e = 0, f = d.length; e < f; ++e) if (OpenLayers.Util.isEquivalentUrl(d.item(e).href, this.theme)) {
                c = 
                false;
                break
            }
            if (c) {
                c = document.createElement("link");
                c.setAttribute("rel", "stylesheet");
                c.setAttribute("type", "text/css");
                c.setAttribute("href", this.theme);
                document.getElementsByTagName("head")[0].appendChild(c)
            }
        }
        if (this.controls == null) this.controls = OpenLayers.Control != null ? [new OpenLayers.Control.Navigation, new OpenLayers.Control.PanZoom, new OpenLayers.Control.ArgParser, new OpenLayers.Control.Attribution] : [];
        e = 0;
        for (f = this.controls.length; e < f; e++) this.addControlToMap(this.controls[e]);
        this.popups = 
        [];
        this.unloadDestroy = OpenLayers.Function.bind(this.destroy, this);
        OpenLayers.Event.observe(window, "unload", this.unloadDestroy);
        if (b && b.layers) {
            delete this.center;
            this.addLayers(b.layers);
            b.center && this.setCenter(b.center, b.zoom)
        }
    },
    render: function(a) {
        this.div = OpenLayers.Util.getElement(a);
        OpenLayers.Element.addClass(this.div, "olMap");
        this.viewPortDiv.parentNode.removeChild(this.viewPortDiv);
        this.div.appendChild(this.viewPortDiv);
        this.updateSize()
    },
    unloadDestroy: null,
    updateSizeDestroy: null,
    destroy: function() {
        if (!this.unloadDestroy) return false;
        if (this.panTween) {
            this.panTween.stop();
            this.panTween = null
        }
        OpenLayers.Event.stopObserving(window, "unload", this.unloadDestroy);
        this.unloadDestroy = null;
        this.updateSizeDestroy ? OpenLayers.Event.stopObserving(window, "resize", this.updateSizeDestroy) : this.events.unregister("resize", this, this.updateSize);
        this.paddingForPopups = null;
        if (this.controls != null) {
            for (var a = this.controls.length - 1; a >= 0; --a) this.controls[a].destroy();
            this.controls = null
        }
        if (this.layers != null) {
            for (a = this.layers.length - 1; a >= 0; --a) this.layers[a].destroy(false);
            this.layers = null
        }
        this.viewPortDiv && this.div.removeChild(this.viewPortDiv);
        this.viewPortDiv = null;
        if (this.eventListeners) {
            this.events.un(this.eventListeners);
            this.eventListeners = null
        }
        this.events.destroy();
        this.events = null
    },
    setOptions: function(a) {
        var b = this.minPx && a.restrictedExtent != this.restrictedExtent;
        OpenLayers.Util.extend(this, a);
        b && this.moveTo(this.getCachedCenter(), this.zoom, {
            forceZoomChange: true
        })
    },
    getTileSize: function() {
        return this.tileSize
    },
    getBy: function(a, b, c) {
        var d = typeof c.test == "function";
        return OpenLayers.Array.filter(this[a], 
        function(e) {
            return e[b] == c || d && c.test(e[b])
        })
    },
    getLayersBy: function(a, b) {
        return this.getBy("layers", a, b)
    },
    getLayersByName: function(a) {
        return this.getLayersBy("name", a)
    },
    getLayersByClass: function(a) {
        return this.getLayersBy("CLASS_NAME", a)
    },
    getControlsBy: function(a, b) {
        return this.getBy("controls", a, b)
    },
    getControlsByClass: function(a) {
        return this.getControlsBy("CLASS_NAME", a)
    },
    getLayer: function(a) {
        for (var b = null, c = 0, d = this.layers.length; c < d; c++) {
            var e = this.layers[c];
            if (e.id == a) {
                b = e;
                break
            }
        }
        return b
    },
    setLayerZIndex: function(a, b) {
        a.setZIndex(this.Z_INDEX_BASE[a.isBaseLayer ? "BaseLayer": "Overlay"] + b * 5)
    },
    resetLayersZIndex: function() {
        for (var a = 0, b = this.layers.length; a < b; a++) this.setLayerZIndex(this.layers[a], a)
    },
    addLayer: function(a) {
        for (var b = 0, c = this.layers.length; b < c; b++) if (this.layers[b] == a) {
            a = OpenLayers.i18n("layerAlreadyAdded", {
                layerName: a.name
            });
            OpenLayers.Console.warn(a);
            return false
        }
        if (this.events.triggerEvent("preaddlayer", {
            layer: a
        }) !== false) {
            if (this.allOverlays) a.isBaseLayer = 
            false;
            a.div.className = "olLayerDiv";
            a.div.style.overflow = "";
            this.setLayerZIndex(a, this.layers.length);
            a.isFixed ? this.viewPortDiv.appendChild(a.div) : this.layerContainerDiv.appendChild(a.div);
            this.layers.push(a);
            a.setMap(this);
            if (a.isBaseLayer || this.allOverlays && !this.baseLayer) this.baseLayer == null ? this.setBaseLayer(a) : a.setVisibility(false);
            else a.redraw();
            this.events.triggerEvent("addlayer", {
                layer: a
            });
            a.events.triggerEvent("added", {
                map: this,
                layer: a
            });
            a.afterAdd()
        }
    },
    addLayers: function(a) {
        for (var b = 
        0, c = a.length; b < c; b++) this.addLayer(a[b])
    },
    removeLayer: function(a, b) {
        if (this.events.triggerEvent("preremovelayer", {
            layer: a
        }) !== false) {
            if (b == null) b = true;
            a.isFixed ? this.viewPortDiv.removeChild(a.div) : this.layerContainerDiv.removeChild(a.div);
            OpenLayers.Util.removeItem(this.layers, a);
            a.removeMap(this);
            a.map = null;
            if (this.baseLayer == a) {
                this.baseLayer = null;
                if (b) for (var c = 0, d = this.layers.length; c < d; c++) {
                    var e = this.layers[c];
                    if (e.isBaseLayer || this.allOverlays) {
                        this.setBaseLayer(e);
                        break
                    }
                }
            }
            this.resetLayersZIndex();
            this.events.triggerEvent("removelayer", {
                layer: a
            });
            a.events.triggerEvent("removed", {
                map: this,
                layer: a
            })
        }
    },
    getNumLayers: function() {
        return this.layers.length
    },
    getLayerIndex: function(a) {
        return OpenLayers.Util.indexOf(this.layers, a)
    },
    setLayerIndex: function(a, b) {
        var c = this.getLayerIndex(a);
        if (b < 0) b = 0;
        else if (b > this.layers.length) b = this.layers.length;
        if (c != b) {
            this.layers.splice(c, 1);
            this.layers.splice(b, 0, a);
            c = 0;
            for (var d = this.layers.length; c < d; c++) this.setLayerZIndex(this.layers[c], c);
            this.events.triggerEvent("changelayer", 
            {
                layer: a,
                property: "order"
            });
            if (this.allOverlays) if (b === 0) this.setBaseLayer(a);
            else this.baseLayer !== this.layers[0] && this.setBaseLayer(this.layers[0])
        }
    },
    raiseLayer: function(a, b) {
        var c = this.getLayerIndex(a) + b;
        this.setLayerIndex(a, c)
    },
    setBaseLayer: function(a) {
        if (a != this.baseLayer) if (OpenLayers.Util.indexOf(this.layers, a) != -1) {
            var b = this.getCachedCenter(),
            c = OpenLayers.Util.getResolutionFromScale(this.getScale(), a.units);
            this.baseLayer != null && !this.allOverlays && this.baseLayer.setVisibility(false);
            this.baseLayer = 
            a;
            this.viewRequestID++;
            if (!this.allOverlays || this.baseLayer.visibility) this.baseLayer.setVisibility(true);
            if (b != null) {
                a = this.getZoomForResolution(c || this.resolution, true);
                this.setCenter(b, a, false, true)
            }
            this.events.triggerEvent("changebaselayer", {
                layer: this.baseLayer
            })
        }
    },
    addControl: function(a, b) {
        this.controls.push(a);
        this.addControlToMap(a, b)
    },
    addControls: function(a, b) {
        for (var c = arguments.length === 1 ? [] : b, d = 0, e = a.length; d < e; d++) this.addControl(a[d], c[d] ? c[d] : null)
    },
    addControlToMap: function(a, b) {
        a.outsideViewport = 
        a.div != null;
        if (this.displayProjection && !a.displayProjection) a.displayProjection = this.displayProjection;
        a.setMap(this);
        var c = a.draw(b);
        if (c) if (!a.outsideViewport) {
            c.style.zIndex = this.Z_INDEX_BASE.Control + this.controls.length;
            this.viewPortDiv.appendChild(c)
        }
        a.autoActivate && a.activate()
    },
    getControl: function(a) {
        for (var b = null, c = 0, d = this.controls.length; c < d; c++) {
            var e = this.controls[c];
            if (e.id == a) {
                b = e;
                break
            }
        }
        return b
    },
    removeControl: function(a) {
        if (a && a == this.getControl(a.id)) {
            a.div && a.div.parentNode == this.viewPortDiv && 
            this.viewPortDiv.removeChild(a.div);
            OpenLayers.Util.removeItem(this.controls, a)
        }
    },
    addPopup: function(a, b) {
        if (b) for (var c = this.popups.length - 1; c >= 0; --c) this.removePopup(this.popups[c]);
        a.map = this;
        this.popups.push(a);
        if (c = a.draw()) {
            c.style.zIndex = this.Z_INDEX_BASE.Popup + this.popups.length;
            this.layerContainerDiv.appendChild(c)
        }
    },
    removePopup: function(a) {
        OpenLayers.Util.removeItem(this.popups, a);
        if (a.div) try {
            this.layerContainerDiv.removeChild(a.div)
        } catch(b) {}
        a.map = null
    },
    getSize: function() {
        var a = null;
        if (this.size != 
        null) a = this.size.clone();
        return a
    },
    updateSize: function() {
        var a = this.getCurrentSize();
        if (a && !isNaN(a.h) && !isNaN(a.w)) {
            this.events.clearMouseCache();
            var b = this.getSize();
            if (b == null) this.size = b = a;
            if (!a.equals(b)) {
                this.size = a;
                a = 0;
                for (b = this.layers.length; a < b; a++) this.layers[a].onMapResize();
                a = this.getCachedCenter();
                if (this.baseLayer != null && a != null) {
                    b = this.getZoom();
                    this.zoom = null;
                    this.setCenter(a, b)
                }
            }
        }
    },
    getCurrentSize: function() {
        var a = new OpenLayers.Size(this.div.clientWidth, this.div.clientHeight);
        if (a.w == 
        0 && a.h == 0 || isNaN(a.w) && isNaN(a.h)) {
            a.w = this.div.offsetWidth;
            a.h = this.div.offsetHeight
        }
        if (a.w == 0 && a.h == 0 || isNaN(a.w) && isNaN(a.h)) {
            a.w = parseInt(this.div.style.width);
            a.h = parseInt(this.div.style.height)
        }
        return a
    },
    calculateBounds: function(a, b) {
        var c = null;
        if (a == null) a = this.getCachedCenter();
        if (b == null) b = this.getResolution();
        if (a != null && b != null) {
            var d = this.getSize();
            c = d.w * b;
            d = d.h * b;
            c = new OpenLayers.Bounds(a.lon - c / 2, a.lat - d / 2, a.lon + c / 2, a.lat + d / 2)
        }
        return c
    },
    getCenter: function() {
        var a = null,
        b = this.getCachedCenter();
        if (b) a = b.clone();
        return a
    },
    getCachedCenter: function() {
        if (!this.center && this.size) this.center = this.getLonLatFromViewPortPx(new OpenLayers.Pixel(this.size.w / 2, this.size.h / 2));
        return this.center
    },
    getZoom: function() {
        return this.zoom
    },
    pan: function(a, b, c) {
        c = OpenLayers.Util.applyDefaults(c, {
            animate: true,
            dragging: false
        });
        if (c.dragging) {
            if (a != 0 || b != 0) this.moveByPx(a, b)
        } else {
            var d = this.getViewPortPxFromLonLat(this.getCachedCenter());
            a = d.add(a, b);
            if (this.dragging || !a.equals(d)) {
                d = this.getLonLatFromViewPortPx(a);
                if (c.animate) this.panTo(d);
                else {
                    this.moveTo(d);
                    this.dragging = false;
                    this.events.triggerEvent("moveend")
                }
            }
        }
    },
    panTo: function(a) {
        if (this.panMethod && this.getExtent().scale(this.panRatio).containsLonLat(a)) {
            if (!this.panTween) this.panTween = new OpenLayers.Tween(this.panMethod);
            var b = this.getCachedCenter();
            if (!a.equals(b)) {
                b = this.getPixelFromLonLat(b);
                var c = this.getPixelFromLonLat(a),
                d = {
                    x: 0,
                    y: 0
                };
                this.panTween.start({
                    x: 0,
                    y: 0
                },
                {
                    x: c.x - b.x,
                    y: c.y - b.y
                },
                this.panDuration, {
                    callbacks: {
                        eachStep: OpenLayers.Function.bind(function(e) {
                            this.moveByPx(e.x - 
                            d.x, e.y - d.y);
                            d.x = Math.round(e.x);
                            d.y = Math.round(e.y)
                        },
                        this),
                        done: OpenLayers.Function.bind(function() {
                            this.moveTo(a);
                            this.dragging = false;
                            this.events.triggerEvent("moveend")
                        },
                        this)
                    }
                })
            }
        } else this.setCenter(a)
    },
    setCenter: function(a, b, c, d) {
        this.panTween && this.panTween.stop();
        this.moveTo(a, b, {
            dragging: c,
            forceZoomChange: d
        })
    },
    moveByPx: function(a, b) {
        var c = this.size.w / 2,
        d = this.size.h / 2,
        e = c + a,
        f = d + b,
        g = this.baseLayer.wrapDateLine,
        h = 0,
        i = 0;
        if (this.restrictedExtent) {
            h = c;
            i = d;
            g = false
        }
        a = g || e <= this.maxPx.x - h && e >= this.minPx.x + 
        h ? Math.round(a) : 0;
        b = f <= this.maxPx.y - i && f >= this.minPx.y + i ? Math.round(b) : 0;
        c = this.minPx.x;
        d = this.maxPx.x;
        if (a || b) {
            if (!this.dragging) {
                this.dragging = true;
                this.events.triggerEvent("movestart")
            }
            this.center = null;
            if (a) {
                this.layerContainerDiv.style.left = parseInt(this.layerContainerDiv.style.left) - a + "px";
                this.minPx.x -= a;
                this.maxPx.x -= a;
                if (g) {
                    if (this.maxPx.x > d) this.maxPx.x -= d - c;
                    if (this.minPx.x < c) this.minPx.x += d - c
                }
            }
            if (b) {
                this.layerContainerDiv.style.top = parseInt(this.layerContainerDiv.style.top) - b + "px";
                this.minPx.y -= 
                b;
                this.maxPx.y -= b
            }
            c = 0;
            for (d = this.layers.length; c < d; ++c) {
                g = this.layers[c];
                if (g.visibility) {
                    g.moveByPx(a, b);
                    g.events.triggerEvent("move")
                }
            }
            this.events.triggerEvent("move")
        }
    },
    moveTo: function(a, b, c) {
        c || (c = {});
        if (b != null) {
            b = parseFloat(b);
            this.fractionalZoom || (b = Math.round(b))
        }
        var d = c.dragging || this.dragging,
        e = c.forceZoomChange;
        if (!this.getCachedCenter() && !this.isValidLonLat(a)) {
            a = this.maxExtent.getCenterLonLat();
            this.center = a.clone()
        }
        if (this.restrictedExtent != null) {
            if (a == null) a = this.center;
            if (b == null) b = 
            this.getZoom();
            var f = this.getResolutionForZoom(b);
            f = this.calculateBounds(a, f);
            if (!this.restrictedExtent.containsBounds(f)) {
                var g = this.restrictedExtent.getCenterLonLat();
                if (f.getWidth() > this.restrictedExtent.getWidth()) a = new OpenLayers.LonLat(g.lon, a.lat);
                else if (f.left < this.restrictedExtent.left) a = a.add(this.restrictedExtent.left - f.left, 0);
                else if (f.right > this.restrictedExtent.right) a = a.add(this.restrictedExtent.right - f.right, 0);
                if (f.getHeight() > this.restrictedExtent.getHeight()) a = new OpenLayers.LonLat(a.lon, 
                g.lat);
                else if (f.bottom < this.restrictedExtent.bottom) a = a.add(0, this.restrictedExtent.bottom - f.bottom);
                else if (f.top > this.restrictedExtent.top) a = a.add(0, this.restrictedExtent.top - f.top)
            }
        }
        e = e || this.isValidZoomLevel(b) && b != this.getZoom();
        f = this.isValidLonLat(a) && !a.equals(this.center);
        if (e || f || d) {
            d || this.events.triggerEvent("movestart");
            if (f) { ! e && this.center && this.centerLayerContainer(a);
                this.center = a.clone()
            }
            a = e ? this.getResolutionForZoom(b) : this.getResolution();
            if (e || this.layerContainerOrigin == null) {
                this.layerContainerOrigin = 
                this.getCachedCenter();
                this.layerContainerDiv.style.left = "0px";
                this.layerContainerDiv.style.top = "0px";
                var h = this.getMaxExtent({
                    restricted: true
                });
                f = h.getCenterLonLat();
                g = this.center.lon - f.lon;
                var i = f.lat - this.center.lat;
                f = Math.round(h.getWidth() / a);
                h = Math.round(h.getHeight() / a);
                g = (this.size.w - f) / 2 - g / a;
                i = (this.size.h - h) / 2 - i / a;
                this.minPx = new OpenLayers.Pixel(g, i);
                this.maxPx = new OpenLayers.Pixel(g + f, i + h)
            }
            if (e) {
                this.zoom = b;
                this.resolution = a;
                this.viewRequestID++
            }
            a = this.getExtent();
            if (this.baseLayer.visibility) {
                this.baseLayer.moveTo(a, 
                e, c.dragging);
                c.dragging || this.baseLayer.events.triggerEvent("moveend", {
                    zoomChanged: e
                })
            }
            a = this.baseLayer.getExtent();
            for (b = this.layers.length - 1; b >= 0; --b) {
                f = this.layers[b];
                if (f !== this.baseLayer && !f.isBaseLayer) {
                    g = f.calculateInRange();
                    if (f.inRange != g) { (f.inRange = g) || f.display(false);
                        this.events.triggerEvent("changelayer", {
                            layer: f,
                            property: "visibility"
                        })
                    }
                    if (g && f.visibility) {
                        f.moveTo(a, e, c.dragging);
                        c.dragging || f.events.triggerEvent("moveend", {
                            zoomChanged: e
                        })
                    }
                }
            }
            this.events.triggerEvent("move");
            d || this.events.triggerEvent("moveend");
            if (e) {
                b = 0;
                for (c = this.popups.length; b < c; b++) this.popups[b].updatePosition();
                this.events.triggerEvent("zoomend")
            }
        }
    },
    centerLayerContainer: function(a) {
        var b = this.getViewPortPxFromLonLat(this.layerContainerOrigin),
        c = this.getViewPortPxFromLonLat(a);
        if (b != null && c != null) {
            var d = parseInt(this.layerContainerDiv.style.left);
            a = parseInt(this.layerContainerDiv.style.top);
            var e = Math.round(b.x - c.x);
            b = Math.round(b.y - c.y);
            this.layerContainerDiv.style.left = e + "px";
            this.layerContainerDiv.style.top = b + "px";
            d -= e;
            a -= b;
            this.minPx.x -= 
            d;
            this.maxPx.x -= d;
            this.minPx.y -= a;
            this.maxPx.y -= a
        }
    },
    isValidZoomLevel: function(a) {
        return a != null && a >= 0 && a < this.getNumZoomLevels()
    },
    isValidLonLat: function(a) {
        var b = false;
        if (a != null) b = this.getMaxExtent().containsLonLat(a);
        return b
    },
    getProjection: function() {
        var a = this.getProjectionObject();
        return a ? a.getCode() : null
    },
    getProjectionObject: function() {
        var a = null;
        if (this.baseLayer != null) a = this.baseLayer.projection;
        return a
    },
    getMaxResolution: function() {
        var a = null;
        if (this.baseLayer != null) a = this.baseLayer.maxResolution;
        return a
    },
    getMaxExtent: function(a) {
        var b = null;
        if (a && a.restricted && this.restrictedExtent) b = this.restrictedExtent;
        else if (this.baseLayer != null) b = this.baseLayer.maxExtent;
        return b
    },
    getNumZoomLevels: function() {
        var a = null;
        if (this.baseLayer != null) a = this.baseLayer.numZoomLevels;
        return a
    },
    getExtent: function() {
        var a = null;
        if (this.baseLayer != null) a = this.baseLayer.getExtent();
        return a
    },
    getResolution: function() {
        var a = null;
        if (this.baseLayer != null) a = this.baseLayer.getResolution();
        else if (this.allOverlays === true && 
        this.layers.length > 0) a = this.layers[0].getResolution();
        return a
    },
    getUnits: function() {
        var a = null;
        if (this.baseLayer != null) a = this.baseLayer.units;
        return a
    },
    getScale: function() {
        var a = null;
        if (this.baseLayer != null) {
            a = this.getResolution();
            a = OpenLayers.Util.getScaleFromResolution(a, this.baseLayer.units)
        }
        return a
    },
    getZoomForExtent: function(a, b) {
        var c = null;
        if (this.baseLayer != null) c = this.baseLayer.getZoomForExtent(a, b);
        return c
    },
    getResolutionForZoom: function(a) {
        var b = null;
        if (this.baseLayer) b = this.baseLayer.getResolutionForZoom(a);
        return b
    },
    getZoomForResolution: function(a, b) {
        var c = null;
        if (this.baseLayer != null) c = this.baseLayer.getZoomForResolution(a, b);
        return c
    },
    zoomTo: function(a) {
        this.isValidZoomLevel(a) && this.setCenter(null, a)
    },
    zoomIn: function() {
        this.zoomTo(this.getZoom() + 1)
    },
    zoomOut: function() {
        this.zoomTo(this.getZoom() - 1)
    },
    zoomToExtent: function(a, b) {
        var c = a.getCenterLonLat();
        if (this.baseLayer.wrapDateLine) {
            c = this.getMaxExtent();
            for (a = a.clone(); a.right < a.left;) a.right += c.getWidth();
            c = a.getCenterLonLat().wrapDateLine(c)
        }
        this.setCenter(c, 
        this.getZoomForExtent(a, b))
    },
    zoomToMaxExtent: function(a) {
        this.zoomToExtent(this.getMaxExtent({
            restricted: a ? a.restricted: true
        }))
    },
    zoomToScale: function(a, b) {
        var c = OpenLayers.Util.getResolutionFromScale(a, this.baseLayer.units),
        d = this.getSize(),
        e = d.w * c;
        c *= d.h;
        d = this.getCachedCenter();
        this.zoomToExtent(new OpenLayers.Bounds(d.lon - e / 2, d.lat - c / 2, d.lon + e / 2, d.lat + c / 2), b)
    },
    getLonLatFromViewPortPx: function(a) {
        var b = null;
        if (this.baseLayer != null) b = this.baseLayer.getLonLatFromViewPortPx(a);
        return b
    },
    getViewPortPxFromLonLat: function(a) {
        var b = 
        null;
        if (this.baseLayer != null) b = this.baseLayer.getViewPortPxFromLonLat(a);
        return b
    },
    getLonLatFromPixel: function(a) {
        return this.getLonLatFromViewPortPx(a)
    },
    getPixelFromLonLat: function(a) {
        a = this.getViewPortPxFromLonLat(a);
        a.x = Math.round(a.x);
        a.y = Math.round(a.y);
        return a
    },
    getGeodesicPixelSize: function(a) {
        var b = a ? this.getLonLatFromPixel(a) : this.getCachedCenter() || new OpenLayers.LonLat(0, 0),
        c = this.getResolution();
        a = b.add( - c / 2, 0);
        var d = b.add(c / 2, 0),
        e = b.add(0, -c / 2);
        b = b.add(0, c / 2);
        c = new OpenLayers.Projection("EPSG:4326");
        var f = this.getProjectionObject() || c;
        if (!f.equals(c)) {
            a.transform(f, c);
            d.transform(f, c);
            e.transform(f, c);
            b.transform(f, c)
        }
        return new OpenLayers.Size(OpenLayers.Util.distVincenty(a, d), OpenLayers.Util.distVincenty(e, b))
    },
    getViewPortPxFromLayerPx: function(a) {
        var b = null;
        if (a != null) {
            b = parseInt(this.layerContainerDiv.style.left);
            var c = parseInt(this.layerContainerDiv.style.top);
            b = a.add(b, c)
        }
        return b
    },
    getLayerPxFromViewPortPx: function(a) {
        var b = null;
        if (a != null) {
            b = -parseInt(this.layerContainerDiv.style.left);
            var c = -parseInt(this.layerContainerDiv.style.top);
            b = a.add(b, c);
            if (isNaN(b.x) || isNaN(b.y)) b = null
        }
        return b
    },
    getLonLatFromLayerPx: function(a) {
        a = this.getViewPortPxFromLayerPx(a);
        return this.getLonLatFromViewPortPx(a)
    },
    getLayerPxFromLonLat: function(a) {
        return this.getLayerPxFromViewPortPx(this.getPixelFromLonLat(a))
    },
    CLASS_NAME: "OpenLayers.Map"
});
OpenLayers.Map.TILE_WIDTH = 256;
OpenLayers.Map.TILE_HEIGHT = 256;
OpenLayers.Projection = OpenLayers.Class({
    proj: null,
    projCode: null,
    titleRegEx: /\+title=[^\+]*/,
    initialize: function(a, b) {
        OpenLayers.Util.extend(this, b);
        this.projCode = a;
        if (window.Proj4js) this.proj = new Proj4js.Proj(a)
    },
    getCode: function() {
        return this.proj ? this.proj.srsCode: this.projCode
    },
    getUnits: function() {
        return this.proj ? this.proj.units: null
    },
    toString: function() {
        return this.getCode()
    },
    equals: function(a) {
        var b = false;
        if (a) if (window.Proj4js && this.proj.defData && a.proj.defData) b = this.proj.defData.replace(this.titleRegEx, 
        "") == a.proj.defData.replace(this.titleRegEx, "");
        else if (a.getCode) {
            b = this.getCode();
            a = a.getCode();
            b = b == a || !!OpenLayers.Projection.transforms[b] && OpenLayers.Projection.transforms[b][a] === OpenLayers.Projection.nullTransform
        }
        return b
    },
    destroy: function() {
        delete this.proj;
        delete this.projCode
    },
    CLASS_NAME: "OpenLayers.Projection"
});
OpenLayers.Projection.transforms = {};
OpenLayers.Projection.addTransform = function(a, b, c) {
    OpenLayers.Projection.transforms[a] || (OpenLayers.Projection.transforms[a] = {});
    OpenLayers.Projection.transforms[a][b] = c
};
OpenLayers.Projection.transform = function(a, b, c) {
    if (b.proj && c.proj) a = Proj4js.transform(b.proj, c.proj, a);
    else if (b && c && OpenLayers.Projection.transforms[b.getCode()] && OpenLayers.Projection.transforms[b.getCode()][c.getCode()]) OpenLayers.Projection.transforms[b.getCode()][c.getCode()](a);
    return a
};
OpenLayers.Projection.nullTransform = function(a) {
    return a
};
OpenLayers.Layer = OpenLayers.Class({
    id: null,
    name: null,
    div: null,
    opacity: null,
    alwaysInRange: null,
    EVENT_TYPES: ["loadstart", "loadend", "loadcancel", "visibilitychanged", "move", "moveend", "added", "removed"],
    RESOLUTION_PROPERTIES: ["scales", "resolutions", "maxScale", "minScale", "maxResolution", "minResolution", "numZoomLevels", "maxZoomLevel"],
    events: null,
    map: null,
    isBaseLayer: false,
    alpha: false,
    displayInLayerSwitcher: true,
    visibility: true,
    attribution: null,
    inRange: false,
    imageSize: null,
    imageOffset: null,
    options: null,
    eventListeners: null,
    gutter: 0,
    projection: null,
    units: null,
    scales: null,
    resolutions: null,
    maxExtent: null,
    minExtent: null,
    maxResolution: null,
    minResolution: null,
    numZoomLevels: null,
    minScale: null,
    maxScale: null,
    displayOutsideMaxExtent: false,
    wrapDateLine: false,
    transitionEffect: null,
    SUPPORTED_TRANSITIONS: ["resize"],
    metadata: {},
    initialize: function(a, b) {
        this.addOptions(b);
        this.name = a;
        if (this.id == null) {
            this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
            this.div = OpenLayers.Util.createDiv(this.id);
            this.div.style.width = 
            "100%";
            this.div.style.height = "100%";
            this.div.dir = "ltr";
            this.events = new OpenLayers.Events(this, this.div, this.EVENT_TYPES);
            if (this.eventListeners instanceof Object) this.events.on(this.eventListeners)
        }
        if (this.wrapDateLine) this.displayOutsideMaxExtent = true
    },
    destroy: function(a) {
        if (a == null) a = true;
        this.map != null && this.map.removeLayer(this, a);
        this.options = this.div = this.name = this.map = this.projection = null;
        if (this.events) {
            this.eventListeners && this.events.un(this.eventListeners);
            this.events.destroy()
        }
        this.events = 
        this.eventListeners = null
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Layer(this.name, this.getOptions());
        OpenLayers.Util.applyDefaults(a, this);
        a.map = null;
        return a
    },
    getOptions: function() {
        var a = {},
        b;
        for (b in this.options) a[b] = this[b];
        return a
    },
    setName: function(a) {
        if (a != this.name) {
            this.name = a;
            this.map != null && this.map.events.triggerEvent("changelayer", {
                layer: this,
                property: "name"
            })
        }
    },
    addOptions: function(a, b) {
        if (this.options == null) this.options = {};
        OpenLayers.Util.extend(this.options, a);
        OpenLayers.Util.extend(this, 
        a);
        if (typeof this.projection == "string") this.projection = new OpenLayers.Projection(this.projection);
        if (this.projection && this.projection.getUnits()) this.units = this.projection.getUnits();
        if (this.map) {
            var c = this.map.getResolution(),
            d = this.RESOLUTION_PROPERTIES.concat(["projection", "units", "minExtent", "maxExtent"]),
            e;
            for (e in a) if (a.hasOwnProperty(e) && OpenLayers.Util.indexOf(d, e) >= 0) {
                this.initResolutions();
                if (b && this.map.baseLayer === this) {
                    this.map.setCenter(this.map.getCenter(), this.map.getZoomForResolution(c), 
                    false, true);
                    this.map.events.triggerEvent("changebaselayer", {
                        layer: this
                    })
                }
                break
            }
        }
    },
    onMapResize: function() {},
    redraw: function() {
        var a = false;
        if (this.map) {
            this.inRange = this.calculateInRange();
            var b = this.getExtent();
            if (b && this.inRange && this.visibility) {
                this.moveTo(b, true, false);
                this.events.triggerEvent("moveend", {
                    zoomChanged: true
                });
                a = true
            }
        }
        return a
    },
    moveTo: function() {
        var a = this.visibility;
        this.isBaseLayer || (a = a && this.inRange);
        this.display(a)
    },
    moveByPx: function() {},
    setMap: function(a) {
        if (this.map == null) {
            this.map = 
            a;
            this.maxExtent = this.maxExtent || this.map.maxExtent;
            this.minExtent = this.minExtent || this.map.minExtent;
            this.projection = this.projection || this.map.projection;
            if (typeof this.projection == "string") this.projection = new OpenLayers.Projection(this.projection);
            this.units = this.projection.getUnits() || this.units || this.map.units;
            this.initResolutions();
            if (!this.isBaseLayer) {
                this.inRange = this.calculateInRange();
                this.div.style.display = this.visibility && this.inRange ? "": "none"
            }
            this.setTileSize()
        }
    },
    afterAdd: function() {},
    removeMap: function() {},
    getImageSize: function() {
        return this.imageSize || this.tileSize
    },
    setTileSize: function(a) {
        this.tileSize = a = a ? a: this.tileSize ? this.tileSize: this.map.getTileSize();
        if (this.gutter) {
            this.imageOffset = new OpenLayers.Pixel( - this.gutter, -this.gutter);
            this.imageSize = new OpenLayers.Size(a.w + 2 * this.gutter, a.h + 2 * this.gutter)
        }
    },
    getVisibility: function() {
        return this.visibility
    },
    setVisibility: function(a) {
        if (a != this.visibility) {
            this.visibility = a;
            this.display(a);
            this.redraw();
            this.map != null && this.map.events.triggerEvent("changelayer", 
            {
                layer: this,
                property: "visibility"
            });
            this.events.triggerEvent("visibilitychanged")
        }
    },
    display: function(a) {
        if (a != (this.div.style.display != "none")) this.div.style.display = a && this.calculateInRange() ? "block": "none"
    },
    calculateInRange: function() {
        var a = false;
        if (this.alwaysInRange) a = true;
        else if (this.map) {
            a = this.map.getResolution();
            a = a >= this.minResolution && a <= this.maxResolution
        }
        return a
    },
    setIsBaseLayer: function(a) {
        if (a != this.isBaseLayer) {
            this.isBaseLayer = a;
            this.map != null && this.map.events.triggerEvent("changebaselayer", 
            {
                layer: this
            })
        }
    },
    initResolutions: function() {
        var a,
        b,
        c,
        d = {},
        e = true;
        a = 0;
        for (b = this.RESOLUTION_PROPERTIES.length; a < b; a++) {
            c = this.RESOLUTION_PROPERTIES[a];
            d[c] = this.options[c];
            if (e && this.options[c]) e = false
        }
        if (this.alwaysInRange == null) this.alwaysInRange = e;
        if (d.resolutions == null) d.resolutions = this.resolutionsFromScales(d.scales);
        if (d.resolutions == null) d.resolutions = this.calculateResolutions(d);
        if (d.resolutions == null) {
            a = 0;
            for (b = this.RESOLUTION_PROPERTIES.length; a < b; a++) {
                c = this.RESOLUTION_PROPERTIES[a];
                d[c] = 
                this.options[c] != null ? this.options[c] : this.map[c]
            }
            if (d.resolutions == null) d.resolutions = this.resolutionsFromScales(d.scales);
            if (d.resolutions == null) d.resolutions = this.calculateResolutions(d)
        }
        var f;
        if (this.options.maxResolution && this.options.maxResolution !== "auto") f = this.options.maxResolution;
        if (this.options.minScale) f = OpenLayers.Util.getResolutionFromScale(this.options.minScale, this.units);
        var g;
        if (this.options.minResolution && this.options.minResolution !== "auto") g = this.options.minResolution;
        if (this.options.maxScale) g = 
        OpenLayers.Util.getResolutionFromScale(this.options.maxScale, this.units);
        if (d.resolutions) {
            d.resolutions.sort(function(h, i) {
                return i - h
            });
            f || (f = d.resolutions[0]);
            g || (g = d.resolutions[d.resolutions.length - 1])
        }
        if (this.resolutions = d.resolutions) {
            b = this.resolutions.length;
            this.scales = Array(b);
            for (a = 0; a < b; a++) this.scales[a] = OpenLayers.Util.getScaleFromResolution(this.resolutions[a], this.units);
            this.numZoomLevels = b
        }
        if (this.minResolution = g) this.maxScale = OpenLayers.Util.getScaleFromResolution(g, this.units);
        if (this.maxResolution = f) this.minScale = OpenLayers.Util.getScaleFromResolution(f, this.units)
    },
    resolutionsFromScales: function(a) {
        if (a != null) {
            var b,
            c,
            d;
            d = a.length;
            b = Array(d);
            for (c = 0; c < d; c++) b[c] = OpenLayers.Util.getResolutionFromScale(a[c], this.units);
            return b
        }
    },
    calculateResolutions: function(a) {
        var b,
        c,
        d = a.maxResolution;
        if (a.minScale != null) d = OpenLayers.Util.getResolutionFromScale(a.minScale, this.units);
        else if (d == "auto" && this.maxExtent != null) {
            b = this.map.getSize();
            c = this.maxExtent.getWidth() / b.w;
            b = this.maxExtent.getHeight() / 
            b.h;
            d = Math.max(c, b)
        }
        c = a.minResolution;
        if (a.maxScale != null) c = OpenLayers.Util.getResolutionFromScale(a.maxScale, this.units);
        else if (a.minResolution == "auto" && this.minExtent != null) {
            b = this.map.getSize();
            c = this.minExtent.getWidth() / b.w;
            b = this.minExtent.getHeight() / b.h;
            c = Math.max(c, b)
        }
        b = a.maxZoomLevel;
        a = a.numZoomLevels;
        if (typeof c === "number" && typeof d === "number" && a === undefined) a = Math.floor(Math.log(d / c) / Math.log(2)) + 1;
        else if (a === undefined && b != null) a = b + 1;
        if (! (typeof a !== "number" || a <= 0 || typeof d !== "number" && 
        typeof c !== "number")) {
            b = Array(a);
            var e = 2;
            if (typeof c == "number" && typeof d == "number") e = Math.pow(d / c, 1 / (a - 1));
            var f;
            if (typeof d === "number") for (f = 0; f < a; f++) b[f] = d / Math.pow(e, f);
            else for (f = 0; f < a; f++) b[a - 1 - f] = c * Math.pow(e, f);
            return b
        }
    },
    getResolution: function() {
        return this.getResolutionForZoom(this.map.getZoom())
    },
    getExtent: function() {
        return this.map.calculateBounds()
    },
    getZoomForExtent: function(a, b) {
        var c = this.map.getSize();
        return this.getZoomForResolution(Math.max(a.getWidth() / c.w, a.getHeight() / c.h), b)
    },
    getDataExtent: function() {},
    getResolutionForZoom: function(a) {
        a = Math.max(0, Math.min(a, this.resolutions.length - 1));
        if (this.map.fractionalZoom) {
            var b = Math.floor(a);
            a = this.resolutions[b] - (a - b) * (this.resolutions[b] - this.resolutions[Math.ceil(a)])
        } else a = this.resolutions[Math.round(a)];
        return a
    },
    getZoomForResolution: function(a, b) {
        var c,
        d;
        if (this.map.fractionalZoom) {
            var e = 0,
            f = this.resolutions[e],
            g = this.resolutions[this.resolutions.length - 1],
            h;
            c = 0;
            for (d = this.resolutions.length; c < d; ++c) {
                h = this.resolutions[c];
                if (h >= a) {
                    f = h;
                    e = c
                }
                if (h <= a) {
                    g = h;
                    break
                }
            }
            c = f - g;
            c = c > 0 ? e + (f - a) / c: e
        } else {
            f = Number.POSITIVE_INFINITY;
            c = 0;
            for (d = this.resolutions.length; c < d; c++) if (b) {
                e = Math.abs(this.resolutions[c] - a);
                if (e > f) break;
                f = e
            } else if (this.resolutions[c] < a) break;
            c = Math.max(0, c - 1)
        }
        return c
    },
    getLonLatFromViewPortPx: function(a) {
        var b = null,
        c = this.map;
        if (a != null && c.minPx) {
            b = c.getResolution();
            var d = c.getMaxExtent({
                restricted: true
            });
            b = new OpenLayers.LonLat((a.x - c.minPx.x) * b + d.left, (c.minPx.y - a.y) * b + d.top);
            if (this.wrapDateLine) b = b.wrapDateLine(this.maxExtent)
        }
        return b
    },
    getViewPortPxFromLonLat: function(a) {
        var b = null;
        if (a != null) {
            b = this.map.getResolution();
            var c = this.map.getExtent();
            b = new OpenLayers.Pixel(1 / b * (a.lon - c.left), 1 / b * (c.top - a.lat))
        }
        return b
    },
    setOpacity: function(a) {
        if (a != this.opacity) {
            this.opacity = a;
            for (var b = 0, c = this.div.childNodes.length; b < c; ++b) OpenLayers.Util.modifyDOMElement(this.div.childNodes[b].firstChild, null, null, null, null, null, null, a);
            this.map != null && this.map.events.triggerEvent("changelayer", {
                layer: this,
                property: "opacity"
            })
        }
    },
    getZIndex: function() {
        return this.div.style.zIndex
    },
    setZIndex: function(a) {
        this.div.style.zIndex = a
    },
    adjustBounds: function(a) {
        if (this.gutter) {
            var b = this.gutter * this.map.getResolution();
            a = new OpenLayers.Bounds(a.left - b, a.bottom - b, a.right + b, a.top + b)
        }
        if (this.wrapDateLine) {
            b = {
                rightTolerance: this.getResolution(),
                leftTolerance: this.getResolution()
            };
            a = a.wrapDateLine(this.maxExtent, b)
        }
        return a
    },
    CLASS_NAME: "OpenLayers.Layer"
});
OpenLayers.Style = OpenLayers.Class({
    id: null,
    name: null,
    title: null,
    description: null,
    layerName: null,
    isDefault: false,
    rules: null,
    context: null,
    defaultStyle: null,
    defaultsPerSymbolizer: false,
    propertyStyles: null,
    initialize: function(a, b) {
        OpenLayers.Util.extend(this, b);
        this.rules = [];
        b && b.rules && this.addRules(b.rules);
        this.setDefaultStyle(a || OpenLayers.Feature.Vector.style["default"]);
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_")
    },
    destroy: function() {
        for (var a = 0, b = this.rules.length; a < b; a++) {
            this.rules[a].destroy();
            this.rules[a] = null
        }
        this.defaultStyle = this.rules = null
    },
    createSymbolizer: function(a) {
        for (var b = this.defaultsPerSymbolizer ? {}: this.createLiterals(OpenLayers.Util.extend({},
        this.defaultStyle), a), c = this.rules, d, e = [], f = false, g = 0, h = c.length; g < h; g++) {
            d = c[g];
            if (d.evaluate(a)) if (d instanceof OpenLayers.Rule && d.elseFilter) e.push(d);
            else {
                f = true;
                this.applySymbolizer(d, b, a)
            }
        }
        if (f == false && e.length > 0) {
            f = true;
            g = 0;
            for (h = e.length; g < h; g++) this.applySymbolizer(e[g], b, a)
        }
        if (c.length > 0 && f == false) b.display = "none";
        if (b.label && 
        typeof b.label !== "string") b.label = String(b.label);
        return b
    },
    applySymbolizer: function(a, b, c) {
        var d = c.geometry ? this.getSymbolizerPrefix(c.geometry) : OpenLayers.Style.SYMBOLIZER_PREFIXES[0];
        a = a.symbolizer[d] || a.symbolizer;
        if (this.defaultsPerSymbolizer === true) {
            d = this.defaultStyle;
            OpenLayers.Util.applyDefaults(a, {
                pointRadius: d.pointRadius
            });
            if (a.stroke === true || a.graphic === true) OpenLayers.Util.applyDefaults(a, {
                strokeWidth: d.strokeWidth,
                strokeColor: d.strokeColor,
                strokeOpacity: d.strokeOpacity,
                strokeDashstyle: d.strokeDashstyle,
                strokeLinecap: d.strokeLinecap
            });
            if (a.fill === true || a.graphic === true) OpenLayers.Util.applyDefaults(a, {
                fillColor: d.fillColor,
                fillOpacity: d.fillOpacity
            });
            a.graphic === true && OpenLayers.Util.applyDefaults(a, {
                pointRadius: this.defaultStyle.pointRadius,
                externalGraphic: this.defaultStyle.externalGraphic,
                graphicName: this.defaultStyle.graphicName,
                graphicOpacity: this.defaultStyle.graphicOpacity,
                graphicWidth: this.defaultStyle.graphicWidth,
                graphicHeight: this.defaultStyle.graphicHeight,
                graphicXOffset: this.defaultStyle.graphicXOffset,
                graphicYOffset: this.defaultStyle.graphicYOffset
            })
        }
        return this.createLiterals(OpenLayers.Util.extend(b, a), c)
    },
    createLiterals: function(a, b) {
        var c = OpenLayers.Util.extend({},
        b.attributes || b.data);
        OpenLayers.Util.extend(c, this.context);
        for (var d in this.propertyStyles) a[d] = OpenLayers.Style.createLiteral(a[d], c, b, d);
        return a
    },
    findPropertyStyles: function() {
        var a = {};
        this.addPropertyStyles(a, this.defaultStyle);
        for (var b = this.rules, c, d, e = 0, f = b.length; e < f; e++) {
            c = b[e].symbolizer;
            for (var g in c) {
                d = c[g];
                if (typeof d == 
                "object") this.addPropertyStyles(a, d);
                else {
                    this.addPropertyStyles(a, c);
                    break
                }
            }
        }
        return a
    },
    addPropertyStyles: function(a, b) {
        var c,
        d;
        for (d in b) {
            c = b[d];
            if (typeof c == "string" && c.match(/\$\{\w+\}/)) a[d] = true
        }
        return a
    },
    addRules: function(a) {
        Array.prototype.push.apply(this.rules, a);
        this.propertyStyles = this.findPropertyStyles()
    },
    setDefaultStyle: function(a) {
        this.defaultStyle = a;
        this.propertyStyles = this.findPropertyStyles()
    },
    getSymbolizerPrefix: function(a) {
        for (var b = OpenLayers.Style.SYMBOLIZER_PREFIXES, c = 0, d = b.length; c < 
        d; c++) if (a.CLASS_NAME.indexOf(b[c]) != -1) return b[c]
    },
    clone: function() {
        var a = OpenLayers.Util.extend({},
        this);
        if (this.rules) {
            a.rules = [];
            for (var b = 0, c = this.rules.length; b < c; ++b) a.rules.push(this.rules[b].clone())
        }
        a.context = this.context && OpenLayers.Util.extend({},
        this.context);
        b = OpenLayers.Util.extend({},
        this.defaultStyle);
        return new OpenLayers.Style(b, a)
    },
    CLASS_NAME: "OpenLayers.Style"
});
OpenLayers.Style.createLiteral = function(a, b, c, d) {
    if (typeof a == "string" && a.indexOf("${") != -1) {
        a = OpenLayers.String.format(a, b, [c, d]);
        a = isNaN(a) || !a ? a: parseFloat(a)
    }
    return a
};
OpenLayers.Style.SYMBOLIZER_PREFIXES = ["Point", "Line", "Polygon", "Text", "Raster"];
OpenLayers.StyleMap = OpenLayers.Class({
    styles: null,
    extendDefault: true,
    initialize: function(a, b) {
        this.styles = {
            "default": new OpenLayers.Style(OpenLayers.Feature.Vector.style["default"]),
            select: new OpenLayers.Style(OpenLayers.Feature.Vector.style.select),
            temporary: new OpenLayers.Style(OpenLayers.Feature.Vector.style.temporary),
            "delete": new OpenLayers.Style(OpenLayers.Feature.Vector.style["delete"])
        };
        if (a instanceof OpenLayers.Style) {
            this.styles["default"] = a;
            this.styles.select = a;
            this.styles.temporary = a;
            this.styles["delete"] = a
        } else if (typeof a == "object") for (var c in a) if (a[c] instanceof OpenLayers.Style) this.styles[c] = a[c];
        else if (typeof a[c] == "object") this.styles[c] = new OpenLayers.Style(a[c]);
        else {
            this.styles["default"] = new OpenLayers.Style(a);
            this.styles.select = new OpenLayers.Style(a);
            this.styles.temporary = new OpenLayers.Style(a);
            this.styles["delete"] = new OpenLayers.Style(a);
            break
        }
        OpenLayers.Util.extend(this, b)
    },
    destroy: function() {
        for (var a in this.styles) this.styles[a].destroy();
        this.styles = null
    },
    createSymbolizer: function(a, b) {
        a || (a = new OpenLayers.Feature.Vector);
        this.styles[b] || (b = "default");
        a.renderIntent = b;
        var c = {};
        if (this.extendDefault && b != "default") c = this.styles["default"].createSymbolizer(a);
        return OpenLayers.Util.extend(c, this.styles[b].createSymbolizer(a))
    },
    addUniqueValueRules: function(a, b, c, d) {
        var e = [],
        f;
        for (f in c) e.push(new OpenLayers.Rule({
            symbolizer: c[f],
            context: d,
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: b,
                value: f
            })
        }));
        this.styles[a].addRules(e)
    },
    CLASS_NAME: "OpenLayers.StyleMap"
});
OpenLayers.Layer.Vector = OpenLayers.Class(OpenLayers.Layer, {
    EVENT_TYPES: ["beforefeatureadded", "beforefeaturesadded", "featureadded", "featuresadded", "beforefeatureremoved", "beforefeaturesremoved", "featureremoved", "featuresremoved", "beforefeatureselected", "featureselected", "featureunselected", "beforefeaturemodified", "featuremodified", "afterfeaturemodified", "vertexmodified", "vertexremoved", "sketchstarted", "sketchmodified", "sketchcomplete", "refresh"],
    isBaseLayer: false,
    isFixed: false,
    features: null,
    filter: null,
    selectedFeatures: null,
    unrenderedFeatures: null,
    reportError: true,
    style: null,
    styleMap: null,
    strategies: null,
    protocol: null,
    renderers: ["SVG", "VML", "Canvas"],
    renderer: null,
    rendererOptions: null,
    geometryType: null,
    drawn: false,
    initialize: function() {
        this.EVENT_TYPES = OpenLayers.Layer.Vector.prototype.EVENT_TYPES.concat(OpenLayers.Layer.prototype.EVENT_TYPES);
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        if (!this.renderer || !this.renderer.supported()) this.assignRenderer();
        if (!this.renderer || !this.renderer.supported()) {
            this.renderer = 
            null;
            this.displayError()
        }
        if (!this.styleMap) this.styleMap = new OpenLayers.StyleMap;
        this.features = [];
        this.selectedFeatures = [];
        this.unrenderedFeatures = {};
        if (this.strategies) for (var a = 0, b = this.strategies.length; a < b; a++) this.strategies[a].setLayer(this)
    },
    destroy: function() {
        if (this.strategies) {
            var a,
            b,
            c;
            b = 0;
            for (c = this.strategies.length; b < c; b++) {
                a = this.strategies[b];
                a.autoDestroy && a.destroy()
            }
            this.strategies = null
        }
        if (this.protocol) {
            this.protocol.autoDestroy && this.protocol.destroy();
            this.protocol = null
        }
        this.destroyFeatures();
        this.unrenderedFeatures = this.selectedFeatures = this.features = null;
        this.renderer && this.renderer.destroy();
        this.drawn = this.geometryType = this.renderer = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments)
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Layer.Vector(this.name, this.getOptions());
        a = OpenLayers.Layer.prototype.clone.apply(this, [a]);
        for (var b = this.features, c = b.length, d = Array(c), e = 0; e < c; ++e) d[e] = b[e].clone();
        a.features = d;
        return a
    },
    refresh: function(a) {
        this.calculateInRange() && this.visibility && 
        this.events.triggerEvent("refresh", a)
    },
    assignRenderer: function() {
        for (var a = 0, b = this.renderers.length; a < b; a++) {
            var c = this.renderers[a];
            if ((c = typeof c == "function" ? c: OpenLayers.Renderer[c]) && c.prototype.supported()) {
                this.renderer = new c(this.div, this.rendererOptions);
                break
            }
        }
    },
    displayError: function() {
        this.reportError && OpenLayers.Console.userError(OpenLayers.i18n("browserNotSupported", {
            renderers: this.renderers.join("\n")
        }))
    },
    setMap: function() {
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
        if (this.renderer) {
            this.renderer.map = 
            this.map;
            this.renderer.setSize(this.map.getSize())
        } else this.map.removeLayer(this)
    },
    afterAdd: function() {
        if (this.strategies) {
            var a,
            b,
            c;
            b = 0;
            for (c = this.strategies.length; b < c; b++) {
                a = this.strategies[b];
                a.autoActivate && a.activate()
            }
        }
    },
    removeMap: function() {
        this.drawn = false;
        if (this.strategies) {
            var a,
            b,
            c;
            b = 0;
            for (c = this.strategies.length; b < c; b++) {
                a = this.strategies[b];
                a.autoActivate && a.deactivate()
            }
        }
    },
    onMapResize: function() {
        OpenLayers.Layer.prototype.onMapResize.apply(this, arguments);
        this.renderer.setSize(this.map.getSize())
    },
    moveTo: function(a, b, c) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        var d = OpenLayers.Renderer.NG && this.renderer instanceof OpenLayers.Renderer.NG;
        if (d) c || this.renderer.updateDimensions(b);
        else {
            var e = true;
            if (!c) {
                this.renderer.root.style.visibility = "hidden";
                this.div.style.left = -parseInt(this.map.layerContainerDiv.style.left) + "px";
                this.div.style.top = -parseInt(this.map.layerContainerDiv.style.top) + "px";
                e = this.renderer.setExtent(this.map.getExtent(), b);
                this.renderer.root.style.visibility = "visible";
                if (OpenLayers.IS_GECKO === true) this.div.scrollLeft = this.div.scrollLeft;
                if (!b && e) for (var f in this.unrenderedFeatures) {
                    var g = this.unrenderedFeatures[f];
                    this.drawFeature(g)
                }
            }
        }
        if (!this.drawn || !d && (b || !e)) {
            this.drawn = true;
            f = 0;
            for (d = this.features.length; f < d; f++) {
                this.renderer.locked = f !== d - 1;
                g = this.features[f];
                this.drawFeature(g)
            }
        }
    },
    redraw: function() {
        if (OpenLayers.Renderer.NG && this.renderer instanceof OpenLayers.Renderer.NG) this.drawn = false;
        return OpenLayers.Layer.prototype.redraw.apply(this, arguments)
    },
    display: function() {
        OpenLayers.Layer.prototype.display.apply(this, arguments);
        var a = this.div.style.display;
        if (a != this.renderer.root.style.display) this.renderer.root.style.display = a
    },
    addFeatures: function(a, b) {
        OpenLayers.Util.isArray(a) || (a = [a]);
        var c = !b || !b.silent;
        if (c) {
            var d = {
                features: a
            };
            if (this.events.triggerEvent("beforefeaturesadded", d) === false) return;
            a = d.features
        }
        d = [];
        for (var e = 0, f = a.length; e < f; e++) {
            this.renderer.locked = e != a.length - 1 ? true: false;
            var g = a[e];
            if (this.geometryType && !(g.geometry instanceof
            this.geometryType)) throw OpenLayers.i18n("componentShouldBe", {
                geomType: this.geometryType.prototype.CLASS_NAME
            });
            g.layer = this;
            if (!g.style && this.style) g.style = OpenLayers.Util.extend({},
            this.style);
            if (c) {
                if (this.events.triggerEvent("beforefeatureadded", {
                    feature: g
                }) === false) continue;
                this.preFeatureInsert(g)
            }
            d.push(g);
            this.features.push(g);
            this.drawFeature(g);
            if (c) {
                this.events.triggerEvent("featureadded", {
                    feature: g
                });
                this.onFeatureInsert(g)
            }
        }
        c && this.events.triggerEvent("featuresadded", {
            features: d
        })
    },
    removeFeatures: function(a, 
    b) {
        if (! (!a || a.length === 0)) {
            if (a === this.features) return this.removeAllFeatures(b);
            OpenLayers.Util.isArray(a) || (a = [a]);
            if (a === this.selectedFeatures) a = a.slice();
            var c = !b || !b.silent;
            c && this.events.triggerEvent("beforefeaturesremoved", {
                features: a
            });
            for (var d = a.length - 1; d >= 0; d--) {
                this.renderer.locked = d != 0 && a[d - 1].geometry ? true: false;
                var e = a[d];
                delete this.unrenderedFeatures[e.id];
                c && this.events.triggerEvent("beforefeatureremoved", {
                    feature: e
                });
                this.features = OpenLayers.Util.removeItem(this.features, e);
                e.layer = 
                null;
                e.geometry && this.renderer.eraseFeatures(e);
                OpenLayers.Util.indexOf(this.selectedFeatures, e) != -1 && OpenLayers.Util.removeItem(this.selectedFeatures, e);
                c && this.events.triggerEvent("featureremoved", {
                    feature: e
                })
            }
            c && this.events.triggerEvent("featuresremoved", {
                features: a
            })
        }
    },
    removeAllFeatures: function(a) {
        a = !a || !a.silent;
        var b = this.features;
        a && this.events.triggerEvent("beforefeaturesremoved", {
            features: b
        });
        for (var c, d = b.length - 1; d >= 0; d--) {
            c = b[d];
            a && this.events.triggerEvent("beforefeatureremoved", {
                feature: c
            });
            c.layer = null;
            a && this.events.triggerEvent("featureremoved", {
                feature: c
            })
        }
        this.renderer.clear();
        this.features = [];
        this.unrenderedFeatures = {};
        this.selectedFeatures = [];
        a && this.events.triggerEvent("featuresremoved", {
            features: b
        })
    },
    destroyFeatures: function(a, b) {
        if (a == undefined) a = this.features;
        if (a) {
            this.removeFeatures(a, b);
            for (var c = a.length - 1; c >= 0; c--) a[c].destroy()
        }
    },
    drawFeature: function(a, b) {
        if (this.drawn) {
            if (typeof b != "object") {
                if (!b && a.state === OpenLayers.State.DELETE) b = "delete";
                var c = b || a.renderIntent;
                (b = a.style || this.style) || (b = this.styleMap.createSymbolizer(a, c))
            }
            c = this.renderer.drawFeature(a, b);
            if (c === false || c === null) this.unrenderedFeatures[a.id] = a;
            else delete this.unrenderedFeatures[a.id]
        }
    },
    eraseFeatures: function(a) {
        this.renderer.eraseFeatures(a)
    },
    getFeatureFromEvent: function(a) {
        if (!this.renderer) {
            OpenLayers.Console.error(OpenLayers.i18n("getFeatureError"));
            return null
        }
        var b = null;
        if (a = this.renderer.getFeatureIdFromEvent(a)) b = typeof a === "string" ? this.getFeatureById(a) : a;
        return b
    },
    getFeatureBy: function(a, 
    b) {
        for (var c = null, d = 0, e = this.features.length; d < e; ++d) if (this.features[d][a] == b) {
            c = this.features[d];
            break
        }
        return c
    },
    getFeatureById: function(a) {
        return this.getFeatureBy("id", a)
    },
    getFeatureByFid: function(a) {
        return this.getFeatureBy("fid", a)
    },
    getFeaturesByAttribute: function(a, b) {
        var c,
        d,
        e = this.features.length,
        f = [];
        for (c = 0; c < e; c++)(d = this.features[c]) && d.attributes && d.attributes[a] === b && f.push(d);
        return f
    },
    onFeatureInsert: function() {},
    preFeatureInsert: function() {},
    getDataExtent: function() {
        var a = null,
        b = 
        this.features;
        if (b && b.length > 0) {
            a = new OpenLayers.Bounds;
            for (var c = null, d = 0, e = b.length; d < e; d++)(c = b[d].geometry) && a.extend(c.getBounds())
        }
        return a
    },
    CLASS_NAME: "OpenLayers.Layer.Vector"
});
OpenLayers.Layer.Vector.RootContainer = OpenLayers.Class(OpenLayers.Layer.Vector, {
    displayInLayerSwitcher: false,
    layers: null,
    initialize: function() {
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, arguments)
    },
    display: function() {},
    getFeatureFromEvent: function(a) {
        for (var b = this.layers, c, d = 0; d < b.length; d++) if (c = b[d].getFeatureFromEvent(a)) return c
    },
    setMap: function(a) {
        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
        this.collectRoots();
        a.events.register("changelayer", this, this.handleChangeLayer)
    },
    removeMap: function(a) {
        a.events.unregister("changelayer", this, this.handleChangeLayer);
        this.resetRoots();
        OpenLayers.Layer.Vector.prototype.removeMap.apply(this, arguments)
    },
    collectRoots: function() {
        for (var a, b = 0; b < this.map.layers.length; ++b) {
            a = this.map.layers[b];
            OpenLayers.Util.indexOf(this.layers, a) != -1 && a.renderer.moveRoot(this.renderer)
        }
    },
    resetRoots: function() {
        for (var a, b = 0; b < this.layers.length; ++b) {
            a = this.layers[b];
            this.renderer && a.renderer.getRenderLayerId() == this.id && this.renderer.moveRoot(a.renderer)
        }
    },
    handleChangeLayer: function(a) {
        var b = a.layer;
        if (a.property == "order" && OpenLayers.Util.indexOf(this.layers, b) != -1) {
            this.resetRoots();
            this.collectRoots()
        }
    },
    CLASS_NAME: "OpenLayers.Layer.Vector.RootContainer"
});
OpenLayers.Control.SelectFeature = OpenLayers.Class(OpenLayers.Control, {
    EVENT_TYPES: ["beforefeaturehighlighted", "featurehighlighted", "featureunhighlighted"],
    multipleKey: null,
    toggleKey: null,
    multiple: false,
    clickout: true,
    toggle: false,
    hover: false,
    highlightOnly: false,
    box: false,
    onBeforeSelect: function() {},
    onSelect: function() {},
    onUnselect: function() {},
    scope: null,
    geometryTypes: null,
    layer: null,
    layers: null,
    callbacks: null,
    selectStyle: null,
    renderIntent: "select",
    handlers: null,
    initialize: function(a, b) {
        this.EVENT_TYPES = 
        OpenLayers.Control.SelectFeature.prototype.EVENT_TYPES.concat(OpenLayers.Control.prototype.EVENT_TYPES);
        OpenLayers.Control.prototype.initialize.apply(this, [b]);
        if (this.scope === null) this.scope = this;
        this.initLayer(a);
        var c = {
            click: this.clickFeature,
            clickout: this.clickoutFeature
        };
        if (this.hover) {
            c.over = this.overFeature;
            c.out = this.outFeature
        }
        this.callbacks = OpenLayers.Util.extend(c, this.callbacks);
        this.handlers = {
            feature: new OpenLayers.Handler.Feature(this, this.layer, this.callbacks, {
                geometryTypes: this.geometryTypes
            })
        };
        if (this.box) this.handlers.box = new OpenLayers.Handler.Box(this, {
            done: this.selectBox
        },
        {
            boxDivClassName: "olHandlerBoxSelectFeature"
        })
    },
    initLayer: function(a) {
        if (OpenLayers.Util.isArray(a)) {
            this.layers = a;
            this.layer = new OpenLayers.Layer.Vector.RootContainer(this.id + "_container", {
                layers: a
            })
        } else this.layer = a
    },
    destroy: function() {
        this.active && this.layers && this.map.removeLayer(this.layer);
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
        this.layers && this.layer.destroy()
    },
    activate: function() {
        if (!this.active) {
            this.layers && 
            this.map.addLayer(this.layer);
            this.handlers.feature.activate();
            this.box && this.handlers.box && this.handlers.box.activate()
        }
        return OpenLayers.Control.prototype.activate.apply(this, arguments)
    },
    deactivate: function() {
        if (this.active) {
            this.handlers.feature.deactivate();
            this.handlers.box && this.handlers.box.deactivate();
            this.layers && this.map.removeLayer(this.layer)
        }
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments)
    },
    unselectAll: function(a) {
        for (var b = this.layers || [this.layer], c, d, e = 0; e < b.length; ++e) {
            c = 
            b[e];
            for (var f = c.selectedFeatures.length - 1; f >= 0; --f) {
                d = c.selectedFeatures[f];
                if (!a || a.except != d) this.unselect(d)
            }
        }
    },
    clickFeature: function(a) {
        if (!this.hover) if (OpenLayers.Util.indexOf(a.layer.selectedFeatures, a) > -1) if (this.toggleSelect()) this.unselect(a);
        else this.multipleSelect() || this.unselectAll({
            except: a
        });
        else {
            this.multipleSelect() || this.unselectAll({
                except: a
            });
            this.select(a)
        }
    },
    multipleSelect: function() {
        return this.multiple || this.handlers.feature.evt && this.handlers.feature.evt[this.multipleKey]
    },
    toggleSelect: function() {
        return this.toggle || this.handlers.feature.evt && this.handlers.feature.evt[this.toggleKey]
    },
    clickoutFeature: function() { ! this.hover && this.clickout && this.unselectAll()
    },
    overFeature: function(a) {
        var b = a.layer;
        if (this.hover) if (this.highlightOnly) this.highlight(a);
        else OpenLayers.Util.indexOf(b.selectedFeatures, a) == -1 && this.select(a)
    },
    outFeature: function(a) {
        if (this.hover) if (this.highlightOnly) {
            if (a._lastHighlighter == this.id) if (a._prevHighlighter && a._prevHighlighter != this.id) {
                delete a._lastHighlighter;
                var b = this.map.getControl(a._prevHighlighter);
                b && b.highlight(a)
            } else this.unhighlight(a)
        } else this.unselect(a)
    },
    highlight: function(a) {
        var b = a.layer;
        if (this.events.triggerEvent("beforefeaturehighlighted", {
            feature: a
        }) !== false) {
            a._prevHighlighter = a._lastHighlighter;
            a._lastHighlighter = this.id;
            b.drawFeature(a, this.selectStyle || this.renderIntent);
            this.events.triggerEvent("featurehighlighted", {
                feature: a
            })
        }
    },
    unhighlight: function(a) {
        var b = a.layer;
        if (a._prevHighlighter == undefined) delete a._lastHighlighter;
        else {
            if (a._prevHighlighter != this.id) a._lastHighlighter = a._prevHighlighter;
            delete a._prevHighlighter
        }
        b.drawFeature(a, a.style || a.layer.style || "default");
        this.events.triggerEvent("featureunhighlighted", {
            feature: a
        })
    },
    select: function(a) {
        var b = this.onBeforeSelect.call(this.scope, a),
        c = a.layer;
        if (b !== false) {
            b = c.events.triggerEvent("beforefeatureselected", {
                feature: a
            });
            if (b !== false) {
                c.selectedFeatures.push(a);
                this.highlight(a);
                if (!this.handlers.feature.lastFeature) this.handlers.feature.lastFeature = c.selectedFeatures[0];
                c.events.triggerEvent("featureselected", {
                    feature: a
                });
                this.onSelect.call(this.scope, a)
            }
        }
    },
    unselect: function(a) {
        var b = a.layer;
        this.unhighlight(a);
        OpenLayers.Util.removeItem(b.selectedFeatures, a);
        b.events.triggerEvent("featureunselected", {
            feature: a
        });
        this.onUnselect.call(this.scope, a)
    },
    selectBox: function(a) {
        if (a instanceof OpenLayers.Bounds) {
            var b = this.map.getLonLatFromPixel(new OpenLayers.Pixel(a.left, a.bottom));
            a = this.map.getLonLatFromPixel(new OpenLayers.Pixel(a.right, a.top));
            b = new OpenLayers.Bounds(b.lon, 
            b.lat, a.lon, a.lat);
            this.multipleSelect() || this.unselectAll();
            a = this.multiple;
            this.multiple = true;
            for (var c = this.layers || [this.layer], d, e = 0; e < c.length; ++e) {
                d = c[e];
                for (var f = 0, g = d.features.length; f < g; ++f) {
                    var h = d.features[f];
                    if (h.getVisibility()) if (this.geometryTypes == null || OpenLayers.Util.indexOf(this.geometryTypes, h.geometry.CLASS_NAME) > -1) b.toGeometry().intersects(h.geometry) && OpenLayers.Util.indexOf(d.selectedFeatures, h) == -1 && this.select(h)
                }
            }
            this.multiple = a
        }
    },
    setMap: function(a) {
        this.handlers.feature.setMap(a);
        this.box && this.handlers.box.setMap(a);
        OpenLayers.Control.prototype.setMap.apply(this, arguments)
    },
    setLayer: function(a) {
        var b = this.active;
        this.unselectAll();
        this.deactivate();
        if (this.layers) {
            this.layer.destroy();
            this.layers = null
        }
        this.initLayer(a);
        this.handlers.feature.layer = this.layer;
        b && this.activate()
    },
    CLASS_NAME: "OpenLayers.Control.SelectFeature"
});
OpenLayers.Handler.Keyboard = OpenLayers.Class(OpenLayers.Handler, {
    KEY_EVENTS: ["keydown", "keyup"],
    eventListener: null,
    initialize: function() {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.eventListener = OpenLayers.Function.bindAsEventListener(this.handleKeyEvent, this)
    },
    destroy: function() {
        this.deactivate();
        this.eventListener = null;
        OpenLayers.Handler.prototype.destroy.apply(this, arguments)
    },
    activate: function() {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            for (var a = 0, 
            b = this.KEY_EVENTS.length; a < b; a++) OpenLayers.Event.observe(document, this.KEY_EVENTS[a], this.eventListener);
            return true
        } else return false
    },
    deactivate: function() {
        var a = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            a = 0;
            for (var b = this.KEY_EVENTS.length; a < b; a++) OpenLayers.Event.stopObserving(document, this.KEY_EVENTS[a], this.eventListener);
            a = true
        }
        return a
    },
    handleKeyEvent: function(a) {
        this.checkModifiers(a) && this.callback(a.type, [a])
    },
    CLASS_NAME: "OpenLayers.Handler.Keyboard"
});
OpenLayers.Control.ModifyFeature = OpenLayers.Class(OpenLayers.Control, {
    geometryTypes: null,
    clickout: true,
    toggle: true,
    standalone: false,
    layer: null,
    feature: null,
    vertices: null,
    virtualVertices: null,
    selectControl: null,
    dragControl: null,
    handlers: null,
    deleteCodes: null,
    virtualStyle: null,
    vertexRenderIntent: null,
    mode: null,
    modified: false,
    radiusHandle: null,
    dragHandle: null,
    onModificationStart: function() {},
    onModification: function() {},
    onModificationEnd: function() {},
    initialize: function(a, b) {
        b = b || {};
        this.layer = a;
        this.vertices = 
        [];
        this.virtualVertices = [];
        this.virtualStyle = OpenLayers.Util.extend({},
        this.layer.style || this.layer.styleMap.createSymbolizer(null, b.vertexRenderIntent));
        this.virtualStyle.fillOpacity = 0.3;
        this.virtualStyle.strokeOpacity = 0.3;
        this.deleteCodes = [46, 68];
        this.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
        OpenLayers.Control.prototype.initialize.apply(this, [b]);
        if (!OpenLayers.Util.isArray(this.deleteCodes)) this.deleteCodes = [this.deleteCodes];
        var c = this,
        d = {
            geometryTypes: this.geometryTypes,
            clickout: this.clickout,
            toggle: this.toggle,
            onBeforeSelect: this.beforeSelectFeature,
            onSelect: this.selectFeature,
            onUnselect: this.unselectFeature,
            scope: this
        };
        if (this.standalone === false) this.selectControl = new OpenLayers.Control.SelectFeature(a, d);
        this.dragControl = new OpenLayers.Control.DragFeature(a, {
            geometryTypes: ["OpenLayers.Geometry.Point"],
            snappingOptions: this.snappingOptions,
            onStart: function(e, f) {
                c.dragStart.apply(c, [e, f])
            },
            onDrag: function(e, f) {
                c.dragVertex.apply(c, [e, f])
            },
            onComplete: function(e) {
                c.dragComplete.apply(c, 
                [e])
            },
            featureCallbacks: {
                over: function(e) {
                    if (c.standalone !== true || e._sketch || c.feature === e) c.dragControl.overFeature.apply(c.dragControl, [e])
                }
            }
        });
        this.handlers = {
            keyboard: new OpenLayers.Handler.Keyboard(this, {
                keydown: this.handleKeypress
            })
        }
    },
    destroy: function() {
        this.layer = null;
        this.standalone || this.selectControl.destroy();
        this.dragControl.destroy();
        OpenLayers.Control.prototype.destroy.apply(this, [])
    },
    activate: function() {
        return (this.standalone || this.selectControl.activate()) && this.handlers.keyboard.activate() && 
        OpenLayers.Control.prototype.activate.apply(this, arguments)
    },
    deactivate: function() {
        var a = false;
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            this.layer.removeFeatures(this.vertices, {
                silent: true
            });
            this.layer.removeFeatures(this.virtualVertices, {
                silent: true
            });
            this.vertices = [];
            this.dragControl.deactivate();
            var b = (a = this.feature) && a.geometry && a.layer;
            if (this.standalone === false) {
                b && this.selectControl.unselect.apply(this.selectControl, [a]);
                this.selectControl.deactivate()
            } else b && this.unselectFeature(a);
            this.handlers.keyboard.deactivate();
            a = true
        }
        return a
    },
    beforeSelectFeature: function(a) {
        return this.layer.events.triggerEvent("beforefeaturemodified", {
            feature: a
        })
    },
    selectFeature: function(a) {
        if (!this.standalone || this.beforeSelectFeature(a) !== false) {
            this.feature = a;
            this.modified = false;
            this.resetVertices();
            this.dragControl.activate();
            this.onModificationStart(this.feature)
        }
        var b = a.modified;
        if (a.geometry && !(b && b.geometry)) this._originalGeometry = a.geometry.clone()
    },
    unselectFeature: function(a) {
        this.layer.removeFeatures(this.vertices, 
        {
            silent: true
        });
        this.vertices = [];
        this.layer.destroyFeatures(this.virtualVertices, {
            silent: true
        });
        this.virtualVertices = [];
        if (this.dragHandle) {
            this.layer.destroyFeatures([this.dragHandle], {
                silent: true
            });
            delete this.dragHandle
        }
        if (this.radiusHandle) {
            this.layer.destroyFeatures([this.radiusHandle], {
                silent: true
            });
            delete this.radiusHandle
        }
        this.feature = null;
        this.dragControl.deactivate();
        this.onModificationEnd(a);
        this.layer.events.triggerEvent("afterfeaturemodified", {
            feature: a,
            modified: this.modified
        });
        this.modified = 
        false
    },
    dragStart: function(a, b) {
        if (a != this.feature && !a.geometry.parent && a != this.dragHandle && a != this.radiusHandle) {
            this.standalone === false && this.feature && this.selectControl.clickFeature.apply(this.selectControl, [this.feature]);
            if (this.geometryTypes == null || OpenLayers.Util.indexOf(this.geometryTypes, a.geometry.CLASS_NAME) != -1) {
                this.standalone || this.selectControl.clickFeature.apply(this.selectControl, [a]);
                this.dragControl.overFeature.apply(this.dragControl, [a]);
                this.dragControl.lastPixel = b;
                this.dragControl.handlers.drag.started = 
                true;
                this.dragControl.handlers.drag.start = b;
                this.dragControl.handlers.drag.last = b
            }
        }
    },
    dragVertex: function(a, b) {
        this.modified = true;
        if (this.feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            if (this.feature != a) this.feature = a;
            this.layer.events.triggerEvent("vertexmodified", {
                vertex: a.geometry,
                feature: this.feature,
                pixel: b
            })
        } else {
            if (a._index) {
                a.geometry.parent.addComponent(a.geometry, a._index);
                delete a._index;
                OpenLayers.Util.removeItem(this.virtualVertices, a);
                this.vertices.push(a)
            } else if (a == this.dragHandle) {
                this.layer.removeFeatures(this.vertices, 
                {
                    silent: true
                });
                this.vertices = [];
                if (this.radiusHandle) {
                    this.layer.destroyFeatures([this.radiusHandle], {
                        silent: true
                    });
                    this.radiusHandle = null
                }
            } else a !== this.radiusHandle && this.layer.events.triggerEvent("vertexmodified", {
                vertex: a.geometry,
                feature: this.feature,
                pixel: b
            });
            if (this.virtualVertices.length > 0) {
                this.layer.destroyFeatures(this.virtualVertices, {
                    silent: true
                });
                this.virtualVertices = []
            }
            this.layer.drawFeature(this.feature, this.standalone ? undefined: this.selectControl.renderIntent)
        }
        this.layer.drawFeature(a)
    },
    dragComplete: function() {
        this.resetVertices();
        this.setFeatureState();
        this.onModification(this.feature);
        this.layer.events.triggerEvent("featuremodified", {
            feature: this.feature
        })
    },
    setFeatureState: function() {
        if (this.feature.state != OpenLayers.State.INSERT && this.feature.state != OpenLayers.State.DELETE) {
            this.feature.state = OpenLayers.State.UPDATE;
            if (this.modified && this._originalGeometry) {
                var a = this.feature;
                a.modified = OpenLayers.Util.extend(a.modified, {
                    geometry: this._originalGeometry
                });
                delete this._originalGeometry
            }
        }
    },
    resetVertices: function() {
        this.dragControl.feature && this.dragControl.outFeature(this.dragControl.feature);
        if (this.vertices.length > 0) {
            this.layer.removeFeatures(this.vertices, {
                silent: true
            });
            this.vertices = []
        }
        if (this.virtualVertices.length > 0) {
            this.layer.removeFeatures(this.virtualVertices, {
                silent: true
            });
            this.virtualVertices = []
        }
        if (this.dragHandle) {
            this.layer.destroyFeatures([this.dragHandle], {
                silent: true
            });
            this.dragHandle = null
        }
        if (this.radiusHandle) {
            this.layer.destroyFeatures([this.radiusHandle], {
                silent: true
            });
            this.radiusHandle = null
        }
        if (this.feature && this.feature.geometry.CLASS_NAME != "OpenLayers.Geometry.Point") {
            this.mode & OpenLayers.Control.ModifyFeature.DRAG && this.collectDragHandle();
            this.mode & (OpenLayers.Control.ModifyFeature.ROTATE | OpenLayers.Control.ModifyFeature.RESIZE) && this.collectRadiusHandle();
            if (this.mode & OpenLayers.Control.ModifyFeature.RESHAPE) this.mode & OpenLayers.Control.ModifyFeature.RESIZE || this.collectVertices()
        }
    },
    handleKeypress: function(a) {
        var b = a.keyCode;
        if (this.feature && OpenLayers.Util.indexOf(this.deleteCodes, 
        b) != -1) if ((b = this.dragControl.feature) && OpenLayers.Util.indexOf(this.vertices, b) != -1 && !this.dragControl.handlers.drag.dragging && b.geometry.parent) {
            b.geometry.parent.removeComponent(b.geometry);
            this.layer.events.triggerEvent("vertexremoved", {
                vertex: b.geometry,
                feature: this.feature,
                pixel: a.xy
            });
            this.layer.drawFeature(this.feature, this.standalone ? undefined: this.selectControl.renderIntent);
            this.resetVertices();
            this.setFeatureState();
            this.onModification(this.feature);
            this.layer.events.triggerEvent("featuremodified", 
            {
                feature: this.feature
            })
        }
    },
    collectVertices: function() {
        function a(c) {
            var d,
            e,
            f;
            if (c.CLASS_NAME == "OpenLayers.Geometry.Point") {
                e = new OpenLayers.Feature.Vector(c);
                e._sketch = true;
                e.renderIntent = b.vertexRenderIntent;
                b.vertices.push(e)
            } else {
                f = c.components.length;
                if (c.CLASS_NAME == "OpenLayers.Geometry.LinearRing") f -= 1;
                for (d = 0; d < f; ++d) {
                    e = c.components[d];
                    if (e.CLASS_NAME == "OpenLayers.Geometry.Point") {
                        e = new OpenLayers.Feature.Vector(e);
                        e._sketch = true;
                        e.renderIntent = b.vertexRenderIntent;
                        b.vertices.push(e)
                    } else a(e)
                }
                if (c.CLASS_NAME != 
                "OpenLayers.Geometry.MultiPoint") {
                    d = 0;
                    for (f = c.components.length; d < f - 1; ++d) {
                        e = c.components[d];
                        var g = c.components[d + 1];
                        if (e.CLASS_NAME == "OpenLayers.Geometry.Point" && g.CLASS_NAME == "OpenLayers.Geometry.Point") {
                            e = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point((e.x + g.x) / 2, (e.y + g.y) / 2), null, b.virtualStyle);
                            e.geometry.parent = c;
                            e._index = d + 1;
                            e._sketch = true;
                            b.virtualVertices.push(e)
                        }
                    }
                }
            }
        }
        this.vertices = [];
        this.virtualVertices = [];
        var b = this;
        a.call(this, this.feature.geometry);
        this.layer.addFeatures(this.virtualVertices, 
        {
            silent: true
        });
        this.layer.addFeatures(this.vertices, {
            silent: true
        })
    },
    collectDragHandle: function() {
        var a = this.feature.geometry,
        b = a.getBounds().getCenterLonLat();
        b = new OpenLayers.Geometry.Point(b.lon, b.lat);
        var c = new OpenLayers.Feature.Vector(b);
        b.move = function(d, e) {
            OpenLayers.Geometry.Point.prototype.move.call(this, d, e);
            a.move(d, e)
        };
        c._sketch = true;
        this.dragHandle = c;
        this.layer.addFeatures([this.dragHandle], {
            silent: true
        })
    },
    collectRadiusHandle: function() {
        var a = this.feature.geometry,
        b = a.getBounds(),
        c = b.getCenterLonLat(),
        d = new OpenLayers.Geometry.Point(c.lon, c.lat);
        b = new OpenLayers.Geometry.Point(b.right, b.bottom);
        c = new OpenLayers.Feature.Vector(b);
        var e = this.mode & OpenLayers.Control.ModifyFeature.RESIZE,
        f = this.mode & OpenLayers.Control.ModifyFeature.RESHAPE,
        g = this.mode & OpenLayers.Control.ModifyFeature.ROTATE;
        b.move = function(h, i) {
            OpenLayers.Geometry.Point.prototype.move.call(this, h, i);
            var j = this.x - d.x,
            k = this.y - d.y,
            l = j - h,
            m = k - i;
            if (g) {
                var n = Math.atan2(k, j) - Math.atan2(m, l);
                n *= 180 / Math.PI;
                a.rotate(n, d)
            }
            if (e) {
                var o;
                if (f) {
                    k /= 
                    m;
                    o = j / l / k
                } else k = Math.sqrt(j * j + k * k) / Math.sqrt(l * l + m * m);
                a.resize(k, d, o)
            }
        };
        c._sketch = true;
        this.radiusHandle = c;
        this.layer.addFeatures([this.radiusHandle], {
            silent: true
        })
    },
    setMap: function(a) {
        this.standalone || this.selectControl.setMap(a);
        this.dragControl.setMap(a);
        OpenLayers.Control.prototype.setMap.apply(this, arguments)
    },
    CLASS_NAME: "OpenLayers.Control.ModifyFeature"
});
OpenLayers.Control.ModifyFeature.RESHAPE = 1;
OpenLayers.Control.ModifyFeature.RESIZE = 2;
OpenLayers.Control.ModifyFeature.ROTATE = 4;
OpenLayers.Control.ModifyFeature.DRAG = 8;
OpenLayers.Layer.HTTPRequest = OpenLayers.Class(OpenLayers.Layer, {
    URL_HASH_FACTOR: (Math.sqrt(5) - 1) / 2,
    url: null,
    params: null,
    reproject: false,
    initialize: function(a, b, c, d) {
        var e = arguments;
        e = [a, d];
        OpenLayers.Layer.prototype.initialize.apply(this, e);
        this.url = b;
        this.params = OpenLayers.Util.extend({},
        c)
    },
    destroy: function() {
        this.params = this.url = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments)
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Layer.HTTPRequest(this.name, this.url, this.params, this.getOptions());
        return a = OpenLayers.Layer.prototype.clone.apply(this, [a])
    },
    setUrl: function(a) {
        this.url = a
    },
    mergeNewParams: function(a) {
        this.params = OpenLayers.Util.extend(this.params, a);
        a = this.redraw();
        this.map != null && this.map.events.triggerEvent("changelayer", {
            layer: this,
            property: "params"
        });
        return a
    },
    redraw: function(a) {
        return a ? this.mergeNewParams({
            _olSalt: Math.random()
        }) : OpenLayers.Layer.prototype.redraw.apply(this, [])
    },
    selectUrl: function(a, b) {
        for (var c = 1, d = 0, e = a.length; d < e; d++) {
            c *= a.charCodeAt(d) * this.URL_HASH_FACTOR;
            c -= Math.floor(c)
        }
        return b[Math.floor(c * b.length)]
    },
    getFullRequestString: function(a, b) {
        var c = b || this.url,
        d = OpenLayers.Util.extend({},
        this.params);
        d = OpenLayers.Util.extend(d, a);
        var e = OpenLayers.Util.getParameterString(d);
        if (OpenLayers.Util.isArray(c)) c = this.selectUrl(e, c);
        e = OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(c));
        for (var f in d) f.toUpperCase() in e && delete d[f];
        e = OpenLayers.Util.getParameterString(d);
        return OpenLayers.Util.urlAppend(c, e)
    },
    CLASS_NAME: "OpenLayers.Layer.HTTPRequest"
});
OpenLayers.Layer.Grid = OpenLayers.Class(OpenLayers.Layer.HTTPRequest, {
    tileSize: null,
    tileOriginCorner: "bl",
    tileOrigin: null,
    tileOptions: null,
    grid: null,
    singleTile: false,
    ratio: 1.5,
    buffer: 0,
    numLoadingTiles: 0,
    tileLoadingDelay: 100,
    timerId: null,
    initialize: function() {
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, arguments);
        this.events.addEventType("tileloaded");
        this.grid = [];
        this._moveGriddedTiles = OpenLayers.Function.bind(this.moveGriddedTiles, this)
    },
    removeMap: function() {
        if (this.timerId != null) {
            window.clearTimeout(this.timerId);
            this.timerId = null
        }
    },
    destroy: function() {
        this.clearGrid();
        this.tileSize = this.grid = null;
        OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this, arguments)
    },
    clearGrid: function() {
        if (this.grid) {
            for (var a = 0, b = this.grid.length; a < b; a++) for (var c = this.grid[a], d = 0, e = c.length; d < e; d++) {
                var f = c[d];
                this.removeTileMonitoringHooks(f);
                f.destroy()
            }
            this.grid = []
        }
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Layer.Grid(this.name, this.url, this.params, this.getOptions());
        a = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, 
        [a]);
        if (this.tileSize != null) a.tileSize = this.tileSize.clone();
        a.grid = [];
        return a
    },
    moveTo: function(a, b, c) {
        OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this, arguments);
        a = a || this.map.getExtent();
        if (a != null) {
            var d = !this.grid.length || b,
            e = this.getTilesBounds();
            if (this.singleTile) {
                if (d || !c && !e.containsBounds(a)) this.initSingleTile(a)
            } else d || !e.containsBounds(a, true) ? this.initGriddedTiles(a) : this.scheduleMoveGriddedTiles()
        }
    },
    moveByPx: function() {
        this.singleTile || this.scheduleMoveGriddedTiles()
    },
    scheduleMoveGriddedTiles: function() {
        this.timerId != 
        null && window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(this._moveGriddedTiles, this.tileLoadingDelay)
    },
    setTileSize: function(a) {
        if (this.singleTile) {
            a = this.map.getSize();
            a.h = parseInt(a.h * this.ratio);
            a.w = parseInt(a.w * this.ratio)
        }
        OpenLayers.Layer.HTTPRequest.prototype.setTileSize.apply(this, [a])
    },
    getGridBounds: function() {
        OpenLayers.Console.warn("The getGridBounds() function is deprecated. It will be removed in 3.0. Please use getTilesBounds() instead.");
        return this.getTilesBounds()
    },
    getTilesBounds: function() {
        var a = 
        null;
        if (this.grid.length) {
            a = this.grid[this.grid.length - 1][0];
            var b = this.grid[0][this.grid[0].length - 1];
            a = new OpenLayers.Bounds(a.bounds.left, a.bounds.bottom, b.bounds.right, b.bounds.top)
        }
        return a
    },
    initSingleTile: function(a) {
        var b = a.getCenterLonLat(),
        c = a.getWidth() * this.ratio;
        a = a.getHeight() * this.ratio;
        b = new OpenLayers.Bounds(b.lon - c / 2, b.lat - a / 2, b.lon + c / 2, b.lat + a / 2);
        c = this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(b.left, b.top));
        this.grid.length || (this.grid[0] = []);
        if (a = this.grid[0][0]) a.moveTo(b, 
        c);
        else {
            a = this.addTile(b, c);
            this.addTileMonitoringHooks(a);
            a.draw();
            this.grid[0][0] = a
        }
        this.removeExcessTiles(1, 1)
    },
    calculateGridLayout: function(a, b, c) {
        var d = c * this.tileSize.w;
        c *= this.tileSize.h;
        var e = a.left - b.lon,
        f = Math.floor(e / d) - this.buffer;
        a = a.top - (b.lat + c);
        var g = Math.ceil(a / c) + this.buffer;
        return {
            tilelon: d,
            tilelat: c,
            tileoffsetlon: b.lon + f * d,
            tileoffsetlat: b.lat + g * c,
            tileoffsetx: -(e / d - f) * this.tileSize.w,
            tileoffsety: -(g - a / c) * this.tileSize.h
        }
    },
    getTileOrigin: function() {
        var a = this.tileOrigin;
        if (!a) {
            a = 
            this.getMaxExtent();
            var b = {
                tl: ["left", "top"],
                tr: ["right", "top"],
                bl: ["left", "bottom"],
                br: ["right", "bottom"]
            } [this.tileOriginCorner];
            a = new OpenLayers.LonLat(a[b[0]], a[b[1]])
        }
        return a
    },
    initGriddedTiles: function(a) {
        var b = this.map.getSize(),
        c = Math.ceil(b.h / this.tileSize.h) + Math.max(1, 2 * this.buffer);
        b = Math.ceil(b.w / this.tileSize.w) + Math.max(1, 2 * this.buffer);
        var d = this.getTileOrigin(),
        e = this.map.getResolution(),
        f = this.calculateGridLayout(a, d, e);
        d = Math.round(f.tileoffsetx);
        e = Math.round(f.tileoffsety);
        var g = 
        f.tileoffsetlon,
        h = f.tileoffsetlat,
        i = f.tilelon;
        f = f.tilelat;
        this.origin = new OpenLayers.Pixel(d, e);
        var j = d,
        k = g,
        l = 0,
        m = parseInt(this.map.layerContainerDiv.style.left),
        n = parseInt(this.map.layerContainerDiv.style.top);
        do {
            var o = this.grid[l++];
            if (!o) {
                o = [];
                this.grid.push(o)
            }
            g = k;
            d = j;
            var p = 0;
            do {
                var q = new OpenLayers.Bounds(g, h, g + i, h + f),
                r = d;
                r -= m;
                var s = e;
                s -= n;
                r = new OpenLayers.Pixel(r, s);
                if (s = o[p++]) s.moveTo(q, r, false);
                else {
                    s = this.addTile(q, r);
                    this.addTileMonitoringHooks(s);
                    o.push(s)
                }
                g += i;
                d += this.tileSize.w
            }
            while (g <= 
            a.right + i * this.buffer || p < b);
            h -= f;
            e += this.tileSize.h
        }
        while (h >= a.bottom - f * this.buffer || l < c);
        this.removeExcessTiles(l, p);
        this.spiralTileLoad()
    },
    getMaxExtent: function() {
        return this.maxExtent
    },
    spiralTileLoad: function() {
        for (var a = [], b = ["right", "down", "left", "up"], c = 0, d = -1, e = OpenLayers.Util.indexOf(b, "right"), f = 0; f < b.length;) {
            var g = c,
            h = d;
            switch (b[e]) {
            case "right":
                h++;
                break;
            case "down":
                g++;
                break;
            case "left":
                h--;
                break;
            case "up":
                g--
            }
            var i = null;
            if (g < this.grid.length && g >= 0 && h < this.grid[0].length && h >= 0) i = this.grid[g][h];
            if (i != null && !i.queued) {
                a.unshift(i);
                i.queued = true;
                f = 0;
                c = g;
                d = h
            } else {
                e = (e + 1) % 4;
                f++
            }
        }
        b = 0;
        for (c = a.length; b < c; b++) {
            i = a[b];
            i.draw();
            i.queued = false
        }
    },
    addTile: function(a, b) {
        return new OpenLayers.Tile.Image(this, b, a, null, this.tileSize, this.tileOptions)
    },
    addTileMonitoringHooks: function(a) {
        a.onLoadStart = function() {
            this.numLoadingTiles == 0 && this.events.triggerEvent("loadstart");
            this.numLoadingTiles++
        };
        a.events.register("loadstart", this, a.onLoadStart);
        a.onLoadEnd = function() {
            this.numLoadingTiles--;
            this.events.triggerEvent("tileloaded");
            this.numLoadingTiles == 0 && this.events.triggerEvent("loadend")
        };
        a.events.register("loadend", this, a.onLoadEnd);
        a.events.register("unload", this, a.onLoadEnd)
    },
    removeTileMonitoringHooks: function(a) {
        a.unload();
        a.events.un({
            loadstart: a.onLoadStart,
            loadend: a.onLoadEnd,
            unload: a.onLoadEnd,
            scope: this
        })
    },
    moveGriddedTiles: function() {
        var a = true,
        b = this.buffer || 1,
        c = this.grid[0][0].position,
        d = parseInt(this.map.layerContainerDiv.style.left),
        e = parseInt(this.map.layerContainerDiv.style.top);
        c = c.add(d, e);
        if (c.x > -this.tileSize.w * 
        (b - 1)) this.shiftColumn(true);
        else if (c.x < -this.tileSize.w * b) this.shiftColumn(false);
        else if (c.y > -this.tileSize.h * (b - 1)) this.shiftRow(true);
        else if (c.y < -this.tileSize.h * b) this.shiftRow(false);
        else a = false;
        if (a) this.timerId = window.setTimeout(this._moveGriddedTiles, 0)
    },
    shiftRow: function(a) {
        var b = this.grid,
        c = b[a ? 0: this.grid.length - 1],
        d = this.map.getResolution(),
        e = a ? -this.tileSize.h: this.tileSize.h;
        d *= -e;
        for (var f = a ? b.pop() : b.shift(), g = 0, h = c.length; g < h; g++) {
            var i = c[g],
            j = i.bounds.clone();
            i = i.position.clone();
            j.bottom += d;
            j.top += d;
            i.y += e;
            f[g].moveTo(j, i)
        }
        a ? b.unshift(f) : b.push(f)
    },
    shiftColumn: function(a) {
        for (var b = a ? -this.tileSize.w: this.tileSize.w, c = this.map.getResolution() * b, d = 0, e = this.grid.length; d < e; d++) {
            var f = this.grid[d],
            g = f[a ? 0: f.length - 1],
            h = g.bounds.clone();
            g = g.position.clone();
            h.left += c;
            h.right += c;
            g.x += b;
            var i = a ? this.grid[d].pop() : this.grid[d].shift();
            i.moveTo(h, g);
            a ? f.unshift(i) : f.push(i)
        }
    },
    removeExcessTiles: function(a, b) {
        for (; this.grid.length > a;) for (var c = this.grid.pop(), d = 0, e = c.length; d < e; d++) {
            var f = 
            c[d];
            this.removeTileMonitoringHooks(f);
            f.destroy()
        }
        for (; this.grid[0].length > b;) {
            d = 0;
            for (e = this.grid.length; d < e; d++) {
                c = this.grid[d];
                f = c.pop();
                this.removeTileMonitoringHooks(f);
                f.destroy()
            }
        }
    },
    onMapResize: function() {
        if (this.singleTile) {
            this.clearGrid();
            this.setTileSize()
        }
    },
    getTileBounds: function(a) {
        var b = this.maxExtent,
        c = this.getResolution(),
        d = c * this.tileSize.w;
        c *= this.tileSize.h;
        var e = this.getLonLatFromViewPortPx(a);
        a = b.left + d * Math.floor((e.lon - b.left) / d);
        b = b.bottom + c * Math.floor((e.lat - b.bottom) / c);
        return new OpenLayers.Bounds(a, b, a + d, b + c)
    },
    CLASS_NAME: "OpenLayers.Layer.Grid"
});
OpenLayers.Tile = OpenLayers.Class({
    EVENT_TYPES: ["loadstart", "loadend", "reload", "unload"],
    events: null,
    id: null,
    layer: null,
    url: null,
    bounds: null,
    size: null,
    position: null,
    isLoading: false,
    initialize: function(a, b, c, d, e, f) {
        this.layer = a;
        this.position = b.clone();
        this.bounds = c.clone();
        this.url = d;
        if (e) this.size = e.clone();
        this.id = OpenLayers.Util.createUniqueID("Tile_");
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
        OpenLayers.Util.extend(this, f)
    },
    unload: function() {
        if (this.isLoading) {
            this.isLoading = 
            false;
            this.events.triggerEvent("unload")
        }
    },
    destroy: function() {
        this.position = this.size = this.bounds = this.layer = null;
        this.events.destroy();
        this.events = null
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Tile(this.layer, this.position, this.bounds, this.url, this.size);
        OpenLayers.Util.applyDefaults(a, this);
        return a
    },
    draw: function() {
        var a = this.layer.maxExtent;
        this.shouldDraw = a && this.bounds.intersectsBounds(a, false) || this.layer.displayOutsideMaxExtent;
        this.clear();
        return this.shouldDraw
    },
    moveTo: function(a, 
    b, c) {
        if (c == null) c = true;
        this.bounds = a.clone();
        this.position = b.clone();
        c && this.draw()
    },
    clear: function() {},
    getBoundsFromBaseLayer: function(a) {
        var b = OpenLayers.i18n("reprojectDeprecated", {
            layerName: this.layer.name
        });
        OpenLayers.Console.warn(b);
        b = this.layer.map.getLonLatFromLayerPx(a);
        a = a.clone();
        a.x += this.size.w;
        a.y += this.size.h;
        a = this.layer.map.getLonLatFromLayerPx(a);
        if (b.lon > a.lon) if (b.lon < 0) b.lon = -180 - (b.lon + 180);
        else a.lon = 180 + a.lon + 180;
        return new OpenLayers.Bounds(b.lon, a.lat, a.lon, b.lat)
    },
    showTile: function() {
        this.shouldDraw && 
        this.show()
    },
    show: function() {},
    hide: function() {},
    CLASS_NAME: "OpenLayers.Tile"
});
OpenLayers.Tile.Image = OpenLayers.Class(OpenLayers.Tile, {
    url: null,
    imgDiv: null,
    frame: null,
    layerAlphaHack: null,
    isBackBuffer: false,
    isFirstDraw: true,
    backBufferTile: null,
    maxGetUrlLength: null,
    initialize: function(a, b, c, d) {
        OpenLayers.Tile.prototype.initialize.apply(this, arguments);
        this.maxGetUrlLength != null && OpenLayers.Util.extend(this, OpenLayers.Tile.Image.IFrame);
        this.url = d;
        this.frame = document.createElement("div");
        this.frame.style.overflow = "hidden";
        this.frame.style.position = "absolute";
        this.layerAlphaHack = 
        this.layer.alpha && OpenLayers.Util.alphaHack()
    },
    destroy: function() {
        this.imgDiv != null && this.removeImgDiv();
        this.imgDiv = null;
        this.frame != null && this.frame.parentNode == this.layer.div && this.layer.div.removeChild(this.frame);
        this.frame = null;
        if (this.backBufferTile) {
            this.backBufferTile.destroy();
            this.backBufferTile = null
        }
        this.layer.events.unregister("loadend", this, this.resetBackBuffer);
        OpenLayers.Tile.prototype.destroy.apply(this, arguments)
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Tile.Image(this.layer, 
        this.position, this.bounds, this.url, this.size);
        a = OpenLayers.Tile.prototype.clone.apply(this, [a]);
        a.imgDiv = null;
        return a
    },
    draw: function() {
        if (this.layer != this.layer.map.baseLayer && this.layer.reproject) this.bounds = this.getBoundsFromBaseLayer(this.position);
        var a = OpenLayers.Tile.prototype.draw.apply(this, arguments);
        if (OpenLayers.Util.indexOf(this.layer.SUPPORTED_TRANSITIONS, this.layer.transitionEffect) != -1 || this.layer.singleTile) if (a) {
            if (!this.backBufferTile) {
                this.backBufferTile = this.clone();
                this.backBufferTile.hide();
                this.backBufferTile.isBackBuffer = true;
                this.events.register("loadend", this, this.resetBackBuffer);
                this.layer.events.register("loadend", this, this.resetBackBuffer)
            }
            this.startTransition()
        } else this.backBufferTile && this.backBufferTile.clear();
        else if (a && this.isFirstDraw) {
            this.events.register("loadend", this, this.showTile);
            this.isFirstDraw = false
        }
        if (!a) return false;
        if (this.isLoading) this.events.triggerEvent("reload");
        else {
            this.isLoading = true;
            this.events.triggerEvent("loadstart")
        }
        return this.renderTile()
    },
    resetBackBuffer: function() {
        this.showTile();
        if (this.backBufferTile && (this.isFirstDraw || !this.layer.numLoadingTiles)) {
            this.isFirstDraw = false;
            var a = this.layer.maxExtent;
            if (a && this.bounds.intersectsBounds(a, false)) {
                this.backBufferTile.position = this.position;
                this.backBufferTile.bounds = this.bounds;
                this.backBufferTile.size = this.size;
                this.backBufferTile.imageSize = this.layer.getImageSize(this.bounds) || this.size;
                this.backBufferTile.imageOffset = this.layer.imageOffset;
                this.backBufferTile.resolution = this.layer.getResolution();
                this.backBufferTile.renderTile()
            }
            this.backBufferTile.hide()
        }
    },
    renderTile: function() {
        if (this.layer.async) {
            this.initImgDiv();
            this.layer.getURLasync(this.bounds, this, "url", this.positionImage)
        } else {
            this.url = this.layer.getURL(this.bounds);
            this.initImgDiv();
            this.positionImage()
        }
        return true
    },
    positionImage: function() {
        if (this.layer !== null) {
            OpenLayers.Util.modifyDOMElement(this.frame, null, this.position, this.size);
            var a = this.layer.getImageSize(this.bounds);
            if (this.layerAlphaHack) OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv, 
            null, null, a, this.url);
            else {
                OpenLayers.Util.modifyDOMElement(this.imgDiv, null, null, a);
                this.imgDiv.src = this.url
            }
        }
    },
    clear: function() {
        if (this.imgDiv) {
            this.hide();
            if (OpenLayers.Tile.Image.useBlankTile) this.imgDiv.src = OpenLayers.Util.getImagesLocation() + "blank.gif"
        }
    },
    initImgDiv: function() {
        if (this.imgDiv == null) {
            var a = this.layer.imageOffset,
            b = this.layer.getImageSize(this.bounds);
            this.imgDiv = this.layerAlphaHack ? OpenLayers.Util.createAlphaImageDiv(null, a, b, null, "relative", null, null, null, true) : OpenLayers.Util.createImage(null, 
            a, b, null, "relative", null, null, true);
            if (OpenLayers.Util.isArray(this.layer.url)) this.imgDiv.urls = this.layer.url.slice();
            this.imgDiv.className = "olTileImage";
            this.frame.style.zIndex = this.isBackBuffer ? 0: 1;
            this.frame.appendChild(this.imgDiv);
            this.layer.div.appendChild(this.frame);
            this.layer.opacity != null && OpenLayers.Util.modifyDOMElement(this.imgDiv, null, null, null, null, null, null, this.layer.opacity);
            this.imgDiv.map = this.layer.map;
            var c = function() {
                if (this.isLoading) {
                    this.isLoading = false;
                    this.events.triggerEvent("loadend")
                }
            };
            this.layerAlphaHack ? OpenLayers.Event.observe(this.imgDiv.childNodes[0], "load", OpenLayers.Function.bind(c, this)) : OpenLayers.Event.observe(this.imgDiv, "load", OpenLayers.Function.bind(c, this));
            OpenLayers.Event.observe(this.imgDiv, "error", OpenLayers.Function.bind(function() {
                this.imgDiv._attempts > OpenLayers.IMAGE_RELOAD_ATTEMPTS && c.call(this)
            },
            this))
        }
        this.imgDiv.viewRequestID = this.layer.map.viewRequestID
    },
    removeImgDiv: function() {
        OpenLayers.Event.stopObservingElement(this.imgDiv);
        if (this.imgDiv.parentNode == 
        this.frame) {
            this.frame.removeChild(this.imgDiv);
            this.imgDiv.map = null
        }
        this.imgDiv.urls = null;
        var a = this.imgDiv.firstChild;
        if (a) {
            OpenLayers.Event.stopObservingElement(a);
            this.imgDiv.removeChild(a);
            delete a
        } else this.imgDiv.src = OpenLayers.Util.getImagesLocation() + "blank.gif"
    },
    checkImgURL: function() {
        if (this.layer) OpenLayers.Util.isEquivalentUrl(this.layerAlphaHack ? this.imgDiv.firstChild.src: this.imgDiv.src, this.url) || this.hide()
    },
    startTransition: function() {
        if (this.backBufferTile && this.backBufferTile.imgDiv) {
            var a = 
            1;
            if (this.backBufferTile.resolution) a = this.backBufferTile.resolution / this.layer.getResolution();
            if (a != 1) {
                if (this.layer.transitionEffect == "resize") {
                    var b = new OpenLayers.LonLat(this.backBufferTile.bounds.left, this.backBufferTile.bounds.top),
                    c = new OpenLayers.Size(this.backBufferTile.size.w * a, this.backBufferTile.size.h * a);
                    b = this.layer.map.getLayerPxFromLonLat(b);
                    OpenLayers.Util.modifyDOMElement(this.backBufferTile.frame, null, b, c);
                    c = this.backBufferTile.imageSize;
                    c = new OpenLayers.Size(c.w * a, c.h * a);
                    if (b = 
                    this.backBufferTile.imageOffset) b = new OpenLayers.Pixel(b.x * a, b.y * a);
                    OpenLayers.Util.modifyDOMElement(this.backBufferTile.imgDiv, null, b, c);
                    this.backBufferTile.show()
                }
            } else this.layer.singleTile ? this.backBufferTile.show() : this.backBufferTile.hide()
        }
    },
    show: function() {
        this.frame.style.display = "";
        if (OpenLayers.Util.indexOf(this.layer.SUPPORTED_TRANSITIONS, this.layer.transitionEffect) != -1) if (OpenLayers.IS_GECKO === true) this.frame.scrollLeft = this.frame.scrollLeft
    },
    hide: function() {
        this.frame.style.display = 
        "none"
    },
    CLASS_NAME: "OpenLayers.Tile.Image"
});
OpenLayers.Tile.Image.useBlankTile = OpenLayers.BROWSER_NAME == "safari" || OpenLayers.BROWSER_NAME == "opera";
OpenLayers.Layer.XYZ = OpenLayers.Class(OpenLayers.Layer.Grid, {
    isBaseLayer: true,
    sphericalMercator: false,
    zoomOffset: 0,
    serverResolutions: null,
    initialize: function(a, b, c) {
        if (c && c.sphericalMercator || this.sphericalMercator) c = OpenLayers.Util.extend({
            maxExtent: new OpenLayers.Bounds( - 2.003750834E7, -2.003750834E7, 2.003750834E7, 2.003750834E7),
            maxResolution: 156543.03390625,
            numZoomLevels: 19,
            units: "m",
            projection: "EPSG:900913"
        },
        c);
        b = b || this.url;
        a = a || this.name;
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, 
        [a, b, {},
        c])
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Layer.XYZ(this.name, this.url, this.getOptions());
        return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [a])
    },
    getURL: function(a) {
        a = this.getXYZ(a);
        var b = this.url;
        if (OpenLayers.Util.isArray(b)) b = this.selectUrl("" + a.x + a.y + a.z, b);
        return OpenLayers.String.format(b, a)
    },
    getXYZ: function(a) {
        var b = this.map.getResolution(),
        c = Math.round((a.left - this.maxExtent.left) / (b * this.tileSize.w));
        a = Math.round((this.maxExtent.top - a.top) / (b * this.tileSize.h));
        b = 
        this.serverResolutions != null ? OpenLayers.Util.indexOf(this.serverResolutions, b) : this.map.getZoom() + this.zoomOffset;
        var d = Math.pow(2, b);
        if (this.wrapDateLine) c = (c % d + d) % d;
        return {
            x: c,
            y: a,
            z: b
        }
    },
    setMap: function() {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        if (!this.tileOrigin) this.tileOrigin = new OpenLayers.LonLat(this.maxExtent.left, this.maxExtent.bottom)
    },
    CLASS_NAME: "OpenLayers.Layer.XYZ"
});
OpenLayers.Layer.OSM = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    name: "OpenStreetMap",
    attribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
    sphericalMercator: true,
    url: "http://tile.openstreetmap.org/${z}/${x}/${y}.png",
    clone: function(a) {
        if (a == null) a = new OpenLayers.Layer.OSM(this.name, this.url, this.getOptions());
        return a = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [a])
    },
    wrapDateLine: true,
    CLASS_NAME: "OpenLayers.Layer.OSM"
});
OpenLayers.Layer.SphericalMercator = {
    getExtent: function() {
        var a = null;
        return a = this.sphericalMercator ? this.map.calculateBounds() : OpenLayers.Layer.FixedZoomLevels.prototype.getExtent.apply(this)
    },
    getLonLatFromViewPortPx: function() {
        return OpenLayers.Layer.prototype.getLonLatFromViewPortPx.apply(this, arguments)
    },
    getViewPortPxFromLonLat: function() {
        return OpenLayers.Layer.prototype.getViewPortPxFromLonLat.apply(this, arguments)
    },
    initMercatorParameters: function() {
        this.RESOLUTIONS = [];
        for (var a = 0; a <= this.MAX_ZOOM_LEVEL; ++a) this.RESOLUTIONS[a] = 
        156543.03390625 / Math.pow(2, a);
        this.units = "m";
        this.projection = this.projection || "EPSG:900913"
    },
    forwardMercator: function(a, b) {
        var c;
        c = Math.log(Math.tan((90 + b) * Math.PI / 360)) / (Math.PI / 180);
        return new OpenLayers.LonLat(a * 2.003750834E7 / 180, c * 2.003750834E7 / 180)
    },
    inverseMercator: function(a, b) {
        var c;
        c = 180 / Math.PI * (2 * Math.atan(Math.exp(b / 2.003750834E7 * 180 * Math.PI / 180)) - Math.PI / 2);
        return new OpenLayers.LonLat(a / 2.003750834E7 * 180, c)
    },
    projectForward: function(a) {
        var b = OpenLayers.Layer.SphericalMercator.forwardMercator(a.x, 
        a.y);
        a.x = b.lon;
        a.y = b.lat;
        return a
    },
    projectInverse: function(a) {
        var b = OpenLayers.Layer.SphericalMercator.inverseMercator(a.x, a.y);
        a.x = b.lon;
        a.y = b.lat;
        return a
    }
}; (function() {
    var a = ["EPSG:900913", "EPSG:3857", "EPSG:102113", "EPSG:102100"],
    b = OpenLayers.Projection.addTransform,
    c = OpenLayers.Layer.SphericalMercator,
    d = OpenLayers.Projection.nullTransform,
    e,
    f,
    g,
    h,
    i;
    e = 0;
    for (f = a.length; e < f; ++e) {
        g = a[e];
        b("EPSG:4326", g, c.projectForward);
        b(g, "EPSG:4326", c.projectInverse);
        for (i = e + 1; i < f; ++i) {
            h = a[i];
            b(g, h, d);
            b(h, g, d)
        }
    }
})();
OpenLayers.Layer.Bing = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    serverResolutions: [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677, 0.14929107084870338, 0.07464553542435169],
    attributionTemplate: '<span class="olBingAttribution ${type}"><div><a target="_blank" href="http://www.bing.com/maps/"><img src="${logo}" /></a></div>${copyrights}<a style="white-space: nowrap" target="_blank" href="http://www.microsoft.com/maps/product/terms.html">Terms of Use</a></span>',
    metadata: null,
    type: "Road",
    metadataParams: null,
    initialize: function(a) {
        a = OpenLayers.Util.applyDefaults({
            sphericalMercator: true
        },
        a);
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, [a.name || "Bing " + (a.type || this.type), null, a]);
        this.loadMetadata()
    },
    loadMetadata: function() {
        this._callbackId = "_callback_" + this.id.replace(/\./g, "_");
        window[this._callbackId] = OpenLayers.Function.bind(OpenLayers.Layer.Bing.processMetadata, this);
        var a = OpenLayers.Util.applyDefaults({
            key: this.key,
            jsonp: this._callbackId,
            include: "ImageryProviders"
        },
        this.metadataParams);
        a = "http://dev.virtualearth.net/REST/v1/Imagery/Metadata/" + this.type + "?" + OpenLayers.Util.getParameterString(a);
        var b = document.createElement("script");
        b.type = "text/javascript";
        b.src = a;
        b.id = this._callbackId;
        document.getElementsByTagName("head")[0].appendChild(b)
    },
    initLayer: function() {
        var a = this.metadata.resourceSets[0].resources[0],
        b = a.imageUrl.replace("{quadkey}", "${quadkey}");
        this.url = [];
        for (var c = 0; c < a.imageUrlSubdomains.length; ++c) this.url.push(b.replace("{subdomain}", a.imageUrlSubdomains[c]));
        this.addOptions({
            maxResolution: Math.min(this.serverResolutions[a.zoomMin], this.maxResolution),
            zoomOffset: a.zoomMin,
            numZoomLevels: Math.min(a.zoomMax + 1 - a.zoomMin, this.numZoomLevels)
        },
        true)
    },
    getURL: function(a) {
        if (!this.url) return OpenLayers.Util.getImagesLocation() + "blank.gif";
        var b = this.getXYZ(a);
        a = b.x;
        var c = b.y;
        b = b.z;
        for (var d = [], e = b; e > 0; --e) {
            var f = "0",
            g = 1 << e - 1; (a & g) != 0 && f++;
            if ((c & g) != 0) {
                f++;
                f++
            }
            d.push(f)
        }
        d = d.join("");
        a = this.selectUrl("" + a + c + b, this.url);
        return OpenLayers.String.format(a, {
            quadkey: d
        })
    },
    updateAttribution: function() {
        var a = this.metadata;
        if (! (!a || !this.map || !this.map.center)) {
            var b = a.resourceSets[0].resources[0],
            c = this.map.getExtent().transform(this.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
            b = b.imageryProviders;
            var d = this.map.getZoom() + 1,
            e = "",
            f,
            g,
            h,
            i,
            j,
            k,
            l;
            g = 0;
            for (h = b.length; g < h; ++g) {
                f = b[g];
                i = 0;
                for (j = f.coverageAreas.length; i < j; ++i) {
                    l = f.coverageAreas[i];
                    k = OpenLayers.Bounds.fromArray(l.bbox);
                    if (c.intersectsBounds(k) && d <= l.zoomMax && d >= l.zoomMin) e += f.attribution + 
                    " "
                }
            }
            this.attribution = OpenLayers.String.format(this.attributionTemplate, {
                type: this.type.toLowerCase(),
                logo: a.brandLogoUri,
                copyrights: e
            });
            this.map && this.map.events.triggerEvent("changelayer", {
                layer: this,
                property: "attribution"
            })
        }
    },
    setMap: function() {
        OpenLayers.Layer.XYZ.prototype.setMap.apply(this, arguments);
        this.updateAttribution();
        this.map.events.register("moveend", this, this.updateAttribution)
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Layer.Bing(this.options);
        return a = OpenLayers.Layer.XYZ.prototype.clone.apply(this, 
        [a])
    },
    destroy: function() {
        this.map && this.map.events.unregister("moveend", this, this.updateAttribution);
        OpenLayers.Layer.XYZ.prototype.destroy.apply(this, arguments)
    },
    CLASS_NAME: "OpenLayers.Layer.Bing"
});
OpenLayers.Layer.Bing.processMetadata = function(a) {
    this.metadata = a;
    this.initLayer();
    a = document.getElementById(this._callbackId);
    a.parentNode.removeChild(a);
    window[this._callbackId] = undefined;
    delete this._callbackId
};
OpenLayers.Geometry.MultiLineString = OpenLayers.Class(OpenLayers.Geometry.Collection, {
    componentTypes: ["OpenLayers.Geometry.LineString"],
    initialize: function() {
        OpenLayers.Geometry.Collection.prototype.initialize.apply(this, arguments)
    },
    split: function(a, b) {
        for (var c = null, d = b && b.mutual, e, f, g, h, i = [], j = [a], k = 0, l = this.components.length; k < l; ++k) {
            f = this.components[k];
            g = false;
            for (var m = 0; m < j.length; ++m) if (e = f.split(j[m], b)) {
                if (d) {
                    g = e[0];
                    for (var n = 0, o = g.length; n < o; ++n) n === 0 && i.length ? i[i.length - 1].addComponent(g[n]) : 
                    i.push(new OpenLayers.Geometry.MultiLineString([g[n]]));
                    g = true;
                    e = e[1]
                }
                if (e.length) {
                    e.unshift(m, 1);
                    Array.prototype.splice.apply(j, e);
                    break
                }
            }
            if (!g) if (i.length) i[i.length - 1].addComponent(f.clone());
            else i = [new OpenLayers.Geometry.MultiLineString(f.clone())]
        }
        if (i && i.length > 1) g = true;
        else i = [];
        if (j && j.length > 1) h = true;
        else j = [];
        if (g || h) c = d ? [i, j] : j;
        return c
    },
    splitWith: function(a, b) {
        var c = null,
        d = b && b.mutual,
        e,
        f,
        g,
        h,
        i,
        j;
        if (a instanceof OpenLayers.Geometry.LineString) {
            j = [];
            i = [a];
            for (var k = 0, l = this.components.length; k < 
            l; ++k) {
                g = false;
                f = this.components[k];
                for (var m = 0; m < i.length; ++m) if (e = i[m].split(f, b)) {
                    if (d) {
                        g = e[0];
                        if (g.length) {
                            g.unshift(m, 1);
                            Array.prototype.splice.apply(i, g);
                            m += g.length - 2
                        }
                        e = e[1];
                        if (e.length === 0) e = [f.clone()]
                    }
                    g = 0;
                    for (var n = e.length; g < n; ++g) g === 0 && j.length ? j[j.length - 1].addComponent(e[g]) : j.push(new OpenLayers.Geometry.MultiLineString([e[g]]));
                    g = true
                }
                if (!g) if (j.length) j[j.length - 1].addComponent(f.clone());
                else j = [new OpenLayers.Geometry.MultiLineString([f.clone()])]
            }
        } else c = a.split(this);
        if (i && i.length > 
        1) h = true;
        else i = [];
        if (j && j.length > 1) g = true;
        else j = [];
        if (h || g) c = d ? [i, j] : j;
        return c
    },
    CLASS_NAME: "OpenLayers.Geometry.MultiLineString"
});
OpenLayers.Format.XML = OpenLayers.Class(OpenLayers.Format, {
    namespaces: null,
    namespaceAlias: null,
    defaultPrefix: null,
    readers: {},
    writers: {},
    xmldom: null,
    initialize: function(a) {
        if (window.ActiveXObject) this.xmldom = new ActiveXObject("Microsoft.XMLDOM");
        OpenLayers.Format.prototype.initialize.apply(this, [a]);
        this.namespaces = OpenLayers.Util.extend({},
        this.namespaces);
        this.namespaceAlias = {};
        for (var b in this.namespaces) this.namespaceAlias[this.namespaces[b]] = b
    },
    destroy: function() {
        this.xmldom = null;
        OpenLayers.Format.prototype.destroy.apply(this, 
        arguments)
    },
    setNamespace: function(a, b) {
        this.namespaces[a] = b;
        this.namespaceAlias[b] = a
    },
    read: function(a) {
        var b = a.indexOf("<");
        if (b > 0) a = a.substring(b);
        b = OpenLayers.Util.Try(OpenLayers.Function.bind(function() {
            var c;
            c = window.ActiveXObject && !this.xmldom ? new ActiveXObject("Microsoft.XMLDOM") : this.xmldom;
            c.loadXML(a);
            return c
        },
        this), 
        function() {
            return (new DOMParser).parseFromString(a, "text/xml")
        },
        function() {
            var c = new XMLHttpRequest;
            c.open("GET", "data:text/xml;charset=utf-8," + encodeURIComponent(a), false);
            c.overrideMimeType && c.overrideMimeType("text/xml");
            c.send(null);
            return c.responseXML
        });
        if (this.keepData) this.data = b;
        return b
    },
    write: function(a) {
        if (this.xmldom) a = a.xml;
        else {
            var b = new XMLSerializer;
            if (a.nodeType == 1) {
                var c = document.implementation.createDocument("", "", null);
                if (c.importNode) a = c.importNode(a, true);
                c.appendChild(a);
                a = b.serializeToString(c)
            } else a = b.serializeToString(a)
        }
        return a
    },
    createElementNS: function(a, b) {
        return this.xmldom ? typeof a == "string" ? this.xmldom.createNode(1, b, a) : this.xmldom.createNode(1, 
        b, "") : document.createElementNS(a, b)
    },
    createTextNode: function(a) {
        if (typeof a !== "string") a = String(a);
        return this.xmldom ? this.xmldom.createTextNode(a) : document.createTextNode(a)
    },
    getElementsByTagNameNS: function(a, b, c) {
        var d = [];
        if (a.getElementsByTagNameNS) d = a.getElementsByTagNameNS(b, c);
        else {
            a = a.getElementsByTagName("*");
            for (var e, f, g = 0, h = a.length; g < h; ++g) {
                e = a[g];
                f = e.prefix ? e.prefix + ":" + c: c;
                if (c == "*" || f == e.nodeName) if (b == "*" || b == e.namespaceURI) d.push(e)
            }
        }
        return d
    },
    getAttributeNodeNS: function(a, b, c) {
        var d = 
        null;
        if (a.getAttributeNodeNS) d = a.getAttributeNodeNS(b, c);
        else {
            a = a.attributes;
            for (var e, f, g = 0, h = a.length; g < h; ++g) {
                e = a[g];
                if (e.namespaceURI == b) {
                    f = e.prefix ? e.prefix + ":" + c: c;
                    if (f == e.nodeName) {
                        d = e;
                        break
                    }
                }
            }
        }
        return d
    },
    getAttributeNS: function(a, b, c) {
        var d = "";
        if (a.getAttributeNS) d = a.getAttributeNS(b, c) || "";
        else if (a = this.getAttributeNodeNS(a, b, c)) d = a.nodeValue;
        return d
    },
    getChildValue: function(a, b) {
        var c = b || "";
        if (a) for (var d = a.firstChild; d; d = d.nextSibling) switch (d.nodeType) {
        case 3:
        case 4:
            c += d.nodeValue
        }
        return c
    },
    concatChildValues: function(a, b) {
        for (var c = "", d = a.firstChild, e; d;) {
            if (e = d.nodeValue) c += e;
            d = d.nextSibling
        }
        if (c == "" && b != undefined) c = b;
        return c
    },
    isSimpleContent: function(a) {
        var b = true;
        for (a = a.firstChild; a; a = a.nextSibling) if (a.nodeType === 1) {
            b = false;
            break
        }
        return b
    },
    contentType: function(a) {
        var b = false,
        c = false,
        d = OpenLayers.Format.XML.CONTENT_TYPE.EMPTY;
        for (a = a.firstChild; a; a = a.nextSibling) {
            switch (a.nodeType) {
            case 1:
                c = true;
                break;
            case 8:
                break;
            default:
                b = true
            }
            if (c && b) break
        }
        if (c && b) d = OpenLayers.Format.XML.CONTENT_TYPE.MIXED;
        else if (c) return OpenLayers.Format.XML.CONTENT_TYPE.COMPLEX;
        else if (b) return OpenLayers.Format.XML.CONTENT_TYPE.SIMPLE;
        return d
    },
    hasAttributeNS: function(a, b, c) {
        var d = false;
        return d = a.hasAttributeNS ? a.hasAttributeNS(b, c) : !!this.getAttributeNodeNS(a, b, c)
    },
    setAttributeNS: function(a, b, c, d) {
        if (a.setAttributeNS) a.setAttributeNS(b, c, d);
        else if (this.xmldom) if (b) {
            b = a.ownerDocument.createNode(2, c, b);
            b.nodeValue = d;
            a.setAttributeNode(b)
        } else a.setAttribute(c, d);
        else throw "setAttributeNS not implemented";
    },
    createElementNSPlus: function(a, 
    b) {
        b = b || {};
        var c = b.uri || this.namespaces[b.prefix];
        if (!c) {
            c = a.indexOf(":");
            c = this.namespaces[a.substring(0, c)]
        }
        c || (c = this.namespaces[this.defaultPrefix]);
        c = this.createElementNS(c, a);
        b.attributes && this.setAttributes(c, b.attributes);
        var d = b.value;
        d != null && c.appendChild(this.createTextNode(d));
        return c
    },
    setAttributes: function(a, b) {
        var c,
        d,
        e;
        for (e in b) if (b[e] != null && b[e].toString) {
            c = b[e].toString();
            d = this.namespaces[e.substring(0, e.indexOf(":"))] || null;
            this.setAttributeNS(a, d, e, c)
        }
    },
    readNode: function(a, 
    b) {
        b || (b = {});
        var c = this.readers[a.namespaceURI ? this.namespaceAlias[a.namespaceURI] : this.defaultPrefix];
        if (c) {
            var d = a.localName || a.nodeName.split(":").pop(); (c = c[d] || c["*"]) && c.apply(this, [a, b])
        }
        return b
    },
    readChildNodes: function(a, b) {
        b || (b = {});
        for (var c = a.childNodes, d, e = 0, f = c.length; e < f; ++e) {
            d = c[e];
            d.nodeType == 1 && this.readNode(d, b)
        }
        return b
    },
    writeNode: function(a, b, c) {
        var d,
        e = a.indexOf(":");
        if (e > 0) {
            d = a.substring(0, e);
            a = a.substring(e + 1)
        } else d = c ? this.namespaceAlias[c.namespaceURI] : this.defaultPrefix;
        b = this.writers[d][a].apply(this, [b]);
        c && c.appendChild(b);
        return b
    },
    getChildEl: function(a, b, c) {
        return a && this.getThisOrNextEl(a.firstChild, b, c)
    },
    getNextEl: function(a, b, c) {
        return a && this.getThisOrNextEl(a.nextSibling, b, c)
    },
    getThisOrNextEl: function(a, b, c) {
        a: for (; a; a = a.nextSibling) switch (a.nodeType) {
        case 1:
            if ((!b || b === (a.localName || a.nodeName.split(":").pop())) && (!c || c === a.namespaceURI)) break a;
            a = null;
            break a;
        case 3:
            if (/^\s*$/.test(a.nodeValue)) break;
        case 4:
        case 6:
        case 12:
        case 10:
        case 11:
            a = null;
            break a
        }
        return a || 
        null
    },
    lookupNamespaceURI: function(a, b) {
        var c = null;
        if (a) if (a.lookupNamespaceURI) c = a.lookupNamespaceURI(b);
        else a: switch (a.nodeType) {
        case 1:
            if (a.namespaceURI !== null && a.prefix === b) {
                c = a.namespaceURI;
                break a
            }
            if (c = a.attributes.length) for (var d, e = 0; e < c; ++e) {
                d = a.attributes[e];
                if (d.prefix === "xmlns" && d.name === "xmlns:" + b) {
                    c = d.value || null;
                    break a
                } else if (d.name === "xmlns" && b === null) {
                    c = d.value || null;
                    break a
                }
            }
            c = this.lookupNamespaceURI(a.parentNode, b);
            break a;
        case 2:
            c = this.lookupNamespaceURI(a.ownerElement, b);
            break a;
            case 9:
            c = this.lookupNamespaceURI(a.documentElement, b);
            break a;
        case 6:
        case 12:
        case 10:
        case 11:
            break a;
        default:
            c = this.lookupNamespaceURI(a.parentNode, b)
        }
        return c
    },
    getXMLDoc: function() {
        if (!OpenLayers.Format.XML.document && !this.xmldom) if (document.implementation && document.implementation.createDocument) OpenLayers.Format.XML.document = document.implementation.createDocument("", "", null);
        else if (!this.xmldom && window.ActiveXObject) this.xmldom = new ActiveXObject("Microsoft.XMLDOM");
        return OpenLayers.Format.XML.document || 
        this.xmldom
    },
    CLASS_NAME: "OpenLayers.Format.XML"
});
OpenLayers.Format.XML.CONTENT_TYPE = {
    EMPTY: 0,
    SIMPLE: 1,
    COMPLEX: 2,
    MIXED: 3
};
OpenLayers.Format.XML.lookupNamespaceURI = OpenLayers.Function.bind(OpenLayers.Format.XML.prototype.lookupNamespaceURI, OpenLayers.Format.XML.prototype);
OpenLayers.Format.XML.document = null;
OpenLayers.Format.OGCExceptionReport = OpenLayers.Class(OpenLayers.Format.XML, {
    namespaces: {
        ogc: "http://www.opengis.net/ogc"
    },
    regExes: {
        trimSpace: /^\s*|\s*$/g,
        removeSpace: /\s*/g,
        splitSpace: /\s+/,
        trimComma: /\s*,\s*/g
    },
    defaultPrefix: "ogc",
    read: function(a) {
        if (typeof a == "string") a = OpenLayers.Format.XML.prototype.read.apply(this, [a]);
        var b = {
            exceptionReport: null
        };
        if (a.documentElement) {
            this.readChildNodes(a, b);
            if (b.exceptionReport === null) b = (new OpenLayers.Format.OWSCommon).read(a)
        }
        return b
    },
    readers: {
        ogc: {
            ServiceExceptionReport: function(a, 
            b) {
                b.exceptionReport = {
                    exceptions: []
                };
                this.readChildNodes(a, b.exceptionReport)
            },
            ServiceException: function(a, b) {
                var c = {
                    code: a.getAttribute("code"),
                    locator: a.getAttribute("locator"),
                    text: this.getChildValue(a)
                };
                b.exceptions.push(c)
            }
        }
    },
    CLASS_NAME: "OpenLayers.Format.OGCExceptionReport"
});
OpenLayers.Format.XML.VersionedOGC = OpenLayers.Class(OpenLayers.Format.XML, {
    defaultVersion: null,
    version: null,
    profile: null,
    errorProperty: null,
    name: null,
    stringifyOutput: false,
    parser: null,
    initialize: function(a) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [a]);
        a = this.CLASS_NAME;
        this.name = a.substring(a.lastIndexOf(".") + 1)
    },
    getVersion: function(a, b) {
        var c;
        if (a) {
            c = this.version;
            if (!c) {
                c = a.getAttribute("version");
                if (!c) c = this.defaultVersion
            }
        } else c = b && b.version || this.version || this.defaultVersion;
        return c
    },
    getParser: function(a) {
        a = a || this.defaultVersion;
        var b = this.profile ? "_" + this.profile: "";
        if (!this.parser || this.parser.VERSION != a) {
            var c = OpenLayers.Format[this.name]["v" + a.replace(/\./g, "_") + b];
            if (!c) throw "Can't find a " + this.name + " parser for version " + a + b;
            this.parser = new c(this.options)
        }
        return this.parser
    },
    write: function(a, b) {
        this.parser = this.getParser(this.getVersion(null, b));
        var c = this.parser.write(a, b);
        return this.stringifyOutput === false ? c: OpenLayers.Format.XML.prototype.write.apply(this, [c])
    },
    read: function(a, 
    b) {
        if (typeof a == "string") a = OpenLayers.Format.XML.prototype.read.apply(this, [a]);
        var c = this.getVersion(a.documentElement);
        this.parser = this.getParser(c);
        var d = this.parser.read(a, b);
        if (this.errorProperty !== null && d[this.errorProperty] === undefined) {
            var e = new OpenLayers.Format.OGCExceptionReport;
            d.error = e.read(a)
        }
        d.version = c;
        return d
    },
    CLASS_NAME: "OpenLayers.Format.XML.VersionedOGC"
});
OpenLayers.Filter = OpenLayers.Class({
    initialize: function(a) {
        OpenLayers.Util.extend(this, a)
    },
    destroy: function() {},
    evaluate: function() {
        return true
    },
    clone: function() {
        return null
    },
    CLASS_NAME: "OpenLayers.Filter"
});
OpenLayers.Filter.FeatureId = OpenLayers.Class(OpenLayers.Filter, {
    fids: null,
    type: "FID",
    initialize: function(a) {
        this.fids = [];
        OpenLayers.Filter.prototype.initialize.apply(this, [a])
    },
    evaluate: function(a) {
        for (var b = 0, c = this.fids.length; b < c; b++) if ((a.fid || a.id) == this.fids[b]) return true;
        return false
    },
    clone: function() {
        var a = new OpenLayers.Filter.FeatureId;
        OpenLayers.Util.extend(a, this);
        a.fids = this.fids.slice();
        return a
    },
    CLASS_NAME: "OpenLayers.Filter.FeatureId"
});
OpenLayers.Filter.Logical = OpenLayers.Class(OpenLayers.Filter, {
    filters: null,
    type: null,
    initialize: function(a) {
        this.filters = [];
        OpenLayers.Filter.prototype.initialize.apply(this, [a])
    },
    destroy: function() {
        this.filters = null;
        OpenLayers.Filter.prototype.destroy.apply(this)
    },
    evaluate: function(a) {
        var b,
        c;
        switch (this.type) {
        case OpenLayers.Filter.Logical.AND:
            b = 0;
            for (c = this.filters.length; b < c; b++) if (this.filters[b].evaluate(a) == false) return false;
            return true;
        case OpenLayers.Filter.Logical.OR:
            b = 0;
            for (c = this.filters.length; b < 
            c; b++) if (this.filters[b].evaluate(a) == true) return true;
            return false;
        case OpenLayers.Filter.Logical.NOT:
            return ! this.filters[0].evaluate(a)
        }
    },
    clone: function() {
        for (var a = [], b = 0, c = this.filters.length; b < c; ++b) a.push(this.filters[b].clone());
        return new OpenLayers.Filter.Logical({
            type: this.type,
            filters: a
        })
    },
    CLASS_NAME: "OpenLayers.Filter.Logical"
});
OpenLayers.Filter.Logical.AND = "&&";
OpenLayers.Filter.Logical.OR = "||";
OpenLayers.Filter.Logical.NOT = "!";
OpenLayers.Filter.Comparison = OpenLayers.Class(OpenLayers.Filter, {
    type: null,
    property: null,
    value: null,
    matchCase: true,
    lowerBoundary: null,
    upperBoundary: null,
    initialize: function(a) {
        OpenLayers.Filter.prototype.initialize.apply(this, [a]);
        if (this.type === OpenLayers.Filter.Comparison.LIKE && a.matchCase === undefined) this.matchCase = null
    },
    evaluate: function(a) {
        if (a instanceof OpenLayers.Feature.Vector) a = a.attributes;
        var b = false;
        a = a[this.property];
        switch (this.type) {
        case OpenLayers.Filter.Comparison.EQUAL_TO:
            b = this.value;
            b = !this.matchCase && typeof a == "string" && typeof b == "string" ? a.toUpperCase() == b.toUpperCase() : a == b;
            break;
        case OpenLayers.Filter.Comparison.NOT_EQUAL_TO:
            b = this.value;
            b = !this.matchCase && typeof a == "string" && typeof b == "string" ? a.toUpperCase() != b.toUpperCase() : a != b;
            break;
        case OpenLayers.Filter.Comparison.LESS_THAN:
            b = a < this.value;
            break;
        case OpenLayers.Filter.Comparison.GREATER_THAN:
            b = a > this.value;
            break;
        case OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO:
            b = a <= this.value;
            break;
        case OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO:
            b = 
            a >= this.value;
            break;
        case OpenLayers.Filter.Comparison.BETWEEN:
            b = a >= this.lowerBoundary && a <= this.upperBoundary;
            break;
        case OpenLayers.Filter.Comparison.LIKE:
            b = RegExp(this.value, "gi").test(a)
        }
        return b
    },
    value2regex: function(a, b, c) {
        if (a == ".") {
            OpenLayers.Console.error("'.' is an unsupported wildCard character for OpenLayers.Filter.Comparison");
            return null
        }
        a = a ? a: "*";
        b = b ? b: ".";
        this.value = this.value.replace(RegExp("\\" + (c ? c: "!") + "(.|$)", "g"), "\\$1");
        this.value = this.value.replace(RegExp("\\" + b, "g"), ".");
        this.value = 
        this.value.replace(RegExp("\\" + a, "g"), ".*");
        this.value = this.value.replace(RegExp("\\\\.\\*", "g"), "\\" + a);
        return this.value = this.value.replace(RegExp("\\\\\\.", "g"), "\\" + b)
    },
    regex2value: function() {
        var a = this.value;
        a = a.replace(/!/g, "!!");
        a = a.replace(/(\\)?\\\./g, 
        function(b, c) {
            return c ? b: "!."
        });
        a = a.replace(/(\\)?\\\*/g, 
        function(b, c) {
            return c ? b: "!*"
        });
        a = a.replace(/\\\\/g, "\\");
        return a = a.replace(/\.\*/g, "*")
    },
    clone: function() {
        return OpenLayers.Util.extend(new OpenLayers.Filter.Comparison, this)
    },
    CLASS_NAME: "OpenLayers.Filter.Comparison"
});
OpenLayers.Filter.Comparison.EQUAL_TO = "==";
OpenLayers.Filter.Comparison.NOT_EQUAL_TO = "!=";
OpenLayers.Filter.Comparison.LESS_THAN = "<";
OpenLayers.Filter.Comparison.GREATER_THAN = ">";
OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO = "<=";
OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO = ">=";
OpenLayers.Filter.Comparison.BETWEEN = "..";
OpenLayers.Filter.Comparison.LIKE = "~";
OpenLayers.Format.Filter = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
    defaultVersion: "1.0.0",
    CLASS_NAME: "OpenLayers.Format.Filter"
});
OpenLayers.Format.WFST = function(a) {
    a = OpenLayers.Util.applyDefaults(a, OpenLayers.Format.WFST.DEFAULTS);
    var b = OpenLayers.Format.WFST["v" + a.version.replace(/\./g, "_")];
    if (!b) throw "Unsupported WFST version: " + a.version;
    return new b(a)
};
OpenLayers.Format.WFST.DEFAULTS = {
    version: "1.0.0"
};
OpenLayers.Format.WFST.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
    namespaces: {
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs",
        gml: "http://www.opengis.net/gml",
        ogc: "http://www.opengis.net/ogc",
        ows: "http://www.opengis.net/ows"
    },
    defaultPrefix: "wfs",
    version: null,
    schemaLocations: null,
    srsName: null,
    extractAttributes: true,
    xy: true,
    stateName: null,
    initialize: function(a) {
        this.stateName = {};
        this.stateName[OpenLayers.State.INSERT] = "wfs:Insert";
        this.stateName[OpenLayers.State.UPDATE] = "wfs:Update";
        this.stateName[OpenLayers.State.DELETE] = "wfs:Delete";
        OpenLayers.Format.XML.prototype.initialize.apply(this, [a])
    },
    getSrsName: function(a, b) {
        var c = b && b.srsName;
        c || (c = a && a.layer ? a.layer.projection.getCode() : this.srsName);
        return c
    },
    read: function(a, b) {
        b = b || {};
        OpenLayers.Util.applyDefaults(b, {
            output: "features"
        });
        if (typeof a == "string") a = OpenLayers.Format.XML.prototype.read.apply(this, [a]);
        if (a && a.nodeType == 9) a = a.documentElement;
        var c = {};
        a && this.readNode(a, 
        c, true);
        if (c.features && b.output === "features") c = c.features;
        return c
    },
    readers: {
        wfs: {
            FeatureCollection: function(a, b) {
                b.features = [];
                this.readChildNodes(a, b)
            }
        }
    },
    write: function(a, b) {
        var c = this.writeNode("wfs:Transaction", {
            features: a,
            options: b
        }),
        d = this.schemaLocationAttr();
        d && this.setAttributeNS(c, this.namespaces.xsi, "xsi:schemaLocation", d);
        return OpenLayers.Format.XML.prototype.write.apply(this, [c])
    },
    writers: {
        wfs: {
            GetFeature: function(a) {
                var b = this.createElementNSPlus("wfs:GetFeature", {
                    attributes: {
                        service: "WFS",
                        version: this.version,
                        handle: a && a.handle,
                        outputFormat: a && a.outputFormat,
                        maxFeatures: a && a.maxFeatures,
                        "xsi:schemaLocation": this.schemaLocationAttr(a)
                    }
                });
                if (typeof this.featureType == "string") this.writeNode("Query", a, b);
                else for (var c = 0, d = this.featureType.length; c < d; c++) {
                    a.featureType = this.featureType[c];
                    this.writeNode("Query", a, b)
                }
                return b
            },
            Transaction: function(a) {
                a = a || {};
                var b = a.options || {},
                c = this.createElementNSPlus("wfs:Transaction", {
                    attributes: {
                        service: "WFS",
                        version: this.version,
                        handle: b.handle
                    }
                }),
                d,
                e = a.features;
                if (e) {
                    if (b.multi === true) OpenLayers.Util.extend(this.geometryTypes, {
                        "OpenLayers.Geometry.Point": "MultiPoint",
                        "OpenLayers.Geometry.LineString": this.multiCurve === true ? "MultiCurve": "MultiLineString",
                        "OpenLayers.Geometry.Polygon": this.multiSurface === true ? "MultiSurface": "MultiPolygon"
                    });
                    var f,
                    g;
                    a = 0;
                    for (d = e.length; a < d; ++a) {
                        g = e[a]; (f = this.stateName[g.state]) && this.writeNode(f, {
                            feature: g,
                            options: b
                        },
                        c)
                    }
                    b.multi === true && this.setGeometryTypes()
                }
                if (b.nativeElements) {
                    a = 0;
                    for (d = b.nativeElements.length; a < 
                    d; ++a) this.writeNode("wfs:Native", b.nativeElements[a], c)
                }
                return c
            },
            Native: function(a) {
                return this.createElementNSPlus("wfs:Native", {
                    attributes: {
                        vendorId: a.vendorId,
                        safeToIgnore: a.safeToIgnore
                    },
                    value: a.value
                })
            },
            Insert: function(a) {
                var b = a.feature;
                a = a.options;
                a = this.createElementNSPlus("wfs:Insert", {
                    attributes: {
                        handle: a && a.handle
                    }
                });
                this.srsName = this.getSrsName(b);
                this.writeNode("feature:_typeName", b, a);
                return a
            },
            Update: function(a) {
                var b = a.feature;
                a = a.options;
                a = this.createElementNSPlus("wfs:Update", 
                {
                    attributes: {
                        handle: a && a.handle,
                        typeName: (this.featureNS ? this.featurePrefix + ":": "") + this.featureType
                    }
                });
                this.featureNS && a.setAttribute("xmlns:" + this.featurePrefix, this.featureNS);
                var c = b.modified;
                if (this.geometryName !== null && (!c || c.geometry)) {
                    this.srsName = this.getSrsName(b);
                    this.writeNode("Property", {
                        name: this.geometryName,
                        value: b.geometry
                    },
                    a)
                }
                for (var d in b.attributes) if (b.attributes[d] !== undefined && (!c || !c.attributes || c.attributes && c.attributes[d])) this.writeNode("Property", {
                    name: d,
                    value: b.attributes[d]
                },
                a);
                this.writeNode("ogc:Filter", new OpenLayers.Filter.FeatureId({
                    fids: [b.fid]
                }), a);
                return a
            },
            Property: function(a) {
                var b = this.createElementNSPlus("wfs:Property");
                this.writeNode("Name", a.name, b);
                a.value !== null && this.writeNode("Value", a.value, b);
                return b
            },
            Name: function(a) {
                return this.createElementNSPlus("wfs:Name", {
                    value: a
                })
            },
            Value: function(a) {
                var b;
                if (a instanceof OpenLayers.Geometry) {
                    b = this.createElementNSPlus("wfs:Value");
                    a = this.writeNode("feature:_geometry", a).firstChild;
                    b.appendChild(a)
                } else b = this.createElementNSPlus("wfs:Value", 
                {
                    value: a
                });
                return b
            },
            Delete: function(a) {
                var b = a.feature;
                a = a.options;
                a = this.createElementNSPlus("wfs:Delete", {
                    attributes: {
                        handle: a && a.handle,
                        typeName: (this.featureNS ? this.featurePrefix + ":": "") + this.featureType
                    }
                });
                this.featureNS && a.setAttribute("xmlns:" + this.featurePrefix, this.featureNS);
                this.writeNode("ogc:Filter", new OpenLayers.Filter.FeatureId({
                    fids: [b.fid]
                }), a);
                return a
            }
        }
    },
    schemaLocationAttr: function(a) {
        a = OpenLayers.Util.extend({
            featurePrefix: this.featurePrefix,
            schema: this.schema
        },
        a);
        var b = OpenLayers.Util.extend({},
        this.schemaLocations);
        if (a.schema) b[a.featurePrefix] = a.schema;
        a = [];
        var c,
        d;
        for (d in b)(c = this.namespaces[d]) && a.push(c + " " + b[d]);
        return a.join(" ") || undefined
    },
    setFilterProperty: function(a) {
        if (a.filters) for (var b = 0, c = a.filters.length; b < c; ++b) this.setFilterProperty(a.filters[b]);
        else if (a instanceof OpenLayers.Filter.Spatial) a.property = this.geometryName
    },
    CLASS_NAME: "OpenLayers.Format.WFST.v1"
});
OpenLayers.Geometry.MultiPolygon = OpenLayers.Class(OpenLayers.Geometry.Collection, {
    componentTypes: ["OpenLayers.Geometry.Polygon"],
    initialize: function() {
        OpenLayers.Geometry.Collection.prototype.initialize.apply(this, arguments)
    },
    CLASS_NAME: "OpenLayers.Geometry.MultiPolygon"
});
OpenLayers.Format.GML = OpenLayers.Class(OpenLayers.Format.XML, {
    featureNS: "http://mapserver.gis.umn.edu/mapserver",
    featurePrefix: "feature",
    featureName: "featureMember",
    layerName: "features",
    geometryName: "geometry",
    collectionName: "FeatureCollection",
    gmlns: "http://www.opengis.net/gml",
    extractAttributes: true,
    xy: true,
    initialize: function(a) {
        this.regExes = {
            trimSpace: /^\s*|\s*$/g,
            removeSpace: /\s*/g,
            splitSpace: /\s+/,
            trimComma: /\s*,\s*/g
        };
        OpenLayers.Format.XML.prototype.initialize.apply(this, [a])
    },
    read: function(a) {
        if (typeof a == 
        "string") a = OpenLayers.Format.XML.prototype.read.apply(this, [a]);
        a = this.getElementsByTagNameNS(a.documentElement, this.gmlns, this.featureName);
        for (var b = [], c = 0; c < a.length; c++) {
            var d = this.parseFeature(a[c]);
            d && b.push(d)
        }
        return b
    },
    parseFeature: function(a) {
        var b = ["MultiPolygon", "Polygon", "MultiLineString", "LineString", "MultiPoint", "Point", "Envelope"],
        c,
        d,
        e,
        f;
        for (f = 0; f < b.length; ++f) {
            c = b[f];
            d = this.getElementsByTagNameNS(a, this.gmlns, c);
            if (d.length > 0) {
                if (f = this.parseGeometry[c.toLowerCase()]) {
                    e = f.apply(this, 
                    [d[0]]);
                    this.internalProjection && this.externalProjection && e.transform(this.externalProjection, this.internalProjection)
                } else OpenLayers.Console.error(OpenLayers.i18n("unsupportedGeometryType", {
                    geomType: c
                }));
                break
            }
        }
        var g;
        c = this.getElementsByTagNameNS(a, this.gmlns, "Box");
        for (f = 0; f < c.length; ++f) {
            b = c[f];
            d = this.parseGeometry.box.apply(this, [b]);
            b = b.parentNode;
            if ((b.localName || b.nodeName.split(":").pop()) === "boundedBy") g = d;
            else e = d.toGeometry()
        }
        var h;
        if (this.extractAttributes) h = this.parseAttributes(a);
        e = 
        new OpenLayers.Feature.Vector(e, h);
        e.bounds = g;
        e.gml = {
            featureType: a.firstChild.nodeName.split(":")[1],
            featureNS: a.firstChild.namespaceURI,
            featureNSPrefix: a.firstChild.prefix
        };
        a = a.firstChild;
        for (var i; a;) {
            if (a.nodeType == 1) if (i = a.getAttribute("fid") || a.getAttribute("id")) break;
            a = a.nextSibling
        }
        e.fid = i;
        return e
    },
    parseGeometry: {
        point: function(a) {
            var b,
            c;
            c = [];
            b = this.getElementsByTagNameNS(a, this.gmlns, "pos");
            if (b.length > 0) {
                c = b[0].firstChild.nodeValue;
                c = c.replace(this.regExes.trimSpace, "");
                c = c.split(this.regExes.splitSpace)
            }
            if (c.length == 
            0) {
                b = this.getElementsByTagNameNS(a, this.gmlns, "coordinates");
                if (b.length > 0) {
                    c = b[0].firstChild.nodeValue;
                    c = c.replace(this.regExes.removeSpace, "");
                    c = c.split(",")
                }
            }
            if (c.length == 0) {
                b = this.getElementsByTagNameNS(a, this.gmlns, "coord");
                if (b.length > 0) {
                    a = this.getElementsByTagNameNS(b[0], this.gmlns, "X");
                    b = this.getElementsByTagNameNS(b[0], this.gmlns, "Y");
                    if (a.length > 0 && b.length > 0) c = [a[0].firstChild.nodeValue, b[0].firstChild.nodeValue]
                }
            }
            if (c.length == 2) c[2] = null;
            return this.xy ? new OpenLayers.Geometry.Point(c[0], 
            c[1], c[2]) : new OpenLayers.Geometry.Point(c[1], c[0], c[2])
        },
        multipoint: function(a) {
            a = this.getElementsByTagNameNS(a, this.gmlns, "Point");
            var b = [];
            if (a.length > 0) for (var c, d = 0; d < a.length; ++d)(c = this.parseGeometry.point.apply(this, [a[d]])) && b.push(c);
            return new OpenLayers.Geometry.MultiPoint(b)
        },
        linestring: function(a, b) {
            var c,
            d;
            d = [];
            var e = [];
            c = this.getElementsByTagNameNS(a, this.gmlns, "posList");
            if (c.length > 0) {
                d = this.getChildValue(c[0]);
                d = d.replace(this.regExes.trimSpace, "");
                d = d.split(this.regExes.splitSpace);
                var f = parseInt(c[0].getAttribute("dimension")),
                g,
                h,
                i;
                for (c = 0; c < d.length / f; ++c) {
                    g = c * f;
                    h = d[g];
                    i = d[g + 1];
                    g = f == 2 ? null: d[g + 2];
                    this.xy ? e.push(new OpenLayers.Geometry.Point(h, i, g)) : e.push(new OpenLayers.Geometry.Point(i, h, g))
                }
            }
            if (d.length == 0) {
                c = this.getElementsByTagNameNS(a, this.gmlns, "coordinates");
                if (c.length > 0) {
                    d = this.getChildValue(c[0]);
                    d = d.replace(this.regExes.trimSpace, "");
                    d = d.replace(this.regExes.trimComma, ",");
                    f = d.split(this.regExes.splitSpace);
                    for (c = 0; c < f.length; ++c) {
                        d = f[c].split(",");
                        if (d.length == 
                        2) d[2] = null;
                        this.xy ? e.push(new OpenLayers.Geometry.Point(d[0], d[1], d[2])) : e.push(new OpenLayers.Geometry.Point(d[1], d[0], d[2]))
                    }
                }
            }
            d = null;
            if (e.length != 0) d = b ? new OpenLayers.Geometry.LinearRing(e) : new OpenLayers.Geometry.LineString(e);
            return d
        },
        multilinestring: function(a) {
            a = this.getElementsByTagNameNS(a, this.gmlns, "LineString");
            var b = [];
            if (a.length > 0) for (var c, d = 0; d < a.length; ++d)(c = this.parseGeometry.linestring.apply(this, [a[d]])) && b.push(c);
            return new OpenLayers.Geometry.MultiLineString(b)
        },
        polygon: function(a) {
            a = 
            this.getElementsByTagNameNS(a, this.gmlns, "LinearRing");
            var b = [];
            if (a.length > 0) for (var c, d = 0; d < a.length; ++d)(c = this.parseGeometry.linestring.apply(this, [a[d], true])) && b.push(c);
            return new OpenLayers.Geometry.Polygon(b)
        },
        multipolygon: function(a) {
            a = this.getElementsByTagNameNS(a, this.gmlns, "Polygon");
            var b = [];
            if (a.length > 0) for (var c, d = 0; d < a.length; ++d)(c = this.parseGeometry.polygon.apply(this, [a[d]])) && b.push(c);
            return new OpenLayers.Geometry.MultiPolygon(b)
        },
        envelope: function(a) {
            var b = [],
            c,
            d,
            e = this.getElementsByTagNameNS(a, 
            this.gmlns, "lowerCorner");
            if (e.length > 0) {
                c = [];
                if (e.length > 0) {
                    c = e[0].firstChild.nodeValue;
                    c = c.replace(this.regExes.trimSpace, "");
                    c = c.split(this.regExes.splitSpace)
                }
                if (c.length == 2) c[2] = null;
                var f = this.xy ? new OpenLayers.Geometry.Point(c[0], c[1], c[2]) : new OpenLayers.Geometry.Point(c[1], c[0], c[2])
            }
            a = this.getElementsByTagNameNS(a, this.gmlns, "upperCorner");
            if (a.length > 0) {
                c = [];
                if (a.length > 0) {
                    c = a[0].firstChild.nodeValue;
                    c = c.replace(this.regExes.trimSpace, "");
                    c = c.split(this.regExes.splitSpace)
                }
                if (c.length == 
                2) c[2] = null;
                var g = this.xy ? new OpenLayers.Geometry.Point(c[0], c[1], c[2]) : new OpenLayers.Geometry.Point(c[1], c[0], c[2])
            }
            if (f && g) {
                b.push(new OpenLayers.Geometry.Point(f.x, f.y));
                b.push(new OpenLayers.Geometry.Point(g.x, f.y));
                b.push(new OpenLayers.Geometry.Point(g.x, g.y));
                b.push(new OpenLayers.Geometry.Point(f.x, g.y));
                b.push(new OpenLayers.Geometry.Point(f.x, f.y));
                b = new OpenLayers.Geometry.LinearRing(b);
                d = new OpenLayers.Geometry.Polygon([b])
            }
            return d
        },
        box: function(a) {
            var b = this.getElementsByTagNameNS(a, 
            this.gmlns, "coordinates");
            var c = a = null;
            if (b.length > 0) {
                b = b[0].firstChild.nodeValue;
                b = b.split(" ");
                if (b.length == 2) {
                    a = b[0].split(",");
                    c = b[1].split(",")
                }
            }
            if (a !== null && c !== null) return new OpenLayers.Bounds(parseFloat(a[0]), parseFloat(a[1]), parseFloat(c[0]), parseFloat(c[1]))
        }
    },
    parseAttributes: function(a) {
        var b = {};
        a = a.firstChild;
        for (var c, d, e; a;) {
            if (a.nodeType == 1) {
                a = a.childNodes;
                for (c = 0; c < a.length; ++c) {
                    d = a[c];
                    if (d.nodeType == 1) {
                        e = d.childNodes;
                        if (e.length == 1) {
                            e = e[0];
                            if (e.nodeType == 3 || e.nodeType == 4) {
                                d = d.prefix ? 
                                d.nodeName.split(":")[1] : d.nodeName;
                                e = e.nodeValue.replace(this.regExes.trimSpace, "");
                                b[d] = e
                            }
                        } else b[d.nodeName.split(":").pop()] = null
                    }
                }
                break
            }
            a = a.nextSibling
        }
        return b
    },
    write: function(a) {
        OpenLayers.Util.isArray(a) || (a = [a]);
        for (var b = this.createElementNS("http://www.opengis.net/wfs", "wfs:" + this.collectionName), c = 0; c < a.length; c++) b.appendChild(this.createFeatureXML(a[c]));
        return OpenLayers.Format.XML.prototype.write.apply(this, [b])
    },
    createFeatureXML: function(a) {
        var b = this.buildGeometryNode(a.geometry),
        c = this.createElementNS(this.featureNS, this.featurePrefix + ":" + this.geometryName);
        c.appendChild(b);
        b = this.createElementNS(this.gmlns, "gml:" + this.featureName);
        var d = this.createElementNS(this.featureNS, this.featurePrefix + ":" + this.layerName);
        d.setAttribute("fid", a.fid || a.id);
        d.appendChild(c);
        for (var e in a.attributes) {
            c = this.createTextNode(a.attributes[e]);
            var f = this.createElementNS(this.featureNS, this.featurePrefix + ":" + e.substring(e.lastIndexOf(":") + 1));
            f.appendChild(c);
            d.appendChild(f)
        }
        b.appendChild(d);
        return b
    },
    buildGeometryNode: function(a) {
        if (this.externalProjection && this.internalProjection) {
            a = a.clone();
            a.transform(this.internalProjection, this.externalProjection)
        }
        var b = a.CLASS_NAME;
        return this.buildGeometry[b.substring(b.lastIndexOf(".") + 1).toLowerCase()].apply(this, [a])
    },
    buildGeometry: {
        point: function(a) {
            var b = this.createElementNS(this.gmlns, "gml:Point");
            b.appendChild(this.buildCoordinatesNode(a));
            return b
        },
        multipoint: function(a) {
            var b = this.createElementNS(this.gmlns, "gml:MultiPoint");
            a = a.components;
            for (var c, d, e = 0; e < a.length; e++) {
                c = this.createElementNS(this.gmlns, "gml:pointMember");
                d = this.buildGeometry.point.apply(this, [a[e]]);
                c.appendChild(d);
                b.appendChild(c)
            }
            return b
        },
        linestring: function(a) {
            var b = this.createElementNS(this.gmlns, "gml:LineString");
            b.appendChild(this.buildCoordinatesNode(a));
            return b
        },
        multilinestring: function(a) {
            var b = this.createElementNS(this.gmlns, "gml:MultiLineString");
            a = a.components;
            for (var c, d, e = 0; e < a.length; ++e) {
                c = this.createElementNS(this.gmlns, "gml:lineStringMember");
                d = this.buildGeometry.linestring.apply(this, [a[e]]);
                c.appendChild(d);
                b.appendChild(c)
            }
            return b
        },
        linearring: function(a) {
            var b = this.createElementNS(this.gmlns, "gml:LinearRing");
            b.appendChild(this.buildCoordinatesNode(a));
            return b
        },
        polygon: function(a) {
            var b = this.createElementNS(this.gmlns, "gml:Polygon");
            a = a.components;
            for (var c, d, e = 0; e < a.length; ++e) {
                c = e == 0 ? "outerBoundaryIs": "innerBoundaryIs";
                c = this.createElementNS(this.gmlns, "gml:" + c);
                d = this.buildGeometry.linearring.apply(this, [a[e]]);
                c.appendChild(d);
                b.appendChild(c)
            }
            return b
        },
        multipolygon: function(a) {
            var b = this.createElementNS(this.gmlns, "gml:MultiPolygon");
            a = a.components;
            for (var c, d, e = 0; e < a.length; ++e) {
                c = this.createElementNS(this.gmlns, "gml:polygonMember");
                d = this.buildGeometry.polygon.apply(this, [a[e]]);
                c.appendChild(d);
                b.appendChild(c)
            }
            return b
        },
        bounds: function(a) {
            var b = this.createElementNS(this.gmlns, "gml:Box");
            b.appendChild(this.buildCoordinatesNode(a));
            return b
        }
    },
    buildCoordinatesNode: function(a) {
        var b = this.createElementNS(this.gmlns, "gml:coordinates");
        b.setAttribute("decimal", ".");
        b.setAttribute("cs", ",");
        b.setAttribute("ts", " ");
        var c = [];
        if (a instanceof OpenLayers.Bounds) {
            c.push(a.left + "," + a.bottom);
            c.push(a.right + "," + a.top)
        } else {
            a = a.components ? a.components: [a];
            for (var d = 0; d < a.length; d++) c.push(a[d].x + "," + a[d].y)
        }
        c = this.createTextNode(c.join(" "));
        b.appendChild(c);
        return b
    },
    CLASS_NAME: "OpenLayers.Format.GML"
});
if (!OpenLayers.Format.GML) OpenLayers.Format.GML = {};
OpenLayers.Format.GML.Base = OpenLayers.Class(OpenLayers.Format.XML, {
    namespaces: {
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs"
    },
    defaultPrefix: "gml",
    schemaLocation: null,
    featureType: null,
    featureNS: null,
    geometryName: "geometry",
    extractAttributes: true,
    srsName: null,
    xy: true,
    geometryTypes: null,
    singleFeatureType: null,
    regExes: {
        trimSpace: /^\s*|\s*$/g,
        removeSpace: /\s*/g,
        splitSpace: /\s+/,
        trimComma: /\s*,\s*/g,
        featureMember: /^(.*:)?featureMembers?$/
    },
    initialize: function(a) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [a]);
        this.setGeometryTypes();
        a && a.featureNS && this.setNamespace("feature", a.featureNS);
        this.singleFeatureType = !a || typeof a.featureType === "string"
    },
    read: function(a) {
        if (typeof a == "string") a = OpenLayers.Format.XML.prototype.read.apply(this, [a]);
        if (a && a.nodeType == 9) a = a.documentElement;
        var b = [];
        this.readNode(a, {
            features: b
        },
        true);
        if (b.length == 0) {
            var c = this.getElementsByTagNameNS(a, this.namespaces.gml, 
            "featureMember");
            if (c.length) {
                a = 0;
                for (var d = c.length; a < d; ++a) this.readNode(c[a], {
                    features: b
                },
                true)
            } else {
                c = this.getElementsByTagNameNS(a, this.namespaces.gml, "featureMembers");
                c.length && this.readNode(c[0], {
                    features: b
                },
                true)
            }
        }
        return b
    },
    readNode: function(a, b, c) {
        if (c === true && this.autoConfig === true) {
            this.featureType = null;
            delete this.namespaceAlias[this.featureNS];
            delete this.namespaces.feature;
            this.featureNS = null
        }
        if (!this.featureNS && !(a.prefix in this.namespaces) && a.parentNode.namespaceURI == this.namespaces.gml && 
        this.regExes.featureMember.test(a.parentNode.nodeName)) {
            this.featureType = a.nodeName.split(":").pop();
            this.setNamespace("feature", a.namespaceURI);
            this.featureNS = a.namespaceURI;
            this.autoConfig = true
        }
        return OpenLayers.Format.XML.prototype.readNode.apply(this, [a, b])
    },
    readers: {
        gml: {
            featureMember: function(a, b) {
                this.readChildNodes(a, b)
            },
            featureMembers: function(a, b) {
                this.readChildNodes(a, b)
            },
            name: function(a, b) {
                b.name = this.getChildValue(a)
            },
            boundedBy: function(a, b) {
                var c = {};
                this.readChildNodes(a, c);
                if (c.components && 
                c.components.length > 0) b.bounds = c.components[0]
            },
            Point: function(a, b) {
                var c = {
                    points: []
                };
                this.readChildNodes(a, c);
                if (!b.components) b.components = [];
                b.components.push(c.points[0])
            },
            coordinates: function(a, b) {
                var c = this.getChildValue(a).replace(this.regExes.trimSpace, "");
                c = c.replace(this.regExes.trimComma, ",");
                c = c.split(this.regExes.splitSpace);
                for (var d, e = c.length, f = Array(e), g = 0; g < e; ++g) {
                    d = c[g].split(",");
                    f[g] = this.xy ? new OpenLayers.Geometry.Point(d[0], d[1], d[2]) : new OpenLayers.Geometry.Point(d[1], d[0], 
                    d[2])
                }
                b.points = f
            },
            coord: function(a, b) {
                var c = {};
                this.readChildNodes(a, c);
                if (!b.points) b.points = [];
                b.points.push(new OpenLayers.Geometry.Point(c.x, c.y, c.z))
            },
            X: function(a, b) {
                b.x = this.getChildValue(a)
            },
            Y: function(a, b) {
                b.y = this.getChildValue(a)
            },
            Z: function(a, b) {
                b.z = this.getChildValue(a)
            },
            MultiPoint: function(a, b) {
                var c = {
                    components: []
                };
                this.readChildNodes(a, c);
                b.components = [new OpenLayers.Geometry.MultiPoint(c.components)]
            },
            pointMember: function(a, b) {
                this.readChildNodes(a, b)
            },
            LineString: function(a, b) {
                var c = 
                {};
                this.readChildNodes(a, c);
                if (!b.components) b.components = [];
                b.components.push(new OpenLayers.Geometry.LineString(c.points))
            },
            MultiLineString: function(a, b) {
                var c = {
                    components: []
                };
                this.readChildNodes(a, c);
                b.components = [new OpenLayers.Geometry.MultiLineString(c.components)]
            },
            lineStringMember: function(a, b) {
                this.readChildNodes(a, b)
            },
            Polygon: function(a, b) {
                var c = {
                    outer: null,
                    inner: []
                };
                this.readChildNodes(a, c);
                c.inner.unshift(c.outer);
                if (!b.components) b.components = [];
                b.components.push(new OpenLayers.Geometry.Polygon(c.inner))
            },
            LinearRing: function(a, b) {
                var c = {};
                this.readChildNodes(a, c);
                b.components = [new OpenLayers.Geometry.LinearRing(c.points)]
            },
            MultiPolygon: function(a, b) {
                var c = {
                    components: []
                };
                this.readChildNodes(a, c);
                b.components = [new OpenLayers.Geometry.MultiPolygon(c.components)]
            },
            polygonMember: function(a, b) {
                this.readChildNodes(a, b)
            },
            GeometryCollection: function(a, b) {
                var c = {
                    components: []
                };
                this.readChildNodes(a, c);
                b.components = [new OpenLayers.Geometry.Collection(c.components)]
            },
            geometryMember: function(a, b) {
                this.readChildNodes(a, 
                b)
            }
        },
        feature: {
            "*": function(a, b) {
                var c,
                d = a.localName || a.nodeName.split(":").pop();
                if (b.features) if (!this.singleFeatureType && OpenLayers.Util.indexOf(this.featureType, d) !== -1) c = "_typeName";
                else {
                    if (d === this.featureType) c = "_typeName"
                } else if (a.childNodes.length == 0 || a.childNodes.length == 1 && a.firstChild.nodeType == 3) {
                    if (this.extractAttributes) c = "_attribute"
                } else c = "_geometry";
                c && this.readers.feature[c].apply(this, [a, b])
            },
            _typeName: function(a, b) {
                var c = {
                    components: [],
                    attributes: {}
                };
                this.readChildNodes(a, c);
                if (c.name) c.attributes.name = c.name;
                var d = new OpenLayers.Feature.Vector(c.components[0], c.attributes);
                if (!this.singleFeatureType) {
                    d.type = a.nodeName.split(":").pop();
                    d.namespace = a.namespaceURI
                }
                var e = a.getAttribute("fid") || this.getAttributeNS(a, this.namespaces.gml, "id");
                if (e) d.fid = e;
                this.internalProjection && this.externalProjection && d.geometry && d.geometry.transform(this.externalProjection, this.internalProjection);
                if (c.bounds) d.bounds = c.bounds;
                b.features.push(d)
            },
            _geometry: function(a, b) {
                if (!this.geometryName) this.geometryName = 
                a.nodeName.split(":").pop();
                this.readChildNodes(a, b)
            },
            _attribute: function(a, b) {
                var c = a.localName || a.nodeName.split(":").pop(),
                d = this.getChildValue(a);
                b.attributes[c] = d
            }
        },
        wfs: {
            FeatureCollection: function(a, b) {
                this.readChildNodes(a, b)
            }
        }
    },
    write: function(a) {
        a = this.writeNode("gml:" + (OpenLayers.Util.isArray(a) ? "featureMembers": "featureMember"), a);
        this.setAttributeNS(a, this.namespaces.xsi, "xsi:schemaLocation", this.schemaLocation);
        return OpenLayers.Format.XML.prototype.write.apply(this, [a])
    },
    writers: {
        gml: {
            featureMember: function(a) {
                var b = 
                this.createElementNSPlus("gml:featureMember");
                this.writeNode("feature:_typeName", a, b);
                return b
            },
            MultiPoint: function(a) {
                var b = this.createElementNSPlus("gml:MultiPoint");
                a = a.components || [a];
                for (var c = 0, d = a.length; c < d; ++c) this.writeNode("pointMember", a[c], b);
                return b
            },
            pointMember: function(a) {
                var b = this.createElementNSPlus("gml:pointMember");
                this.writeNode("Point", a, b);
                return b
            },
            MultiLineString: function(a) {
                var b = this.createElementNSPlus("gml:MultiLineString");
                a = a.components || [a];
                for (var c = 0, d = a.length; c < 
                d; ++c) this.writeNode("lineStringMember", a[c], b);
                return b
            },
            lineStringMember: function(a) {
                var b = this.createElementNSPlus("gml:lineStringMember");
                this.writeNode("LineString", a, b);
                return b
            },
            MultiPolygon: function(a) {
                var b = this.createElementNSPlus("gml:MultiPolygon");
                a = a.components || [a];
                for (var c = 0, d = a.length; c < d; ++c) this.writeNode("polygonMember", a[c], b);
                return b
            },
            polygonMember: function(a) {
                var b = this.createElementNSPlus("gml:polygonMember");
                this.writeNode("Polygon", a, b);
                return b
            },
            GeometryCollection: function(a) {
                for (var b = 
                this.createElementNSPlus("gml:GeometryCollection"), c = 0, d = a.components.length; c < d; ++c) this.writeNode("geometryMember", a.components[c], b);
                return b
            },
            geometryMember: function(a) {
                var b = this.createElementNSPlus("gml:geometryMember");
                a = this.writeNode("feature:_geometry", a);
                b.appendChild(a.firstChild);
                return b
            }
        },
        feature: {
            _typeName: function(a) {
                var b = this.createElementNSPlus("feature:" + this.featureType, {
                    attributes: {
                        fid: a.fid
                    }
                });
                a.geometry && this.writeNode("feature:_geometry", a.geometry, b);
                for (var c in a.attributes) {
                    var d = 
                    a.attributes[c];
                    d != null && this.writeNode("feature:_attribute", {
                        name: c,
                        value: d
                    },
                    b)
                }
                return b
            },
            _geometry: function(a) {
                if (this.externalProjection && this.internalProjection) a = a.clone().transform(this.internalProjection, this.externalProjection);
                var b = this.createElementNSPlus("feature:" + this.geometryName);
                a = this.writeNode("gml:" + this.geometryTypes[a.CLASS_NAME], a, b);
                this.srsName && a.setAttribute("srsName", this.srsName);
                return b
            },
            _attribute: function(a) {
                return this.createElementNSPlus("feature:" + a.name, {
                    value: a.value
                })
            }
        },
        wfs: {
            FeatureCollection: function(a) {
                for (var b = this.createElementNSPlus("wfs:FeatureCollection"), c = 0, d = a.length; c < d; ++c) this.writeNode("gml:featureMember", a[c], b);
                return b
            }
        }
    },
    setGeometryTypes: function() {
        this.geometryTypes = {
            "OpenLayers.Geometry.Point": "Point",
            "OpenLayers.Geometry.MultiPoint": "MultiPoint",
            "OpenLayers.Geometry.LineString": "LineString",
            "OpenLayers.Geometry.MultiLineString": "MultiLineString",
            "OpenLayers.Geometry.Polygon": "Polygon",
            "OpenLayers.Geometry.MultiPolygon": "MultiPolygon",
            "OpenLayers.Geometry.Collection": "GeometryCollection"
        }
    },
    CLASS_NAME: "OpenLayers.Format.GML.Base"
});
OpenLayers.Format.GML.v2 = OpenLayers.Class(OpenLayers.Format.GML.Base, {
    schemaLocation: "http://www.opengis.net/gml http://schemas.opengis.net/gml/2.1.2/feature.xsd",
    initialize: function(a) {
        OpenLayers.Format.GML.Base.prototype.initialize.apply(this, [a])
    },
    readers: {
        gml: OpenLayers.Util.applyDefaults({
            outerBoundaryIs: function(a, b) {
                var c = {};
                this.readChildNodes(a, c);
                b.outer = c.components[0]
            },
            innerBoundaryIs: function(a, b) {
                var c = {};
                this.readChildNodes(a, c);
                b.inner.push(c.components[0])
            },
            Box: function(a, b) {
                var c = 
                {};
                this.readChildNodes(a, c);
                if (!b.components) b.components = [];
                var d = c.points[0];
                c = c.points[1];
                b.components.push(new OpenLayers.Bounds(d.x, d.y, c.x, c.y))
            }
        },
        OpenLayers.Format.GML.Base.prototype.readers.gml),
        feature: OpenLayers.Format.GML.Base.prototype.readers.feature,
        wfs: OpenLayers.Format.GML.Base.prototype.readers.wfs
    },
    write: function(a) {
        a = this.writeNode(OpenLayers.Util.isArray(a) ? "wfs:FeatureCollection": "gml:featureMember", a);
        this.setAttributeNS(a, this.namespaces.xsi, "xsi:schemaLocation", this.schemaLocation);
        return OpenLayers.Format.XML.prototype.write.apply(this, [a])
    },
    writers: {
        gml: OpenLayers.Util.applyDefaults({
            Point: function(a) {
                var b = this.createElementNSPlus("gml:Point");
                this.writeNode("coordinates", [a], b);
                return b
            },
            coordinates: function(a) {
                for (var b = a.length, c = Array(b), d, e = 0; e < b; ++e) {
                    d = a[e];
                    c[e] = this.xy ? d.x + "," + d.y: d.y + "," + d.x;
                    if (d.z != undefined) c[e] += "," + d.z
                }
                return this.createElementNSPlus("gml:coordinates", {
                    attributes: {
                        decimal: ".",
                        cs: ",",
                        ts: " "
                    },
                    value: b == 1 ? c[0] : c.join(" ")
                })
            },
            LineString: function(a) {
                var b = 
                this.createElementNSPlus("gml:LineString");
                this.writeNode("coordinates", a.components, b);
                return b
            },
            Polygon: function(a) {
                var b = this.createElementNSPlus("gml:Polygon");
                this.writeNode("outerBoundaryIs", a.components[0], b);
                for (var c = 1; c < a.components.length; ++c) this.writeNode("innerBoundaryIs", a.components[c], b);
                return b
            },
            outerBoundaryIs: function(a) {
                var b = this.createElementNSPlus("gml:outerBoundaryIs");
                this.writeNode("LinearRing", a, b);
                return b
            },
            innerBoundaryIs: function(a) {
                var b = this.createElementNSPlus("gml:innerBoundaryIs");
                this.writeNode("LinearRing", a, b);
                return b
            },
            LinearRing: function(a) {
                var b = this.createElementNSPlus("gml:LinearRing");
                this.writeNode("coordinates", a.components, b);
                return b
            },
            Box: function(a) {
                var b = this.createElementNSPlus("gml:Box");
                this.writeNode("coordinates", [{
                    x: a.left,
                    y: a.bottom
                },
                {
                    x: a.right,
                    y: a.top
                }], b);
                this.srsName && b.setAttribute("srsName", this.srsName);
                return b
            }
        },
        OpenLayers.Format.GML.Base.prototype.writers.gml),
        feature: OpenLayers.Format.GML.Base.prototype.writers.feature,
        wfs: OpenLayers.Format.GML.Base.prototype.writers.wfs
    },
    CLASS_NAME: "OpenLayers.Format.GML.v2"
});
OpenLayers.Filter.Function = OpenLayers.Class(OpenLayers.Filter, {
    name: null,
    params: null,
    initialize: function(a) {
        OpenLayers.Filter.prototype.initialize.apply(this, [a])
    },
    CLASS_NAME: "OpenLayers.Filter.Function"
});
OpenLayers.Format.Filter.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
    namespaces: {
        ogc: "http://www.opengis.net/ogc",
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },
    defaultPrefix: "ogc",
    schemaLocation: null,
    initialize: function(a) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [a])
    },
    read: function(a) {
        var b = {};
        this.readers.ogc.Filter.apply(this, [a, b]);
        return b.filter
    },
    readers: {
        ogc: {
            Filter: function(a, b) {
                var c = {
                    fids: [],
                    filters: []
                };
                this.readChildNodes(a, c);
                if (c.fids.length > 0) b.filter = new OpenLayers.Filter.FeatureId({
                    fids: c.fids
                });
                else if (c.filters.length > 0) b.filter = c.filters[0]
            },
            FeatureId: function(a, b) {
                var c = a.getAttribute("fid");
                c && b.fids.push(c)
            },
            And: function(a, b) {
                var c = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.AND
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            Or: function(a, b) {
                var c = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.OR
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            Not: function(a, 
            b) {
                var c = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.NOT
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            PropertyIsLessThan: function(a, b) {
                var c = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            PropertyIsGreaterThan: function(a, b) {
                var c = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            PropertyIsLessThanOrEqualTo: function(a, b) {
                var c = 
                new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            PropertyIsGreaterThanOrEqualTo: function(a, b) {
                var c = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            PropertyIsBetween: function(a, b) {
                var c = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            Literal: function(a, 
            b) {
                b.value = OpenLayers.String.numericIf(this.getChildValue(a))
            },
            PropertyName: function(a, b) {
                b.property = this.getChildValue(a)
            },
            LowerBoundary: function(a, b) {
                b.lowerBoundary = OpenLayers.String.numericIf(this.readOgcExpression(a))
            },
            UpperBoundary: function(a, b) {
                b.upperBoundary = OpenLayers.String.numericIf(this.readOgcExpression(a))
            },
            Intersects: function(a, b) {
                this.readSpatial(a, b, OpenLayers.Filter.Spatial.INTERSECTS)
            },
            Within: function(a, b) {
                this.readSpatial(a, b, OpenLayers.Filter.Spatial.WITHIN)
            },
            Contains: function(a, 
            b) {
                this.readSpatial(a, b, OpenLayers.Filter.Spatial.CONTAINS)
            },
            DWithin: function(a, b) {
                this.readSpatial(a, b, OpenLayers.Filter.Spatial.DWITHIN)
            },
            Distance: function(a, b) {
                b.distance = parseInt(this.getChildValue(a));
                b.distanceUnits = a.getAttribute("units")
            },
            Function: function() {}
        }
    },
    readSpatial: function(a, b, c) {
        c = new OpenLayers.Filter.Spatial({
            type: c
        });
        this.readChildNodes(a, c);
        c.value = c.components[0];
        delete c.components;
        b.filters.push(c)
    },
    readOgcExpression: function(a) {
        var b = {};
        this.readChildNodes(a, b);
        b = b.value;
        if (b === undefined) b = this.getChildValue(a);
        return b
    },
    writeOgcExpression: function(a, b) {
        if (a instanceof OpenLayers.Filter.Function) {
            var c = this.writeNode("Function", a, b);
            b.appendChild(c)
        } else this.writeNode("Literal", a, b);
        return b
    },
    write: function(a) {
        return this.writers.ogc.Filter.apply(this, [a])
    },
    writeFeatureIdNodes: function(a, b) {
        for (var c = 0, d = a.fids.length; c < d; ++c) this.writeNode("FeatureId", a.fids[c], b)
    },
    writers: {
        ogc: {
            Filter: function(a) {
                var b = this.createElementNSPlus("ogc:Filter");
                a.type === "FID" ? this.writeFeatureIdNodes(a, 
                b) : this.writeNode(this.getFilterType(a), a, b);
                return b
            },
            FeatureId: function(a) {
                return this.createElementNSPlus("ogc:FeatureId", {
                    attributes: {
                        fid: a
                    }
                })
            },
            And: function(a) {
                for (var b = this.createElementNSPlus("ogc:And"), c, d = 0, e = a.filters.length; d < e; ++d) {
                    c = a.filters[d];
                    c.type === "FID" ? this.writeFeatureIdNodes(c, b) : this.writeNode(this.getFilterType(c), c, b)
                }
                return b
            },
            Or: function(a) {
                for (var b = this.createElementNSPlus("ogc:Or"), c, d = 0, e = a.filters.length; d < e; ++d) {
                    c = a.filters[d];
                    c.type === "FID" ? this.writeFeatureIdNodes(c, 
                    b) : this.writeNode(this.getFilterType(c), c, b)
                }
                return b
            },
            Not: function(a) {
                var b = this.createElementNSPlus("ogc:Not");
                a = a.filters[0];
                a.type === "FID" ? this.writeFeatureIdNodes(a, b) : this.writeNode(this.getFilterType(a), a, b);
                return b
            },
            PropertyIsLessThan: function(a) {
                var b = this.createElementNSPlus("ogc:PropertyIsLessThan");
                this.writeNode("PropertyName", a, b);
                this.writeOgcExpression(a.value, b);
                return b
            },
            PropertyIsGreaterThan: function(a) {
                var b = this.createElementNSPlus("ogc:PropertyIsGreaterThan");
                this.writeNode("PropertyName", 
                a, b);
                this.writeOgcExpression(a.value, b);
                return b
            },
            PropertyIsLessThanOrEqualTo: function(a) {
                var b = this.createElementNSPlus("ogc:PropertyIsLessThanOrEqualTo");
                this.writeNode("PropertyName", a, b);
                this.writeOgcExpression(a.value, b);
                return b
            },
            PropertyIsGreaterThanOrEqualTo: function(a) {
                var b = this.createElementNSPlus("ogc:PropertyIsGreaterThanOrEqualTo");
                this.writeNode("PropertyName", a, b);
                this.writeOgcExpression(a.value, b);
                return b
            },
            PropertyIsBetween: function(a) {
                var b = this.createElementNSPlus("ogc:PropertyIsBetween");
                this.writeNode("PropertyName", a, b);
                this.writeNode("LowerBoundary", a, b);
                this.writeNode("UpperBoundary", a, b);
                return b
            },
            PropertyName: function(a) {
                return this.createElementNSPlus("ogc:PropertyName", {
                    value: a.property
                })
            },
            Literal: function(a) {
                return this.createElementNSPlus("ogc:Literal", {
                    value: a
                })
            },
            LowerBoundary: function(a) {
                var b = this.createElementNSPlus("ogc:LowerBoundary");
                this.writeOgcExpression(a.lowerBoundary, b);
                return b
            },
            UpperBoundary: function(a) {
                var b = this.createElementNSPlus("ogc:UpperBoundary");
                this.writeNode("Literal", a.upperBoundary, b);
                return b
            },
            INTERSECTS: function(a) {
                return this.writeSpatial(a, "Intersects")
            },
            WITHIN: function(a) {
                return this.writeSpatial(a, "Within")
            },
            CONTAINS: function(a) {
                return this.writeSpatial(a, "Contains")
            },
            DWITHIN: function(a) {
                var b = this.writeSpatial(a, "DWithin");
                this.writeNode("Distance", a, b);
                return b
            },
            Distance: function(a) {
                return this.createElementNSPlus("ogc:Distance", {
                    attributes: {
                        units: a.distanceUnits
                    },
                    value: a.distance
                })
            },
            Function: function(a) {
                var b = this.createElementNSPlus("ogc:Function", 
                {
                    attributes: {
                        name: a.name
                    }
                });
                a = a.params;
                for (var c = 0, d = a.length; c < d; c++) this.writeOgcExpression(a[c], b);
                return b
            }
        }
    },
    getFilterType: function(a) {
        var b = this.filterMap[a.type];
        if (!b) throw "Filter writing not supported for rule type: " + a.type;
        return b
    },
    filterMap: {
        "&&": "And",
        "||": "Or",
        "!": "Not",
        "==": "PropertyIsEqualTo",
        "!=": "PropertyIsNotEqualTo",
        "<": "PropertyIsLessThan",
        ">": "PropertyIsGreaterThan",
        "<=": "PropertyIsLessThanOrEqualTo",
        ">=": "PropertyIsGreaterThanOrEqualTo",
        "..": "PropertyIsBetween",
        "~": "PropertyIsLike",
        BBOX: "BBOX",
        DWITHIN: "DWITHIN",
        WITHIN: "WITHIN",
        CONTAINS: "CONTAINS",
        INTERSECTS: "INTERSECTS",
        FID: "FeatureId"
    },
    CLASS_NAME: "OpenLayers.Format.Filter.v1"
});
OpenLayers.Format.Filter.v1_0_0 = OpenLayers.Class(OpenLayers.Format.GML.v2, OpenLayers.Format.Filter.v1, {
    VERSION: "1.0.0",
    schemaLocation: "http://www.opengis.net/ogc/filter/1.0.0/filter.xsd",
    initialize: function(a) {
        OpenLayers.Format.GML.v2.prototype.initialize.apply(this, [a])
    },
    readers: {
        ogc: OpenLayers.Util.applyDefaults({
            PropertyIsEqualTo: function(a, b) {
                var c = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            PropertyIsNotEqualTo: function(a, 
            b) {
                var c = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO
                });
                this.readChildNodes(a, c);
                b.filters.push(c)
            },
            PropertyIsLike: function(a, b) {
                var c = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LIKE
                });
                this.readChildNodes(a, c);
                var d = a.getAttribute("wildCard"),
                e = a.getAttribute("singleChar"),
                f = a.getAttribute("escape");
                c.value2regex(d, e, f);
                b.filters.push(c)
            }
        },
        OpenLayers.Format.Filter.v1.prototype.readers.ogc),
        gml: OpenLayers.Format.GML.v2.prototype.readers.gml,
        feature: OpenLayers.Format.GML.v2.prototype.readers.feature
    },
    writers: {
        ogc: OpenLayers.Util.applyDefaults({
            PropertyIsEqualTo: function(a) {
                var b = this.createElementNSPlus("ogc:PropertyIsEqualTo");
                this.writeNode("PropertyName", a, b);
                this.writeOgcExpression(a.value, b);
                return b
            },
            PropertyIsNotEqualTo: function(a) {
                var b = this.createElementNSPlus("ogc:PropertyIsNotEqualTo");
                this.writeNode("PropertyName", a, b);
                this.writeOgcExpression(a.value, b);
                return b
            },
            PropertyIsLike: function(a) {
                var b = this.createElementNSPlus("ogc:PropertyIsLike", 
                {
                    attributes: {
                        wildCard: "*",
                        singleChar: ".",
                        escape: "!"
                    }
                });
                this.writeNode("PropertyName", a, b);
                this.writeNode("Literal", a.regex2value(), b);
                return b
            },
            BBOX: function(a) {
                var b = this.createElementNSPlus("ogc:BBOX");
                a.property && this.writeNode("PropertyName", a, b);
                var c = this.writeNode("gml:Box", a.value, b);
                a.projection && c.setAttribute("srsName", a.projection);
                return b
            }
        },
        OpenLayers.Format.Filter.v1.prototype.writers.ogc),
        gml: OpenLayers.Format.GML.v2.prototype.writers.gml,
        feature: OpenLayers.Format.GML.v2.prototype.writers.feature
    },
    writeSpatial: function(a, b) {
        var c = this.createElementNSPlus("ogc:" + b);
        this.writeNode("PropertyName", a, c);
        if (a.value instanceof OpenLayers.Filter.Function) this.writeNode("Function", a.value, c);
        else {
            var d;
            d = a.value instanceof OpenLayers.Geometry ? this.writeNode("feature:_geometry", a.value).firstChild: this.writeNode("gml:Box", a.value);
            a.projection && d.setAttribute("srsName", a.projection);
            c.appendChild(d)
        }
        return c
    },
    CLASS_NAME: "OpenLayers.Format.Filter.v1_0_0"
});
OpenLayers.Format.WFST.v1_0_0 = OpenLayers.Class(OpenLayers.Format.Filter.v1_0_0, OpenLayers.Format.WFST.v1, {
    version: "1.0.0",
    srsNameInQuery: false,
    schemaLocations: {
        wfs: "http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd"
    },
    initialize: function(a) {
        OpenLayers.Format.Filter.v1_0_0.prototype.initialize.apply(this, [a]);
        OpenLayers.Format.WFST.v1.prototype.initialize.apply(this, [a])
    },
    readNode: function(a, b) {
        return OpenLayers.Format.GML.v2.prototype.readNode.apply(this, [a, b])
    },
    readers: {
        wfs: OpenLayers.Util.applyDefaults({
            WFS_TransactionResponse: function(a, 
            b) {
                b.insertIds = [];
                b.success = false;
                this.readChildNodes(a, b)
            },
            InsertResult: function(a, b) {
                var c = {
                    fids: []
                };
                this.readChildNodes(a, c);
                b.insertIds.push(c.fids[0])
            },
            TransactionResult: function(a, b) {
                this.readChildNodes(a, b)
            },
            Status: function(a, b) {
                this.readChildNodes(a, b)
            },
            SUCCESS: function(a, b) {
                b.success = true
            }
        },
        OpenLayers.Format.WFST.v1.prototype.readers.wfs),
        gml: OpenLayers.Format.GML.v2.prototype.readers.gml,
        feature: OpenLayers.Format.GML.v2.prototype.readers.feature,
        ogc: OpenLayers.Format.Filter.v1_0_0.prototype.readers.ogc
    },
    writers: {
        wfs: OpenLayers.Util.applyDefaults({
            Query: function(a) {
                a = OpenLayers.Util.extend({
                    featureNS: this.featureNS,
                    featurePrefix: this.featurePrefix,
                    featureType: this.featureType,
                    srsName: this.srsName,
                    srsNameInQuery: this.srsNameInQuery
                },
                a);
                var b = a.featurePrefix,
                c = this.createElementNSPlus("wfs:Query", {
                    attributes: {
                        typeName: (b ? b + ":": "") + a.featureType
                    }
                });
                a.srsNameInQuery && a.srsName && c.setAttribute("srsName", a.srsName);
                a.featureNS && c.setAttribute("xmlns:" + b, a.featureNS);
                if (a.propertyNames) {
                    b = 0;
                    for (var d = a.propertyNames.length; b < 
                    d; b++) this.writeNode("ogc:PropertyName", {
                        property: a.propertyNames[b]
                    },
                    c)
                }
                if (a.filter) {
                    this.setFilterProperty(a.filter);
                    this.writeNode("ogc:Filter", a.filter, c)
                }
                return c
            }
        },
        OpenLayers.Format.WFST.v1.prototype.writers.wfs),
        gml: OpenLayers.Format.GML.v2.prototype.writers.gml,
        feature: OpenLayers.Format.GML.v2.prototype.writers.feature,
        ogc: OpenLayers.Format.Filter.v1_0_0.prototype.writers.ogc
    },
    CLASS_NAME: "OpenLayers.Format.WFST.v1_0_0"
});
OpenLayers.ElementsIndexer = OpenLayers.Class({
    maxZIndex: null,
    order: null,
    indices: null,
    compare: null,
    initialize: function(a) {
        this.compare = a ? OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_Y_ORDER: OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_DRAWING_ORDER;
        this.clear()
    },
    insert: function(a) {
        this.exists(a) && this.remove(a);
        var b = a.id;
        this.determineZIndex(a);
        for (var c = -1, d = this.order.length, e; d - c > 1;) {
            e = parseInt((c + d) / 2);
            if (this.compare(this, a, OpenLayers.Util.getElement(this.order[e])) > 0) c = e;
            else d = e
        }
        this.order.splice(d, 
        0, b);
        this.indices[b] = this.getZIndex(a);
        return this.getNextElement(d)
    },
    remove: function(a) {
        a = a.id;
        var b = OpenLayers.Util.indexOf(this.order, a);
        if (b >= 0) {
            this.order.splice(b, 1);
            delete this.indices[a];
            this.maxZIndex = this.order.length > 0 ? this.indices[this.order[this.order.length - 1]] : 0
        }
    },
    clear: function() {
        this.order = [];
        this.indices = {};
        this.maxZIndex = 0
    },
    exists: function(a) {
        return this.indices[a.id] != null
    },
    getZIndex: function(a) {
        return a._style.graphicZIndex
    },
    determineZIndex: function(a) {
        var b = a._style.graphicZIndex;
        if (b == null) {
            b = this.maxZIndex;
            a._style.graphicZIndex = b
        } else if (b > this.maxZIndex) this.maxZIndex = b
    },
    getNextElement: function(a) {
        a += 1;
        if (a < this.order.length) {
            var b = OpenLayers.Util.getElement(this.order[a]);
            if (b == undefined) b = this.getNextElement(a);
            return b
        } else return null
    },
    CLASS_NAME: "OpenLayers.ElementsIndexer"
});
OpenLayers.ElementsIndexer.IndexingMethods = {
    Z_ORDER: function(a, b, c) {
        b = a.getZIndex(b);
        var d = 0;
        if (c) {
            a = a.getZIndex(c);
            d = b - a
        }
        return d
    },
    Z_ORDER_DRAWING_ORDER: function(a, b, c) {
        a = OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(a, b, c);
        if (c && a == 0) a = 1;
        return a
    },
    Z_ORDER_Y_ORDER: function(a, b, c) {
        a = OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(a, b, c);
        if (c && a === 0) {
            b = c._boundsBottom - b._boundsBottom;
            a = b === 0 ? 1: b
        }
        return a
    }
};
OpenLayers.Renderer.Elements = OpenLayers.Class(OpenLayers.Renderer, {
    rendererRoot: null,
    root: null,
    vectorRoot: null,
    textRoot: null,
    xmlns: null,
    indexer: null,
    BACKGROUND_ID_SUFFIX: "_background",
    LABEL_ID_SUFFIX: "_label",
    initialize: function(a, b) {
        OpenLayers.Renderer.prototype.initialize.apply(this, arguments);
        this.rendererRoot = this.createRenderRoot();
        this.root = this.createRoot("_root");
        this.vectorRoot = this.createRoot("_vroot");
        this.textRoot = this.createRoot("_troot");
        this.root.appendChild(this.vectorRoot);
        this.root.appendChild(this.textRoot);
        this.rendererRoot.appendChild(this.root);
        this.container.appendChild(this.rendererRoot);
        if (b && (b.zIndexing || b.yOrdering)) this.indexer = new OpenLayers.ElementsIndexer(b.yOrdering)
    },
    destroy: function() {
        this.clear();
        this.xmlns = this.root = this.rendererRoot = null;
        OpenLayers.Renderer.prototype.destroy.apply(this, arguments)
    },
    clear: function() {
        var a,
        b = this.vectorRoot;
        if (b) for (; a = b.firstChild;) b.removeChild(a);
        if (b = this.textRoot) for (; a = b.firstChild;) b.removeChild(a);
        this.indexer && this.indexer.clear()
    },
    getNodeType: function() {},
    drawGeometry: function(a, b, c) {
        var d = a.CLASS_NAME,
        e = true;
        if (d == "OpenLayers.Geometry.Collection" || d == "OpenLayers.Geometry.MultiPoint" || d == "OpenLayers.Geometry.MultiLineString" || d == "OpenLayers.Geometry.MultiPolygon") {
            d = 0;
            for (var f = a.components.length; d < f; d++) e = this.drawGeometry(a.components[d], b, c) && e;
            return e
        }
        d = e = false;
        if (b.display != "none") {
            if (b.backgroundGraphic) this.redrawBackgroundNode(a.id, a, b, c);
            else d = true;
            e = this.redrawNode(a.id, a, b, c)
        }
        if (e == false) if (b = document.getElementById(a.id)) {
            if (b._style.backgroundGraphic) d = 
            true;
            b.parentNode.removeChild(b)
        }
        if (d)(b = document.getElementById(a.id + this.BACKGROUND_ID_SUFFIX)) && b.parentNode.removeChild(b);
        return e
    },
    redrawNode: function(a, b, c, d) {
        c = this.applyDefaultSymbolizer(c);
        a = this.nodeFactory(a, this.getNodeType(b, c));
        a._featureId = d;
        a._boundsBottom = b.getBounds().bottom;
        a._geometryClass = b.CLASS_NAME;
        a._style = c;
        b = this.drawGeometryNode(a, b, c);
        if (b === false) return false;
        a = b.node;
        if (this.indexer)(c = this.indexer.insert(a)) ? this.vectorRoot.insertBefore(a, c) : this.vectorRoot.appendChild(a);
        else a.parentNode !== this.vectorRoot && this.vectorRoot.appendChild(a);
        this.postDraw(a);
        return b.complete
    },
    redrawBackgroundNode: function(a, b, c) {
        c = OpenLayers.Util.extend({},
        c);
        c.externalGraphic = c.backgroundGraphic;
        c.graphicXOffset = c.backgroundXOffset;
        c.graphicYOffset = c.backgroundYOffset;
        c.graphicZIndex = c.backgroundGraphicZIndex;
        c.graphicWidth = c.backgroundWidth || c.graphicWidth;
        c.graphicHeight = c.backgroundHeight || c.graphicHeight;
        c.backgroundGraphic = null;
        c.backgroundXOffset = null;
        c.backgroundYOffset = null;
        c.backgroundGraphicZIndex = null;
        return this.redrawNode(a + this.BACKGROUND_ID_SUFFIX, b, c, null)
    },
    drawGeometryNode: function(a, b, c) {
        c = c || a._style;
        var d = {
            isFilled: c.fill === undefined ? true: c.fill,
            isStroked: c.stroke === undefined ? !!c.strokeWidth: c.stroke
        },
        e;
        switch (b.CLASS_NAME) {
        case "OpenLayers.Geometry.Point":
            if (c.graphic === false) {
                d.isFilled = false;
                d.isStroked = false
            }
            e = this.drawPoint(a, b);
            break;
        case "OpenLayers.Geometry.LineString":
            d.isFilled = false;
            e = this.drawLineString(a, b);
            break;
        case "OpenLayers.Geometry.LinearRing":
            e = 
            this.drawLinearRing(a, b);
            break;
        case "OpenLayers.Geometry.Polygon":
            e = this.drawPolygon(a, b);
            break;
        case "OpenLayers.Geometry.Surface":
            e = this.drawSurface(a, b);
            break;
        case "OpenLayers.Geometry.Rectangle":
            e = this.drawRectangle(a, b)
        }
        a._options = d;
        return e != false ? {
            node: this.setStyle(a, c, d, b),
            complete: e
        }: false
    },
    postDraw: function() {},
    drawPoint: function() {},
    drawLineString: function() {},
    drawLinearRing: function() {},
    drawPolygon: function() {},
    drawRectangle: function() {},
    drawCircle: function() {},
    drawSurface: function() {},
    removeText: function(a) { (a = document.getElementById(a + this.LABEL_ID_SUFFIX)) && this.textRoot.removeChild(a)
    },
    getFeatureIdFromEvent: function(a) {
        var b = a.target,
        c = b && b.correspondingUseElement;
        return (c ? c: b || a.srcElement)._featureId
    },
    eraseGeometry: function(a, b) {
        if (a.CLASS_NAME == "OpenLayers.Geometry.MultiPoint" || a.CLASS_NAME == "OpenLayers.Geometry.MultiLineString" || a.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon" || a.CLASS_NAME == "OpenLayers.Geometry.Collection") for (var c = 0, d = a.components.length; c < d; c++) this.eraseGeometry(a.components[c], 
        b);
        else if ((c = OpenLayers.Util.getElement(a.id)) && c.parentNode) {
            if (c.geometry) {
                c.geometry.destroy();
                c.geometry = null
            }
            c.parentNode.removeChild(c);
            this.indexer && this.indexer.remove(c);
            if (c._style.backgroundGraphic)(c = OpenLayers.Util.getElement(a.id + this.BACKGROUND_ID_SUFFIX)) && c.parentNode && c.parentNode.removeChild(c)
        }
    },
    nodeFactory: function(a, b) {
        var c = OpenLayers.Util.getElement(a);
        if (c) {
            if (!this.nodeTypeCompare(c, b)) {
                c.parentNode.removeChild(c);
                c = this.nodeFactory(a, b)
            }
        } else c = this.createNode(b, a);
        return c
    },
    nodeTypeCompare: function() {},
    createNode: function() {},
    moveRoot: function(a) {
        var b = this.root;
        if (a.root.parentNode == this.rendererRoot) b = a.root;
        b.parentNode.removeChild(b);
        a.rendererRoot.appendChild(b)
    },
    getRenderLayerId: function() {
        return this.root.parentNode.parentNode.id
    },
    isComplexSymbol: function(a) {
        return a != "circle" && !!a
    },
    CLASS_NAME: "OpenLayers.Renderer.Elements"
});
OpenLayers.Renderer.symbol = {
    star: [350, 75, 379, 161, 469, 161, 397, 215, 423, 301, 350, 250, 277, 301, 303, 215, 231, 161, 321, 161, 350, 75],
    cross: [4, 0, 6, 0, 6, 4, 10, 4, 10, 6, 6, 6, 6, 10, 4, 10, 4, 6, 0, 6, 0, 4, 4, 4, 4, 0],
    x: [0, 0, 25, 0, 50, 35, 75, 0, 100, 0, 65, 50, 100, 100, 75, 100, 50, 65, 25, 100, 0, 100, 35, 50, 0, 0],
    square: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    triangle: [0, 10, 10, 10, 5, 0, 0, 10]
};
OpenLayers.Strategy = OpenLayers.Class({
    layer: null,
    options: null,
    active: null,
    autoActivate: true,
    autoDestroy: true,
    initialize: function(a) {
        OpenLayers.Util.extend(this, a);
        this.options = a;
        this.active = false
    },
    destroy: function() {
        this.deactivate();
        this.options = this.layer = null
    },
    setLayer: function(a) {
        this.layer = a
    },
    activate: function() {
        if (!this.active) return this.active = true;
        return false
    },
    deactivate: function() {
        if (this.active) {
            this.active = false;
            return true
        }
        return false
    },
    CLASS_NAME: "OpenLayers.Strategy"
});
OpenLayers.Strategy.Fixed = OpenLayers.Class(OpenLayers.Strategy, {
    preload: false,
    activate: function() {
        if (OpenLayers.Strategy.prototype.activate.apply(this, arguments)) {
            this.layer.events.on({
                refresh: this.load,
                scope: this
            });
            if (this.layer.visibility == true || this.preload) this.load();
            else this.layer.events.on({
                visibilitychanged: this.load,
                scope: this
            });
            return true
        }
        return false
    },
    deactivate: function() {
        var a = OpenLayers.Strategy.prototype.deactivate.call(this);
        a && this.layer.events.un({
            refresh: this.load,
            visibilitychanged: this.load,
            scope: this
        });
        return a
    },
    load: function(a) {
        var b = this.layer;
        b.events.triggerEvent("loadstart");
        b.protocol.read(OpenLayers.Util.applyDefaults({
            callback: OpenLayers.Function.bind(this.merge, this, b.map.getProjectionObject()),
            filter: b.filter
        },
        a));
        b.events.un({
            visibilitychanged: this.load,
            scope: this
        })
    },
    merge: function(a, b) {
        var c = this.layer;
        c.destroyFeatures();
        var d = b.features;
        if (d && d.length > 0) {
            if (!a.equals(c.projection)) for (var e, f = 0, g = d.length; f < g; ++f)(e = d[f].geometry) && e.transform(c.projection, a);
            c.addFeatures(d)
        }
        c.events.triggerEvent("loadend")
    },
    CLASS_NAME: "OpenLayers.Strategy.Fixed"
});
OpenLayers.Protocol = OpenLayers.Class({
    format: null,
    options: null,
    autoDestroy: true,
    defaultFilter: null,
    initialize: function(a) {
        a = a || {};
        OpenLayers.Util.extend(this, a);
        this.options = a
    },
    mergeWithDefaultFilter: function(a) {
        return a && this.defaultFilter ? new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [this.defaultFilter, a]
        }) : a || this.defaultFilter || undefined
    },
    destroy: function() {
        this.format = this.options = null
    },
    read: function(a) {
        a = a || {};
        a.filter = this.mergeWithDefaultFilter(a.filter)
    },
    create: function() {},
    update: function() {},
    "delete": function() {},
    commit: function() {},
    abort: function() {},
    createCallback: function(a, b, c) {
        return OpenLayers.Function.bind(function() {
            a.apply(this, [b, c])
        },
        this)
    },
    CLASS_NAME: "OpenLayers.Protocol"
});
OpenLayers.Protocol.Response = OpenLayers.Class({
    code: null,
    requestType: null,
    last: true,
    features: null,
    reqFeatures: null,
    priv: null,
    error: null,
    initialize: function(a) {
        OpenLayers.Util.extend(this, a)
    },
    success: function() {
        return this.code > 0
    },
    CLASS_NAME: "OpenLayers.Protocol.Response"
});
OpenLayers.Protocol.Response.SUCCESS = 1;
OpenLayers.Protocol.Response.FAILURE = 0;
OpenLayers.Protocol.WFS = function(a) {
    a = OpenLayers.Util.applyDefaults(a, OpenLayers.Protocol.WFS.DEFAULTS);
    var b = OpenLayers.Protocol.WFS["v" + a.version.replace(/\./g, "_")];
    if (!b) throw "Unsupported WFS version: " + a.version;
    return new b(a)
};
OpenLayers.Protocol.WFS.fromWMSLayer = function(a, b) {
    var c,
    d;
    c = a.params.LAYERS;
    c = (OpenLayers.Util.isArray(c) ? c[0] : c).split(":");
    if (c.length > 1) d = c[0];
    c = c.pop();
    d = {
        url: a.url,
        featureType: c,
        featurePrefix: d,
        srsName: a.projection && a.projection.getCode() || a.map && a.map.getProjectionObject().getCode(),
        version: "1.1.0"
    };
    return new OpenLayers.Protocol.WFS(OpenLayers.Util.applyDefaults(b, d))
};
OpenLayers.Protocol.WFS.DEFAULTS = {
    version: "1.0.0"
};
OpenLayers.Request = {
    DEFAULT_CONFIG: {
        method: "GET",
        url: window.location.href,
        async: true,
        user: undefined,
        password: undefined,
        params: null,
        proxy: OpenLayers.ProxyHost,
        headers: {},
        data: null,
        callback: function() {},
        success: null,
        failure: null,
        scope: null
    },
    URL_SPLIT_REGEX: /([^:]*:)\/\/([^:]*:?[^@]*@)?([^:\/\?]*):?([^\/\?]*)/,
    events: new OpenLayers.Events(this, null, ["complete", "success", "failure"]),
    issue: function(a) {
        var b = OpenLayers.Util.extend(this.DEFAULT_CONFIG, {
            proxy: OpenLayers.ProxyHost
        });
        a = OpenLayers.Util.applyDefaults(a, 
        b);
        var c = new OpenLayers.Request.XMLHttpRequest,
        d = OpenLayers.Util.urlAppend(a.url, OpenLayers.Util.getParameterString(a.params || {}));
        b = d.indexOf("http") != 0;
        var e = !b && d.match(this.URL_SPLIT_REGEX);
        if (e) {
            var f = window.location;
            b = e[1] == f.protocol && e[3] == f.hostname;
            e = e[4];
            f = f.port;
            if (e != 80 && e != "" || f != "80" && f != "") b = b && e == f
        }
        if (!b) if (a.proxy) d = typeof a.proxy == "function" ? a.proxy(d) : a.proxy + encodeURIComponent(d);
        else OpenLayers.Console.warn(OpenLayers.i18n("proxyNeeded"), {
            url: d
        });
        c.open(a.method, d, a.async, a.user, 
        a.password);
        for (var g in a.headers) c.setRequestHeader(g, a.headers[g]);
        var h = this.events,
        i = this;
        c.onreadystatechange = function() {
            c.readyState == OpenLayers.Request.XMLHttpRequest.DONE && h.triggerEvent("complete", {
                request: c,
                config: a,
                requestUrl: d
            }) !== false && i.runCallbacks({
                request: c,
                config: a,
                requestUrl: d
            })
        };
        a.async === false ? c.send(a.data) : window.setTimeout(function() {
            c.readyState !== 0 && c.send(a.data)
        },
        0);
        return c
    },
    runCallbacks: function(a) {
        var b = a.request,
        c = a.config,
        d = c.scope ? OpenLayers.Function.bind(c.callback, 
        c.scope) : c.callback,
        e;
        if (c.success) e = c.scope ? OpenLayers.Function.bind(c.success, c.scope) : c.success;
        var f;
        if (c.failure) f = c.scope ? OpenLayers.Function.bind(c.failure, c.scope) : c.failure;
        if (OpenLayers.Util.createUrlObject(c.url).protocol == "file:" && b.responseText) b.status = 200;
        d(b);
        if (!b.status || b.status >= 200 && b.status < 300) {
            this.events.triggerEvent("success", a);
            e && e(b)
        }
        if (b.status && (b.status < 200 || b.status >= 300)) {
            this.events.triggerEvent("failure", a);
            f && f(b)
        }
    },
    GET: function(a) {
        a = OpenLayers.Util.extend(a, {
            method: "GET"
        });
        return OpenLayers.Request.issue(a)
    },
    POST: function(a) {
        a = OpenLayers.Util.extend(a, {
            method: "POST"
        });
        a.headers = a.headers ? a.headers: {};
        "CONTENT-TYPE" in OpenLayers.Util.upperCaseObject(a.headers) || (a.headers["Content-Type"] = "application/xml");
        return OpenLayers.Request.issue(a)
    },
    PUT: function(a) {
        a = OpenLayers.Util.extend(a, {
            method: "PUT"
        });
        a.headers = a.headers ? a.headers: {};
        "CONTENT-TYPE" in OpenLayers.Util.upperCaseObject(a.headers) || (a.headers["Content-Type"] = "application/xml");
        return OpenLayers.Request.issue(a)
    },
    DELETE: function(a) {
        a = OpenLayers.Util.extend(a, {
            method: "DELETE"
        });
        return OpenLayers.Request.issue(a)
    },
    HEAD: function(a) {
        a = OpenLayers.Util.extend(a, {
            method: "HEAD"
        });
        return OpenLayers.Request.issue(a)
    },
    OPTIONS: function(a) {
        a = OpenLayers.Util.extend(a, {
            method: "OPTIONS"
        });
        return OpenLayers.Request.issue(a)
    }
};
 (function() {
    function a() {
        this._object = f && !i ? new f: new window.ActiveXObject("Microsoft.XMLHTTP");
        this._listeners = []
    }
    function b() {
        return new a
    }
    function c(j) {
        b.onreadystatechange && b.onreadystatechange.apply(j);
        j.dispatchEvent({
            type: "readystatechange",
            bubbles: false,
            cancelable: false,
            timeStamp: new Date + 0
        })
    }
    function d(j) {
        try {
            j.responseText = j._object.responseText
        } catch(k) {}
        try {
            var l;
            a: {
                var m = j._object,
                n = m.responseXML,
                o = m.responseText;
                if (h && o && n && !n.documentElement && m.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
                    n = 
                    new window.ActiveXObject("Microsoft.XMLDOM");
                    n.async = false;
                    n.validateOnParse = false;
                    n.loadXML(o)
                }
                if (n) if (h && n.parseError != 0 || !n.documentElement || n.documentElement && n.documentElement.tagName == "parsererror") {
                    l = null;
                    break a
                }
                l = n
            }
            j.responseXML = l
        } catch(p) {}
        try {
            j.status = j._object.status
        } catch(q) {}
        try {
            j.statusText = j._object.statusText
        } catch(r) {}
    }
    function e(j) {
        j._object.onreadystatechange = new window.Function
    }
    var f = window.XMLHttpRequest,
    g = !!window.controllers,
    h = window.document.all && !window.opera,
    i = h && window.navigator.userAgent.match(/MSIE 7.0/);
    b.prototype = a.prototype;
    if (g && f.wrapped) b.wrapped = f.wrapped;
    b.UNSENT = 0;
    b.OPENED = 1;
    b.HEADERS_RECEIVED = 2;
    b.LOADING = 3;
    b.DONE = 4;
    b.prototype.readyState = b.UNSENT;
    b.prototype.responseText = "";
    b.prototype.responseXML = null;
    b.prototype.status = 0;
    b.prototype.statusText = "";
    b.prototype.priority = "NORMAL";
    b.prototype.onreadystatechange = null;
    b.onreadystatechange = null;
    b.onopen = null;
    b.onsend = null;
    b.onabort = null;
    b.prototype.open = function(j, k, l, m, n) {
        delete this._headers;
        if (arguments.length < 3) l = true;
        this._async = l;
        var o = 
        this,
        p = this.readyState,
        q;
        if (h && l) {
            q = function() {
                if (p != b.DONE) {
                    e(o);
                    o.abort()
                }
            };
            window.attachEvent("onunload", q)
        }
        b.onopen && b.onopen.apply(this, arguments);
        if (arguments.length > 4) this._object.open(j, k, l, m, n);
        else arguments.length > 3 ? this._object.open(j, k, l, m) : this._object.open(j, k, l);
        this.readyState = b.OPENED;
        c(this);
        this._object.onreadystatechange = function() {
            if (! (g && !l)) {
                o.readyState = o._object.readyState;
                d(o);
                if (o._aborted) o.readyState = b.UNSENT;
                else {
                    if (o.readyState == b.DONE) {
                        delete o._data;
                        e(o);
                        h && l && window.detachEvent("onunload", 
                        q)
                    }
                    p != o.readyState && c(o);
                    p = o.readyState
                }
            }
        }
    };
    b.prototype.send = function(j) {
        b.onsend && b.onsend.apply(this, arguments);
        arguments.length || (j = null);
        if (j && j.nodeType) {
            j = window.XMLSerializer ? (new window.XMLSerializer).serializeToString(j) : j.xml;
            oRequest._headers["Content-Type"] || oRequest._object.setRequestHeader("Content-Type", "application/xml")
        }
        this._data = j;
        this._object.send(this._data);
        if (g && !this._async) {
            this.readyState = b.OPENED;
            for (d(this); this.readyState < b.DONE;) {
                this.readyState++;
                c(this);
                if (this._aborted) break
            }
        }
    };
    b.prototype.abort = function() {
        b.onabort && b.onabort.apply(this, arguments);
        if (this.readyState > b.UNSENT) this._aborted = true;
        this._object.abort();
        e(this);
        this.readyState = b.UNSENT;
        delete this._data
    };
    b.prototype.getAllResponseHeaders = function() {
        return this._object.getAllResponseHeaders()
    };
    b.prototype.getResponseHeader = function(j) {
        return this._object.getResponseHeader(j)
    };
    b.prototype.setRequestHeader = function(j, k) {
        if (!this._headers) this._headers = {};
        this._headers[j] = k;
        return this._object.setRequestHeader(j, 
        k)
    };
    b.prototype.addEventListener = function(j, k, l) {
        for (var m = 0, n; n = this._listeners[m]; m++) if (n[0] == j && n[1] == k && n[2] == l) return;
        this._listeners.push([j, k, l])
    };
    b.prototype.removeEventListener = function(j, k, l) {
        for (var m = 0, n; n = this._listeners[m]; m++) if (n[0] == j && n[1] == k && n[2] == l) break;
        n && this._listeners.splice(m, 1)
    };
    b.prototype.dispatchEvent = function(j) {
        j = {
            type: j.type,
            target: this,
            currentTarget: this,
            eventPhase: 2,
            bubbles: j.bubbles,
            cancelable: j.cancelable,
            timeStamp: j.timeStamp,
            stopPropagation: function() {},
            preventDefault: function() {},
            initEvent: function() {}
        };
        if (j.type == "readystatechange" && this.onreadystatechange)(this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [j]);
        for (var k = 0, l; l = this._listeners[k]; k++) if (l[0] == j.type && !l[2])(l[1].handleEvent || l[1]).apply(this, [j])
    };
    b.prototype.toString = function() {
        return "[object XMLHttpRequest]"
    };
    b.toString = function() {
        return "[XMLHttpRequest]"
    };
    if (!window.Function.prototype.apply) window.Function.prototype.apply = function(j, k) {
        k || (k = []);
        j.__func = this;
        j.__func(k[0], k[1], k[2], 
        k[3], k[4]);
        delete j.__func
    };
    OpenLayers.Request.XMLHttpRequest = b
})();
OpenLayers.Format.KML = OpenLayers.Class(OpenLayers.Format.XML, {
    namespaces: {
        kml: "http://www.opengis.net/kml/2.2",
        gx: "http://www.google.com/kml/ext/2.2"
    },
    kmlns: "http://earth.google.com/kml/2.0",
    placemarksDesc: "No description available",
    foldersName: "OpenLayers export",
    foldersDesc: "Exported on " + new Date,
    extractAttributes: true,
    extractStyles: false,
    extractTracks: false,
    trackAttributes: null,
    internalns: null,
    features: null,
    styles: null,
    styleBaseUrl: "",
    fetched: null,
    maxDepth: 0,
    initialize: function(a) {
        this.regExes = 
        {
            trimSpace: /^\s*|\s*$/g,
            removeSpace: /\s*/g,
            splitSpace: /\s+/,
            trimComma: /\s*,\s*/g,
            kmlColor: /(\w{2})(\w{2})(\w{2})(\w{2})/,
            kmlIconPalette: /root:\/\/icons\/palette-(\d+)(\.\w+)/,
            straightBracket: /\$\[(.*?)\]/g
        };
        this.externalProjection = new OpenLayers.Projection("EPSG:4326");
        OpenLayers.Format.XML.prototype.initialize.apply(this, [a])
    },
    read: function(a) {
        this.features = [];
        this.styles = {};
        this.fetched = {};
        return this.parseData(a, {
            depth: 0,
            styleBaseUrl: this.styleBaseUrl
        })
    },
    parseData: function(a, b) {
        if (typeof a == "string") a = 
        OpenLayers.Format.XML.prototype.read.apply(this, [a]);
        for (var c = ["Link", "NetworkLink", "Style", "StyleMap", "Placemark"], d = 0, e = c.length; d < e; ++d) {
            var f = c[d],
            g = this.getElementsByTagNameNS(a, "*", f);
            if (g.length != 0) switch (f.toLowerCase()) {
            case "link":
            case "networklink":
                this.parseLinks(g, b);
                break;
            case "style":
                this.extractStyles && this.parseStyles(g, b);
                break;
            case "stylemap":
                this.extractStyles && this.parseStyleMaps(g, b);
                break;
            case "placemark":
                this.parseFeatures(g, b)
            }
        }
        return this.features
    },
    parseLinks: function(a, 
    b) {
        if (b.depth >= this.maxDepth) return false;
        var c = OpenLayers.Util.extend({},
        b);
        c.depth++;
        for (var d = 0, e = a.length; d < e; d++) {
            var f = this.parseProperty(a[d], "*", "href");
            if (f && !this.fetched[f]) {
                this.fetched[f] = true; (f = this.fetchLink(f)) && this.parseData(f, c)
            }
        }
    },
    fetchLink: function(a) {
        if (a = OpenLayers.Request.GET({
            url: a,
            async: false
        })) return a.responseText
    },
    parseStyles: function(a, b) {
        for (var c = 0, d = a.length; c < d; c++) {
            var e = this.parseStyle(a[c]);
            if (e) this.styles[(b.styleBaseUrl || "") + "#" + e.id] = e
        }
    },
    parseKmlColor: function(a) {
        var b = 
        null;
        if (a) if (a = a.match(this.regExes.kmlColor)) b = {
            color: "#" + a[4] + a[3] + a[2],
            opacity: parseInt(a[1], 16) / 255
        };
        return b
    },
    parseStyle: function(a) {
        for (var b = {},
        c = ["LineStyle", "PolyStyle", "IconStyle", "BalloonStyle", "LabelStyle"], d, e, f = 0, g = c.length; f < g; ++f) {
            d = c[f];
            if (e = this.getElementsByTagNameNS(a, "*", d)[0]) switch (d.toLowerCase()) {
            case "linestyle":
                d = this.parseProperty(e, "*", "color");
                if (d = this.parseKmlColor(d)) {
                    b.strokeColor = d.color;
                    b.strokeOpacity = d.opacity
                }
                if (d = this.parseProperty(e, "*", "width")) b.strokeWidth = 
                d;
                break;
            case "polystyle":
                d = this.parseProperty(e, "*", "color");
                if (d = this.parseKmlColor(d)) {
                    b.fillOpacity = d.opacity;
                    b.fillColor = d.color
                }
                if (this.parseProperty(e, "*", "fill") == "0") b.fillColor = "none";
                if (this.parseProperty(e, "*", "outline") == "0") b.strokeWidth = "0";
                break;
            case "iconstyle":
                var h = parseFloat(this.parseProperty(e, "*", "scale") || 1);
                d = 32 * h;
                var i = 32 * h,
                j = this.getElementsByTagNameNS(e, "*", "Icon")[0];
                if (j) {
                    var k = this.parseProperty(j, "*", "href");
                    if (k) {
                        var l = this.parseProperty(j, "*", "w"),
                        m = this.parseProperty(j, 
                        "*", "h");
                        if (OpenLayers.String.startsWith(k, "http://maps.google.com/mapfiles/kml") && !l && !m) {
                            m = l = 64;
                            h /= 2
                        }
                        l = l || m;
                        m = m || l;
                        if (l) d = parseInt(l) * h;
                        if (m) i = parseInt(m) * h;
                        if (m = k.match(this.regExes.kmlIconPalette)) {
                            l = m[1];
                            m = m[2];
                            k = this.parseProperty(j, "*", "x");
                            j = this.parseProperty(j, "*", "y");
                            k = "http://maps.google.com/mapfiles/kml/pal" + l + "/icon" + ((j ? 7 - j / 32: 7) * 8 + (k ? k / 32: 0)) + m
                        }
                        b.graphicOpacity = 1;
                        b.externalGraphic = k
                    }
                }
                if (e = this.getElementsByTagNameNS(e, "*", "hotSpot")[0]) {
                    k = parseFloat(e.getAttribute("x"));
                    j = parseFloat(e.getAttribute("y"));
                    l = e.getAttribute("xunits");
                    if (l == "pixels") b.graphicXOffset = -k * h;
                    else if (l == "insetPixels") b.graphicXOffset = -d + k * h;
                    else if (l == "fraction") b.graphicXOffset = -d * k;
                    e = e.getAttribute("yunits");
                    if (e == "pixels") b.graphicYOffset = -i + j * h + 1;
                    else if (e == "insetPixels") b.graphicYOffset = -(j * h) + 1;
                    else if (e == "fraction") b.graphicYOffset = -i * (1 - j) + 1
                }
                b.graphicWidth = d;
                b.graphicHeight = i;
                break;
            case "balloonstyle":
                if (e = OpenLayers.Util.getXmlNodeValue(e)) b.balloonStyle = e.replace(this.regExes.straightBracket, "${$1}");
                break;
            case "labelstyle":
                d = 
                this.parseProperty(e, "*", "color");
                if (d = this.parseKmlColor(d)) {
                    b.fontColor = d.color;
                    b.fontOpacity = d.opacity
                }
            }
        }
        if (!b.strokeColor && b.fillColor) b.strokeColor = b.fillColor;
        if ((a = a.getAttribute("id")) && b) b.id = a;
        return b
    },
    parseStyleMaps: function(a, b) {
        for (var c = 0, d = a.length; c < d; c++) {
            var e = a[c],
            f = this.getElementsByTagNameNS(e, "*", "Pair");
            e = e.getAttribute("id");
            for (var g = 0, h = f.length; g < h; g++) {
                var i = f[g],
                j = this.parseProperty(i, "*", "key");
                if ((i = this.parseProperty(i, "*", "styleUrl")) && j == "normal") this.styles[(b.styleBaseUrl || 
                "") + "#" + e] = this.styles[(b.styleBaseUrl || "") + i]
            }
        }
    },
    parseFeatures: function(a, b) {
        for (var c = [], d = 0, e = a.length; d < e; d++) {
            var f = a[d],
            g = this.parseFeature.apply(this, [f]);
            if (g) {
                if (this.extractStyles && g.attributes && g.attributes.styleUrl) g.style = this.getStyle(g.attributes.styleUrl, b);
                if (this.extractStyles) {
                    var h = this.getElementsByTagNameNS(f, "*", "Style")[0];
                    if (h) if (h = this.parseStyle(h)) g.style = OpenLayers.Util.extend(g.style, h)
                }
                if (this.extractTracks) {
                    if ((f = this.getElementsByTagNameNS(f, this.namespaces.gx, "Track")) && 
                    f.length > 0) {
                        g = {
                            features: [],
                            feature: g
                        };
                        this.readNode(f[0], g);
                        g.features.length > 0 && c.push.apply(c, g.features)
                    }
                } else c.push(g)
            } else throw "Bad Placemark: " + d;
        }
        this.features = this.features.concat(c)
    },
    readers: {
        kml: {
            when: function(a, b) {
                b.whens.push(OpenLayers.Date.parse(this.getChildValue(a)))
            },
            _trackPointAttribute: function(a, b) {
                var c = a.nodeName.split(":").pop();
                b.attributes[c].push(this.getChildValue(a))
            }
        },
        gx: {
            Track: function(a, b) {
                var c = {
                    whens: [],
                    points: [],
                    angles: []
                };
                if (this.trackAttributes) {
                    var d;
                    c.attributes = 
                    {};
                    for (var e = 0, f = this.trackAttributes.length; e < f; ++e) {
                        d = this.trackAttributes[e];
                        c.attributes[d] = [];
                        if (! (d in this.readers.kml)) this.readers.kml[d] = this.readers.kml._trackPointAttribute
                    }
                }
                this.readChildNodes(a, c);
                if (c.whens.length !== c.points.length) throw Error("gx:Track with unequal number of when (" + c.whens.length + ") and gx:coord (" + c.points.length + ") elements.");
                var g = c.angles.length > 0;
                if (g && c.whens.length !== c.angles.length) throw Error("gx:Track with unequal number of when (" + c.whens.length + ") and gx:angles (" + 
                c.angles.length + ") elements.");
                var h,
                i;
                e = 0;
                for (f = c.whens.length; e < f; ++e) {
                    h = b.feature.clone();
                    h.fid = b.feature.fid || b.feature.id;
                    i = c.points[e];
                    h.geometry = i;
                    if ("z" in i) h.attributes.altitude = i.z;
                    this.internalProjection && this.externalProjection && h.geometry.transform(this.externalProjection, this.internalProjection);
                    if (this.trackAttributes) {
                        i = 0;
                        for (var j = this.trackAttributes.length; i < j; ++i) h.attributes[d] = c.attributes[this.trackAttributes[i]][e]
                    }
                    h.attributes.when = c.whens[e];
                    h.attributes.trackId = b.feature.id;
                    if (g) {
                        i = c.angles[e];
                        h.attributes.heading = parseFloat(i[0]);
                        h.attributes.tilt = parseFloat(i[1]);
                        h.attributes.roll = parseFloat(i[2])
                    }
                    b.features.push(h)
                }
            },
            coord: function(a, b) {
                var c = this.getChildValue(a).replace(this.regExes.trimSpace, "").split(/\s+/),
                d = new OpenLayers.Geometry.Point(c[0], c[1]);
                if (c.length > 2) d.z = parseFloat(c[2]);
                b.points.push(d)
            },
            angles: function(a, b) {
                var c = this.getChildValue(a).replace(this.regExes.trimSpace, "").split(/\s+/);
                b.angles.push(c)
            }
        }
    },
    parseFeature: function(a) {
        for (var b = ["MultiGeometry", 
        "Polygon", "LineString", "Point"], c, d, e, f = 0, g = b.length; f < g; ++f) {
            c = b[f];
            this.internalns = a.namespaceURI ? a.namespaceURI: this.kmlns;
            d = this.getElementsByTagNameNS(a, this.internalns, c);
            if (d.length > 0) {
                if (b = this.parseGeometry[c.toLowerCase()]) {
                    e = b.apply(this, [d[0]]);
                    this.internalProjection && this.externalProjection && e.transform(this.externalProjection, this.internalProjection)
                } else OpenLayers.Console.error(OpenLayers.i18n("unsupportedGeometryType", {
                    geomType: c
                }));
                break
            }
        }
        var h;
        if (this.extractAttributes) h = this.parseAttributes(a);
        c = new OpenLayers.Feature.Vector(e, h);
        a = a.getAttribute("id") || a.getAttribute("name");
        if (a != null) c.fid = a;
        return c
    },
    getStyle: function(a, b) {
        var c = OpenLayers.Util.removeTail(a),
        d = OpenLayers.Util.extend({},
        b);
        d.depth++;
        d.styleBaseUrl = c;
        if (!this.styles[a] && !OpenLayers.String.startsWith(a, "#") && d.depth <= this.maxDepth && !this.fetched[c])(c = this.fetchLink(c)) && this.parseData(c, d);
        return OpenLayers.Util.extend({},
        this.styles[a])
    },
    parseGeometry: {
        point: function(a) {
            var b = this.getElementsByTagNameNS(a, this.internalns, 
            "coordinates");
            a = [];
            if (b.length > 0) {
                var c = b[0].firstChild.nodeValue;
                c = c.replace(this.regExes.removeSpace, "");
                a = c.split(",")
            }
            b = null;
            if (a.length > 1) {
                if (a.length == 2) a[2] = null;
                b = new OpenLayers.Geometry.Point(a[0], a[1], a[2])
            } else throw "Bad coordinate string: " + c;
            return b
        },
        linestring: function(a, b) {
            var c = this.getElementsByTagNameNS(a, this.internalns, "coordinates"),
            d = null;
            if (c.length > 0) {
                c = this.getChildValue(c[0]);
                c = c.replace(this.regExes.trimSpace, "");
                c = c.replace(this.regExes.trimComma, ",");
                d = c.split(this.regExes.splitSpace);
                for (var e = d.length, f = Array(e), g, h, i = 0; i < e; ++i) {
                    g = d[i].split(",");
                    h = g.length;
                    if (h > 1) {
                        if (g.length == 2) g[2] = null;
                        f[i] = new OpenLayers.Geometry.Point(g[0], g[1], g[2])
                    } else throw "Bad LineString point coordinates: " + d[i];
                }
                if (e) d = b ? new OpenLayers.Geometry.LinearRing(f) : new OpenLayers.Geometry.LineString(f);
                else throw "Bad LineString coordinates: " + c;
            }
            return d
        },
        polygon: function(a) {
            a = this.getElementsByTagNameNS(a, this.internalns, "LinearRing");
            var b = a.length,
            c = Array(b);
            if (b > 0) for (var d = 0, e = a.length; d < e; ++d) if (b = 
            this.parseGeometry.linestring.apply(this, [a[d], true])) c[d] = b;
            else throw "Bad LinearRing geometry: " + d;
            return new OpenLayers.Geometry.Polygon(c)
        },
        multigeometry: function(a) {
            for (var b, c = [], d = a.childNodes, e = 0, f = d.length; e < f; ++e) {
                a = d[e];
                if (a.nodeType == 1)(b = this.parseGeometry[(a.prefix ? a.nodeName.split(":")[1] : a.nodeName).toLowerCase()]) && c.push(b.apply(this, [a]))
            }
            return new OpenLayers.Geometry.Collection(c)
        }
    },
    parseAttributes: function(a) {
        var b = {},
        c = a.getElementsByTagName("ExtendedData");
        if (c.length) b = this.parseExtendedData(c[0]);
        var d,
        e,
        f;
        a = a.childNodes;
        c = 0;
        for (var g = a.length; c < g; ++c) {
            d = a[c];
            if (d.nodeType == 1) {
                e = d.childNodes;
                if (e.length >= 1 && e.length <= 3) {
                    switch (e.length) {
                    case 1:
                        f = e[0];
                        break;
                    case 2:
                        f = e[0];
                        e = e[1];
                        f = f.nodeType == 3 || f.nodeType == 4 ? f: e;
                        break;
                    default:
                        f = e[1]
                    }
                    if (f.nodeType == 3 || f.nodeType == 4) {
                        d = d.prefix ? d.nodeName.split(":")[1] : d.nodeName;
                        if (f = OpenLayers.Util.getXmlNodeValue(f)) {
                            f = f.replace(this.regExes.trimSpace, "");
                            b[d] = f
                        }
                    }
                }
            }
        }
        return b
    },
    parseExtendedData: function(a) {
        var b = {},
        c,
        d,
        e,
        f,
        g = a.getElementsByTagName("Data");
        c = 0;
        for (d = g.length; c < d; c++) {
            e = g[c];
            f = e.getAttribute("name");
            var h = {},
            i = e.getElementsByTagName("value");
            if (i.length) h.value = this.getChildValue(i[0]);
            e = e.getElementsByTagName("displayName");
            if (e.length) h.displayName = this.getChildValue(e[0]);
            b[f] = h
        }
        a = a.getElementsByTagName("SimpleData");
        c = 0;
        for (d = a.length; c < d; c++) {
            h = {};
            e = a[c];
            f = e.getAttribute("name");
            h.value = this.getChildValue(e);
            h.displayName = f;
            b[f] = h
        }
        return b
    },
    parseProperty: function(a, b, c) {
        var d;
        a = this.getElementsByTagNameNS(a, b, c);
        try {
            d = OpenLayers.Util.getXmlNodeValue(a[0])
        } catch(e) {
            d = 
            null
        }
        return d
    },
    write: function(a) {
        OpenLayers.Util.isArray(a) || (a = [a]);
        for (var b = this.createElementNS(this.kmlns, "kml"), c = this.createFolderXML(), d = 0, e = a.length; d < e; ++d) c.appendChild(this.createPlacemarkXML(a[d]));
        b.appendChild(c);
        return OpenLayers.Format.XML.prototype.write.apply(this, [b])
    },
    createFolderXML: function() {
        var a = this.createElementNS(this.kmlns, "Folder");
        if (this.foldersName) {
            var b = this.createElementNS(this.kmlns, "name"),
            c = this.createTextNode(this.foldersName);
            b.appendChild(c);
            a.appendChild(b)
        }
        if (this.foldersDesc) {
            b = 
            this.createElementNS(this.kmlns, "description");
            c = this.createTextNode(this.foldersDesc);
            b.appendChild(c);
            a.appendChild(b)
        }
        return a
    },
    createPlacemarkXML: function(a) {
        var b = this.createElementNS(this.kmlns, "name");
        b.appendChild(this.createTextNode(a.style && a.style.label ? a.style.label: a.attributes.name || a.id));
        var c = this.createElementNS(this.kmlns, "description");
        c.appendChild(this.createTextNode(a.attributes.description || this.placemarksDesc));
        var d = this.createElementNS(this.kmlns, "Placemark");
        a.fid != null && 
        d.setAttribute("id", a.fid);
        d.appendChild(b);
        d.appendChild(c);
        a = this.buildGeometryNode(a.geometry);
        d.appendChild(a);
        return d
    },
    buildGeometryNode: function(a) {
        if (this.internalProjection && this.externalProjection && !(a instanceof OpenLayers.Geometry.Collection)) {
            a = a.clone();
            a.transform(this.internalProjection, this.externalProjection)
        }
        var b = a.CLASS_NAME;
        b = this.buildGeometry[b.substring(b.lastIndexOf(".") + 1).toLowerCase()];
        var c = null;
        if (b) c = b.apply(this, [a]);
        return c
    },
    buildGeometry: {
        point: function(a) {
            var b = 
            this.createElementNS(this.kmlns, "Point");
            b.appendChild(this.buildCoordinatesNode(a));
            return b
        },
        multipoint: function(a) {
            return this.buildGeometry.collection.apply(this, [a])
        },
        linestring: function(a) {
            var b = this.createElementNS(this.kmlns, "LineString");
            b.appendChild(this.buildCoordinatesNode(a));
            return b
        },
        multilinestring: function(a) {
            return this.buildGeometry.collection.apply(this, [a])
        },
        linearring: function(a) {
            var b = this.createElementNS(this.kmlns, "LinearRing");
            b.appendChild(this.buildCoordinatesNode(a));
            return b
        },
        polygon: function(a) {
            var b = this.createElementNS(this.kmlns, "Polygon");
            a = a.components;
            for (var c, d, e = 0, f = a.length; e < f; ++e) {
                c = e == 0 ? "outerBoundaryIs": "innerBoundaryIs";
                c = this.createElementNS(this.kmlns, c);
                d = this.buildGeometry.linearring.apply(this, [a[e]]);
                c.appendChild(d);
                b.appendChild(c)
            }
            return b
        },
        multipolygon: function(a) {
            return this.buildGeometry.collection.apply(this, [a])
        },
        collection: function(a) {
            for (var b = this.createElementNS(this.kmlns, "MultiGeometry"), c, d = 0, e = a.components.length; d < e; ++d)(c = 
            this.buildGeometryNode.apply(this, [a.components[d]])) && b.appendChild(c);
            return b
        }
    },
    buildCoordinatesNode: function(a) {
        var b = this.createElementNS(this.kmlns, "coordinates"),
        c;
        if (c = a.components) {
            for (var d = c.length, e = Array(d), f = 0; f < d; ++f) {
                a = c[f];
                e[f] = a.x + "," + a.y
            }
            c = e.join(" ")
        } else c = a.x + "," + a.y;
        c = this.createTextNode(c);
        b.appendChild(c);
        return b
    },
    CLASS_NAME: "OpenLayers.Format.KML"
});
OpenLayers.Protocol.WFS.v1 = OpenLayers.Class(OpenLayers.Protocol, {
    version: null,
    srsName: "EPSG:4326",
    featureType: null,
    featureNS: null,
    geometryName: "the_geom",
    schema: null,
    featurePrefix: "feature",
    formatOptions: null,
    readFormat: null,
    readOptions: null,
    initialize: function(a) {
        OpenLayers.Protocol.prototype.initialize.apply(this, [a]);
        if (!a.geometryName && !a.featureNS) this.geometryName = null;
        if (!a.format) this.format = OpenLayers.Format.WFST(OpenLayers.Util.extend({
            version: this.version,
            featureType: this.featureType,
            featureNS: this.featureNS,
            featurePrefix: this.featurePrefix,
            geometryName: this.geometryName,
            srsName: this.srsName,
            schema: this.schema
        },
        this.formatOptions))
    },
    destroy: function() {
        this.options && !this.options.format && this.format.destroy();
        this.format = null;
        OpenLayers.Protocol.prototype.destroy.apply(this)
    },
    read: function(a) {
        OpenLayers.Protocol.prototype.read.apply(this, arguments);
        a = OpenLayers.Util.extend({},
        a);
        OpenLayers.Util.applyDefaults(a, this.options || {});
        var b = new OpenLayers.Protocol.Response({
            requestType: "read"
        }),
        c = OpenLayers.Format.XML.prototype.write.apply(this.format, 
        [this.format.writeNode("wfs:GetFeature", a)]);
        b.priv = OpenLayers.Request.POST({
            url: a.url,
            callback: this.createCallback(this.handleRead, b, a),
            params: a.params,
            headers: a.headers,
            data: c
        });
        return b
    },
    setFeatureType: function(a) {
        this.featureType = a;
        this.format.featureType = a
    },
    setGeometryName: function(a) {
        this.geometryName = a;
        this.format.geometryName = a
    },
    handleRead: function(a, b) {
        b = OpenLayers.Util.extend({},
        b);
        OpenLayers.Util.applyDefaults(b, this.options);
        if (b.callback) {
            var c = a.priv;
            if (c.status >= 200 && c.status < 300) if ((c = 
            this.parseResponse(c, b.readOptions)) && c.success !== false) {
                if (b.readOptions && b.readOptions.output == "object") OpenLayers.Util.extend(a, c);
                else a.features = c;
                a.code = OpenLayers.Protocol.Response.SUCCESS
            } else {
                a.code = OpenLayers.Protocol.Response.FAILURE;
                a.error = c
            } else a.code = OpenLayers.Protocol.Response.FAILURE;
            b.callback.call(b.scope, a)
        }
    },
    parseResponse: function(a, b) {
        var c = a.responseXML;
        if (!c || !c.documentElement) c = a.responseText;
        if (!c || c.length <= 0) return null;
        c = this.readFormat !== null ? this.readFormat.read(c) : 
        this.format.read(c, b);
        if (!this.featureNS) {
            var d = this.readFormat || this.format;
            this.featureNS = d.featureNS;
            d.autoConfig = false;
            this.geometryName || this.setGeometryName(d.geometryName)
        }
        return c
    },
    commit: function(a, b) {
        b = OpenLayers.Util.extend({},
        b);
        OpenLayers.Util.applyDefaults(b, this.options);
        var c = new OpenLayers.Protocol.Response({
            requestType: "commit",
            reqFeatures: a
        });
        c.priv = OpenLayers.Request.POST({
            url: b.url,
            headers: b.headers,
            data: this.format.write(a, b),
            callback: this.createCallback(this.handleCommit, c, 
            b)
        });
        return c
    },
    handleCommit: function(a, b) {
        if (b.callback) {
            var c = a.priv,
            d = c.responseXML;
            if (!d || !d.documentElement) d = c.responseText;
            c = this.format.read(d) || {};
            a.insertIds = c.insertIds || [];
            if (c.success) a.code = OpenLayers.Protocol.Response.SUCCESS;
            else {
                a.code = OpenLayers.Protocol.Response.FAILURE;
                a.error = c
            }
            b.callback.call(b.scope, a)
        }
    },
    filterDelete: function(a, b) {
        b = OpenLayers.Util.extend({},
        b);
        OpenLayers.Util.applyDefaults(b, this.options);
        new OpenLayers.Protocol.Response({
            requestType: "commit"
        });
        var c = this.format.createElementNSPlus("wfs:Transaction", 
        {
            attributes: {
                service: "WFS",
                version: this.version
            }
        }),
        d = this.format.createElementNSPlus("wfs:Delete", {
            attributes: {
                typeName: (b.featureNS ? this.featurePrefix + ":": "") + b.featureType
            }
        });
        b.featureNS && d.setAttribute("xmlns:" + this.featurePrefix, b.featureNS);
        var e = this.format.writeNode("ogc:Filter", a);
        d.appendChild(e);
        c.appendChild(d);
        c = OpenLayers.Format.XML.prototype.write.apply(this.format, [c]);
        return OpenLayers.Request.POST({
            url: this.url,
            callback: b.callback || 
            function() {},
            data: c
        })
    },
    abort: function(a) {
        a && a.priv.abort()
    },
    CLASS_NAME: "OpenLayers.Protocol.WFS.v1"
});
OpenLayers.Filter.Spatial = OpenLayers.Class(OpenLayers.Filter, {
    type: null,
    property: null,
    value: null,
    distance: null,
    distanceUnits: null,
    initialize: function(a) {
        OpenLayers.Filter.prototype.initialize.apply(this, [a])
    },
    evaluate: function(a) {
        var b = false;
        switch (this.type) {
        case OpenLayers.Filter.Spatial.BBOX:
        case OpenLayers.Filter.Spatial.INTERSECTS:
            if (a.geometry) {
                var c = this.value;
                if (this.value.CLASS_NAME == "OpenLayers.Bounds") c = this.value.toGeometry();
                if (a.geometry.intersects(c)) b = true
            }
            break;
        default:
            OpenLayers.Console.error(OpenLayers.i18n("filterEvaluateNotImplemented"))
        }
        return b
    },
    clone: function() {
        var a = OpenLayers.Util.applyDefaults({
            value: this.value && this.value.clone && this.value.clone()
        },
        this);
        return new OpenLayers.Filter.Spatial(a)
    },
    CLASS_NAME: "OpenLayers.Filter.Spatial"
});
OpenLayers.Filter.Spatial.BBOX = "BBOX";
OpenLayers.Filter.Spatial.INTERSECTS = "INTERSECTS";
OpenLayers.Filter.Spatial.DWITHIN = "DWITHIN";
OpenLayers.Filter.Spatial.WITHIN = "WITHIN";
OpenLayers.Filter.Spatial.CONTAINS = "CONTAINS";
OpenLayers.Control.Attribution = OpenLayers.Class(OpenLayers.Control, {
    separator: ", ",
    destroy: function() {
        this.map.events.un({
            removelayer: this.updateAttribution,
            addlayer: this.updateAttribution,
            changelayer: this.updateAttribution,
            changebaselayer: this.updateAttribution,
            scope: this
        });
        OpenLayers.Control.prototype.destroy.apply(this, arguments)
    },
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.map.events.on({
            changebaselayer: this.updateAttribution,
            changelayer: this.updateAttribution,
            addlayer: this.updateAttribution,
            removelayer: this.updateAttribution,
            scope: this
        });
        this.updateAttribution();
        return this.div
    },
    updateAttribution: function() {
        var a = [];
        if (this.map && this.map.layers) {
            for (var b = 0, c = this.map.layers.length; b < c; b++) {
                var d = this.map.layers[b];
                d.attribution && d.getVisibility() && OpenLayers.Util.indexOf(a, d.attribution) === -1 && a.push(d.attribution)
            }
            this.div.innerHTML = a.join(this.separator)
        }
    },
    CLASS_NAME: "OpenLayers.Control.Attribution"
});
OpenLayers.Kinetic = OpenLayers.Class({
    threshold: 0,
    interval: 10,
    deceleration: 0.0035,
    nbPoints: 100,
    delay: 200,
    points: undefined,
    timerId: undefined,
    initialize: function(a) {
        OpenLayers.Util.extend(this, a)
    },
    begin: function() {
        clearInterval(this.timerId);
        this.timerId = undefined;
        this.points = []
    },
    update: function(a) {
        this.points.unshift({
            xy: a,
            tick: (new Date).getTime()
        });
        this.points.length > this.nbPoints && this.points.pop()
    },
    end: function(a) {
        for (var b, c = (new Date).getTime(), d = 0, e = this.points.length, f; d < e; d++) {
            f = this.points[d];
            if (c - f.tick > this.delay) break;
            b = f
        }
        if (b) {
            d = (new Date).getTime() - b.tick;
            c = Math.sqrt(Math.pow(a.x - b.xy.x, 2) + Math.pow(a.y - b.xy.y, 2));
            d = c / d;
            if (! (d == 0 || d < this.threshold)) {
                c = Math.asin((a.y - b.xy.y) / c);
                if (b.xy.x <= a.x) c = Math.PI - c;
                return {
                    speed: d,
                    theta: c
                }
            }
        }
    },
    move: function(a, b) {
        var c = a.speed,
        d = Math.cos(a.theta),
        e = -Math.sin(a.theta),
        f = 0,
        g = (new Date).getTime(),
        h = 0,
        i = 0;
        this.timerId = window.setInterval(OpenLayers.Function.bind(function() {
            if (this.timerId != null) {
                f += this.interval;
                var j = (new Date).getTime() - g;
                j = (f + j) / 2;
                var k = -this.deceleration * Math.pow(j, 2) / 2 + c * j,
                l = k * d;
                k *= e;
                var m = {};
                m.end = false;
                if ( - this.deceleration * j + c <= 0) {
                    clearInterval(this.timerId);
                    this.timerId = null;
                    m.end = true
                }
                m.x = l - h;
                m.y = k - i;
                h = l;
                i = k;
                b(m.x, m.y, m.end)
            }
        },
        this), this.interval)
    },
    CLASS_NAME: "OpenLayers.Kinetic"
});
OpenLayers.Layer.WMS = OpenLayers.Class(OpenLayers.Layer.Grid, {
    DEFAULT_PARAMS: {
        service: "WMS",
        version: "1.1.1",
        request: "GetMap",
        styles: "",
        format: "image/jpeg"
    },
    reproject: false,
    isBaseLayer: true,
    encodeBBOX: false,
    noMagic: false,
    yx: {
        "EPSG:4326": true
    },
    initialize: function(a, b, c, d) {
        var e = [];
        c = OpenLayers.Util.upperCaseObject(c);
        if (parseFloat(c.VERSION) >= 1.3 && !c.EXCEPTIONS) c.EXCEPTIONS = "INIMAGE";
        e.push(a, b, c, d);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, e);
        OpenLayers.Util.applyDefaults(this.params, OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
        if (!this.noMagic && this.params.TRANSPARENT && this.params.TRANSPARENT.toString().toLowerCase() == "true") {
            if (d == null || !d.isBaseLayer) this.isBaseLayer = false;
            if (this.params.FORMAT == "image/jpeg") this.params.FORMAT = OpenLayers.Util.alphaHack() ? "image/gif": "image/png"
        }
    },
    destroy: function() {
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments)
    },
    clone: function(a) {
        if (a == null) a = new OpenLayers.Layer.WMS(this.name, this.url, this.params, this.getOptions());
        return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, 
        [a])
    },
    reverseAxisOrder: function() {
        return parseFloat(this.params.VERSION) >= 1.3 && !!this.yx[this.map.getProjectionObject().getCode()]
    },
    getURL: function(a) {
        a = this.adjustBounds(a);
        var b = this.getImageSize(),
        c = {},
        d = this.reverseAxisOrder();
        c.BBOX = this.encodeBBOX ? a.toBBOX(null, d) : a.toArray(d);
        c.WIDTH = b.w;
        c.HEIGHT = b.h;
        return this.getFullRequestString(c)
    },
    mergeNewParams: function(a) {
        a = [OpenLayers.Util.upperCaseObject(a)];
        return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, a)
    },
    getFullRequestString: function(a) {
        var b = 
        this.map.getProjectionObject();
        b = this.projection && this.projection.equals(b) ? this.projection.getCode() : b.getCode();
        b = b == "none" ? null: b;
        if (parseFloat(this.params.VERSION) >= 1.3) this.params.CRS = b;
        else this.params.SRS = b;
        if (typeof this.params.TRANSPARENT == "boolean") a.TRANSPARENT = this.params.TRANSPARENT ? "TRUE": "FALSE";
        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, arguments)
    },
    CLASS_NAME: "OpenLayers.Layer.WMS"
});
OpenLayers.Renderer.SVG = OpenLayers.Class(OpenLayers.Renderer.Elements, {
    xmlns: "http://www.w3.org/2000/svg",
    xlinkns: "http://www.w3.org/1999/xlink",
    MAX_PIXEL: 15E3,
    translationParameters: null,
    symbolMetrics: null,
    initialize: function() {
        if (this.supported()) {
            OpenLayers.Renderer.Elements.prototype.initialize.apply(this, arguments);
            this.translationParameters = {
                x: 0,
                y: 0
            };
            this.symbolMetrics = {}
        }
    },
    supported: function() {
        return document.implementation && (document.implementation.hasFeature("org.w3c.svg", "1.0") || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#SVG", 
        "1.1") || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"))
    },
    inValidRange: function(a, b, c) {
        a += c ? 0: this.translationParameters.x;
        b += c ? 0: this.translationParameters.y;
        return a >= -this.MAX_PIXEL && a <= this.MAX_PIXEL && b >= -this.MAX_PIXEL && b <= this.MAX_PIXEL
    },
    setExtent: function(a, b) {
        OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, arguments);
        var c = this.getResolution(),
        d = -a.left / c;
        c = a.top / c;
        if (b) {
            this.left = d;
            this.top = c;
            this.rendererRoot.setAttributeNS(null, 
            "viewBox", "0 0 " + this.size.w + " " + this.size.h);
            this.translate(0, 0);
            return true
        } else { (d = this.translate(d - this.left, c - this.top)) || this.setExtent(a, true);
            return d
        }
    },
    translate: function(a, b) {
        if (this.inValidRange(a, b, true)) {
            var c = "";
            if (a || b) c = "translate(" + a + "," + b + ")";
            this.root.setAttributeNS(null, "transform", c);
            this.translationParameters = {
                x: a,
                y: b
            };
            return true
        } else return false
    },
    setSize: function() {
        OpenLayers.Renderer.prototype.setSize.apply(this, arguments);
        this.rendererRoot.setAttributeNS(null, "width", this.size.w);
        this.rendererRoot.setAttributeNS(null, "height", this.size.h)
    },
    getNodeType: function(a, b) {
        var c = null;
        switch (a.CLASS_NAME) {
        case "OpenLayers.Geometry.Point":
            c = b.externalGraphic ? "image": this.isComplexSymbol(b.graphicName) ? "svg": "circle";
            break;
        case "OpenLayers.Geometry.Rectangle":
            c = "rect";
            break;
        case "OpenLayers.Geometry.LineString":
            c = "polyline";
            break;
        case "OpenLayers.Geometry.LinearRing":
            c = "polygon";
            break;
        case "OpenLayers.Geometry.Polygon":
        case "OpenLayers.Geometry.Curve":
        case "OpenLayers.Geometry.Surface":
            c = 
            "path"
        }
        return c
    },
    setStyle: function(a, b, c) {
        b = b || a._style;
        c = c || a._options;
        var d = parseFloat(a.getAttributeNS(null, "r")),
        e = 1,
        f;
        if (a._geometryClass == "OpenLayers.Geometry.Point" && d) {
            a.style.visibility = "";
            if (b.graphic === false) a.style.visibility = "hidden";
            else if (b.externalGraphic) {
                f = this.getPosition(a);
                if (b.graphicTitle) {
                    a.setAttributeNS(null, "title", b.graphicTitle);
                    d = this.nodeFactory(null, "title");
                    d.textContent = b.graphicTitle;
                    a.appendChild(d)
                }
                b.graphicWidth && b.graphicHeight && a.setAttributeNS(null, "preserveAspectRatio", 
                "none");
                d = b.graphicWidth || b.graphicHeight;
                var g = b.graphicHeight || b.graphicWidth;
                d = d ? d: b.pointRadius * 2;
                g = g ? g: b.pointRadius * 2;
                var h = b.graphicYOffset != undefined ? b.graphicYOffset: -(0.5 * g),
                i = b.graphicOpacity || b.fillOpacity;
                a.setAttributeNS(null, "x", (f.x + (b.graphicXOffset != undefined ? b.graphicXOffset: -(0.5 * d))).toFixed());
                a.setAttributeNS(null, "y", (f.y + h).toFixed());
                a.setAttributeNS(null, "width", d);
                a.setAttributeNS(null, "height", g);
                a.setAttributeNS(this.xlinkns, "href", b.externalGraphic);
                a.setAttributeNS(null, 
                "style", "opacity: " + i);
                a.onclick = OpenLayers.Renderer.SVG.preventDefault
            } else if (this.isComplexSymbol(b.graphicName)) {
                d = b.pointRadius * 3;
                g = d * 2;
                var j = this.importSymbol(b.graphicName);
                f = this.getPosition(a);
                e = this.symbolMetrics[j.id][0] * 3 / g;
                h = a.parentNode;
                i = a.nextSibling;
                h && h.removeChild(a);
                a.firstChild && a.removeChild(a.firstChild);
                a.appendChild(j.firstChild.cloneNode(true));
                a.setAttributeNS(null, "viewBox", j.getAttributeNS(null, "viewBox"));
                a.setAttributeNS(null, "width", g);
                a.setAttributeNS(null, "height", 
                g);
                a.setAttributeNS(null, "x", f.x - d);
                a.setAttributeNS(null, "y", f.y - d);
                if (i) h.insertBefore(a, i);
                else h && h.appendChild(a)
            } else a.setAttributeNS(null, "r", b.pointRadius);
            d = b.rotation;
            if ((d !== undefined || a._rotation !== undefined) && f) {
                a._rotation = d;
                d |= 0;
                if (a.nodeName !== "svg") a.setAttributeNS(null, "transform", "rotate(" + d + " " + f.x + " " + f.y + ")");
                else {
                    f = this.symbolMetrics[j.id];
                    a.firstChild.setAttributeNS(null, "transform", "rotate(" + d + " " + f[1] + " " + f[2] + ")")
                }
            }
        }
        if (c.isFilled) {
            a.setAttributeNS(null, "fill", b.fillColor);
            a.setAttributeNS(null, "fill-opacity", b.fillOpacity)
        } else a.setAttributeNS(null, "fill", "none");
        if (c.isStroked) {
            a.setAttributeNS(null, "stroke", b.strokeColor);
            a.setAttributeNS(null, "stroke-opacity", b.strokeOpacity);
            a.setAttributeNS(null, "stroke-width", b.strokeWidth * e);
            a.setAttributeNS(null, "stroke-linecap", b.strokeLinecap || "round");
            a.setAttributeNS(null, "stroke-linejoin", "round");
            b.strokeDashstyle && a.setAttributeNS(null, "stroke-dasharray", this.dashStyle(b, e))
        } else a.setAttributeNS(null, "stroke", "none");
        b.pointerEvents && a.setAttributeNS(null, "pointer-events", b.pointerEvents);
        b.cursor != null && a.setAttributeNS(null, "cursor", b.cursor);
        return a
    },
    dashStyle: function(a, b) {
        var c = a.strokeWidth * b,
        d = a.strokeDashstyle;
        switch (d) {
        case "solid":
            return "none";
        case "dot":
            return [1, 4 * c].join();
        case "dash":
            return [4 * c, 4 * c].join();
        case "dashdot":
            return [4 * c, 4 * c, 1, 4 * c].join();
        case "longdash":
            return [8 * c, 4 * c].join();
        case "longdashdot":
            return [8 * c, 4 * c, 1, 4 * c].join();
        default:
            return OpenLayers.String.trim(d).replace(/\s+/g, ",")
        }
    },
    createNode: function(a, b) {
        var c = document.createElementNS(this.xmlns, a);
        b && c.setAttributeNS(null, "id", b);
        return c
    },
    nodeTypeCompare: function(a, b) {
        return b == a.nodeName
    },
    createRenderRoot: function() {
        return this.nodeFactory(this.container.id + "_svgRoot", "svg")
    },
    createRoot: function(a) {
        return this.nodeFactory(this.container.id + a, "g")
    },
    createDefs: function() {
        var a = this.nodeFactory(this.container.id + "_defs", "defs");
        this.rendererRoot.appendChild(a);
        return a
    },
    drawPoint: function(a, b) {
        return this.drawCircle(a, b, 1)
    },
    drawCircle: function(a, b, c) {
        var d = this.getResolution(),
        e = b.x / d + this.left;
        b = this.top - b.y / d;
        if (this.inValidRange(e, b)) {
            a.setAttributeNS(null, "cx", e);
            a.setAttributeNS(null, "cy", b);
            a.setAttributeNS(null, "r", c);
            return a
        } else return false
    },
    drawLineString: function(a, b) {
        var c = this.getComponentsString(b.components);
        if (c.path) {
            a.setAttributeNS(null, "points", c.path);
            return c.complete ? a: null
        } else return false
    },
    drawLinearRing: function(a, b) {
        var c = this.getComponentsString(b.components);
        if (c.path) {
            a.setAttributeNS(null, 
            "points", c.path);
            return c.complete ? a: null
        } else return false
    },
    drawPolygon: function(a, b) {
        for (var c = "", d = true, e = true, f, g, h = 0, i = b.components.length; h < i; h++) {
            c += " M";
            f = this.getComponentsString(b.components[h].components, " ");
            if (g = f.path) {
                c += " " + g;
                e = f.complete && e
            } else d = false
        }
        c += " z";
        if (d) {
            a.setAttributeNS(null, "d", c);
            a.setAttributeNS(null, "fill-rule", "evenodd");
            return e ? a: null
        } else return false
    },
    drawRectangle: function(a, b) {
        var c = this.getResolution(),
        d = b.x / c + this.left,
        e = this.top - b.y / c;
        if (this.inValidRange(d, 
        e)) {
            a.setAttributeNS(null, "x", d);
            a.setAttributeNS(null, "y", e);
            a.setAttributeNS(null, "width", b.width / c);
            a.setAttributeNS(null, "height", b.height / c);
            return a
        } else return false
    },
    drawSurface: function(a, b) {
        for (var c = null, d = true, e = 0, f = b.components.length; e < f; e++) if (e % 3 == 0 && e / 3 == 0) {
            var g = this.getShortString(b.components[e]);
            g || (d = false);
            c = "M " + g
        } else if (e % 3 == 1) { (g = this.getShortString(b.components[e])) || (d = false);
            c += " C " + g
        } else { (g = this.getShortString(b.components[e])) || (d = false);
            c += " " + g
        }
        c += " Z";
        if (d) {
            a.setAttributeNS(null, 
            "d", c);
            return a
        } else return false
    },
    drawText: function(a, b, c) {
        var d = this.getResolution(),
        e = c.x / d + this.left,
        f = c.y / d - this.top;
        d = this.nodeFactory(a + this.LABEL_ID_SUFFIX, "text");
        d.setAttributeNS(null, "x", e);
        d.setAttributeNS(null, "y", -f);
        b.fontColor && d.setAttributeNS(null, "fill", b.fontColor);
        b.fontOpacity && d.setAttributeNS(null, "opacity", b.fontOpacity);
        b.fontFamily && d.setAttributeNS(null, "font-family", b.fontFamily);
        b.fontSize && d.setAttributeNS(null, "font-size", b.fontSize);
        b.fontWeight && d.setAttributeNS(null, 
        "font-weight", b.fontWeight);
        b.fontStyle && d.setAttributeNS(null, "font-style", b.fontStyle);
        if (b.labelSelect === true) {
            d.setAttributeNS(null, "pointer-events", "visible");
            d._featureId = a
        } else d.setAttributeNS(null, "pointer-events", "none");
        f = b.labelAlign || "cm";
        d.setAttributeNS(null, "text-anchor", OpenLayers.Renderer.SVG.LABEL_ALIGN[f[0]] || "middle");
        if (OpenLayers.IS_GECKO === true) d.setAttributeNS(null, "dominant-baseline", OpenLayers.Renderer.SVG.LABEL_ALIGN[f[1]] || "central");
        for (var g = b.label.split("\n"), h = g.length; d.childNodes.length > 
        h;) d.removeChild(d.lastChild);
        for (var i = 0; i < h; i++) {
            var j = this.nodeFactory(a + this.LABEL_ID_SUFFIX + "_tspan_" + i, "tspan");
            if (b.labelSelect === true) {
                j._featureId = a;
                j._geometry = c;
                j._geometryClass = c.CLASS_NAME
            }
            if (OpenLayers.IS_GECKO === false) j.setAttributeNS(null, "baseline-shift", OpenLayers.Renderer.SVG.LABEL_VSHIFT[f[1]] || "-35%");
            j.setAttribute("x", e);
            if (i == 0) {
                var k = OpenLayers.Renderer.SVG.LABEL_VFACTOR[f[1]];
                if (k == null) k = -0.5;
                j.setAttribute("dy", k * (h - 1) + "em")
            } else j.setAttribute("dy", "1em");
            j.textContent = 
            g[i] === "" ? " ": g[i];
            j.parentNode || d.appendChild(j)
        }
        d.parentNode || this.textRoot.appendChild(d)
    },
    getComponentsString: function(a, b) {
        for (var c = [], d = true, e = a.length, f = [], g, h = 0; h < e; h++) {
            g = a[h];
            c.push(g);
            if (g = this.getShortString(g)) f.push(g);
            else {
                h > 0 && this.getShortString(a[h - 1]) && f.push(this.clipLine(a[h], a[h - 1]));
                h < e - 1 && this.getShortString(a[h + 1]) && f.push(this.clipLine(a[h], a[h + 1]));
                d = false
            }
        }
        return {
            path: f.join(b || ","),
            complete: d
        }
    },
    clipLine: function(a, b) {
        if (b.equals(a)) return "";
        var c = this.getResolution(),
        d = this.MAX_PIXEL - this.translationParameters.x,
        e = this.MAX_PIXEL - this.translationParameters.y,
        f = b.x / c + this.left,
        g = this.top - b.y / c,
        h = a.x / c + this.left;
        c = this.top - a.y / c;
        var i;
        if (h < -d || h > d) {
            i = (c - g) / (h - f);
            h = h < 0 ? -d: d;
            c = g + (h - f) * i
        }
        if (c < -e || c > e) {
            i = (h - f) / (c - g);
            c = c < 0 ? -e: e;
            h = f + (c - g) * i
        }
        return h + "," + c
    },
    getShortString: function(a) {
        var b = this.getResolution(),
        c = a.x / b + this.left;
        a = this.top - a.y / b;
        return this.inValidRange(c, a) ? c + "," + a: false
    },
    getPosition: function(a) {
        return {
            x: parseFloat(a.getAttributeNS(null, "cx")),
            y: parseFloat(a.getAttributeNS(null, 
            "cy"))
        }
    },
    importSymbol: function(a) {
        if (!this.defs) this.defs = this.createDefs();
        var b = this.container.id + "-" + a,
        c = document.getElementById(b);
        if (c != null) return c;
        var d = OpenLayers.Renderer.symbol[a];
        if (!d) throw Error(a + " is not a valid symbol name");
        a = this.nodeFactory(b, "symbol");
        var e = this.nodeFactory(null, "polygon");
        a.appendChild(e);
        c = new OpenLayers.Bounds(Number.MAX_VALUE, Number.MAX_VALUE, 0, 0);
        for (var f = [], g, h, i = 0; i < d.length; i += 2) {
            g = d[i];
            h = d[i + 1];
            c.left = Math.min(c.left, g);
            c.bottom = Math.min(c.bottom, h);
            c.right = Math.max(c.right, g);
            c.top = Math.max(c.top, h);
            f.push(g, ",", h)
        }
        e.setAttributeNS(null, "points", f.join(" "));
        d = c.getWidth();
        e = c.getHeight();
        a.setAttributeNS(null, "viewBox", [c.left - d, c.bottom - e, d * 3, e * 3].join(" "));
        this.symbolMetrics[b] = [Math.max(d, e), c.getCenterLonLat().lon, c.getCenterLonLat().lat];
        this.defs.appendChild(a);
        return a
    },
    getFeatureIdFromEvent: function(a) {
        var b = OpenLayers.Renderer.Elements.prototype.getFeatureIdFromEvent.apply(this, arguments);
        if (!b) {
            b = a.target;
            b = b.parentNode && b != this.rendererRoot && 
            b.parentNode._featureId
        }
        return b
    },
    CLASS_NAME: "OpenLayers.Renderer.SVG"
});
OpenLayers.Renderer.SVG.LABEL_ALIGN = {
    l: "start",
    r: "end",
    b: "bottom",
    t: "hanging"
};
OpenLayers.Renderer.SVG.LABEL_VSHIFT = {
    t: "-70%",
    b: "0"
};
OpenLayers.Renderer.SVG.LABEL_VFACTOR = {
    t: 0,
    b: -1
};
OpenLayers.Renderer.SVG.preventDefault = function(a) {
    a.preventDefault && a.preventDefault()
};
OpenLayers.Format.JSON = OpenLayers.Class(OpenLayers.Format, {
    indent: "    ",
    space: " ",
    newline: "\n",
    level: 0,
    pretty: false,
    nativeJSON: function() {
        return !! (window.JSON && typeof JSON.parse == "function" && typeof JSON.stringify == "function")
    } (),
    read: function(a, b) {
        var c;
        if (this.nativeJSON) c = JSON.parse(a, b);
        else try {
            if (/^[\],:{}\s]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                c = eval("(" + a + ")");
                if (typeof b === 
                "function") {
                    var d = function(f, g) {
                        if (g && typeof g === "object") for (var h in g) if (g.hasOwnProperty(h)) g[h] = d(h, g[h]);
                        return b(f, g)
                    };
                    c = d("", c)
                }
            }
        } catch(e) {}
        if (this.keepData) this.data = c;
        return c
    },
    write: function(a, b) {
        this.pretty = !!b;
        var c = null,
        d = typeof a;
        if (this.serialize[d]) try {
            c = !this.pretty && this.nativeJSON ? JSON.stringify(a) : this.serialize[d].apply(this, [a])
        } catch(e) {
            OpenLayers.Console.error("Trouble serializing: " + e)
        }
        return c
    },
    writeIndent: function() {
        var a = [];
        if (this.pretty) for (var b = 0; b < this.level; ++b) a.push(this.indent);
        return a.join("")
    },
    writeNewline: function() {
        return this.pretty ? this.newline: ""
    },
    writeSpace: function() {
        return this.pretty ? this.space: ""
    },
    serialize: {
        object: function(a) {
            if (a == null) return "null";
            if (a.constructor == Date) return this.serialize.date.apply(this, [a]);
            if (a.constructor == Array) return this.serialize.array.apply(this, [a]);
            var b = ["{"];
            this.level += 1;
            var c,
            d,
            e,
            f = false;
            for (c in a) if (a.hasOwnProperty(c)) {
                d = OpenLayers.Format.JSON.prototype.write.apply(this, [c, this.pretty]);
                e = OpenLayers.Format.JSON.prototype.write.apply(this, 
                [a[c], this.pretty]);
                if (d != null && e != null) {
                    f && b.push(",");
                    b.push(this.writeNewline(), this.writeIndent(), d, ":", this.writeSpace(), e);
                    f = true
                }
            }
            this.level -= 1;
            b.push(this.writeNewline(), this.writeIndent(), "}");
            return b.join("")
        },
        array: function(a) {
            var b,
            c = ["["];
            this.level += 1;
            for (var d = 0, e = a.length; d < e; ++d) {
                b = OpenLayers.Format.JSON.prototype.write.apply(this, [a[d], this.pretty]);
                if (b != null) {
                    d > 0 && c.push(",");
                    c.push(this.writeNewline(), this.writeIndent(), b)
                }
            }
            this.level -= 1;
            c.push(this.writeNewline(), this.writeIndent(), 
            "]");
            return c.join("")
        },
        string: function(a) {
            var b = {
                "\u0008": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\u000c": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            };
            if (/["\\\x00-\x1f]/.test(a)) return '"' + a.replace(/([\x00-\x1f\\"])/g, 
            function(c, d) {
                var e = b[d];
                if (e) return e;
                e = d.charCodeAt();
                return "\\u00" + Math.floor(e / 16).toString(16) + (e % 16).toString(16)
            }) + '"';
            return '"' + a + '"'
        },
        number: function(a) {
            return isFinite(a) ? String(a) : "null"
        },
        "boolean": function(a) {
            return String(a)
        },
        date: function(a) {
            function b(c) {
                return c < 10 ? "0" + c: c
            }
            return '"' + 
            a.getFullYear() + "-" + b(a.getMonth() + 1) + "-" + b(a.getDate()) + "T" + b(a.getHours()) + ":" + b(a.getMinutes()) + ":" + b(a.getSeconds()) + '"'
        }
    },
    CLASS_NAME: "OpenLayers.Format.JSON"
});
OpenLayers.Format.GeoJSON = OpenLayers.Class(OpenLayers.Format.JSON, {
    ignoreExtraDims: false,
    read: function(a, b, c) {
        b = b ? b: "FeatureCollection";
        var d = null,
        e = null;
        if (e = typeof a == "string" ? OpenLayers.Format.JSON.prototype.read.apply(this, [a, c]) : a) if (typeof e.type != "string") OpenLayers.Console.error("Bad GeoJSON - no type: " + a);
        else {
            if (this.isValidType(e, b)) switch (b) {
            case "Geometry":
                try {
                    d = this.parseGeometry(e)
                } catch(f) {
                    OpenLayers.Console.error(f)
                }
                break;
            case "Feature":
                try {
                    d = this.parseFeature(e);
                    d.type = "Feature"
                } catch(g) {
                    OpenLayers.Console.error(g)
                }
                break;
                case "FeatureCollection":
                d = [];
                switch (e.type) {
                case "Feature":
                    try {
                        d.push(this.parseFeature(e))
                    } catch(h) {
                        d = null;
                        OpenLayers.Console.error(h)
                    }
                    break;
                case "FeatureCollection":
                    a = 0;
                    for (b = e.features.length; a < b; ++a) try {
                        d.push(this.parseFeature(e.features[a]))
                    } catch(i) {
                        d = null;
                        OpenLayers.Console.error(i)
                    }
                    break;
                default:
                    try {
                        var j = this.parseGeometry(e);
                        d.push(new OpenLayers.Feature.Vector(j))
                    } catch(k) {
                        d = null;
                        OpenLayers.Console.error(k)
                    }
                }
            }
        } else OpenLayers.Console.error("Bad JSON: " + a);
        return d
    },
    isValidType: function(a, 
    b) {
        var c = false;
        switch (b) {
        case "Geometry":
            if (OpenLayers.Util.indexOf(["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "Box", "GeometryCollection"], a.type) == -1) OpenLayers.Console.error("Unsupported geometry type: " + a.type);
            else c = true;
            break;
        case "FeatureCollection":
            c = true;
            break;
        default:
            if (a.type == b) c = true;
            else OpenLayers.Console.error("Cannot convert types from " + a.type + " to " + b)
        }
        return c
    },
    parseFeature: function(a) {
        var b,
        c,
        d;
        c = a.properties ? a.properties: {};
        d = a.geometry && a.geometry.bbox || 
        a.bbox;
        try {
            b = this.parseGeometry(a.geometry)
        } catch(e) {
            throw e;
        }
        b = new OpenLayers.Feature.Vector(b, c);
        if (d) b.bounds = OpenLayers.Bounds.fromArray(d);
        if (a.id) b.fid = a.id;
        return b
    },
    parseGeometry: function(a) {
        if (a == null) return null;
        var b,
        c = false;
        if (a.type == "GeometryCollection") {
            if (!OpenLayers.Util.isArray(a.geometries)) throw "GeometryCollection must have geometries array: " + a;
            b = a.geometries.length;
            c = Array(b);
            for (var d = 0; d < b; ++d) c[d] = this.parseGeometry.apply(this, [a.geometries[d]]);
            b = new OpenLayers.Geometry.Collection(c);
            c = true
        } else {
            if (!OpenLayers.Util.isArray(a.coordinates)) throw "Geometry must have coordinates array: " + a;
            if (!this.parseCoords[a.type.toLowerCase()]) throw "Unsupported geometry type: " + a.type;
            try {
                b = this.parseCoords[a.type.toLowerCase()].apply(this, [a.coordinates])
            } catch(e) {
                throw e;
            }
        }
        this.internalProjection && this.externalProjection && !c && b.transform(this.externalProjection, this.internalProjection);
        return b
    },
    parseCoords: {
        point: function(a) {
            if (this.ignoreExtraDims == false && a.length != 2) throw "Only 2D points are supported: " + 
            a;
            return new OpenLayers.Geometry.Point(a[0], a[1])
        },
        multipoint: function(a) {
            for (var b = [], c = null, d = 0, e = a.length; d < e; ++d) {
                try {
                    c = this.parseCoords.point.apply(this, [a[d]])
                } catch(f) {
                    throw f;
                }
                b.push(c)
            }
            return new OpenLayers.Geometry.MultiPoint(b)
        },
        linestring: function(a) {
            for (var b = [], c = null, d = 0, e = a.length; d < e; ++d) {
                try {
                    c = this.parseCoords.point.apply(this, [a[d]])
                } catch(f) {
                    throw f;
                }
                b.push(c)
            }
            return new OpenLayers.Geometry.LineString(b)
        },
        multilinestring: function(a) {
            for (var b = [], c = null, d = 0, e = a.length; d < e; ++d) {
                try {
                    c = 
                    this.parseCoords.linestring.apply(this, [a[d]])
                } catch(f) {
                    throw f;
                }
                b.push(c)
            }
            return new OpenLayers.Geometry.MultiLineString(b)
        },
        polygon: function(a) {
            for (var b = [], c, d, e = 0, f = a.length; e < f; ++e) {
                try {
                    d = this.parseCoords.linestring.apply(this, [a[e]])
                } catch(g) {
                    throw g;
                }
                c = new OpenLayers.Geometry.LinearRing(d.components);
                b.push(c)
            }
            return new OpenLayers.Geometry.Polygon(b)
        },
        multipolygon: function(a) {
            for (var b = [], c = null, d = 0, e = a.length; d < e; ++d) {
                try {
                    c = this.parseCoords.polygon.apply(this, [a[d]])
                } catch(f) {
                    throw f;
                }
                b.push(c)
            }
            return new OpenLayers.Geometry.MultiPolygon(b)
        },
        box: function(a) {
            if (a.length != 2) throw "GeoJSON box coordinates must have 2 elements";
            return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(a[0][0], a[0][1]), new OpenLayers.Geometry.Point(a[1][0], a[0][1]), new OpenLayers.Geometry.Point(a[1][0], a[1][1]), new OpenLayers.Geometry.Point(a[0][0], a[1][1]), new OpenLayers.Geometry.Point(a[0][0], a[0][1])])])
        }
    },
    write: function(a, b) {
        var c = {
            type: null
        };
        if (OpenLayers.Util.isArray(a)) {
            c.type = "FeatureCollection";
            var d = 
            a.length;
            c.features = Array(d);
            for (var e = 0; e < d; ++e) {
                var f = a[e];
                if (!f instanceof OpenLayers.Feature.Vector) throw "FeatureCollection only supports collections of features: " + f;
                c.features[e] = this.extract.feature.apply(this, [f])
            }
        } else if (a.CLASS_NAME.indexOf("OpenLayers.Geometry") == 0) c = this.extract.geometry.apply(this, [a]);
        else if (a instanceof OpenLayers.Feature.Vector) {
            c = this.extract.feature.apply(this, [a]);
            if (a.layer && a.layer.projection) c.crs = this.createCRSObject(a)
        }
        return OpenLayers.Format.JSON.prototype.write.apply(this, 
        [c, b])
    },
    createCRSObject: function(a) {
        a = a.layer.projection.toString();
        var b = {};
        if (a.match(/epsg:/i)) {
            a = parseInt(a.substring(a.indexOf(":") + 1));
            b = a == 4326 ? {
                type: "name",
                properties: {
                    name: "urn:ogc:def:crs:OGC:1.3:CRS84"
                }
            }: {
                type: "name",
                properties: {
                    name: "EPSG:" + a
                }
            }
        }
        return b
    },
    extract: {
        feature: function(a) {
            var b = this.extract.geometry.apply(this, [a.geometry]);
            b = {
                type: "Feature",
                properties: a.attributes,
                geometry: b
            };
            if (a.fid != null) b.id = a.fid;
            return b
        },
        geometry: function(a) {
            if (a == null) return null;
            if (this.internalProjection && 
            this.externalProjection) {
                a = a.clone();
                a.transform(this.internalProjection, this.externalProjection)
            }
            var b = a.CLASS_NAME.split(".")[2];
            a = this.extract[b.toLowerCase()].apply(this, [a]);
            return b == "Collection" ? {
                type: "GeometryCollection",
                geometries: a
            }: {
                type: b,
                coordinates: a
            }
        },
        point: function(a) {
            return [a.x, a.y]
        },
        multipoint: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push(this.extract.point.apply(this, [a.components[c]]));
            return b
        },
        linestring: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < 
            d; ++c) b.push(this.extract.point.apply(this, [a.components[c]]));
            return b
        },
        multilinestring: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push(this.extract.linestring.apply(this, [a.components[c]]));
            return b
        },
        polygon: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push(this.extract.linestring.apply(this, [a.components[c]]));
            return b
        },
        multipolygon: function(a) {
            for (var b = [], c = 0, d = a.components.length; c < d; ++c) b.push(this.extract.polygon.apply(this, [a.components[c]]));
            return b
        },
        collection: function(a) {
            for (var b = 
            a.components.length, c = Array(b), d = 0; d < b; ++d) c[d] = this.extract.geometry.apply(this, [a.components[d]]);
            return c
        }
    },
    CLASS_NAME: "OpenLayers.Format.GeoJSON"
});
OpenLayers.Control.DrawFeature = OpenLayers.Class(OpenLayers.Control, {
    layer: null,
    callbacks: null,
    EVENT_TYPES: ["featureadded"],
    multi: false,
    featureAdded: function() {},
    handlerOptions: null,
    initialize: function(a, b, c) {
        this.EVENT_TYPES = OpenLayers.Control.DrawFeature.prototype.EVENT_TYPES.concat(OpenLayers.Control.prototype.EVENT_TYPES);
        OpenLayers.Control.prototype.initialize.apply(this, [c]);
        this.callbacks = OpenLayers.Util.extend({
            done: this.drawFeature,
            modify: function(d, e) {
                this.layer.events.triggerEvent("sketchmodified", 
                {
                    vertex: d,
                    feature: e
                })
            },
            create: function(d, e) {
                this.layer.events.triggerEvent("sketchstarted", {
                    vertex: d,
                    feature: e
                })
            }
        },
        this.callbacks);
        this.layer = a;
        this.handlerOptions = this.handlerOptions || {};
        if (! ("multi" in this.handlerOptions)) this.handlerOptions.multi = this.multi;
        if (a = this.layer.styleMap && this.layer.styleMap.styles.temporary) this.handlerOptions.layerOptions = OpenLayers.Util.applyDefaults(this.handlerOptions.layerOptions, {
            styleMap: new OpenLayers.StyleMap({
                "default": a
            })
        });
        this.handler = new b(this, this.callbacks, 
        this.handlerOptions)
    },
    drawFeature: function(a) {
        a = new OpenLayers.Feature.Vector(a);
        if (this.layer.events.triggerEvent("sketchcomplete", {
            feature: a
        }) !== false) {
            a.state = OpenLayers.State.INSERT;
            this.layer.addFeatures([a]);
            this.featureAdded(a);
            this.events.triggerEvent("featureadded", {
                feature: a
            })
        }
    },
    insertXY: function(a, b) {
        this.handler && this.handler.line && this.handler.insertXY(a, b)
    },
    insertDeltaXY: function(a, b) {
        this.handler && this.handler.line && this.handler.insertDeltaXY(a, b)
    },
    insertDirectionLength: function(a, 
    b) {
        this.handler && this.handler.line && this.handler.insertDirectionLength(a, b)
    },
    insertDeflectionLength: function(a, b) {
        this.handler && this.handler.line && this.handler.insertDeflectionLength(a, b)
    },
    undo: function() {
        return this.handler.undo && this.handler.undo()
    },
    redo: function() {
        return this.handler.redo && this.handler.redo()
    },
    finishSketch: function() {
        this.handler.finishGeometry()
    },
    cancel: function() {
        this.handler.cancel()
    },
    CLASS_NAME: "OpenLayers.Control.DrawFeature"
});
OpenLayers.Handler.Pinch = OpenLayers.Class(OpenLayers.Handler, {
    started: false,
    stopDown: false,
    pinching: false,
    last: null,
    start: null,
    initialize: function() {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments)
    },
    touchstart: function(a) {
        var b = true;
        this.pinching = false;
        if (OpenLayers.Event.isMultiTouch(a)) {
            this.started = true;
            this.last = this.start = {
                distance: this.getDistance(a.touches),
                delta: 0,
                scale: 1
            };
            this.callback("start", [a, this.start]);
            b = !this.stopDown
        } else {
            this.started = false;
            this.last = this.start = null
        }
        OpenLayers.Event.stop(a);
        return b
    },
    touchmove: function(a) {
        if (this.started && OpenLayers.Event.isMultiTouch(a)) {
            this.pinching = true;
            var b = this.getPinchData(a);
            this.callback("move", [a, b]);
            this.last = b;
            OpenLayers.Event.stop(a)
        }
        return true
    },
    touchend: function(a) {
        if (this.started) {
            this.pinching = this.started = false;
            this.callback("done", [a, this.start, this.last]);
            this.last = this.start = null
        }
        return true
    },
    activate: function() {
        var a = false;
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.pinching = false;
            a = true
        }
        return a
    },
    deactivate: function() {
        var a = 
        false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.pinching = this.started = false;
            this.last = this.start = null;
            a = true
        }
        return a
    },
    getDistance: function(a) {
        var b = a[0];
        a = a[1];
        return Math.sqrt(Math.pow(b.clientX - a.clientX, 2) + Math.pow(b.clientY - a.clientY, 2))
    },
    getPinchData: function(a) {
        a = this.getDistance(a.touches);
        return {
            distance: a,
            delta: this.last.distance - a,
            scale: a / this.start.distance
        }
    },
    CLASS_NAME: "OpenLayers.Handler.Pinch"
});
OpenLayers.Control.Geolocate = OpenLayers.Class(OpenLayers.Control, {
    EVENT_TYPES: ["locationupdated", "locationfailed", "locationuncapable"],
    geolocation: navigator.geolocation,
    bind: true,
    watch: false,
    geolocationOptions: null,
    initialize: function(a) {
        this.EVENT_TYPES = OpenLayers.Control.Geolocate.prototype.EVENT_TYPES.concat(OpenLayers.Control.prototype.EVENT_TYPES);
        this.geolocationOptions = {};
        OpenLayers.Control.prototype.initialize.apply(this, [a])
    },
    destroy: function() {
        this.deactivate();
        OpenLayers.Control.prototype.destroy.apply(this, 
        arguments)
    },
    activate: function() {
        if (!this.geolocation) {
            this.events.triggerEvent("locationuncapable");
            return false
        }
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            if (this.watch) this.watchId = this.geolocation.watchPosition(OpenLayers.Function.bind(this.geolocate, this), OpenLayers.Function.bind(this.failure, this), this.geolocationOptions);
            else this.getCurrentLocation();
            return true
        }
        return false
    },
    deactivate: function() {
        this.active && this.watchId !== null && this.geolocation.clearWatch(this.watchId);
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments)
    },
    geolocate: function(a) {
        var b = (new OpenLayers.LonLat(a.coords.longitude, a.coords.latitude)).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
        this.bind && this.map.setCenter(b);
        this.events.triggerEvent("locationupdated", {
            position: a,
            point: new OpenLayers.Geometry.Point(b.lon, b.lat)
        })
    },
    getCurrentLocation: function() {
        if (!this.active || this.watch) return false;
        this.geolocation.getCurrentPosition(OpenLayers.Function.bind(this.geolocate, 
        this), OpenLayers.Function.bind(this.failure, this), this.geolocationOptions);
        return true
    },
    failure: function(a) {
        this.events.triggerEvent("locationfailed", {
            error: a
        })
    },
    CLASS_NAME: "OpenLayers.Control.Geolocate"
});
OpenLayers.Format.QueryStringFilter = function() {
    function a(c) {
        c = c.replace(/%/g, "\\%");
        c = c.replace(/\\\\\.(\*)?/g, 
        function(d, e) {
            return e ? d: "\\\\_"
        });
        c = c.replace(/\\\\\.\*/g, "\\\\%");
        c = c.replace(/(\\)?\.(\*)?/g, 
        function(d, e, f) {
            return e || f ? d: "_"
        });
        c = c.replace(/(\\)?\.\*/g, 
        function(d, e) {
            return e ? d: "%"
        });
        c = c.replace(/\\\./g, ".");
        return c = c.replace(/(\\)?\\\*/g, 
        function(d, e) {
            return e ? d: "*"
        })
    }
    var b = {};
    b[OpenLayers.Filter.Comparison.EQUAL_TO] = "eq";
    b[OpenLayers.Filter.Comparison.NOT_EQUAL_TO] = "ne";
    b[OpenLayers.Filter.Comparison.LESS_THAN] = 
    "lt";
    b[OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO] = "lte";
    b[OpenLayers.Filter.Comparison.GREATER_THAN] = "gt";
    b[OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO] = "gte";
    b[OpenLayers.Filter.Comparison.LIKE] = "ilike";
    return OpenLayers.Class(OpenLayers.Format, {
        wildcarded: false,
        srsInBBOX: false,
        write: function(c, d) {
            d = d || {};
            var e = c.CLASS_NAME;
            e = e.substring(e.lastIndexOf(".") + 1);
            switch (e) {
            case "Spatial":
                switch (c.type) {
                case OpenLayers.Filter.Spatial.BBOX:
                    d.bbox = c.value.toArray();
                    this.srsInBBOX && c.projection && 
                    d.bbox.push(c.projection.getCode());
                    break;
                case OpenLayers.Filter.Spatial.DWITHIN:
                    d.tolerance = c.distance;
                case OpenLayers.Filter.Spatial.WITHIN:
                    d.lon = c.value.x;
                    d.lat = c.value.y;
                    break;
                default:
                    OpenLayers.Console.warn("Unknown spatial filter type " + c.type)
                }
                break;
            case "Comparison":
                e = b[c.type];
                if (e !== undefined) {
                    var f = c.value;
                    if (c.type == OpenLayers.Filter.Comparison.LIKE) {
                        f = a(f);
                        if (this.wildcarded) f = "%" + f + "%"
                    }
                    d[c.property + "__" + e] = f;
                    d.queryable = d.queryable || [];
                    d.queryable.push(c.property)
                } else OpenLayers.Console.warn("Unknown comparison filter type " + 
                c.type);
                break;
            case "Logical":
                if (c.type === OpenLayers.Filter.Logical.AND) {
                    e = 0;
                    for (f = c.filters.length; e < f; e++) d = this.write(c.filters[e], d)
                } else OpenLayers.Console.warn("Unsupported logical filter type " + c.type);
                break;
            default:
                OpenLayers.Console.warn("Unknown filter type " + e)
            }
            return d
        },
        CLASS_NAME: "OpenLayers.Format.QueryStringFilter"
    })
} ();
OpenLayers.Handler.Click = OpenLayers.Class(OpenLayers.Handler, {
    delay: 300,
    single: true,
    "double": false,
    pixelTolerance: 0,
    dblclickTolerance: 13,
    stopSingle: false,
    stopDouble: false,
    timerId: null,
    touch: false,
    down: null,
    last: null,
    first: null,
    rightclickTimerId: null,
    initialize: function() {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments)
    },
    touchstart: function(a) {
        if (!this.touch) {
            this.unregisterMouseListeners();
            this.touch = true
        }
        this.down = this.getEventInfo(a);
        this.last = this.getEventInfo(a);
        return true
    },
    touchmove: function(a) {
        this.last = 
        this.getEventInfo(a);
        return true
    },
    touchend: function(a) {
        if (this.down) {
            a.xy = this.last.xy;
            a.lastTouches = this.last.touches;
            this.handleSingle(a);
            this.down = null
        }
        return true
    },
    unregisterMouseListeners: function() {
        this.map.events.un({
            mousedown: this.mousedown,
            mouseup: this.mouseup,
            click: this.click,
            dblclick: this.dblclick,
            scope: this
        })
    },
    mousedown: function(a) {
        this.down = this.getEventInfo(a);
        this.last = this.getEventInfo(a);
        return true
    },
    mouseup: function(a) {
        var b = true;
        if (this.checkModifiers(a) && this.control.handleRightClicks && 
        OpenLayers.Event.isRightClick(a)) b = this.rightclick(a);
        return b
    },
    rightclick: function(a) {
        if (this.passesTolerance(a)) if (this.rightclickTimerId != null) {
            this.clearTimer();
            this.callback("dblrightclick", [a]);
            return ! this.stopDouble
        } else {
            a = this["double"] ? OpenLayers.Util.extend({},
            a) : this.callback("rightclick", [a]);
            a = OpenLayers.Function.bind(this.delayedRightCall, this, a);
            this.rightclickTimerId = window.setTimeout(a, this.delay)
        }
        return ! this.stopSingle
    },
    delayedRightCall: function(a) {
        this.rightclickTimerId = null;
        a && 
        this.callback("rightclick", [a])
    },
    click: function(a) {
        if (!this.last) this.last = this.getEventInfo(a);
        this.handleSingle(a);
        return ! this.stopSingle
    },
    dblclick: function(a) {
        this.handleDouble(a);
        return ! this.stopDouble
    },
    handleDouble: function(a) {
        this["double"] && this.passesDblclickTolerance(a) && this.callback("dblclick", [a])
    },
    handleSingle: function(a) {
        if (this.passesTolerance(a)) if (this.timerId != null) {
            if (this.last.touches && this.last.touches.length === 1) {
                this["double"] && OpenLayers.Event.stop(a);
                this.handleDouble(a)
            }
            if (!this.last.touches || 
            this.last.touches.length !== 2) this.clearTimer()
        } else {
            this.first = this.getEventInfo(a);
            this.queuePotentialClick(this.single ? OpenLayers.Util.extend({},
            a) : null)
        }
    },
    queuePotentialClick: function(a) {
        this.timerId = window.setTimeout(OpenLayers.Function.bind(this.delayedCall, this, a), this.delay)
    },
    passesTolerance: function(a) {
        var b = true;
        if (this.pixelTolerance != null && this.down && this.down.xy) if ((b = this.pixelTolerance >= this.down.xy.distanceTo(a.xy)) && this.touch && this.down.touches.length === this.last.touches.length) {
            a = 
            0;
            for (var c = this.down.touches.length; a < c; ++a) if (this.getTouchDistance(this.down.touches[a], this.last.touches[a]) > this.pixelTolerance) {
                b = false;
                break
            }
        }
        return b
    },
    getTouchDistance: function(a, b) {
        return Math.sqrt(Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2))
    },
    passesDblclickTolerance: function() {
        var a = true;
        if (this.down && this.first) a = this.down.xy.distanceTo(this.first.xy) <= this.dblclickTolerance;
        return a
    },
    clearTimer: function() {
        if (this.timerId != null) {
            window.clearTimeout(this.timerId);
            this.timerId = 
            null
        }
        if (this.rightclickTimerId != null) {
            window.clearTimeout(this.rightclickTimerId);
            this.rightclickTimerId = null
        }
    },
    delayedCall: function(a) {
        this.timerId = null;
        a && this.callback("click", [a])
    },
    getEventInfo: function(a) {
        var b;
        if (a.touches) {
            var c = a.touches.length;
            b = Array(c);
            for (var d, e = 0; e < c; e++) {
                d = a.touches[e];
                b[e] = {
                    clientX: d.clientX,
                    clientY: d.clientY
                }
            }
        }
        return {
            xy: a.xy,
            touches: b
        }
    },
    deactivate: function() {
        var a = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.clearTimer();
            this.last = 
            this.first = this.down = null;
            this.touch = false;
            a = true
        }
        return a
    },
    CLASS_NAME: "OpenLayers.Handler.Click"
});
OpenLayers.Protocol.HTTP = OpenLayers.Class(OpenLayers.Protocol, {
    url: null,
    headers: null,
    params: null,
    callback: null,
    scope: null,
    readWithPOST: false,
    wildcarded: false,
    srsInBBOX: false,
    initialize: function() {
        this.params = {};
        this.headers = {};
        OpenLayers.Protocol.prototype.initialize.apply(this, arguments);
        if (!this.filterToParams && OpenLayers.Format.QueryStringFilter) {
            var a = new OpenLayers.Format.QueryStringFilter({
                wildcarded: this.wildcarded,
                srsInBBOX: this.srsInBBOX
            });
            this.filterToParams = function(b, c) {
                return a.write(b, 
                c)
            }
        }
    },
    destroy: function() {
        this.headers = this.params = null;
        OpenLayers.Protocol.prototype.destroy.apply(this)
    },
    read: function(a) {
        OpenLayers.Protocol.prototype.read.apply(this, arguments);
        a = a || {};
        a.params = OpenLayers.Util.applyDefaults(a.params, this.options.params);
        a = OpenLayers.Util.applyDefaults(a, this.options);
        if (a.filter && this.filterToParams) a.params = this.filterToParams(a.filter, a.params);
        var b = a.readWithPOST !== undefined ? a.readWithPOST: this.readWithPOST,
        c = new OpenLayers.Protocol.Response({
            requestType: "read"
        });
        c.priv = b ? OpenLayers.Request.POST({
            url: a.url,
            callback: this.createCallback(this.handleRead, c, a),
            data: OpenLayers.Util.getParameterString(a.params),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }) : OpenLayers.Request.GET({
            url: a.url,
            callback: this.createCallback(this.handleRead, c, a),
            params: a.params,
            headers: a.headers
        });
        return c
    },
    handleRead: function(a, b) {
        this.handleResponse(a, b)
    },
    create: function(a, b) {
        b = OpenLayers.Util.applyDefaults(b, this.options);
        var c = new OpenLayers.Protocol.Response({
            reqFeatures: a,
            requestType: "create"
        });
        c.priv = OpenLayers.Request.POST({
            url: b.url,
            callback: this.createCallback(this.handleCreate, c, b),
            headers: b.headers,
            data: this.format.write(a)
        });
        return c
    },
    handleCreate: function(a, b) {
        this.handleResponse(a, b)
    },
    update: function(a, b) {
        b = b || {};
        var c = b.url || a.url || this.options.url + "/" + a.fid;
        b = OpenLayers.Util.applyDefaults(b, this.options);
        var d = new OpenLayers.Protocol.Response({
            reqFeatures: a,
            requestType: "update"
        });
        d.priv = OpenLayers.Request.PUT({
            url: c,
            callback: this.createCallback(this.handleUpdate, 
            d, b),
            headers: b.headers,
            data: this.format.write(a)
        });
        return d
    },
    handleUpdate: function(a, b) {
        this.handleResponse(a, b)
    },
    "delete": function(a, b) {
        b = b || {};
        var c = b.url || a.url || this.options.url + "/" + a.fid;
        b = OpenLayers.Util.applyDefaults(b, this.options);
        var d = new OpenLayers.Protocol.Response({
            reqFeatures: a,
            requestType: "delete"
        });
        d.priv = OpenLayers.Request.DELETE({
            url: c,
            callback: this.createCallback(this.handleDelete, d, b),
            headers: b.headers
        });
        return d
    },
    handleDelete: function(a, b) {
        this.handleResponse(a, b)
    },
    handleResponse: function(a, 
    b) {
        var c = a.priv;
        if (b.callback) {
            if (c.status >= 200 && c.status < 300) {
                if (a.requestType != "delete") a.features = this.parseFeatures(c);
                a.code = OpenLayers.Protocol.Response.SUCCESS
            } else a.code = OpenLayers.Protocol.Response.FAILURE;
            b.callback.call(b.scope, a)
        }
    },
    parseFeatures: function(a) {
        var b = a.responseXML;
        if (!b || !b.documentElement) b = a.responseText;
        if (!b || b.length <= 0) return null;
        return this.format.read(b)
    },
    commit: function(a, b) {
        function c(p) {
            for (var q = p.features ? p.features.length: 0, r = Array(q), s = 0; s < q; ++s) r[s] = p.features[s].fid;
            o.insertIds = r;
            d.apply(this, [p])
        }
        function d(p) {
            this.callUserCallback(p, b);
            n = n && p.success();
            f++;
            if (f >= m) if (b.callback) {
                o.code = n ? OpenLayers.Protocol.Response.SUCCESS: OpenLayers.Protocol.Response.FAILURE;
                b.callback.apply(b.scope, [o])
            }
        }
        b = OpenLayers.Util.applyDefaults(b, this.options);
        var e = [],
        f = 0,
        g = {};
        g[OpenLayers.State.INSERT] = [];
        g[OpenLayers.State.UPDATE] = [];
        g[OpenLayers.State.DELETE] = [];
        for (var h, i, j = [], k = 0, l = a.length; k < l; ++k) {
            h = a[k];
            if (i = g[h.state]) {
                i.push(h);
                j.push(h)
            }
        }
        var m = (g[OpenLayers.State.INSERT].length > 
        0 ? 1: 0) + g[OpenLayers.State.UPDATE].length + g[OpenLayers.State.DELETE].length,
        n = true,
        o = new OpenLayers.Protocol.Response({
            reqFeatures: j
        });
        h = g[OpenLayers.State.INSERT];
        h.length > 0 && e.push(this.create(h, OpenLayers.Util.applyDefaults({
            callback: c,
            scope: this
        },
        b.create)));
        h = g[OpenLayers.State.UPDATE];
        for (k = h.length - 1; k >= 0; --k) e.push(this.update(h[k], OpenLayers.Util.applyDefaults({
            callback: d,
            scope: this
        },
        b.update)));
        h = g[OpenLayers.State.DELETE];
        for (k = h.length - 1; k >= 0; --k) e.push(this["delete"](h[k], OpenLayers.Util.applyDefaults({
            callback: d,
            scope: this
        },
        b["delete"])));
        return e
    },
    abort: function(a) {
        a && a.priv.abort()
    },
    callUserCallback: function(a, b) {
        var c = b[a.requestType];
        c && c.callback && c.callback.call(c.scope, a)
    },
    CLASS_NAME: "OpenLayers.Protocol.HTTP"
});
OpenLayers.Control.DragPan = OpenLayers.Class(OpenLayers.Control, {
    type: OpenLayers.Control.TYPE_TOOL,
    panned: false,
    interval: 1,
    documentDrag: false,
    kinetic: null,
    enableKinetic: false,
    kineticInterval: 10,
    draw: function() {
        if (this.enableKinetic) {
            var a = {
                interval: this.kineticInterval
            };
            if (typeof this.enableKinetic === "object") a = OpenLayers.Util.extend(a, this.enableKinetic);
            this.kinetic = new OpenLayers.Kinetic(a)
        }
        this.handler = new OpenLayers.Handler.Drag(this, {
            move: this.panMap,
            done: this.panMapDone,
            down: this.panMapStart
        },
        {
            interval: this.interval,
            documentDrag: this.documentDrag
        })
    },
    panMapStart: function() {
        this.kinetic && this.kinetic.begin()
    },
    panMap: function(a) {
        this.kinetic && this.kinetic.update(a);
        this.panned = true;
        this.map.pan(this.handler.last.x - a.x, this.handler.last.y - a.y, {
            dragging: true,
            animate: false
        })
    },
    panMapDone: function(a) {
        if (this.panned) {
            var b = null;
            if (this.kinetic) b = this.kinetic.end(a);
            this.map.pan(this.handler.last.x - a.x, this.handler.last.y - a.y, {
                dragging: !!b,
                animate: false
            });
            if (b) {
                var c = this;
                this.kinetic.move(b, 
                function(d, 
                e, f) {
                    c.map.pan(d, e, {
                        dragging: !f,
                        animate: false
                    })
                })
            }
            this.panned = false
        }
    },
    CLASS_NAME: "OpenLayers.Control.DragPan"
});
OpenLayers.Control.PinchZoom = OpenLayers.Class(OpenLayers.Control, {
    type: OpenLayers.Control.TYPE_TOOL,
    containerOrigin: null,
    pinchOrigin: null,
    currentCenter: null,
    autoActivate: true,
    initialize: function() {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.handler = new OpenLayers.Handler.Pinch(this, {
            start: this.pinchStart,
            move: this.pinchMove,
            done: this.pinchDone
        },
        this.handlerOptions)
    },
    activate: function() {
        var a = OpenLayers.Control.prototype.activate.apply(this, arguments);
        if (a) {
            this.map.events.on({
                moveend: this.updateContainerOrigin,
                scope: this
            });
            this.updateContainerOrigin()
        }
        return a
    },
    deactivate: function() {
        var a = OpenLayers.Control.prototype.deactivate.apply(this, arguments);
        this.map && this.map.events && this.map.events.un({
            moveend: this.updateContainerOrigin,
            scope: this
        });
        return a
    },
    updateContainerOrigin: function() {
        var a = this.map.layerContainerDiv;
        this.containerOrigin = {
            x: parseInt(a.style.left, 10),
            y: parseInt(a.style.top, 10)
        }
    },
    pinchStart: function(a) {
        this.currentCenter = this.pinchOrigin = a.xy
    },
    pinchMove: function(a, b) {
        var c = b.scale,
        d = this.containerOrigin,
        e = this.pinchOrigin,
        f = a.xy;
        this.applyTransform("translate(" + Math.round(f.x - e.x + (c - 1) * (d.x - e.x)) + "px, " + Math.round(f.y - e.y + (c - 1) * (d.y - e.y)) + "px) scale(" + c + ")");
        this.currentCenter = f
    },
    applyTransform: function(a) {
        var b = this.map.layerContainerDiv.style;
        b["-webkit-transform"] = a;
        b["-moz-transform"] = a
    },
    pinchDone: function(a, b, c) {
        this.applyTransform("");
        a = this.map.getZoomForResolution(this.map.getResolution() / c.scale, true);
        if (a !== this.map.getZoom() || !this.currentCenter.equals(this.pinchOrigin)) {
            b = this.map.getResolutionForZoom(a);
            c = this.map.getLonLatFromPixel(this.pinchOrigin);
            var d = this.currentCenter,
            e = this.map.getSize();
            c.lon += b * (e.w / 2 - d.x);
            c.lat -= b * (e.h / 2 - d.y);
            this.map.setCenter(c, a)
        }
    },
    CLASS_NAME: "OpenLayers.Control.PinchZoom"
});
OpenLayers.Control.TouchNavigation = OpenLayers.Class(OpenLayers.Control, {
    dragPan: null,
    dragPanOptions: null,
    pinchZoom: null,
    pinchZoomOptions: null,
    clickHandlerOptions: null,
    documentDrag: false,
    autoActivate: true,
    initialize: function() {
        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, arguments)
    },
    destroy: function() {
        this.deactivate();
        this.dragPan && this.dragPan.destroy();
        this.dragPan = null;
        if (this.pinchZoom) {
            this.pinchZoom.destroy();
            delete this.pinchZoom
        }
        OpenLayers.Control.prototype.destroy.apply(this, 
        arguments)
    },
    activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            this.dragPan.activate();
            this.handlers.click.activate();
            this.pinchZoom.activate();
            return true
        }
        return false
    },
    deactivate: function() {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            this.dragPan.deactivate();
            this.handlers.click.deactivate();
            this.pinchZoom.deactivate();
            return true
        }
        return false
    },
    draw: function() {
        var a = {
            click: this.defaultClick,
            dblclick: this.defaultDblClick
        },
        b = OpenLayers.Util.extend({
            "double": true,
            stopDouble: true,
            pixelTolerance: 2
        },
        this.clickHandlerOptions);
        this.handlers.click = new OpenLayers.Handler.Click(this, a, b);
        this.dragPan = new OpenLayers.Control.DragPan(OpenLayers.Util.extend({
            map: this.map,
            documentDrag: this.documentDrag
        },
        this.dragPanOptions));
        this.dragPan.draw();
        this.pinchZoom = new OpenLayers.Control.PinchZoom(OpenLayers.Util.extend({
            map: this.map
        },
        this.pinchZoomOptions))
    },
    defaultClick: function(a) {
        a.lastTouches && a.lastTouches.length == 2 && this.map.zoomOut()
    },
    defaultDblClick: function(a) {
        this.map.setCenter(this.map.getLonLatFromViewPortPx(a.xy), 
        this.map.zoom + 1)
    },
    CLASS_NAME: "OpenLayers.Control.TouchNavigation"
});
OpenLayers.Protocol.WFS.v1_0_0 = OpenLayers.Class(OpenLayers.Protocol.WFS.v1, {
    version: "1.0.0",
    CLASS_NAME: "OpenLayers.Protocol.WFS.v1_0_0"
});
