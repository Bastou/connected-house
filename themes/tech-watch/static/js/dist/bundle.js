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
        this.darkened = false;

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
            if (this.darkened) {
                this.pColor.setAlpha(40);
            }
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
            this.p.textAlign(this.p.CENTER);
            this.p.textSize(14);
            this.p.push();
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

        this._r = 16;
        this.x;
        this.y;
        this.bbox = {};

        this.textFont;

        this.isHovered = false;

        this.isClicked = false;
    }

    _createClass(Category, [{
        key: 'init',
        value: function init() {
            this.setPcolor(this.color);
            this.setPos(this.pos);
            this.setBbox();
        }
    }, {
        key: 'show',
        value: function show() {
            this.p.noStroke();
            this.p.fill(this.pColor);
            this.p.push();
            this.p.ellipse(this.x, this.y, this._r);
            this.p.pop();

            this.p.fill('white');
            this.p.textSize(20);
            this.p.textAlign(this.p.LEFT);
            this.p.push();
            this.p.text(this.id, this.x + 25, this.y + this._r / 3);
            this.p.pop();
        }
    }, {
        key: 'hovered',
        value: function hovered(px, py) {
            if (this.pointerInCategory(px, py)) {
                console.log('hovered', this.id);
                this.p.cursor(this.p.HAND);
                this.isHovered = true;
            } else {
                this.isHovered = false;
            }
        }
    }, {
        key: 'clicked',
        value: function clicked(px, py) {
            if (this.pointerInCategory(px, py)) {
                console.log('click', this.id);
                this.isClicked = true;
            }
        }
    }, {
        key: 'pointerInCategory',
        value: function pointerInCategory(px, py) {
            if (px >= this.bbox.x && px <= this.bbox.x + this.bbox.w && py >= this.bbox.y && py <= this.bbox.y + this.bbox.h) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'setPcolor',
        value: function setPcolor(color) {
            this.pColor = this.p.color(color);
        }
    }, {
        key: 'setPos',
        value: function setPos(pos) {
            this.x = this.p.windowWidth / 2 - 540 + (200 * pos - 1);
            this.y = this.p.windowHeight - this.p.windowHeight / 4 + 40;
        }
    }, {
        key: 'setBbox',
        value: function setBbox() {
            this.bbox = {
                x: this.x - this._r / 2,
                y: this.y - this._r / 2,
                w: 150,
                h: this._r
            };
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
    var catPosY = [H / 4 + 45, H / 3 + 45, H - H / 3 - 45, H - H / 4 - 45];
    var font = void 0;
    var states = {
        'categorySelected': false

        /////////////////////////

    };var Pcolors = Object.keys(_datas2.default.colors).reduce(function (previous, current) {
        previous[current] = p.color(_datas2.default.colors[current]);
        return previous;
    }, {});

    var categories = [];
    // Parse categories
    _datas2.default.categories.forEach(function (c, key) {
        var currentCat = new _category2.default(Object.assign(c, { p: p }));
        currentCat.posY = catPosY[c.pos - 1]; // Set Y pos
        categories.push(currentCat);
        categories[key].init();
    });

    // categories = datas.categories.map(c => {
    //     return new Category(Object.assign(c,{p}));
    // });
    /////////////////////////

    var articles = [];
    // END TIMELINE CONFIGS /////////

    var cv = null;

    p.preload = function () {

        // Load font
        font = p.loadFont('./font/karla.ttf');

        // Get all articles from generated hugo json
        var url = '//' + window.location.host + '/articles/index.json';
        p.loadJSON(url, function (data) {
            data.articles.forEach(function (article, key) {
                var articleCategory = categories.filter(function (el) {
                    return el.id === article.categories[0];
                });

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

        // FONT
        p.textFont(font);

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
            p.textSize(14);
            p.textAlign(p.CENTER);
            p.push();
            p.text(_datas2.default.months[i], monthX, H / 2 + textOffest);
        }
        p.pop();
        /////////////////////////

        /////// CATEGORIES ////////
        categories.forEach(function (category) {
            category.hovered(p.mouseX, p.mouseY);
            category.show();

            // click
            if (category.isClicked) {
                categories.forEach(function (category) {
                    category.isClicked = false;
                });
                category.isClicked = true;
            }

            if (category.isClicked) {
                states.categorySelected = true;
                filterArticles(category);
            } else {
                states.categorySelected = false;
            }

            // hover
            if (category.isHovered) {
                filterArticles(category);
            }

            // select state
            if (category.isHovered || category.isClicked) {
                states.categorySelected = true;
            } else {
                states.categorySelected = false;
            }

            p.text(category.id + ': ' + states.categorySelected, 20, 200 + 20 * category.pos);
        });
        /////////////////////////


        /////// ARTICLES ////////
        articles.forEach(function (article) {
            article.hovered(p.mouseX, p.mouseY);
            article.show();
            if (!states.categorySelected) {
                article.darkened = false;
            }
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
        categories.forEach(function (category) {
            category.isClicked = false;
            category.clicked(p.mouseX, p.mouseY);
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

    function filterArticles(category) {
        articles.forEach(function (article) {
            if (article.category !== category.id) {
                article.darkened = true;
            } else {
                article.darkened = false;
            }
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvanMvVG9vbHMuanMiLCJzdGF0aWMvanMvYXJ0aWNsZS5qcyIsInN0YXRpYy9qcy9jYXRlZ29yeS5qcyIsInN0YXRpYy9qcy9kYXNoZWRMaW5lLmpzIiwic3RhdGljL2pzL2RhdGFzLmpzIiwic3RhdGljL2pzL21haW4uanMiLCJzdGF0aWMvanMvc2tldGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBO0lBQ3FCLEs7QUFFakIscUJBQWM7QUFBQTs7QUFDVixhQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDSDs7Ozs4QkFFSyxNLEVBQVE7QUFDVixtQkFBTyxVQUFRLEtBQUssRUFBTCxHQUFRLEdBQWhCLENBQVA7QUFDSDs7OzhCQUNLLEcsRUFBSztBQUFFLG1CQUFPLE1BQU0sQ0FBYjtBQUFlOzs7NEJBQ3hCLEssRUFBTztBQUNQLGdCQUFJLEtBQUssWUFBTCxJQUFxQixJQUFyQixJQUE2QixLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsT0FBaUMsTUFBTSxRQUFOLEVBQTlELElBQW1GLEtBQUssS0FBTCxDQUFXLEtBQUssWUFBTCxHQUFvQixJQUEvQixJQUF1QyxJQUF4QyxLQUFtRCxLQUFLLEtBQUwsQ0FBVyxRQUFRLElBQW5CLElBQTJCLElBQXBLLEVBQTJLO0FBQ3ZLLHdCQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0g7QUFDRCxpQkFBSyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0g7QUFDRDs7Ozs7Ozs7dUNBS2UsRyxFQUFLO0FBQ2hCLGdCQUFNLEtBQUssZ0JBQVg7QUFDQSxtQkFBTyxJQUFJLEtBQUosQ0FBVSxFQUFWLEVBQWMsQ0FBZCxDQUFQO0FBQ0g7Ozs7OztrQkF6QmdCLEs7QUEwQnBCOzs7Ozs7Ozs7Ozs7O0FDM0JEOzs7O0lBSXFCLE87QUFDakIscUJBQVksS0FBWixFQUFtQjtBQUFB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LEVBQW1CO0FBQ2pDLGdCQUFHLFFBQVEsUUFBUixLQUFxQixTQUFTLEVBQWpDLEVBQXFDO0FBQ2pDLHdCQUFRLFFBQVIsR0FBbUIsSUFBbkI7QUFDSCxhQUZELE1BRU87QUFDSCx3QkFBUSxRQUFSLEdBQW1CLEtBQW5CO0FBQ0g7QUFDSixTQU5EO0FBT0g7QUFDRDtBQUVILEM7O0FBM1FEOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTtBQU5BO0FBT0EsR0FBRyxTQUFILENBQWEsVUFBYjs7QUFFQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiLy8gVG9vbHNcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2xzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxvZ1ByZXZWYWx1ZSA9IG51bGxcbiAgICAgICAgdGhpcy5sb2dDb3VudCA9IDBcbiAgICB9XG5cbiAgICBkZTJyYShkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSooTWF0aC5QSS8xODApO1xuICAgIH1cbiAgICBpc09kZChudW0pIHsgcmV0dXJuIG51bSAlIDJ9XG4gICAgTG9nKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmxvZ1ByZXZWYWx1ZSA9PSBudWxsIHx8IHRoaXMubG9nUHJldlZhbHVlLnRvU3RyaW5nKCkgIT09IHZhbHVlLnRvU3RyaW5nKCkgfHwgKE1hdGgucm91bmQodGhpcy5sb2dQcmV2VmFsdWUgKiAxMDAwKSAvIDEwMDApICE9PSAoTWF0aC5yb3VuZCh2YWx1ZSAqIDEwMDApIC8gMTAwMCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ1ByZXZWYWx1ZSA9IHZhbHVlXG4gICAgfVxuICAgIC8qXG4gICAgICogIHNsdWdpZnlVcmxcbiAgICAgKiAgZ2V0IGxhc3QgcGFydCBvZiB1cmxcbiAgICAgKlxuICAgICAqL1xuICAgIGdldExhc3RQYXJ0VXJsKHVybCkge1xuICAgICAgICBjb25zdCByZSA9ICdbXi9dKyg/PVxcLyR8JCknXG4gICAgICAgIHJldHVybiB1cmwubWF0Y2gocmUpWzBdO1xuICAgIH1cbn07XG5cblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEJhc3RvdSBvbiAwNi8wNC8yMDE4LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFydGljbGUge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHByb3BzID0gcHJvcHMgfHwge307IC8vdGhpcyBpcyBkZWZhdWx0IHZhbHVlIGZvciBwYXJhbS5cblxuICAgICAgICAvLyBQNVxuICAgICAgICB0aGlzLnAgPSBwcm9wcy5wO1xuXG4gICAgICAgIC8vIEFydGljbGUgbWV0YXNcbiAgICAgICAgdGhpcy5pZCA9IHByb3BzLmlkO1xuICAgICAgICB0aGlzLmNhdGVnb3J5ID0gcHJvcHMuY2F0ZWdvcnk7XG4gICAgICAgIHRoaXMudGl0bGUgPSBwcm9wcy50aXRsZTtcbiAgICAgICAgdGhpcy5kYXRlID0gcHJvcHMuZGF0ZTtcbiAgICAgICAgdGhpcy51cmwgPSBwcm9wcy51cmw7XG4gICAgICAgIHRoaXMuaHRtbCA9IHByb3BzLmh0bWw7XG5cbiAgICAgICAgLy8gQXJ0aWNsZSBjYW52YXMgc2hhcGVcbiAgICAgICAgdGhpcy54ID0gcHJvcHMueDtcbiAgICAgICAgdGhpcy55ID0gcHJvcHMueTtcbiAgICAgICAgdGhpcy5jb2xvciA9IHByb3BzLmNvbG9yO1xuICAgICAgICB0aGlzLnBDb2xvcjtcbiAgICAgICAgdGhpcy5kYXJrZW5lZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIEFydGljbGUgbGluZSBpZiBjb25uZWN0ZWQgdG8gYW5vdGhlciBhcnRpY2xlXG4gICAgICAgIHRoaXMuaGFzTGluZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxpbmVUbyA9IHt4OjAseTowfVxuXG4gICAgICAgIC8vIHByaXZhdGVcbiAgICAgICAgdGhpcy5fciA9IDEwO1xuXG4gICAgICAgIC8vIEFyb3VuZCBjaXJjbGVzXG5cbiAgICAgICAgLy8gVE9ETzogcHV0IHRoYXQgc3R1ZmYgaW4gYW4gb2JqZWN0IGZ1Y2sgb2ZmXG4gICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlc05iID0gNDtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVST2ZmID0gMDtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVzID0gbmV3IEFycmF5KHRoaXMuYXJvdW5kQ2lyY2xlc05iKS5maWxsKDApLm1hcChjID0+ICh7eDp0aGlzLngsIHk6dGhpcy55LHI6MH0pKTtcblxuICAgICAgICAvLyB0aXRsZSBpbiBWaWV3XG4gICAgICAgIHRoaXMudWlUaXRsZUFscGhhID0ge2E6MH07IC8vIG11c3QgIGJlIGFuIG9iamVjdCBmb3IgVHdlZW5cbiAgICAgICAgdGhpcy51aVRpdGxlUCA9IHtcbiAgICAgICAgICAgICdhbHBoYSc6IHt4OjAsIHk6MH0sXG4gICAgICAgICAgICAnYWxwaGFUYXJnZXQnOiB7YToyNTV9LFxuICAgICAgICAgICAgJ3R3ZWVuJzogbmV3IFRXRUVOLlR3ZWVuKHRoaXMudWlUaXRsZUFscGhhKVxuICAgICAgICAgICAgICAgIC50byh7YTogMjU1fSwgNTAwKVxuICAgICAgICAgICAgICAgIC5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YWRyYXRpYy5JbilcbiAgICAgICAgICAgICAgICAub25VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMudWlUaXRsZUFscGhhLmEpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgJ3N0YXJ0ZWQnOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgaW5pdCAoKSB7XG4gICAgICAgIHRoaXMuc2V0UGNvbG9yKHRoaXMuY29sb3IpO1xuICAgIH1cblxuICAgIGNsaWNrZWQocHgsIHB5KSB7XG4gICAgICAgIGlmKHRoaXMucG9pbnRlckluQXJ0aWNsZShweCxweSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGlja2VkIG9uIGFydGljbGUnICsgJ1wiJyArIHRoaXMudGl0bGUgKyAnXCInKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhvdmVyZWQocHgsIHB5KSB7XG4gICAgICAgIGlmKHRoaXMucG9pbnRlckluQXJ0aWNsZShweCxweSkpIHtcbiAgICAgICAgICAgIC8vIHRpdGxlIGluXG4gICAgICAgICAgICB0aGlzLmRyYXdUaXRsZSgpO1xuXG4gICAgICAgICAgICAvLyBjaXJjbGVzIGluXG4gICAgICAgICAgICB0aGlzLmRyYXdDaXJjbGVzQXJvdW5kKClcblxuICAgICAgICAgICAgdGhpcy5wLmN1cnNvcih0aGlzLnAuSEFORCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXRsZSBvdXRcbiAgICAgICAgICAgIHRoaXMuZHJhd1RpdGxlKHRydWUpO1xuXG4gICAgICAgICAgICAvLyBjaXJjbGVzIG91dFxuICAgICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlc0Fyb3VuZCh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvaW50ZXJJbkFydGljbGUocHgscHkpIHtcbiAgICAgICAgbGV0IGQgPSB0aGlzLnAuZGlzdChweCwgcHksIHRoaXMueCwgdGhpcy55KTtcbiAgICAgICAgaWYoZCA8IHRoaXMuX3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5wLm5vU3Ryb2tlKCk7XG4gICAgICAgIGlmKHRoaXMuZGFya2VuZWQpIHtcbiAgICAgICAgICAgIHRoaXMucENvbG9yLnNldEFscGhhKDQwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLnBDb2xvcik7XG4gICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgIHRoaXMucC5lbGxpcHNlKHRoaXMueCwgdGhpcy55LCB0aGlzLl9yKTtcbiAgICAgICAgdGhpcy5wLnBvcCgpO1xuXG4gICAgICAgIGlmKHRoaXMuaGFzTGluZSkge1xuICAgICAgICAgICAgdGhpcy5wLnN0cm9rZSh0aGlzLnBDb2xvcik7XG4gICAgICAgICAgICB0aGlzLnAuc3Ryb2tlV2VpZ2h0KDQpO1xuICAgICAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgICAgIHRoaXMucC5saW5lKHRoaXMueCwgdGhpcy55LCB0aGlzLmxpbmVUby54LCB0aGlzLmxpbmVUby55KTtcbiAgICAgICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyYXdDaXJjbGVzQXJvdW5kKG91dCA9IGZhbHNlKSB7XG4gICAgICAgIGlmKG91dCAmJiB0aGlzLmFyb3VuZENpcmNsZXMuciA9PT0gMCkgcmV0dXJuO1xuICAgICAgICB0aGlzLnAubm9TdHJva2UoKTtcbiAgICAgICAgdGhpcy5wQ29sb3Iuc2V0QWxwaGEoNDApO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLnBDb2xvcik7XG4gICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlcy5mb3JFYWNoKChjLCBpKSA9PiB7XG4gICAgICAgICAgICAvLyBlYXNlIHJhZGl1cyBzaXplXG4gICAgICAgICAgICBpZihvdXQpIHtcbiAgICAgICAgICAgICAgICBjLnIgICs9ICgwIC0gYy5yICkgKiAwLjEzO1xuICAgICAgICAgICAgfSAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlUk9mZiArPSAwLjAwNztcbiAgICAgICAgICAgICAgICBsZXQgbiA9IHRoaXMucC5ub2lzZSh0aGlzLmFyb3VuZENpcmNsZVJPZmYpKjEuNTtcbiAgICAgICAgICAgICAgICBjLnIgICs9ICggKHRoaXMuX3IgKyBuICsgKGkgKiAxMiAqIG4pICkgLSBjLnIgKSAqIDAuMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucC5lbGxpcHNlKGMueCwgYy55LCBjLnIpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnAucG9wKCk7XG4gICAgICAgIHRoaXMucENvbG9yLnNldEFscGhhKDI1NSk7XG4gICAgfVxuXG4gICAgZHJhd1RpdGxlKG91dCA9IGZhbHNlKSB7XG4gICAgICAgIGlmKG91dCkge1xuICAgICAgICAgICAgdGhpcy51aVRpdGxlUC50d2Vlbi5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLnVpVGl0bGVQLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudWlUaXRsZUFscGhhLmEgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmKCF0aGlzLnVpVGl0bGVQLnN0YXJ0ZWQgJiYgIW91dCkge1xuICAgICAgICAgICAgdGhpcy51aVRpdGxlUC50d2Vlbi5zdGFydCgpO1xuICAgICAgICAgICAgdGhpcy51aVRpdGxlUC5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZihvdXQpIHJldHVybjtcbiAgICAgICAgdGhpcy5wQ29sb3Iuc2V0QWxwaGEodGhpcy51aVRpdGxlQWxwaGEuYSk7XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLnBDb2xvcik7XG4gICAgICAgIHRoaXMucC50ZXh0QWxpZ24odGhpcy5wLkNFTlRFUik7XG4gICAgICAgIHRoaXMucC50ZXh0U2l6ZSgxNCk7XG4gICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgIHRoaXMucC50ZXh0KHRoaXMudGl0bGUsIHRoaXMueCwgdGhpcy55IC0gMzApO1xuICAgICAgICB0aGlzLnAucG9wKCk7XG4gICAgICAgIHRoaXMucENvbG9yLnNldEFscGhhKDI1NSk7XG4gICAgfVxuXG4gICAgc2V0UGNvbG9yKGNvbG9yKSB7XG4gICAgICAgIHRoaXMucENvbG9yID0gdGhpcy5wLmNvbG9yKGNvbG9yKTtcbiAgICB9XG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEJhc3RvdSBvbiAwNi8wNC8yMDE4LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhdGVnb3J5IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICAvLyBwNVxuICAgICAgICB0aGlzLnAgPSBwcm9wcy5wO1xuXG4gICAgICAgIC8vIFByb3BzXG4gICAgICAgIHRoaXMuaWQgPSBwcm9wcy5pZDtcbiAgICAgICAgdGhpcy5jb2xvciA9IHByb3BzLmNvbG9yO1xuICAgICAgICB0aGlzLnBDb2xvciA9IG51bGw7XG4gICAgICAgIHRoaXMucG9zWSA9IHByb3BzLnBvc1k7XG4gICAgICAgIHRoaXMucG9zID0gcHJvcHMucG9zO1xuXG4gICAgICAgIHRoaXMuX3IgPSAxNjtcbiAgICAgICAgdGhpcy54O1xuICAgICAgICB0aGlzLnk7XG4gICAgICAgIHRoaXMuYmJveCA9IHt9O1xuXG4gICAgICAgIHRoaXMudGV4dEZvbnQ7XG5cbiAgICAgICAgdGhpcy5pc0hvdmVyZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmlzQ2xpY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuc2V0UGNvbG9yKHRoaXMuY29sb3IpO1xuICAgICAgICB0aGlzLnNldFBvcyh0aGlzLnBvcyk7XG4gICAgICAgIHRoaXMuc2V0QmJveCgpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLnBDb2xvcik7XG4gICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgIHRoaXMucC5lbGxpcHNlKHRoaXMueCwgdGhpcy55LCB0aGlzLl9yKTtcbiAgICAgICAgdGhpcy5wLnBvcCgpO1xuXG4gICAgICAgIHRoaXMucC5maWxsKCd3aGl0ZScpO1xuICAgICAgICB0aGlzLnAudGV4dFNpemUoMjApO1xuICAgICAgICB0aGlzLnAudGV4dEFsaWduKHRoaXMucC5MRUZUKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5wLnRleHQodGhpcy5pZCwgdGhpcy54ICsgMjUsIHRoaXMueSArIHRoaXMuX3IvMyk7XG4gICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICB9XG5cbiAgICBob3ZlcmVkKHB4LCBweSkge1xuICAgICAgICBpZih0aGlzLnBvaW50ZXJJbkNhdGVnb3J5KHB4LHB5KSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2hvdmVyZWQnLCB0aGlzLmlkKTtcbiAgICAgICAgICAgIHRoaXMucC5jdXJzb3IodGhpcy5wLkhBTkQpO1xuICAgICAgICAgICAgdGhpcy5pc0hvdmVyZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc0hvdmVyZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsaWNrZWQocHgsIHB5KSB7XG4gICAgICAgIGlmKHRoaXMucG9pbnRlckluQ2F0ZWdvcnkocHgscHkpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2snLCB0aGlzLmlkKTtcbiAgICAgICAgICAgIHRoaXMuaXNDbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvaW50ZXJJbkNhdGVnb3J5KHB4LHB5KSB7XG4gICAgICAgIGlmICggcHggPj0gdGhpcy5iYm94LnggJiYgcHggPD0gdGhpcy5iYm94LnggKyB0aGlzLmJib3gudyAmJlxuICAgICAgICAgICAgcHkgPj0gdGhpcy5iYm94LnkgJiYgcHkgPD0gdGhpcy5iYm94LnkgKyB0aGlzLmJib3guaCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRQY29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5wQ29sb3IgPSB0aGlzLnAuY29sb3IoY29sb3IpO1xuICAgIH1cblxuICAgIHNldFBvcyhwb3MpIHtcbiAgICAgICAgdGhpcy54ID0gdGhpcy5wLndpbmRvd1dpZHRoLzIgLSA1NDAgKyAoMjAwICogcG9zLTEpO1xuICAgICAgICB0aGlzLnkgPSB0aGlzLnAud2luZG93SGVpZ2h0IC0gdGhpcy5wLndpbmRvd0hlaWdodC80ICsgNDA7XG4gICAgfVxuXG4gICAgc2V0QmJveCgpIHtcbiAgICAgICAgdGhpcy5iYm94ID0ge1xuICAgICAgICAgICAgeDogdGhpcy54IC0gdGhpcy5fci8yLFxuICAgICAgICAgICAgeTogdGhpcy55IC0gdGhpcy5fci8yLFxuICAgICAgICAgICAgdzogMTUwLFxuICAgICAgICAgICAgaDogdGhpcy5fclxuICAgICAgICB9XG4gICAgfVxufSIsIi8qXG4gRHJhdyBkYXNoZWQgbGluZXMgd2hlcmVcbiAobCA9IGxlbmd0aCBvZiBkYXNoZWQgbGluZSBpbiBweCwgZyA9IGdhcCBpbiBweClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyLCBsLCBnKSB7XG4gICAgY29uc3QgcGMgPSB0aGlzLmRpc3QoeDEsIHkxLCB4MiwgeTIpIC8gMTAwO1xuICAgIGxldCBwY0NvdW50ID0gMTtcbiAgICBsZXQgbFBlcmNlbnQsIGdQZXJjZW50ID0gMDtcbiAgICBsZXQgY3VycmVudFBvcyA9IDA7XG4gICAgbGV0IHh4MSwgeXkxLCB4eDIsIHl5MiA9IDA7XG5cbiAgICB3aGlsZSAodGhpcy5pbnQocGNDb3VudCAqIHBjKSA8IGwpIHtcbiAgICAgICAgcGNDb3VudCsrXG4gICAgfVxuICAgIGxQZXJjZW50ID0gcGNDb3VudDtcbiAgICBwY0NvdW50ID0gMTtcbiAgICB3aGlsZSAodGhpcy5pbnQocGNDb3VudCAqIHBjKSA8IGcpIHtcbiAgICAgICAgcGNDb3VudCsrXG4gICAgfVxuICAgIGdQZXJjZW50ID0gcGNDb3VudDtcblxuICAgIGxQZXJjZW50ID0gbFBlcmNlbnQgLyAxMDA7XG4gICAgZ1BlcmNlbnQgPSBnUGVyY2VudCAvIDEwMDtcbiAgICB3aGlsZSAoY3VycmVudFBvcyA8IDEpIHtcbiAgICAgICAgeHgxID0gdGhpcy5sZXJwKHgxLCB4MiwgY3VycmVudFBvcyk7XG4gICAgICAgIHl5MSA9IHRoaXMubGVycCh5MSwgeTIsIGN1cnJlbnRQb3MpO1xuICAgICAgICB4eDIgPSB0aGlzLmxlcnAoeDEsIHgyLCBjdXJyZW50UG9zICsgbFBlcmNlbnQpO1xuICAgICAgICB5eTIgPSB0aGlzLmxlcnAoeTEsIHkyLCBjdXJyZW50UG9zICsgbFBlcmNlbnQpO1xuICAgICAgICBpZiAoeDEgPiB4Mikge1xuICAgICAgICAgICAgaWYgKHh4MiA8IHgyKSB7XG4gICAgICAgICAgICAgICAgeHgyID0geDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHgxIDwgeDIpIHtcbiAgICAgICAgICAgIGlmICh4eDIgPiB4Mikge1xuICAgICAgICAgICAgICAgIHh4MiA9IHgyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh5MSA+IHkyKSB7XG4gICAgICAgICAgICBpZiAoeXkyIDwgeTIpIHtcbiAgICAgICAgICAgICAgICB5eTIgPSB5MjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoeTEgPCB5Mikge1xuICAgICAgICAgICAgaWYgKHl5MiA+IHkyKSB7XG4gICAgICAgICAgICAgICAgeXkyID0geTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxpbmUoeHgxLCB5eTEsIHh4MiwgeXkyKTtcbiAgICAgICAgY3VycmVudFBvcyA9IGN1cnJlbnRQb3MgKyBsUGVyY2VudCArIGdQZXJjZW50O1xuICAgIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBCYXN0b3Ugb24gMDkvMDQvMjAxOC5cbiAqL1xuXG5jb25zdCBkYXRhcyA9IHtcbiAgICAnbW9udGhzJzogWydTRVAuJywnT0NULicsJ05PVi4nLCdERUMuJywnSkFOLicsJ0ZFQi4nLCdNQVIuJywnQVBSLiddLFxuICAgICdkYXRlUmFuZ2UnOiBbXG4gICAgICAgICcyMDE3LTA5LTAxVDAwOjAwOjAwJyxcbiAgICAgICAgJzIwMTgtMDQtMDFUMDA6MDA6MDAnXG4gICAgXSxcbiAgICAnY29sb3JzJzoge1xuICAgICAgICAncGFsZUlsYWMnOiAncmdiYSgyMjksIDIyNywgMjU1KScsXG4gICAgICAgICdwYWxlSWxhY1RyYW5zcGFyZW50JzogJ3JnYmEoMjI5LCAyMjcsIDI1NSwgMC4yKScsXG4gICAgICAgICdkYXJrQmx1ZUdyZXknOiAncmdiKDIyLCAyMCwgNTkpJyxcbiAgICAgICAgJ2RhcmtTZWFmb2FtJzogJ3JnYigzNiwgMTgxLCAxMzEpJyxcbiAgICAgICAgJ2JyaWdodFNreUJsdWUnOiAncmdiKDQsIDE5MCwgMjU0KScsXG4gICAgICAgICdyZWRQaW5rJzogJ3JnYigyNDgsIDQ0LCAxMDMpJyxcbiAgICAgICAgJ3BhbGVZZWxsb3cnOiAncmdiKDI1MCwgMjU1LCAxMzEpJ1xuICAgIH0sXG4gICAgJ2NhdGVnb3JpZXMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdlY29sb2d5JyxcbiAgICAgICAgICAgICdjb2xvcic6ICdyZ2IoMzYsIDE4MSwgMTMxKScsIC8vIGRhcmtTZWFmb2FtXG4gICAgICAgICAgICAncG9zJzogMVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnaG91c2UnLFxuICAgICAgICAgICAgJ2NvbG9yJzogJ3JnYig0LCAxOTAsIDI1NCknLCAvLyBicmlnaHRTa3lCbHVlXG4gICAgICAgICAgICAncG9zJzogMlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnc2VjdXJpdHknLFxuICAgICAgICAgICAgJ2NvbG9yJzogJ3JnYigyNDgsIDQ0LCAxMDMpJywgLy8gcmVkUGlua1xuICAgICAgICAgICAgJ3Bvcyc6IDNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2NvbWZvcnQnLFxuICAgICAgICAgICAgJ2NvbG9yJzogJ3JnYigyNTAsIDI1NSwgMTMxKScsIC8vIGJyaWdodFNreUJsdWVcbiAgICAgICAgICAgICdwb3MnOiA0XG4gICAgICAgIH1cbiAgICBdXG59O1xuZXhwb3J0IGRlZmF1bHQgZGF0YXM7XG4iLCIvL2ltcG9ydCB7IGdlbmVyYXRlUmFuZG9tLCBzdW0gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBza2V0Y2ggZnJvbSAnLi9za2V0Y2gnO1xuaW1wb3J0IFRvb2xzIGZyb20gJy4vVG9vbHMnO1xuXG5cbi8vIGdsb2JhbCB0b29sc1xud2luZG93LnRvb2xzID0gbmV3IFRvb2xzKCk7XG5cblxubmV3IHA1KHNrZXRjaCwgJ3RpbWVsaW5lJyk7XG5cbiIsIi8vaW1wb3J0IEJ1YmJsZSBmcm9tICcuL2J1YmJsZSc7XG5pbXBvcnQgZGFzaGVkTGluZSBmcm9tICcuL2Rhc2hlZExpbmUnO1xuaW1wb3J0IEFydGljbGUgZnJvbSAnLi9hcnRpY2xlJztcbmltcG9ydCBkYXRhcyBmcm9tICcuL2RhdGFzJztcbmltcG9ydCBDYXRlZ29yeSBmcm9tICcuL2NhdGVnb3J5JztcblxuLy8gQWRkIGV4dGVuc2lvbiB0byBQNVxucDUucHJvdG90eXBlLmRhc2hlZExpbmUgPSBkYXNoZWRMaW5lO1xuXG4vLyBTZXR1cCB0aW1lbGluZVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oIHAgKSB7XG5cbiAgICAvLyBUSU1FTElORSBDT05GSUdTIC8vLy8vLy8vL1xuICAgIGNvbnN0IHBhZGRpbmcgPSBbMCwgODBdO1xuICAgIGxldCBXID0gcC53aW5kb3dXaWR0aDtcbiAgICBsZXQgSCA9IHAud2luZG93SGVpZ2h0O1xuICAgIGNvbnN0IGNhdFBvc1kgPSBbXG4gICAgICAgIChILzQgKyA0NSksXG4gICAgICAgIChILzMgKyA0NSksXG4gICAgICAgIChIIC0gSC8zIC0gNDUpLFxuICAgICAgICAoSCAtIEgvNCAtIDQ1KVxuICAgIF07XG4gICAgbGV0IGZvbnQ7XG4gICAgbGV0IHN0YXRlcyA9IHtcbiAgICAgICAgJ2NhdGVnb3J5U2VsZWN0ZWQnOiBmYWxzZSxcbiAgICB9XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICBsZXQgUGNvbG9ycyA9IE9iamVjdC5rZXlzKGRhdGFzLmNvbG9ycykucmVkdWNlKGZ1bmN0aW9uKHByZXZpb3VzLCBjdXJyZW50KSB7XG4gICAgICAgIHByZXZpb3VzW2N1cnJlbnRdID0gcC5jb2xvcihkYXRhcy5jb2xvcnNbY3VycmVudF0pO1xuICAgICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgfSwge30pO1xuXG4gICAgbGV0IGNhdGVnb3JpZXMgPSBbXTtcbiAgICAvLyBQYXJzZSBjYXRlZ29yaWVzXG4gICAgZGF0YXMuY2F0ZWdvcmllcy5mb3JFYWNoKChjLCBrZXkpID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRDYXQgPSBuZXcgQ2F0ZWdvcnkoT2JqZWN0LmFzc2lnbihjLHtwfSkpO1xuICAgICAgICBjdXJyZW50Q2F0LnBvc1kgPSBjYXRQb3NZW2MucG9zIC0gMV07IC8vIFNldCBZIHBvc1xuICAgICAgICBjYXRlZ29yaWVzLnB1c2goY3VycmVudENhdCk7XG4gICAgICAgIGNhdGVnb3JpZXNba2V5XS5pbml0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBjYXRlZ29yaWVzID0gZGF0YXMuY2F0ZWdvcmllcy5tYXAoYyA9PiB7XG4gICAgLy8gICAgIHJldHVybiBuZXcgQ2F0ZWdvcnkoT2JqZWN0LmFzc2lnbihjLHtwfSkpO1xuICAgIC8vIH0pO1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGxldCBhcnRpY2xlcyA9IFtdO1xuICAgIC8vIEVORCBUSU1FTElORSBDT05GSUdTIC8vLy8vLy8vL1xuXG4gICAgbGV0IGN2ID0gbnVsbDtcblxuICAgIHAucHJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBMb2FkIGZvbnRcbiAgICAgICAgZm9udCA9IHAubG9hZEZvbnQoJy4vZm9udC9rYXJsYS50dGYnKTtcblxuICAgICAgICAvLyBHZXQgYWxsIGFydGljbGVzIGZyb20gZ2VuZXJhdGVkIGh1Z28ganNvblxuICAgICAgICBjb25zdCB1cmwgPSAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyAnL2FydGljbGVzL2luZGV4Lmpzb24nO1xuICAgICAgICBwLmxvYWRKU09OKHVybCwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuYXJ0aWNsZXMuZm9yRWFjaCggKGFydGljbGUsIGtleSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJ0aWNsZUNhdGVnb3J5ID0gY2F0ZWdvcmllcy5maWx0ZXIoIChlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuaWQgPT09IGFydGljbGUuY2F0ZWdvcmllc1swXVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgYXJ0aWNsZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgbmV3IEFydGljbGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcDogcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0b29scy5nZXRMYXN0UGFydFVybChhcnRpY2xlLnVybCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYXJ0aWNsZS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBhcnRpY2xlLmNhdGVnb3JpZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBhcnRpY2xlLmRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGFydGljbGUudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbDogYXJ0aWNsZVsnY29udGVudF9odG1sJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYXJ0aWNsZUNhdGVnb3J5WzBdLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogbWFrZSBpbiBhcnRpY2xlXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBzZXREYXRlVG9Qb3NYKGFydGljbGUuZGF0ZSxkYXRhcy5kYXRlUmFuZ2VbMF0sZGF0YXMuZGF0ZVJhbmdlWzFdLHBhZGRpbmdbMV0sIFcgLSBwYWRkaW5nWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IGFydGljbGVDYXRlZ29yeVswXS5wb3NZXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBhcnRpY2xlc1trZXldLmluaXQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNvcnQgYXJ0aWNsZXNcbiAgICAgICAgYXJ0aWNsZXMuc29ydChmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgICAgIGxldCBzb3J0UGFyYW0gPSAnZGF0ZSc7XG4gICAgICAgICAgICByZXR1cm4gKGFbc29ydFBhcmFtXSA+IGJbc29ydFBhcmFtXSkgPyAxIDogKChiW3NvcnRQYXJhbV0gPiBhW3NvcnRQYXJhbV0pID8gLTEgOiAwKVxuICAgICAgICB9KVxuICAgIH07XG5cbiAgICBwLnNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGN2ID0gcC5jcmVhdGVDYW52YXMoVywgSCk7XG4gICAgICAgIGN2Lm1vdXNlUHJlc3NlZChjdk1vdXNlUHJlc3NlZCk7XG5cblxuICAgICAgICAvLyBUT0RPOiBtb3ZlIGF3YXlcbiAgICAgICAgc2V0dXBBcnRpY2xlc0xpbmVzKCk7XG4gICAgfTtcblxuICAgIHAuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL3AuYmFja2dyb3VuZCgnIzAyMDEyNicpO1xuICAgICAgICBwLmNsZWFyKCk7XG5cbiAgICAgICAgLy8gQ1VSU09SIFNUQVRFXG4gICAgICAgIHAuY3Vyc29yKHAuQVJST1cpO1xuXG4gICAgICAgIC8vIEZPTlRcbiAgICAgICAgcC50ZXh0Rm9udChmb250KTtcblxuICAgICAgICAvLy8vLy8vIE1PTlRIUyAvLy8vLy8vL1xuXG4gICAgICAgIC8vIE1vbnRocyBsaW5lXG4gICAgICAgIHAuc3Ryb2tlKFBjb2xvcnMucGFsZUlsYWNUcmFuc3BhcmVudCk7XG4gICAgICAgIHAuc3Ryb2tlV2VpZ2h0KDEpO1xuXG4gICAgICAgIC8vIE1vbnRoc1xuICAgICAgICBwLmxpbmUocGFkZGluZ1sxXSwgSC8yLCBXLXBhZGRpbmdbMV0sIEgvMik7XG4gICAgICAgIGZvciAobGV0IGk9MDtpPGRhdGFzLm1vbnRocy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICBsZXQgYW10ID0gKCBpLyhkYXRhcy5tb250aHMubGVuZ3RoIC0gMSkgKSAqIDE7XG4gICAgICAgICAgICBsZXQgbW9udGhYID0gcC5sZXJwKHBhZGRpbmdbMV0sIFctcGFkZGluZ1sxXSwgYW10KTtcbiAgICAgICAgICAgIGxldCB0ZXh0T2ZmZXN0ID0gKChpKzEpICUgMiA9PSAwKSA/IDMwIDogLTIwO1xuXG4gICAgICAgICAgICAvLyBjaXJjbGUgYW5kIHZlcnRpY2FsIGRhc2ggbGluZVxuICAgICAgICAgICAgaWYoaSAhPT0gMCAmJiBpICE9PSBkYXRhcy5tb250aHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIHAuZWxsaXBzZShtb250aFgsIEgvMiwgOSk7XG4gICAgICAgICAgICAgICAgcC5zdHJva2UoUGNvbG9ycy5wYWxlSWxhY1RyYW5zcGFyZW50KTtcbiAgICAgICAgICAgICAgICBwLmRhc2hlZExpbmUobW9udGhYLEgvNCxtb250aFgsSC1ILzQsMSwxNSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRleHRcbiAgICAgICAgICAgIHAubm9TdHJva2UoKTtcbiAgICAgICAgICAgIHAuZmlsbChQY29sb3JzLnBhbGVJbGFjKTtcbiAgICAgICAgICAgIHAudGV4dFNpemUoMTQpO1xuICAgICAgICAgICAgcC50ZXh0QWxpZ24ocC5DRU5URVIpO1xuICAgICAgICAgICAgcC5wdXNoKCk7XG4gICAgICAgICAgICBwLnRleHQoZGF0YXMubW9udGhzW2ldLCBtb250aFgsIEgvMit0ZXh0T2ZmZXN0KTtcbiAgICAgICAgfVxuICAgICAgICBwLnBvcCgpO1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8vLy8vLyBDQVRFR09SSUVTIC8vLy8vLy8vXG4gICAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCggZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG4gICAgICAgICAgICBjYXRlZ29yeS5ob3ZlcmVkKHAubW91c2VYLHAubW91c2VZKTtcbiAgICAgICAgICAgIGNhdGVnb3J5LnNob3coKTtcblxuICAgICAgICAgICAgLy8gY2xpY2tcbiAgICAgICAgICAgIGlmKGNhdGVnb3J5LmlzQ2xpY2tlZCkge1xuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCggZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5LmlzQ2xpY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNhdGVnb3J5LmlzQ2xpY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNhdGVnb3J5LmlzQ2xpY2tlZCkge1xuICAgICAgICAgICAgICAgIHN0YXRlcy5jYXRlZ29yeVNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmaWx0ZXJBcnRpY2xlcyhjYXRlZ29yeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlcy5jYXRlZ29yeVNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGhvdmVyXG4gICAgICAgICAgICBpZihjYXRlZ29yeS5pc0hvdmVyZWQpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJBcnRpY2xlcyhjYXRlZ29yeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlbGVjdCBzdGF0ZVxuICAgICAgICAgICAgaWYoY2F0ZWdvcnkuaXNIb3ZlcmVkIHx8IGNhdGVnb3J5LmlzQ2xpY2tlZCkge1xuICAgICAgICAgICAgICAgIHN0YXRlcy5jYXRlZ29yeVNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGVzLmNhdGVnb3J5U2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcC50ZXh0KGNhdGVnb3J5LmlkICsgJzogJyArIHN0YXRlcy5jYXRlZ29yeVNlbGVjdGVkLCAyMCAsMjAwICsgMjAgKiBjYXRlZ29yeS5wb3MpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbiAgICAgICAgLy8vLy8vLyBBUlRJQ0xFUyAvLy8vLy8vL1xuICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKCBmdW5jdGlvbiAoYXJ0aWNsZSkge1xuICAgICAgICAgICAgYXJ0aWNsZS5ob3ZlcmVkKHAubW91c2VYLHAubW91c2VZKTtcbiAgICAgICAgICAgIGFydGljbGUuc2hvdygpO1xuICAgICAgICAgICAgaWYoIXN0YXRlcy5jYXRlZ29yeVNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgYXJ0aWNsZS5kYXJrZW5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIFRXRUVOUyAvLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgVFdFRU4udXBkYXRlKCk7XG4gICAgfTtcblxuICAgIHAud2luZG93UmVzaXplZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVyA9IHAud2luZG93V2lkdGg7XG4gICAgICAgIEggPSBwLndpbmRvd0hlaWdodDtcbiAgICAgICAgcC5yZXNpemVDYW52YXMoVywgSCk7XG5cbiAgICAgICAgLy8gVE9ETzogcmUtY2FsY3VsIGFydGljbGUgcG9zXG4gICAgfTtcblxuICAgIC8vIElOVEVSQUNUSU9OUyAvLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGZ1bmN0aW9uIGN2TW91c2VQcmVzc2VkICgpIHtcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCggZnVuY3Rpb24gKGFydGljbGUpIHtcbiAgICAgICAgICAgIGFydGljbGUuY2xpY2tlZChwLm1vdXNlWCxwLm1vdXNlWSlcbiAgICAgICAgfSk7XG4gICAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCggZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG4gICAgICAgICAgICBjYXRlZ29yeS5pc0NsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNhdGVnb3J5LmNsaWNrZWQocC5tb3VzZVgscC5tb3VzZVkpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIExlcyB0cmFpdHMgIVxuICAgIC8vIFRPRE86IGluIGNsYXNzIGFydGljbGVzTWFuYWdlciA/XG4gICAgZnVuY3Rpb24gc2V0dXBBcnRpY2xlc0xpbmVzKCkge1xuICAgICAgICBsZXQgbGFzdE1vbnRoID0gMDtcbiAgICAgICAgbGV0IGxhc3RDb29yZHMgPSB7eDowLHk6MH07XG5cbiAgICAgICAgZGF0YXMuY2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcbiAgICAgICAgICAgIGFydGljbGVzLmZvckVhY2goYXJ0aWNsZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoYXJ0aWNsZS5jYXRlZ29yeSA9PT0gY2F0ZWdvcnkuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYobGFzdE1vbnRoID09PSBuZXcgRGF0ZShhcnRpY2xlLmRhdGUpLmdldE1vbnRoKCkgKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpY2xlLmhhc0xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZS5saW5lVG8ueCA9IGxhc3RDb29yZHMueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFydGljbGUubGluZVRvLnkgPSBsYXN0Q29vcmRzLnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vbnRoID0gbmV3IERhdGUoYXJ0aWNsZS5kYXRlKS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdENvb3Jkcy54ID0gYXJ0aWNsZS54O1xuICAgICAgICAgICAgICAgICAgICBsYXN0Q29vcmRzLnkgPSBhcnRpY2xlLnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gVEVNUCBVVElMUyAvLy8vLy8vLy9cblxuICAgIC8vIFRPRE86IGFkZCB0byBhcnRpY2xlc01hbmFnZXIgP1xuICAgIC8qXG4gICAgICogIGRhdGVUb1Bvc1hcbiAgICAgKlxuICAgICAqICBUcmFuc2Zvcm0gdGltZXN0YW1wIHRvIHBvc2l0aW9uIGluIHBpeGVsICB3aXRoaW4gYSByYW5nZVxuICAgICAqICByZXR1cm4gcG9zaXRpb24gaW4gcGl4ZWxzIChpbnQpXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0RGF0ZVRvUG9zWChkYXRlLCBiZWdpbkRhdGUsIEVuZERhdGUsIGJlZ2luWCwgZW5kWCkge1xuICAgICAgICAvLyBEYXRlIFRyYW5zZm9ybVxuICAgICAgICBjb25zdCBkYXRlQXJyYXkgPSBbZGF0ZSwgYmVnaW5EYXRlLCBFbmREYXRlXTtcbiAgICAgICAgY29uc3QgZGF0ZVRpbWVzID0gW107XG4gICAgICAgIGRhdGVBcnJheS5mb3JFYWNoKCBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICAgICAgZGF0ZVRpbWVzLnB1c2gobmV3IERhdGUoZGF0ZSkuZ2V0VGltZSgpKVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmV0dXJuIHBvcyBpbiBwaXhlbFxuICAgICAgICByZXR1cm4gcC5tYXAoZGF0ZVRpbWVzWzBdLCBkYXRlVGltZXNbMV0sIGRhdGVUaW1lc1syXSwgYmVnaW5YLCBlbmRYKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJBcnRpY2xlcyhjYXRlZ29yeSkge1xuICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKCBmdW5jdGlvbiAoYXJ0aWNsZSkge1xuICAgICAgICAgICAgaWYoYXJ0aWNsZS5jYXRlZ29yeSAhPT0gY2F0ZWdvcnkuaWQpIHtcbiAgICAgICAgICAgICAgICBhcnRpY2xlLmRhcmtlbmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJ0aWNsZS5kYXJrZW5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxufSJdfQ==
