(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Tools
var Tools = function () {
    function Tools() {
        _classCallCheck(this, Tools);

        this.logPrevValue = null;
        this.logCount = 0;
    }

    _createClass(Tools, [{
        key: 'de2ra',
        value: function de2ra(degree) {
            return degree * (Math.PI / 180);
        }
    }, {
        key: 'isOdd',
        value: function isOdd(num) {
            return num % 2;
        }
    }, {
        key: 'Log',
        value: function Log(value) {
            if (this.logPrevValue == null || this.logPrevValue.toString() !== value.toString() || Math.round(this.logPrevValue * 1000) / 1000 !== Math.round(value * 1000) / 1000) {
                console.log(value);
            }
            this.logPrevValue = value;
        }
        /*
         *  slugifyUrl
         *  get last part of url
         *
         */

    }, {
        key: 'getLastPartUrl',
        value: function getLastPartUrl(url) {
            var re = '[^/]+(?=\/$|$)';
            return url.match(re)[0];
        }
    }]);

    return Tools;
}();

exports.default = Tools;
;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Bastou on 06/04/2018.
 */

var Article = function () {
    function Article(props) {
        var _this = this;

        _classCallCheck(this, Article);

        props = props || {}; //this is default value for param.

        // P5
        this.p = props.p;

        // Article metas
        this.id = props.id;
        this.category = props.category;
        this.title = props.title;
        this.date = props.date;
        this.url = props.url;
        this.html = props.html;

        // Article canvas shape
        this.x = props.x;
        this.y = props.y;
        this.color = props.color;
        this.pColor;

        // Article line if connected to another article
        this.hasLine = false;
        this.lineTo = { x: 0, y: 0

            // private
        };this._r = 10;

        // Around circles

        // TODO: put that stuff in an object fuck off
        this.aroundCirclesNb = 4;
        this.aroundCircleROff = 0;
        this.aroundCircles = new Array(this.aroundCirclesNb).fill(0).map(function (c) {
            return { x: _this.x, y: _this.y, r: 0 };
        });

        // title in View
        this.uiTitleAlpha = { a: 0 }; // must  be an object for Tween
        this.uiTitleP = {
            'alpha': { x: 0, y: 0 },
            'alphaTarget': { a: 255 },
            'tween': new TWEEN.Tween(this.uiTitleAlpha).to({ a: 255 }, 500).easing(TWEEN.Easing.Quadratic.In).onUpdate(function () {
                //console.log(this.uiTitleAlpha.a);
            }),
            'started': false
        };
    }

    _createClass(Article, [{
        key: 'init',
        value: function init() {
            this.setPcolor(this.color);
        }
    }, {
        key: 'clicked',
        value: function clicked(px, py) {
            if (this.pointerInArticle(px, py)) {
                console.log('clicked on article' + '"' + this.title + '"');
            }
        }
    }, {
        key: 'hovered',
        value: function hovered(px, py) {
            if (this.pointerInArticle(px, py)) {
                // title in
                this.drawTitle();

                // circles in
                this.drawCirclesAround();

                this.p.cursor(this.p.HAND);
            } else {
                // title out
                this.drawTitle(true);

                // circles out
                this.drawCirclesAround(true);
            }
        }
    }, {
        key: 'pointerInArticle',
        value: function pointerInArticle(px, py) {
            var d = this.p.dist(px, py, this.x, this.y);
            if (d < this._r) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'show',
        value: function show() {
            this.p.noStroke();
            this.p.fill(this.pColor);
            this.p.push();
            this.p.ellipse(this.x, this.y, this._r);
            this.p.pop();

            if (this.hasLine) {
                this.p.stroke(this.pColor);
                this.p.strokeWeight(4);
                this.p.push();
                this.p.line(this.x, this.y, this.lineTo.x, this.lineTo.y);
                this.p.pop();
            }
        }
    }, {
        key: 'drawCirclesAround',
        value: function drawCirclesAround() {
            var _this2 = this;

            var out = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (out && this.aroundCircles.r === 0) return;
            this.p.noStroke();
            this.pColor.setAlpha(40);
            this.p.fill(this.pColor);
            this.p.push();
            this.aroundCircles.forEach(function (c, i) {
                // ease radius size
                if (out) {
                    c.r += (0 - c.r) * 0.13;
                } else {
                    _this2.aroundCircleROff += 0.007;
                    var n = _this2.p.noise(_this2.aroundCircleROff) * 1.5;
                    c.r += (_this2._r + n + i * 12 * n - c.r) * 0.1;
                }
                _this2.p.ellipse(c.x, c.y, c.r);
            });
            this.p.pop();
            this.pColor.setAlpha(255);
        }
    }, {
        key: 'drawTitle',
        value: function drawTitle() {
            var out = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (out) {
                this.uiTitleP.tween.stop();
                this.uiTitleP.started = false;
                this.uiTitleAlpha.a = 0;
            }
            if (!this.uiTitleP.started && !out) {
                this.uiTitleP.tween.start();
                this.uiTitleP.started = true;
            }
            if (out) return;
            this.pColor.setAlpha(this.uiTitleAlpha.a);
            this.p.noStroke();
            this.p.fill(this.pColor);
            this.p.push();
            this.p.textAlign(this.p.CENTER);
            this.p.text(this.title, this.x, this.y - 30);
            this.p.pop();
            this.pColor.setAlpha(255);
        }
    }, {
        key: 'setPcolor',
        value: function setPcolor(color) {
            this.pColor = this.p.color(color);
        }
    }]);

    return Article;
}();

exports.default = Article;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Bastou on 06/04/2018.
 */

var Category = function () {
    function Category(props) {
        _classCallCheck(this, Category);

        // p5
        this.p = props.p;

        // Props
        this.id = props.id;
        this.color = props.color;
        this.pColor = null;
        this.posY = props.posY;
        this.pos = props.pos;
    }

    _createClass(Category, [{
        key: 'show',
        value: function show() {
            console.log('show');
        }
    }]);

    return Category;
}();

exports.default = Category;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (x1, y1, x2, y2, l, g) {
    var pc = this.dist(x1, y1, x2, y2) / 100;
    var pcCount = 1;
    var lPercent = void 0,
        gPercent = 0;
    var currentPos = 0;
    var xx1 = void 0,
        yy1 = void 0,
        xx2 = void 0,
        yy2 = 0;

    while (this.int(pcCount * pc) < l) {
        pcCount++;
    }
    lPercent = pcCount;
    pcCount = 1;
    while (this.int(pcCount * pc) < g) {
        pcCount++;
    }
    gPercent = pcCount;

    lPercent = lPercent / 100;
    gPercent = gPercent / 100;
    while (currentPos < 1) {
        xx1 = this.lerp(x1, x2, currentPos);
        yy1 = this.lerp(y1, y2, currentPos);
        xx2 = this.lerp(x1, x2, currentPos + lPercent);
        yy2 = this.lerp(y1, y2, currentPos + lPercent);
        if (x1 > x2) {
            if (xx2 < x2) {
                xx2 = x2;
            }
        }
        if (x1 < x2) {
            if (xx2 > x2) {
                xx2 = x2;
            }
        }
        if (y1 > y2) {
            if (yy2 < y2) {
                yy2 = y2;
            }
        }
        if (y1 < y2) {
            if (yy2 > y2) {
                yy2 = y2;
            }
        }

        this.line(xx1, yy1, xx2, yy2);
        currentPos = currentPos + lPercent + gPercent;
    }
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Bastou on 09/04/2018.
 */

var datas = {
    'months': ['SEP.', 'OCT.', 'NOV.', 'DEC.', 'JAN.', 'FEB.', 'MAR.', 'APR.'],
    'dateRange': ['2017-09-01T00:00:00', '2018-04-01T00:00:00'],
    'colors': {
        'paleIlac': 'rgba(229, 227, 255)',
        'paleIlacTransparent': 'rgba(229, 227, 255, 0.2)',
        'darkBlueGrey': 'rgb(22, 20, 59)',
        'darkSeafoam': 'rgb(36, 181, 131)',
        'brightSkyBlue': 'rgb(4, 190, 254)',
        'redPink': 'rgb(248, 44, 103)',
        'paleYellow': 'rgb(250, 255, 131)'
    },
    'categories': [{
        'id': 'ecology',
        'color': 'rgb(36, 181, 131)', // darkSeafoam
        'pos': 1
    }, {
        'id': 'house',
        'color': 'rgb(4, 190, 254)', // brightSkyBlue
        'pos': 2
    }, {
        'id': 'security',
        'color': 'rgb(248, 44, 103)', // redPink
        'pos': 3
    }, {
        'id': 'comfort',
        'color': 'rgb(250, 255, 131)', // brightSkyBlue
        'pos': 4
    }]
};
exports.default = datas;

},{}],6:[function(require,module,exports){
'use strict';

var _sketch = require('./sketch');

var _sketch2 = _interopRequireDefault(_sketch);

var _Tools = require('./Tools');

var _Tools2 = _interopRequireDefault(_Tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// global tools
//import { generateRandom, sum } from './utils';
window.tools = new _Tools2.default();

new p5(_sketch2.default, 'timeline');

},{"./Tools":1,"./sketch":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (p) {

    // TIMELINE CONFIGS /////////
    var padding = [0, 80];
    var W = p.windowWidth;
    var H = p.windowHeight;
    var catPosY = [H / 4 + 45, H / 3 + 45, H - H / 4 - 45, H - H / 3 - 45];

    /////////////////////////

    var Pcolors = Object.keys(_datas2.default.colors).reduce(function (previous, current) {
        previous[current] = p.color(_datas2.default.colors[current]);
        return previous;
    }, {});

    var categories = [];
    // Parse categories
    _datas2.default.categories.forEach(function (c) {
        var currentCat = new _category2.default(Object.assign(c, { p: p }));
        currentCat.posY = catPosY[c.pos - 1]; // Set Y pos
        categories.push(currentCat);
    });

    // categories = datas.categories.map(c => {
    //     return new Category(Object.assign(c,{p}));
    // });
    /////////////////////////

    var articles = [];
    // END TIMELINE CONFIGS /////////

    var cv = null;

    p.preload = function () {

        // Get all articles from generated hugo json
        var url = '//' + window.location.host + '/articles/index.json';
        p.loadJSON(url, function (data) {
            data.articles.forEach(function (article, key) {
                var articleCategory = categories.filter(function (el) {
                    return el.id === article.categories[0];
                });

                //console.log(articleCategory[0].posY);

                articles.push(new _article2.default({
                    p: p,
                    id: tools.getLastPartUrl(article.url),
                    title: article.title,
                    category: article.categories[0],
                    date: article.date,
                    url: article.url,
                    html: article['content_html'],
                    color: articleCategory[0].color,
                    // TODO: make in article
                    x: setDateToPosX(article.date, _datas2.default.dateRange[0], _datas2.default.dateRange[1], padding[1], W - padding[1]),
                    y: articleCategory[0].posY
                }));
                articles[key].init();
                console.log(articles[key].color);
            });
        });

        // Sort articles
        articles.sort(function (a, b) {
            var sortParam = 'date';
            return a[sortParam] > b[sortParam] ? 1 : b[sortParam] > a[sortParam] ? -1 : 0;
        });
    };

    p.setup = function () {
        cv = p.createCanvas(W, H);
        cv.mousePressed(cvMousePressed);

        // TODO: move away
        setupArticlesLines();
    };

    p.draw = function () {
        //p.background('#020126');
        p.clear();

        // CURSOR STATE
        p.cursor(p.ARROW);

        /////// MONTHS ////////

        // Months line
        p.stroke(Pcolors.paleIlacTransparent);
        p.strokeWeight(1);

        // Months
        p.line(padding[1], H / 2, W - padding[1], H / 2);
        for (var i = 0; i < _datas2.default.months.length; i++) {
            var amt = i / (_datas2.default.months.length - 1) * 1;
            var monthX = p.lerp(padding[1], W - padding[1], amt);
            var textOffest = (i + 1) % 2 == 0 ? 30 : -20;

            // circle and vertical dash line
            if (i !== 0 && i !== _datas2.default.months.length - 1) {
                p.ellipse(monthX, H / 2, 9);
                p.stroke(Pcolors.paleIlacTransparent);
                p.dashedLine(monthX, H / 4, monthX, H - H / 4, 1, 15);
            }

            // text
            p.noStroke();
            p.fill(Pcolors.paleIlac);
            p.push();
            p.textAlign(p.CENTER);
            p.text(_datas2.default.months[i], monthX, H / 2 + textOffest);
        }
        p.pop();
        /////////////////////////

        /////// ARTICLES ////////
        articles.forEach(function (article) {
            article.hovered(p.mouseX, p.mouseY);
            article.show();
        });
        /////////////////////////

        // TWEENS //////////////////
        TWEEN.update();
    };

    p.windowResized = function () {
        W = p.windowWidth;
        H = p.windowHeight;
        p.resizeCanvas(W, H);

        // TODO: re-calcul article pos
    };

    // INTERACTIONS //////////////////

    function cvMousePressed() {
        articles.forEach(function (article) {
            article.clicked(p.mouseX, p.mouseY);
        });
    }

    // Les traits !
    // TODO: in class articlesManager ?
    function setupArticlesLines() {
        var lastMonth = 0;
        var lastCoords = { x: 0, y: 0 };

        _datas2.default.categories.forEach(function (category) {
            articles.forEach(function (article) {
                if (article.category === category.id) {
                    if (lastMonth === new Date(article.date).getMonth() + 1) {
                        article.hasLine = true;
                        article.lineTo.x = lastCoords.x;
                        article.lineTo.y = lastCoords.y;
                    }
                    lastMonth = new Date(article.date).getMonth() + 1;
                    lastCoords.x = article.x;
                    lastCoords.y = article.y;
                }
            });
        });
    }

    // TEMP UTILS /////////

    // TODO: add to articlesManager ?
    /*
     *  dateToPosX
     *
     *  Transform timestamp to position in pixel  within a range
     *  return position in pixels (int)
     */
    function setDateToPosX(date, beginDate, EndDate, beginX, endX) {
        // Date Transform
        var dateArray = [date, beginDate, EndDate];
        var dateTimes = [];
        dateArray.forEach(function (date) {
            dateTimes.push(new Date(date).getTime());
        });
        // return pos in pixel
        return p.map(dateTimes[0], dateTimes[1], dateTimes[2], beginX, endX);
    }
    ///////////////////////
};

var _dashedLine = require('./dashedLine');

var _dashedLine2 = _interopRequireDefault(_dashedLine);

var _article = require('./article');

var _article2 = _interopRequireDefault(_article);

var _datas = require('./datas');

var _datas2 = _interopRequireDefault(_datas);

var _category = require('./category');

var _category2 = _interopRequireDefault(_category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Add extension to P5
//import Bubble from './bubble';
p5.prototype.dashedLine = _dashedLine2.default;

// Setup timeline

},{"./article":2,"./category":3,"./dashedLine":4,"./datas":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvanMvVG9vbHMuanMiLCJzdGF0aWMvanMvYXJ0aWNsZS5qcyIsInN0YXRpYy9qcy9jYXRlZ29yeS5qcyIsInN0YXRpYy9qcy9kYXNoZWRMaW5lLmpzIiwic3RhdGljL2pzL2RhdGFzLmpzIiwic3RhdGljL2pzL21haW4uanMiLCJzdGF0aWMvanMvc2tldGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBO0lBQ3FCLEs7QUFFakIscUJBQWM7QUFBQTs7QUFDVixhQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDSDs7Ozs4QkFFSyxNLEVBQVE7QUFDVixtQkFBTyxVQUFRLEtBQUssRUFBTCxHQUFRLEdBQWhCLENBQVA7QUFDSDs7OzhCQUNLLEcsRUFBSztBQUFFLG1CQUFPLE1BQU0sQ0FBYjtBQUFlOzs7NEJBQ3hCLEssRUFBTztBQUNQLGdCQUFJLEtBQUssWUFBTCxJQUFxQixJQUFyQixJQUE2QixLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsT0FBaUMsTUFBTSxRQUFOLEVBQTlELElBQW1GLEtBQUssS0FBTCxDQUFXLEtBQUssWUFBTCxHQUFvQixJQUEvQixJQUF1QyxJQUF4QyxLQUFtRCxLQUFLLEtBQUwsQ0FBVyxRQUFRLElBQW5CLElBQTJCLElBQXBLLEVBQTJLO0FBQ3ZLLHdCQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0g7QUFDRCxpQkFBSyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0g7QUFDRDs7Ozs7Ozs7dUNBS2UsRyxFQUFLO0FBQ2hCLGdCQUFNLEtBQUssZ0JBQVg7QUFDQSxtQkFBTyxJQUFJLEtBQUosQ0FBVSxFQUFWLEVBQWMsQ0FBZCxDQUFQO0FBQ0g7Ozs7OztrQkF6QmdCLEs7QUEwQnBCOzs7Ozs7Ozs7Ozs7O0FDM0JEOzs7O0lBSXFCLE87QUFDakIscUJBQVksS0FBWixFQUFtQjtBQUFB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UUFBUSxJQUFqQixFQUF1QixRQUF2QixLQUFvQyxDQUFoRDtBQUNBLCtCQUFXLENBQVgsR0FBZSxRQUFRLENBQXZCO0FBQ0EsK0JBQVcsQ0FBWCxHQUFlLFFBQVEsQ0FBdkI7QUFDSDtBQUNKLGFBWEQ7QUFZSCxTQWJEO0FBY0g7O0FBR0Q7O0FBRUE7QUFDQTs7Ozs7O0FBTUEsYUFBUyxhQUFULENBQXVCLElBQXZCLEVBQTZCLFNBQTdCLEVBQXdDLE9BQXhDLEVBQWlELE1BQWpELEVBQXlELElBQXpELEVBQStEO0FBQzNEO0FBQ0EsWUFBTSxZQUFZLENBQUMsSUFBRCxFQUFPLFNBQVAsRUFBa0IsT0FBbEIsQ0FBbEI7QUFDQSxZQUFNLFlBQVksRUFBbEI7QUFDQSxrQkFBVSxPQUFWLENBQW1CLFVBQVUsSUFBVixFQUFnQjtBQUMvQixzQkFBVSxJQUFWLENBQWUsSUFBSSxJQUFKLENBQVMsSUFBVCxFQUFlLE9BQWYsRUFBZjtBQUNILFNBRkQ7QUFHQTtBQUNBLGVBQU8sRUFBRSxHQUFGLENBQU0sVUFBVSxDQUFWLENBQU4sRUFBb0IsVUFBVSxDQUFWLENBQXBCLEVBQWtDLFVBQVUsQ0FBVixDQUFsQyxFQUFnRCxNQUFoRCxFQUF3RCxJQUF4RCxDQUFQO0FBQ0g7QUFDRDtBQUVILEM7O0FBN01EOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTtBQU5BO0FBT0EsR0FBRyxTQUFILENBQWEsVUFBYjs7QUFFQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiLy8gVG9vbHNcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2xzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxvZ1ByZXZWYWx1ZSA9IG51bGxcbiAgICAgICAgdGhpcy5sb2dDb3VudCA9IDBcbiAgICB9XG5cbiAgICBkZTJyYShkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSooTWF0aC5QSS8xODApO1xuICAgIH1cbiAgICBpc09kZChudW0pIHsgcmV0dXJuIG51bSAlIDJ9XG4gICAgTG9nKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmxvZ1ByZXZWYWx1ZSA9PSBudWxsIHx8IHRoaXMubG9nUHJldlZhbHVlLnRvU3RyaW5nKCkgIT09IHZhbHVlLnRvU3RyaW5nKCkgfHwgKE1hdGgucm91bmQodGhpcy5sb2dQcmV2VmFsdWUgKiAxMDAwKSAvIDEwMDApICE9PSAoTWF0aC5yb3VuZCh2YWx1ZSAqIDEwMDApIC8gMTAwMCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ1ByZXZWYWx1ZSA9IHZhbHVlXG4gICAgfVxuICAgIC8qXG4gICAgICogIHNsdWdpZnlVcmxcbiAgICAgKiAgZ2V0IGxhc3QgcGFydCBvZiB1cmxcbiAgICAgKlxuICAgICAqL1xuICAgIGdldExhc3RQYXJ0VXJsKHVybCkge1xuICAgICAgICBjb25zdCByZSA9ICdbXi9dKyg/PVxcLyR8JCknXG4gICAgICAgIHJldHVybiB1cmwubWF0Y2gocmUpWzBdO1xuICAgIH1cbn07XG5cblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEJhc3RvdSBvbiAwNi8wNC8yMDE4LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFydGljbGUge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHByb3BzID0gcHJvcHMgfHwge307IC8vdGhpcyBpcyBkZWZhdWx0IHZhbHVlIGZvciBwYXJhbS5cblxuICAgICAgICAvLyBQNVxuICAgICAgICB0aGlzLnAgPSBwcm9wcy5wO1xuXG4gICAgICAgIC8vIEFydGljbGUgbWV0YXNcbiAgICAgICAgdGhpcy5pZCA9IHByb3BzLmlkO1xuICAgICAgICB0aGlzLmNhdGVnb3J5ID0gcHJvcHMuY2F0ZWdvcnk7XG4gICAgICAgIHRoaXMudGl0bGUgPSBwcm9wcy50aXRsZTtcbiAgICAgICAgdGhpcy5kYXRlID0gcHJvcHMuZGF0ZTtcbiAgICAgICAgdGhpcy51cmwgPSBwcm9wcy51cmw7XG4gICAgICAgIHRoaXMuaHRtbCA9IHByb3BzLmh0bWw7XG5cbiAgICAgICAgLy8gQXJ0aWNsZSBjYW52YXMgc2hhcGVcbiAgICAgICAgdGhpcy54ID0gcHJvcHMueDtcbiAgICAgICAgdGhpcy55ID0gcHJvcHMueTtcbiAgICAgICAgdGhpcy5jb2xvciA9IHByb3BzLmNvbG9yO1xuICAgICAgICB0aGlzLnBDb2xvcjtcblxuICAgICAgICAvLyBBcnRpY2xlIGxpbmUgaWYgY29ubmVjdGVkIHRvIGFub3RoZXIgYXJ0aWNsZVxuICAgICAgICB0aGlzLmhhc0xpbmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5saW5lVG8gPSB7eDowLHk6MH1cblxuICAgICAgICAvLyBwcml2YXRlXG4gICAgICAgIHRoaXMuX3IgPSAxMDtcblxuICAgICAgICAvLyBBcm91bmQgY2lyY2xlc1xuXG4gICAgICAgIC8vIFRPRE86IHB1dCB0aGF0IHN0dWZmIGluIGFuIG9iamVjdCBmdWNrIG9mZlxuICAgICAgICB0aGlzLmFyb3VuZENpcmNsZXNOYiA9IDQ7XG4gICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlUk9mZiA9IDA7XG4gICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlcyA9IG5ldyBBcnJheSh0aGlzLmFyb3VuZENpcmNsZXNOYikuZmlsbCgwKS5tYXAoYyA9PiAoe3g6dGhpcy54LCB5OnRoaXMueSxyOjB9KSk7XG5cbiAgICAgICAgLy8gdGl0bGUgaW4gVmlld1xuICAgICAgICB0aGlzLnVpVGl0bGVBbHBoYSA9IHthOjB9OyAvLyBtdXN0ICBiZSBhbiBvYmplY3QgZm9yIFR3ZWVuXG4gICAgICAgIHRoaXMudWlUaXRsZVAgPSB7XG4gICAgICAgICAgICAnYWxwaGEnOiB7eDowLCB5OjB9LFxuICAgICAgICAgICAgJ2FscGhhVGFyZ2V0Jzoge2E6MjU1fSxcbiAgICAgICAgICAgICd0d2Vlbic6IG5ldyBUV0VFTi5Ud2Vlbih0aGlzLnVpVGl0bGVBbHBoYSlcbiAgICAgICAgICAgICAgICAudG8oe2E6IDI1NX0sIDUwMClcbiAgICAgICAgICAgICAgICAuZWFzaW5nKFRXRUVOLkVhc2luZy5RdWFkcmF0aWMuSW4pXG4gICAgICAgICAgICAgICAgLm9uVXBkYXRlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnVpVGl0bGVBbHBoYS5hKTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICdzdGFydGVkJzogZmFsc2VcbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIGluaXQgKCkge1xuICAgICAgICB0aGlzLnNldFBjb2xvcih0aGlzLmNvbG9yKTtcbiAgICB9XG5cbiAgICBjbGlja2VkKHB4LCBweSkge1xuICAgICAgICBpZih0aGlzLnBvaW50ZXJJbkFydGljbGUocHgscHkpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2tlZCBvbiBhcnRpY2xlJyArICdcIicgKyB0aGlzLnRpdGxlICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBob3ZlcmVkKHB4LCBweSkge1xuICAgICAgICBpZih0aGlzLnBvaW50ZXJJbkFydGljbGUocHgscHkpKSB7XG4gICAgICAgICAgICAvLyB0aXRsZSBpblxuICAgICAgICAgICAgdGhpcy5kcmF3VGl0bGUoKTtcblxuICAgICAgICAgICAgLy8gY2lyY2xlcyBpblxuICAgICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlc0Fyb3VuZCgpXG5cbiAgICAgICAgICAgIHRoaXMucC5jdXJzb3IodGhpcy5wLkhBTkQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGl0bGUgb3V0XG4gICAgICAgICAgICB0aGlzLmRyYXdUaXRsZSh0cnVlKTtcblxuICAgICAgICAgICAgLy8gY2lyY2xlcyBvdXRcbiAgICAgICAgICAgIHRoaXMuZHJhd0NpcmNsZXNBcm91bmQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwb2ludGVySW5BcnRpY2xlKHB4LHB5KSB7XG4gICAgICAgIGxldCBkID0gdGhpcy5wLmRpc3QocHgsIHB5LCB0aGlzLngsIHRoaXMueSk7XG4gICAgICAgIGlmKGQgPCB0aGlzLl9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLnBDb2xvcik7XG4gICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgIHRoaXMucC5lbGxpcHNlKHRoaXMueCwgdGhpcy55LCB0aGlzLl9yKTtcbiAgICAgICAgdGhpcy5wLnBvcCgpO1xuXG4gICAgICAgIGlmKHRoaXMuaGFzTGluZSkge1xuICAgICAgICAgICAgdGhpcy5wLnN0cm9rZSh0aGlzLnBDb2xvcik7XG4gICAgICAgICAgICB0aGlzLnAuc3Ryb2tlV2VpZ2h0KDQpO1xuICAgICAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgICAgIHRoaXMucC5saW5lKHRoaXMueCwgdGhpcy55LCB0aGlzLmxpbmVUby54LCB0aGlzLmxpbmVUby55KTtcbiAgICAgICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyYXdDaXJjbGVzQXJvdW5kKG91dCA9IGZhbHNlKSB7XG4gICAgICAgIGlmKG91dCAmJiB0aGlzLmFyb3VuZENpcmNsZXMuciA9PT0gMCkgcmV0dXJuO1xuICAgICAgICB0aGlzLnAubm9TdHJva2UoKTtcbiAgICAgICAgdGhpcy5wQ29sb3Iuc2V0QWxwaGEoNDApO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLnBDb2xvcik7XG4gICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlcy5mb3JFYWNoKChjLCBpKSA9PiB7XG4gICAgICAgICAgICAvLyBlYXNlIHJhZGl1cyBzaXplXG4gICAgICAgICAgICBpZihvdXQpIHtcbiAgICAgICAgICAgICAgICBjLnIgICs9ICgwIC0gYy5yICkgKiAwLjEzO1xuICAgICAgICAgICAgfSAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlUk9mZiArPSAwLjAwNztcbiAgICAgICAgICAgICAgICBsZXQgbiA9IHRoaXMucC5ub2lzZSh0aGlzLmFyb3VuZENpcmNsZVJPZmYpKjEuNTtcbiAgICAgICAgICAgICAgICBjLnIgICs9ICggKHRoaXMuX3IgKyBuICsgKGkgKiAxMiAqIG4pICkgLSBjLnIgKSAqIDAuMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucC5lbGxpcHNlKGMueCwgYy55LCBjLnIpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnAucG9wKCk7XG4gICAgICAgIHRoaXMucENvbG9yLnNldEFscGhhKDI1NSk7XG4gICAgfVxuXG4gICAgZHJhd1RpdGxlKG91dCA9IGZhbHNlKSB7XG4gICAgICAgIGlmKG91dCkge1xuICAgICAgICAgICAgdGhpcy51aVRpdGxlUC50d2Vlbi5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLnVpVGl0bGVQLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudWlUaXRsZUFscGhhLmEgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmKCF0aGlzLnVpVGl0bGVQLnN0YXJ0ZWQgJiYgIW91dCkge1xuICAgICAgICAgICAgdGhpcy51aVRpdGxlUC50d2Vlbi5zdGFydCgpO1xuICAgICAgICAgICAgdGhpcy51aVRpdGxlUC5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZihvdXQpIHJldHVybjtcbiAgICAgICAgdGhpcy5wQ29sb3Iuc2V0QWxwaGEodGhpcy51aVRpdGxlQWxwaGEuYSk7XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLnBDb2xvcik7XG4gICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgIHRoaXMucC50ZXh0QWxpZ24odGhpcy5wLkNFTlRFUik7XG4gICAgICAgIHRoaXMucC50ZXh0KHRoaXMudGl0bGUsIHRoaXMueCwgdGhpcy55IC0gMzApO1xuICAgICAgICB0aGlzLnAucG9wKCk7XG4gICAgICAgIHRoaXMucENvbG9yLnNldEFscGhhKDI1NSk7XG4gICAgfVxuXG4gICAgc2V0UGNvbG9yKGNvbG9yKSB7XG4gICAgICAgIHRoaXMucENvbG9yID0gdGhpcy5wLmNvbG9yKGNvbG9yKTtcbiAgICB9XG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEJhc3RvdSBvbiAwNi8wNC8yMDE4LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhdGVnb3J5IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICAvLyBwNVxuICAgICAgICB0aGlzLnAgPSBwcm9wcy5wO1xuXG4gICAgICAgIC8vIFByb3BzXG4gICAgICAgIHRoaXMuaWQgPSBwcm9wcy5pZDtcbiAgICAgICAgdGhpcy5jb2xvciA9IHByb3BzLmNvbG9yO1xuICAgICAgICB0aGlzLnBDb2xvciA9IG51bGw7XG4gICAgICAgIHRoaXMucG9zWSA9IHByb3BzLnBvc1k7XG4gICAgICAgIHRoaXMucG9zID0gcHJvcHMucG9zO1xuXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Nob3cnKTtcbiAgICB9XG59IiwiLypcbiBEcmF3IGRhc2hlZCBsaW5lcyB3aGVyZVxuIChsID0gbGVuZ3RoIG9mIGRhc2hlZCBsaW5lIGluIHB4LCBnID0gZ2FwIGluIHB4KVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIsIGwsIGcpIHtcbiAgICBjb25zdCBwYyA9IHRoaXMuZGlzdCh4MSwgeTEsIHgyLCB5MikgLyAxMDA7XG4gICAgbGV0IHBjQ291bnQgPSAxO1xuICAgIGxldCBsUGVyY2VudCwgZ1BlcmNlbnQgPSAwO1xuICAgIGxldCBjdXJyZW50UG9zID0gMDtcbiAgICBsZXQgeHgxLCB5eTEsIHh4MiwgeXkyID0gMDtcblxuICAgIHdoaWxlICh0aGlzLmludChwY0NvdW50ICogcGMpIDwgbCkge1xuICAgICAgICBwY0NvdW50KytcbiAgICB9XG4gICAgbFBlcmNlbnQgPSBwY0NvdW50O1xuICAgIHBjQ291bnQgPSAxO1xuICAgIHdoaWxlICh0aGlzLmludChwY0NvdW50ICogcGMpIDwgZykge1xuICAgICAgICBwY0NvdW50KytcbiAgICB9XG4gICAgZ1BlcmNlbnQgPSBwY0NvdW50O1xuXG4gICAgbFBlcmNlbnQgPSBsUGVyY2VudCAvIDEwMDtcbiAgICBnUGVyY2VudCA9IGdQZXJjZW50IC8gMTAwO1xuICAgIHdoaWxlIChjdXJyZW50UG9zIDwgMSkge1xuICAgICAgICB4eDEgPSB0aGlzLmxlcnAoeDEsIHgyLCBjdXJyZW50UG9zKTtcbiAgICAgICAgeXkxID0gdGhpcy5sZXJwKHkxLCB5MiwgY3VycmVudFBvcyk7XG4gICAgICAgIHh4MiA9IHRoaXMubGVycCh4MSwgeDIsIGN1cnJlbnRQb3MgKyBsUGVyY2VudCk7XG4gICAgICAgIHl5MiA9IHRoaXMubGVycCh5MSwgeTIsIGN1cnJlbnRQb3MgKyBsUGVyY2VudCk7XG4gICAgICAgIGlmICh4MSA+IHgyKSB7XG4gICAgICAgICAgICBpZiAoeHgyIDwgeDIpIHtcbiAgICAgICAgICAgICAgICB4eDIgPSB4MjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoeDEgPCB4Mikge1xuICAgICAgICAgICAgaWYgKHh4MiA+IHgyKSB7XG4gICAgICAgICAgICAgICAgeHgyID0geDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkxID4geTIpIHtcbiAgICAgICAgICAgIGlmICh5eTIgPCB5Mikge1xuICAgICAgICAgICAgICAgIHl5MiA9IHkyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh5MSA8IHkyKSB7XG4gICAgICAgICAgICBpZiAoeXkyID4geTIpIHtcbiAgICAgICAgICAgICAgICB5eTIgPSB5MjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGluZSh4eDEsIHl5MSwgeHgyLCB5eTIpO1xuICAgICAgICBjdXJyZW50UG9zID0gY3VycmVudFBvcyArIGxQZXJjZW50ICsgZ1BlcmNlbnQ7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEJhc3RvdSBvbiAwOS8wNC8yMDE4LlxuICovXG5cbmNvbnN0IGRhdGFzID0ge1xuICAgICdtb250aHMnOiBbJ1NFUC4nLCdPQ1QuJywnTk9WLicsJ0RFQy4nLCdKQU4uJywnRkVCLicsJ01BUi4nLCdBUFIuJ10sXG4gICAgJ2RhdGVSYW5nZSc6IFtcbiAgICAgICAgJzIwMTctMDktMDFUMDA6MDA6MDAnLFxuICAgICAgICAnMjAxOC0wNC0wMVQwMDowMDowMCdcbiAgICBdLFxuICAgICdjb2xvcnMnOiB7XG4gICAgICAgICdwYWxlSWxhYyc6ICdyZ2JhKDIyOSwgMjI3LCAyNTUpJyxcbiAgICAgICAgJ3BhbGVJbGFjVHJhbnNwYXJlbnQnOiAncmdiYSgyMjksIDIyNywgMjU1LCAwLjIpJyxcbiAgICAgICAgJ2RhcmtCbHVlR3JleSc6ICdyZ2IoMjIsIDIwLCA1OSknLFxuICAgICAgICAnZGFya1NlYWZvYW0nOiAncmdiKDM2LCAxODEsIDEzMSknLFxuICAgICAgICAnYnJpZ2h0U2t5Qmx1ZSc6ICdyZ2IoNCwgMTkwLCAyNTQpJyxcbiAgICAgICAgJ3JlZFBpbmsnOiAncmdiKDI0OCwgNDQsIDEwMyknLFxuICAgICAgICAncGFsZVllbGxvdyc6ICdyZ2IoMjUwLCAyNTUsIDEzMSknXG4gICAgfSxcbiAgICAnY2F0ZWdvcmllcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2Vjb2xvZ3knLFxuICAgICAgICAgICAgJ2NvbG9yJzogJ3JnYigzNiwgMTgxLCAxMzEpJywgLy8gZGFya1NlYWZvYW1cbiAgICAgICAgICAgICdwb3MnOiAxXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdob3VzZScsXG4gICAgICAgICAgICAnY29sb3InOiAncmdiKDQsIDE5MCwgMjU0KScsIC8vIGJyaWdodFNreUJsdWVcbiAgICAgICAgICAgICdwb3MnOiAyXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdzZWN1cml0eScsXG4gICAgICAgICAgICAnY29sb3InOiAncmdiKDI0OCwgNDQsIDEwMyknLCAvLyByZWRQaW5rXG4gICAgICAgICAgICAncG9zJzogM1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnY29tZm9ydCcsXG4gICAgICAgICAgICAnY29sb3InOiAncmdiKDI1MCwgMjU1LCAxMzEpJywgLy8gYnJpZ2h0U2t5Qmx1ZVxuICAgICAgICAgICAgJ3Bvcyc6IDRcbiAgICAgICAgfVxuICAgIF1cbn07XG5leHBvcnQgZGVmYXVsdCBkYXRhcztcbiIsIi8vaW1wb3J0IHsgZ2VuZXJhdGVSYW5kb20sIHN1bSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHNrZXRjaCBmcm9tICcuL3NrZXRjaCc7XG5pbXBvcnQgVG9vbHMgZnJvbSAnLi9Ub29scyc7XG5cblxuLy8gZ2xvYmFsIHRvb2xzXG53aW5kb3cudG9vbHMgPSBuZXcgVG9vbHMoKTtcblxuXG5uZXcgcDUoc2tldGNoLCAndGltZWxpbmUnKTtcblxuIiwiLy9pbXBvcnQgQnViYmxlIGZyb20gJy4vYnViYmxlJztcbmltcG9ydCBkYXNoZWRMaW5lIGZyb20gJy4vZGFzaGVkTGluZSc7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tICcuL2FydGljbGUnO1xuaW1wb3J0IGRhdGFzIGZyb20gJy4vZGF0YXMnO1xuaW1wb3J0IENhdGVnb3J5IGZyb20gJy4vY2F0ZWdvcnknO1xuXG4vLyBBZGQgZXh0ZW5zaW9uIHRvIFA1XG5wNS5wcm90b3R5cGUuZGFzaGVkTGluZSA9IGRhc2hlZExpbmU7XG5cbi8vIFNldHVwIHRpbWVsaW5lXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiggcCApIHtcblxuICAgIC8vIFRJTUVMSU5FIENPTkZJR1MgLy8vLy8vLy8vXG4gICAgY29uc3QgcGFkZGluZyA9IFswLCA4MF07XG4gICAgbGV0IFcgPSBwLndpbmRvd1dpZHRoO1xuICAgIGxldCBIID0gcC53aW5kb3dIZWlnaHQ7XG4gICAgY29uc3QgY2F0UG9zWSA9IFtcbiAgICAgICAgKEgvNCArIDQ1KSxcbiAgICAgICAgKEgvMyArIDQ1KSxcbiAgICAgICAgKEggLSBILzQgLSA0NSksXG4gICAgICAgIChIIC0gSC8zIC0gNDUpXG4gICAgXTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGxldCBQY29sb3JzID0gT2JqZWN0LmtleXMoZGF0YXMuY29sb3JzKS5yZWR1Y2UoZnVuY3Rpb24ocHJldmlvdXMsIGN1cnJlbnQpIHtcbiAgICAgICAgcHJldmlvdXNbY3VycmVudF0gPSBwLmNvbG9yKGRhdGFzLmNvbG9yc1tjdXJyZW50XSk7XG4gICAgICAgIHJldHVybiBwcmV2aW91cztcbiAgICB9LCB7fSk7XG5cbiAgICBsZXQgY2F0ZWdvcmllcyA9IFtdO1xuICAgIC8vIFBhcnNlIGNhdGVnb3JpZXNcbiAgICBkYXRhcy5jYXRlZ29yaWVzLmZvckVhY2goKGMpID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRDYXQgPSBuZXcgQ2F0ZWdvcnkoT2JqZWN0LmFzc2lnbihjLHtwfSkpO1xuICAgICAgICBjdXJyZW50Q2F0LnBvc1kgPSBjYXRQb3NZW2MucG9zIC0gMV07IC8vIFNldCBZIHBvc1xuICAgICAgICBjYXRlZ29yaWVzLnB1c2goY3VycmVudENhdCk7XG4gICAgfSk7XG5cbiAgICAvLyBjYXRlZ29yaWVzID0gZGF0YXMuY2F0ZWdvcmllcy5tYXAoYyA9PiB7XG4gICAgLy8gICAgIHJldHVybiBuZXcgQ2F0ZWdvcnkoT2JqZWN0LmFzc2lnbihjLHtwfSkpO1xuICAgIC8vIH0pO1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGxldCBhcnRpY2xlcyA9IFtdO1xuICAgIC8vIEVORCBUSU1FTElORSBDT05GSUdTIC8vLy8vLy8vL1xuXG4gICAgbGV0IGN2ID0gbnVsbDtcblxuICAgIHAucHJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBHZXQgYWxsIGFydGljbGVzIGZyb20gZ2VuZXJhdGVkIGh1Z28ganNvblxuICAgICAgICBjb25zdCB1cmwgPSAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyAnL2FydGljbGVzL2luZGV4Lmpzb24nO1xuICAgICAgICBwLmxvYWRKU09OKHVybCwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuYXJ0aWNsZXMuZm9yRWFjaCggKGFydGljbGUsIGtleSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJ0aWNsZUNhdGVnb3J5ID0gY2F0ZWdvcmllcy5maWx0ZXIoIChlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuaWQgPT09IGFydGljbGUuY2F0ZWdvcmllc1swXVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhcnRpY2xlQ2F0ZWdvcnlbMF0ucG9zWSk7XG5cbiAgICAgICAgICAgICAgICBhcnRpY2xlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBuZXcgQXJ0aWNsZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwOiBwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRvb2xzLmdldExhc3RQYXJ0VXJsKGFydGljbGUudXJsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBhcnRpY2xlLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGFydGljbGUuY2F0ZWdvcmllc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGFydGljbGUuZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYXJ0aWNsZS51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sOiBhcnRpY2xlWydjb250ZW50X2h0bWwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhcnRpY2xlQ2F0ZWdvcnlbMF0uY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBtYWtlIGluIGFydGljbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHNldERhdGVUb1Bvc1goYXJ0aWNsZS5kYXRlLGRhdGFzLmRhdGVSYW5nZVswXSxkYXRhcy5kYXRlUmFuZ2VbMV0scGFkZGluZ1sxXSwgVyAtIHBhZGRpbmdbMV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJ0aWNsZUNhdGVnb3J5WzBdLnBvc1lcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGFydGljbGVzW2tleV0uaW5pdCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGVzW2tleV0uY29sb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU29ydCBhcnRpY2xlc1xuICAgICAgICBhcnRpY2xlcy5zb3J0KGZ1bmN0aW9uKGEsYikge1xuICAgICAgICAgICAgbGV0IHNvcnRQYXJhbSA9ICdkYXRlJztcbiAgICAgICAgICAgIHJldHVybiAoYVtzb3J0UGFyYW1dID4gYltzb3J0UGFyYW1dKSA/IDEgOiAoKGJbc29ydFBhcmFtXSA+IGFbc29ydFBhcmFtXSkgPyAtMSA6IDApXG4gICAgICAgIH0pXG4gICAgfTtcblxuICAgIHAuc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY3YgPSBwLmNyZWF0ZUNhbnZhcyhXLCBIKTtcbiAgICAgICAgY3YubW91c2VQcmVzc2VkKGN2TW91c2VQcmVzc2VkKTtcblxuXG4gICAgICAgIC8vIFRPRE86IG1vdmUgYXdheVxuICAgICAgICBzZXR1cEFydGljbGVzTGluZXMoKTtcbiAgICB9O1xuXG4gICAgcC5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vcC5iYWNrZ3JvdW5kKCcjMDIwMTI2Jyk7XG4gICAgICAgIHAuY2xlYXIoKTtcblxuICAgICAgICAvLyBDVVJTT1IgU1RBVEVcbiAgICAgICAgcC5jdXJzb3IocC5BUlJPVyk7XG5cbiAgICAgICAgLy8vLy8vLyBNT05USFMgLy8vLy8vLy9cblxuICAgICAgICAvLyBNb250aHMgbGluZVxuICAgICAgICBwLnN0cm9rZShQY29sb3JzLnBhbGVJbGFjVHJhbnNwYXJlbnQpO1xuICAgICAgICBwLnN0cm9rZVdlaWdodCgxKTtcblxuICAgICAgICAvLyBNb250aHNcbiAgICAgICAgcC5saW5lKHBhZGRpbmdbMV0sIEgvMiwgVy1wYWRkaW5nWzFdLCBILzIpO1xuICAgICAgICBmb3IgKGxldCBpPTA7aTxkYXRhcy5tb250aHMubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgbGV0IGFtdCA9ICggaS8oZGF0YXMubW9udGhzLmxlbmd0aCAtIDEpICkgKiAxO1xuICAgICAgICAgICAgbGV0IG1vbnRoWCA9IHAubGVycChwYWRkaW5nWzFdLCBXLXBhZGRpbmdbMV0sIGFtdCk7XG4gICAgICAgICAgICBsZXQgdGV4dE9mZmVzdCA9ICgoaSsxKSAlIDIgPT0gMCkgPyAzMCA6IC0yMDtcblxuICAgICAgICAgICAgLy8gY2lyY2xlIGFuZCB2ZXJ0aWNhbCBkYXNoIGxpbmVcbiAgICAgICAgICAgIGlmKGkgIT09IDAgJiYgaSAhPT0gZGF0YXMubW9udGhzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBwLmVsbGlwc2UobW9udGhYLCBILzIsIDkpO1xuICAgICAgICAgICAgICAgIHAuc3Ryb2tlKFBjb2xvcnMucGFsZUlsYWNUcmFuc3BhcmVudCk7XG4gICAgICAgICAgICAgICAgcC5kYXNoZWRMaW5lKG1vbnRoWCxILzQsbW9udGhYLEgtSC80LDEsMTUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0ZXh0XG4gICAgICAgICAgICBwLm5vU3Ryb2tlKCk7XG4gICAgICAgICAgICBwLmZpbGwoUGNvbG9ycy5wYWxlSWxhYyk7XG4gICAgICAgICAgICBwLnB1c2goKTtcbiAgICAgICAgICAgIHAudGV4dEFsaWduKHAuQ0VOVEVSKTtcbiAgICAgICAgICAgIHAudGV4dChkYXRhcy5tb250aHNbaV0sIG1vbnRoWCwgSC8yK3RleHRPZmZlc3QpO1xuICAgICAgICB9XG4gICAgICAgIHAucG9wKCk7XG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvLy8vLy8vIEFSVElDTEVTIC8vLy8vLy8vXG4gICAgICAgIGFydGljbGVzLmZvckVhY2goIGZ1bmN0aW9uIChhcnRpY2xlKSB7XG4gICAgICAgICAgICBhcnRpY2xlLmhvdmVyZWQocC5tb3VzZVgscC5tb3VzZVkpO1xuICAgICAgICAgICAgYXJ0aWNsZS5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gVFdFRU5TIC8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICBUV0VFTi51cGRhdGUoKTtcblxuICAgIH07XG5cbiAgICBwLndpbmRvd1Jlc2l6ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFcgPSBwLndpbmRvd1dpZHRoO1xuICAgICAgICBIID0gcC53aW5kb3dIZWlnaHQ7XG4gICAgICAgIHAucmVzaXplQ2FudmFzKFcsIEgpO1xuXG4gICAgICAgIC8vIFRPRE86IHJlLWNhbGN1bCBhcnRpY2xlIHBvc1xuICAgIH07XG5cbiAgICAvLyBJTlRFUkFDVElPTlMgLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICBmdW5jdGlvbiBjdk1vdXNlUHJlc3NlZCAoKSB7XG4gICAgICAgIGFydGljbGVzLmZvckVhY2goIGZ1bmN0aW9uIChhcnRpY2xlKSB7XG4gICAgICAgICAgICBhcnRpY2xlLmNsaWNrZWQocC5tb3VzZVgscC5tb3VzZVkpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIExlcyB0cmFpdHMgIVxuICAgIC8vIFRPRE86IGluIGNsYXNzIGFydGljbGVzTWFuYWdlciA/XG4gICAgZnVuY3Rpb24gc2V0dXBBcnRpY2xlc0xpbmVzKCkge1xuICAgICAgICBsZXQgbGFzdE1vbnRoID0gMDtcbiAgICAgICAgbGV0IGxhc3RDb29yZHMgPSB7eDowLHk6MH07XG5cbiAgICAgICAgZGF0YXMuY2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcbiAgICAgICAgICAgIGFydGljbGVzLmZvckVhY2goYXJ0aWNsZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoYXJ0aWNsZS5jYXRlZ29yeSA9PT0gY2F0ZWdvcnkuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYobGFzdE1vbnRoID09PSBuZXcgRGF0ZShhcnRpY2xlLmRhdGUpLmdldE1vbnRoKCkgKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpY2xlLmhhc0xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZS5saW5lVG8ueCA9IGxhc3RDb29yZHMueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFydGljbGUubGluZVRvLnkgPSBsYXN0Q29vcmRzLnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vbnRoID0gbmV3IERhdGUoYXJ0aWNsZS5kYXRlKS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdENvb3Jkcy54ID0gYXJ0aWNsZS54O1xuICAgICAgICAgICAgICAgICAgICBsYXN0Q29vcmRzLnkgPSBhcnRpY2xlLnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gVEVNUCBVVElMUyAvLy8vLy8vLy9cblxuICAgIC8vIFRPRE86IGFkZCB0byBhcnRpY2xlc01hbmFnZXIgP1xuICAgIC8qXG4gICAgICogIGRhdGVUb1Bvc1hcbiAgICAgKlxuICAgICAqICBUcmFuc2Zvcm0gdGltZXN0YW1wIHRvIHBvc2l0aW9uIGluIHBpeGVsICB3aXRoaW4gYSByYW5nZVxuICAgICAqICByZXR1cm4gcG9zaXRpb24gaW4gcGl4ZWxzIChpbnQpXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0RGF0ZVRvUG9zWChkYXRlLCBiZWdpbkRhdGUsIEVuZERhdGUsIGJlZ2luWCwgZW5kWCkge1xuICAgICAgICAvLyBEYXRlIFRyYW5zZm9ybVxuICAgICAgICBjb25zdCBkYXRlQXJyYXkgPSBbZGF0ZSwgYmVnaW5EYXRlLCBFbmREYXRlXTtcbiAgICAgICAgY29uc3QgZGF0ZVRpbWVzID0gW107XG4gICAgICAgIGRhdGVBcnJheS5mb3JFYWNoKCBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICAgICAgZGF0ZVRpbWVzLnB1c2gobmV3IERhdGUoZGF0ZSkuZ2V0VGltZSgpKVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmV0dXJuIHBvcyBpbiBwaXhlbFxuICAgICAgICByZXR1cm4gcC5tYXAoZGF0ZVRpbWVzWzBdLCBkYXRlVGltZXNbMV0sIGRhdGVUaW1lc1syXSwgYmVnaW5YLCBlbmRYKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxufSJdfQ==
