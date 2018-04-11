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
        this.colorAlpha = {
            a: 0,
            in: 0,
            out: 255
        };
        this.darkened = false;

        // panel
        this.uiPanel = props.uiPanel;

        // Article line if connected to another article
        this.hasLine = false;
        this.lineTo = { x: 0, y: 0 };

        // private
        this._r = 10;

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

        // Is onTop
        this.isOnTop = false; // Si articles de la même date alors le précédent au dessus
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
                this.openPanel();
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
            // Animate alpha
            this.colorAlpha.a += (this.colorAlpha.out - this.colorAlpha.a) * 0.19;

            this.p.noStroke();
            if (this.darkened) {
                this.colorAlpha.out = 40;
            } else {
                this.colorAlpha.out = 255;
            }
            this.pColor.setAlpha(this.colorAlpha.a);
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
    }, {
        key: 'openPanel',
        value: function openPanel() {
            this.uiPanel.date.innerText = new Date(this.date).toLocaleDateString();
            this.uiPanel.title.innerText = this.title;
            this.uiPanel.content.innerHTML = this.html;
            this.uiPanel.link.setAttribute('href', this.url);
            this.uiPanel.closeButton.style.color = this.color;
            this.uiPanel.container.classList.add('open');
            this.p.tlStates.panelOpened = true;
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

        // TODO: Add hover circles

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

if (document.getElementById('timeline')) {
    new p5(_sketch2.default, 'timeline');
}

},{"./Tools":1,"./sketch":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (p) {
    var articles = [];
    var categories = [];
    var font = void 0;

    // TIMELINE CONFIGS /////////
    var padding = [0, 80];
    var W = p.windowWidth;
    var H = p.windowHeight;
    var catPosY = [H / 4 + 45, H / 3 + 45, H - H / 3 - 45, H - H / 4 - 45];
    p.tlStates = {
        'categorySelected': false,
        'panelOpened': false,
        'loaded': false
    };
    // END TIMELINE CONFIGS ///////

    // TL PANEL ////////////
    var uiPanel = {
        'container': document.getElementById('tl-article-panel'),
        'date': document.getElementById('article-date'),
        'title': document.getElementById('article-title'),
        'content': document.getElementById('article-content'),
        'link': document.getElementById('article-link'),
        'closeButton': document.getElementById('close-button')
    };

    // Ui close on button click
    uiPanel.closeButton.addEventListener('click', function () {
        closePanel();
    });

    function closePanel() {
        if (uiPanel.container.classList.contains('open')) {
            uiPanel.container.classList.remove('open');
            p.tlStates.panelOpened = false;
        }
    }

    // SETUP P5 DATAS ////////

    var Pcolors = Object.keys(_datas2.default.colors).reduce(function (previous, current) {
        previous[current] = p.color(_datas2.default.colors[current]);
        return previous;
    }, {});

    // Parse categories
    _datas2.default.categories.forEach(function (c, key) {
        var currentCat = new _category2.default(Object.assign(c, { p: p }));
        currentCat.posY = catPosY[c.pos - 1]; // Set Y pos
        categories.push(currentCat);
        categories[key].init();
    });

    /////////////////////////

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
                    y: articleCategory[0].posY,
                    uiPanel: uiPanel
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
        cv.mouseClicked(cvMouseClicked);

        setupArticlesLines();
    };

    p.draw = function () {

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

        // Click filter
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
                p.tlStates.categorySelected = true;
                filterArticles(category);
            } else {
                p.tlStates.categorySelected = false;
            }
        });

        // Hover filter
        categories.forEach(function (category) {
            // hover
            if (category.isHovered) {
                filterArticles(category);
            }

            // select state
            if (category.isHovered || category.isClicked) {
                p.tlStates.categorySelected = true;
            } else {
                p.tlStates.categorySelected = false;
            }
        });
        /////////////////////////


        /////// ARTICLES ////////
        articles.forEach(function (article) {
            article.hovered(p.mouseX, p.mouseY);
            article.show();
            if (!p.tlStates.categorySelected) {
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

        // TODO: re-calcul article pos and categories pos
    };

    // INTERACTIONS //////////////////

    function cvMouseClicked() {
        articles.forEach(function (article) {
            article.clicked(p.mouseX, p.mouseY);
        });
        categories.forEach(function (category) {
            category.isClicked = false;
            category.clicked(p.mouseX, p.mouseY);
        });
        return false;
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

    /*
     * filterArticles
     *
     * Set article opacity with selected categories
     */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvanMvVG9vbHMuanMiLCJzdGF0aWMvanMvYXJ0aWNsZS5qcyIsInN0YXRpYy9qcy9jYXRlZ29yeS5qcyIsInN0YXRpYy9qcy9kYXNoZWRMaW5lLmpzIiwic3RhdGljL2pzL2RhdGFzLmpzIiwic3RhdGljL2pzL21haW4uanMiLCJzdGF0aWMvanMvc2tldGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBO0lBQ3FCLEs7QUFFakIscUJBQWM7QUFBQTs7QUFDVixhQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDSDs7Ozs4QkFFSyxNLEVBQVE7QUFDVixtQkFBTyxVQUFRLEtBQUssRUFBTCxHQUFRLEdBQWhCLENBQVA7QUFDSDs7OzhCQUNLLEcsRUFBSztBQUFFLG1CQUFPLE1BQU0sQ0FBYjtBQUFlOzs7NEJBQ3hCLEssRUFBTztBQUNQLGdCQUFJLEtBQUssWUFBTCxJQUFxQixJQUFyQixJQUE2QixLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsT0FBaUMsTUFBTSxRQUFOLEVBQTlELElBQW1GLEtBQUssS0FBTCxDQUFXLEtBQUssWUFBTCxHQUFvQixJQUEvQixJQUF1QyxJQUF4QyxLQUFtRCxLQUFLLEtBQUwsQ0FBVyxRQUFRLElBQW5CLElBQTJCLElBQXBLLEVBQTJLO0FBQ3ZLLHdCQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0g7QUFDRCxpQkFBSyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0g7QUFDRDs7Ozs7Ozs7dUNBS2UsRyxFQUFLO0FBQ2hCLGdCQUFNLEtBQUssZ0JBQVg7QUFDQSxtQkFBTyxJQUFJLEtBQUosQ0FBVSxFQUFWLEVBQWMsQ0FBZCxDQUFQO0FBQ0g7Ozs7OztrQkF6QmdCLEs7QUEwQnBCOzs7Ozs7Ozs7Ozs7O0FDM0JEOzs7O0lBSXFCLE87QUFDakIscUJBQVksS0FBWixFQUFtQjtBQUFB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SUFBdkIsRUFBNkIsU0FBN0IsRUFBd0MsT0FBeEMsRUFBaUQsTUFBakQsRUFBeUQsSUFBekQsRUFBK0Q7QUFDM0Q7QUFDQSxZQUFNLFlBQVksQ0FBQyxJQUFELEVBQU8sU0FBUCxFQUFrQixPQUFsQixDQUFsQjtBQUNBLFlBQU0sWUFBWSxFQUFsQjtBQUNBLGtCQUFVLE9BQVYsQ0FBbUIsVUFBVSxJQUFWLEVBQWdCO0FBQy9CLHNCQUFVLElBQVYsQ0FBZSxJQUFJLElBQUosQ0FBUyxJQUFULEVBQWUsT0FBZixFQUFmO0FBQ0gsU0FGRDtBQUdBO0FBQ0EsZUFBTyxFQUFFLEdBQUYsQ0FBTSxVQUFVLENBQVYsQ0FBTixFQUFvQixVQUFVLENBQVYsQ0FBcEIsRUFBa0MsVUFBVSxDQUFWLENBQWxDLEVBQWdELE1BQWhELEVBQXdELElBQXhELENBQVA7QUFDSDs7QUFFRDs7Ozs7QUFLQSxhQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0M7QUFDOUIsaUJBQVMsT0FBVCxDQUFrQixVQUFVLE9BQVYsRUFBbUI7QUFDakMsZ0JBQUcsUUFBUSxRQUFSLEtBQXFCLFNBQVMsRUFBakMsRUFBcUM7QUFDakMsd0JBQVEsUUFBUixHQUFtQixJQUFuQjtBQUNILGFBRkQsTUFFTztBQUNILHdCQUFRLFFBQVIsR0FBbUIsS0FBbkI7QUFDSDtBQUNKLFNBTkQ7QUFPSDtBQUNEO0FBRUgsQzs7QUF4U0Q7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBTkE7QUFPQSxHQUFHLFNBQUgsQ0FBYSxVQUFiOztBQUVBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIvLyBUb29sc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbHMge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubG9nUHJldlZhbHVlID0gbnVsbFxuICAgICAgICB0aGlzLmxvZ0NvdW50ID0gMFxuICAgIH1cblxuICAgIGRlMnJhKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gZGVncmVlKihNYXRoLlBJLzE4MCk7XG4gICAgfVxuICAgIGlzT2RkKG51bSkgeyByZXR1cm4gbnVtICUgMn1cbiAgICBMb2codmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMubG9nUHJldlZhbHVlID09IG51bGwgfHwgdGhpcy5sb2dQcmV2VmFsdWUudG9TdHJpbmcoKSAhPT0gdmFsdWUudG9TdHJpbmcoKSB8fCAoTWF0aC5yb3VuZCh0aGlzLmxvZ1ByZXZWYWx1ZSAqIDEwMDApIC8gMTAwMCkgIT09IChNYXRoLnJvdW5kKHZhbHVlICogMTAwMCkgLyAxMDAwKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nUHJldlZhbHVlID0gdmFsdWVcbiAgICB9XG4gICAgLypcbiAgICAgKiAgc2x1Z2lmeVVybFxuICAgICAqICBnZXQgbGFzdCBwYXJ0IG9mIHVybFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0TGFzdFBhcnRVcmwodXJsKSB7XG4gICAgICAgIGNvbnN0IHJlID0gJ1teL10rKD89XFwvJHwkKSdcbiAgICAgICAgcmV0dXJuIHVybC5tYXRjaChyZSlbMF07XG4gICAgfVxufTtcblxuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQmFzdG91IG9uIDA2LzA0LzIwMTguXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJ0aWNsZSB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgcHJvcHMgPSBwcm9wcyB8fCB7fTsgLy90aGlzIGlzIGRlZmF1bHQgdmFsdWUgZm9yIHBhcmFtLlxuXG4gICAgICAgIC8vIFA1XG4gICAgICAgIHRoaXMucCA9IHByb3BzLnA7XG5cbiAgICAgICAgLy8gQXJ0aWNsZSBtZXRhc1xuICAgICAgICB0aGlzLmlkID0gcHJvcHMuaWQ7XG4gICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBwcm9wcy5jYXRlZ29yeTtcbiAgICAgICAgdGhpcy50aXRsZSA9IHByb3BzLnRpdGxlO1xuICAgICAgICB0aGlzLmRhdGUgPSBwcm9wcy5kYXRlO1xuICAgICAgICB0aGlzLnVybCA9IHByb3BzLnVybDtcbiAgICAgICAgdGhpcy5odG1sID0gcHJvcHMuaHRtbDtcblxuICAgICAgICAvLyBBcnRpY2xlIGNhbnZhcyBzaGFwZVxuICAgICAgICB0aGlzLnggPSBwcm9wcy54O1xuICAgICAgICB0aGlzLnkgPSBwcm9wcy55O1xuICAgICAgICB0aGlzLmNvbG9yID0gcHJvcHMuY29sb3I7XG4gICAgICAgIHRoaXMucENvbG9yO1xuICAgICAgICB0aGlzLmNvbG9yQWxwaGEgPSB7XG4gICAgICAgICAgICBhOjAsXG4gICAgICAgICAgICBpbjogMCxcbiAgICAgICAgICAgIG91dDoyNTVcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kYXJrZW5lZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIHBhbmVsXG4gICAgICAgIHRoaXMudWlQYW5lbCA9IHByb3BzLnVpUGFuZWw7XG5cbiAgICAgICAgLy8gQXJ0aWNsZSBsaW5lIGlmIGNvbm5lY3RlZCB0byBhbm90aGVyIGFydGljbGVcbiAgICAgICAgdGhpcy5oYXNMaW5lID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGluZVRvID0ge3g6MCx5OjB9O1xuXG4gICAgICAgIC8vIHByaXZhdGVcbiAgICAgICAgdGhpcy5fciA9IDEwO1xuXG4gICAgICAgIC8vIEFyb3VuZCBjaXJjbGVzXG5cbiAgICAgICAgLy8gVE9ETzogcHV0IHRoYXQgc3R1ZmYgaW4gYW4gb2JqZWN0IGZ1Y2sgb2ZmXG4gICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlc05iID0gNDtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVST2ZmID0gMDtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVzID0gbmV3IEFycmF5KHRoaXMuYXJvdW5kQ2lyY2xlc05iKS5maWxsKDApLm1hcChjID0+ICh7eDp0aGlzLngsIHk6dGhpcy55LHI6MH0pKTtcblxuICAgICAgICAvLyB0aXRsZSBpbiBWaWV3XG4gICAgICAgIHRoaXMudWlUaXRsZUFscGhhID0ge2E6MH07IC8vIG11c3QgIGJlIGFuIG9iamVjdCBmb3IgVHdlZW5cbiAgICAgICAgdGhpcy51aVRpdGxlUCA9IHtcbiAgICAgICAgICAgICdhbHBoYSc6IHt4OjAsIHk6MH0sXG4gICAgICAgICAgICAnYWxwaGFUYXJnZXQnOiB7YToyNTV9LFxuICAgICAgICAgICAgJ3R3ZWVuJzogbmV3IFRXRUVOLlR3ZWVuKHRoaXMudWlUaXRsZUFscGhhKVxuICAgICAgICAgICAgICAgIC50byh7YTogMjU1fSwgNTAwKVxuICAgICAgICAgICAgICAgIC5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YWRyYXRpYy5JbilcbiAgICAgICAgICAgICAgICAub25VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMudWlUaXRsZUFscGhhLmEpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgJ3N0YXJ0ZWQnOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIElzIG9uVG9wXG4gICAgICAgIHRoaXMuaXNPblRvcCA9IGZhbHNlOyAvLyBTaSBhcnRpY2xlcyBkZSBsYSBtw6ptZSBkYXRlIGFsb3JzIGxlIHByw6ljw6lkZW50IGF1IGRlc3N1c1xuXG4gICAgfVxuXG4gICAgaW5pdCAoKSB7XG4gICAgICAgIHRoaXMuc2V0UGNvbG9yKHRoaXMuY29sb3IpO1xuICAgIH1cblxuICAgIGNsaWNrZWQocHgsIHB5KSB7XG4gICAgICAgIGlmKHRoaXMucG9pbnRlckluQXJ0aWNsZShweCxweSkpIHtcbiAgICAgICAgICAgIHRoaXMub3BlblBhbmVsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBob3ZlcmVkKHB4LCBweSkge1xuICAgICAgICBpZih0aGlzLnBvaW50ZXJJbkFydGljbGUocHgscHkpKSB7XG4gICAgICAgICAgICAvLyB0aXRsZSBpblxuICAgICAgICAgICAgdGhpcy5kcmF3VGl0bGUoKTtcblxuICAgICAgICAgICAgLy8gY2lyY2xlcyBpblxuICAgICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlc0Fyb3VuZCgpXG5cbiAgICAgICAgICAgIHRoaXMucC5jdXJzb3IodGhpcy5wLkhBTkQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGl0bGUgb3V0XG4gICAgICAgICAgICB0aGlzLmRyYXdUaXRsZSh0cnVlKTtcblxuICAgICAgICAgICAgLy8gY2lyY2xlcyBvdXRcbiAgICAgICAgICAgIHRoaXMuZHJhd0NpcmNsZXNBcm91bmQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwb2ludGVySW5BcnRpY2xlKHB4LHB5KSB7XG4gICAgICAgIGxldCBkID0gdGhpcy5wLmRpc3QocHgsIHB5LCB0aGlzLngsIHRoaXMueSk7XG4gICAgICAgIGlmKGQgPCB0aGlzLl9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIC8vIEFuaW1hdGUgYWxwaGFcbiAgICAgICAgdGhpcy5jb2xvckFscGhhLmEgKz0gKCB0aGlzLmNvbG9yQWxwaGEub3V0IC0gdGhpcy5jb2xvckFscGhhLmEpICogMC4xOTtcblxuICAgICAgICB0aGlzLnAubm9TdHJva2UoKTtcbiAgICAgICAgaWYodGhpcy5kYXJrZW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xvckFscGhhLm91dCA9IDQwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb2xvckFscGhhLm91dCA9IDI1NTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBDb2xvci5zZXRBbHBoYSh0aGlzLmNvbG9yQWxwaGEuYSk7XG4gICAgICAgIHRoaXMucC5maWxsKHRoaXMucENvbG9yKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5wLmVsbGlwc2UodGhpcy54LCB0aGlzLnksIHRoaXMuX3IpO1xuICAgICAgICB0aGlzLnAucG9wKCk7XG5cbiAgICAgICAgaWYodGhpcy5oYXNMaW5lKSB7XG4gICAgICAgICAgICB0aGlzLnAuc3Ryb2tlKHRoaXMucENvbG9yKTtcbiAgICAgICAgICAgIHRoaXMucC5zdHJva2VXZWlnaHQoNCk7XG4gICAgICAgICAgICB0aGlzLnAucHVzaCgpO1xuICAgICAgICAgICAgdGhpcy5wLmxpbmUodGhpcy54LCB0aGlzLnksIHRoaXMubGluZVRvLngsIHRoaXMubGluZVRvLnkpO1xuICAgICAgICAgICAgdGhpcy5wLnBvcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhd0NpcmNsZXNBcm91bmQob3V0ID0gZmFsc2UpIHtcbiAgICAgICAgaWYob3V0ICYmIHRoaXMuYXJvdW5kQ2lyY2xlcy5yID09PSAwKSByZXR1cm47XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnBDb2xvci5zZXRBbHBoYSg0MCk7XG4gICAgICAgIHRoaXMucC5maWxsKHRoaXMucENvbG9yKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVzLmZvckVhY2goKGMsIGkpID0+IHtcbiAgICAgICAgICAgIC8vIGVhc2UgcmFkaXVzIHNpemVcbiAgICAgICAgICAgIGlmKG91dCkge1xuICAgICAgICAgICAgICAgIGMuciAgKz0gKDAgLSBjLnIgKSAqIDAuMTM7XG4gICAgICAgICAgICB9ICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVST2ZmICs9IDAuMDA3O1xuICAgICAgICAgICAgICAgIGxldCBuID0gdGhpcy5wLm5vaXNlKHRoaXMuYXJvdW5kQ2lyY2xlUk9mZikqMS41O1xuICAgICAgICAgICAgICAgIGMuciAgKz0gKCAodGhpcy5fciArIG4gKyAoaSAqIDEyICogbikgKSAtIGMuciApICogMC4xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wLmVsbGlwc2UoYy54LCBjLnksIGMucilcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICAgICAgdGhpcy5wQ29sb3Iuc2V0QWxwaGEoMjU1KTtcbiAgICB9XG5cbiAgICBkcmF3VGl0bGUob3V0ID0gZmFsc2UpIHtcbiAgICAgICAgaWYob3V0KSB7XG4gICAgICAgICAgICB0aGlzLnVpVGl0bGVQLnR3ZWVuLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMudWlUaXRsZVAuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy51aVRpdGxlQWxwaGEuYSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIXRoaXMudWlUaXRsZVAuc3RhcnRlZCAmJiAhb3V0KSB7XG4gICAgICAgICAgICB0aGlzLnVpVGl0bGVQLnR3ZWVuLnN0YXJ0KCk7XG4gICAgICAgICAgICB0aGlzLnVpVGl0bGVQLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKG91dCkgcmV0dXJuO1xuICAgICAgICB0aGlzLnBDb2xvci5zZXRBbHBoYSh0aGlzLnVpVGl0bGVBbHBoYS5hKTtcbiAgICAgICAgdGhpcy5wLm5vU3Ryb2tlKCk7XG4gICAgICAgIHRoaXMucC5maWxsKHRoaXMucENvbG9yKTtcbiAgICAgICAgdGhpcy5wLnRleHRBbGlnbih0aGlzLnAuQ0VOVEVSKTtcbiAgICAgICAgdGhpcy5wLnRleHRTaXplKDE0KTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5wLnRleHQodGhpcy50aXRsZSwgdGhpcy54LCB0aGlzLnkgLSAzMCk7XG4gICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICAgICAgdGhpcy5wQ29sb3Iuc2V0QWxwaGEoMjU1KTtcbiAgICB9XG5cbiAgICBzZXRQY29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5wQ29sb3IgPSB0aGlzLnAuY29sb3IoY29sb3IpO1xuICAgIH1cblxuICAgIG9wZW5QYW5lbCgpIHtcbiAgICAgICAgdGhpcy51aVBhbmVsLmRhdGUuaW5uZXJUZXh0ID0gbmV3IERhdGUodGhpcy5kYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgICAgdGhpcy51aVBhbmVsLnRpdGxlLmlubmVyVGV4dCA9IHRoaXMudGl0bGU7XG4gICAgICAgIHRoaXMudWlQYW5lbC5jb250ZW50LmlubmVySFRNTCA9IHRoaXMuaHRtbDtcbiAgICAgICAgdGhpcy51aVBhbmVsLmxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdGhpcy51cmwpO1xuICAgICAgICB0aGlzLnVpUGFuZWwuY2xvc2VCdXR0b24uc3R5bGUuY29sb3IgPSB0aGlzLmNvbG9yO1xuICAgICAgICB0aGlzLnVpUGFuZWwuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICAgICAgdGhpcy5wLnRsU3RhdGVzLnBhbmVsT3BlbmVkID0gdHJ1ZTtcbiAgICB9XG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEJhc3RvdSBvbiAwNi8wNC8yMDE4LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhdGVnb3J5IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICAvLyBwNVxuICAgICAgICB0aGlzLnAgPSBwcm9wcy5wO1xuXG4gICAgICAgIC8vIFByb3BzXG4gICAgICAgIHRoaXMuaWQgPSBwcm9wcy5pZDtcbiAgICAgICAgdGhpcy5jb2xvciA9IHByb3BzLmNvbG9yO1xuICAgICAgICB0aGlzLnBDb2xvciA9IG51bGw7XG4gICAgICAgIHRoaXMucG9zWSA9IHByb3BzLnBvc1k7XG4gICAgICAgIHRoaXMucG9zID0gcHJvcHMucG9zO1xuXG4gICAgICAgIHRoaXMuX3IgPSAxNjtcbiAgICAgICAgdGhpcy54O1xuICAgICAgICB0aGlzLnk7XG4gICAgICAgIHRoaXMuYmJveCA9IHt9O1xuXG4gICAgICAgIHRoaXMudGV4dEZvbnQ7XG5cbiAgICAgICAgdGhpcy5pc0hvdmVyZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmlzQ2xpY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuc2V0UGNvbG9yKHRoaXMuY29sb3IpO1xuICAgICAgICB0aGlzLnNldFBvcyh0aGlzLnBvcyk7XG4gICAgICAgIHRoaXMuc2V0QmJveCgpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLnBDb2xvcik7XG4gICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgIHRoaXMucC5lbGxpcHNlKHRoaXMueCwgdGhpcy55LCB0aGlzLl9yKTtcbiAgICAgICAgdGhpcy5wLnBvcCgpO1xuXG4gICAgICAgIHRoaXMucC5maWxsKCd3aGl0ZScpO1xuICAgICAgICB0aGlzLnAudGV4dFNpemUoMjApO1xuICAgICAgICB0aGlzLnAudGV4dEFsaWduKHRoaXMucC5MRUZUKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5wLnRleHQodGhpcy5pZCwgdGhpcy54ICsgMjUsIHRoaXMueSArIHRoaXMuX3IvMyk7XG4gICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICB9XG5cbiAgICBob3ZlcmVkKHB4LCBweSkge1xuICAgICAgICBpZih0aGlzLnBvaW50ZXJJbkNhdGVnb3J5KHB4LHB5KSkge1xuICAgICAgICAgICAgdGhpcy5wLmN1cnNvcih0aGlzLnAuSEFORCk7XG4gICAgICAgICAgICB0aGlzLmlzSG92ZXJlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzSG92ZXJlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xpY2tlZChweCwgcHkpIHtcbiAgICAgICAgaWYodGhpcy5wb2ludGVySW5DYXRlZ29yeShweCxweSkpIHtcbiAgICAgICAgICAgIHRoaXMuaXNDbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvaW50ZXJJbkNhdGVnb3J5KHB4LHB5KSB7XG4gICAgICAgIGlmICggcHggPj0gdGhpcy5iYm94LnggJiYgcHggPD0gdGhpcy5iYm94LnggKyB0aGlzLmJib3gudyAmJlxuICAgICAgICAgICAgcHkgPj0gdGhpcy5iYm94LnkgJiYgcHkgPD0gdGhpcy5iYm94LnkgKyB0aGlzLmJib3guaCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRQY29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5wQ29sb3IgPSB0aGlzLnAuY29sb3IoY29sb3IpO1xuICAgIH1cblxuICAgIHNldFBvcyhwb3MpIHtcbiAgICAgICAgdGhpcy54ID0gdGhpcy5wLndpbmRvd1dpZHRoLzIgLSA1NDAgKyAoMjAwICogcG9zLTEpO1xuICAgICAgICB0aGlzLnkgPSB0aGlzLnAud2luZG93SGVpZ2h0IC0gdGhpcy5wLndpbmRvd0hlaWdodC80ICsgNDA7XG4gICAgfVxuXG4gICAgc2V0QmJveCgpIHtcbiAgICAgICAgdGhpcy5iYm94ID0ge1xuICAgICAgICAgICAgeDogdGhpcy54IC0gdGhpcy5fci8yLFxuICAgICAgICAgICAgeTogdGhpcy55IC0gdGhpcy5fci8yLFxuICAgICAgICAgICAgdzogMTUwLFxuICAgICAgICAgICAgaDogdGhpcy5fclxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETzogQWRkIGhvdmVyIGNpcmNsZXNcbn0iLCIvKlxuIERyYXcgZGFzaGVkIGxpbmVzIHdoZXJlXG4gKGwgPSBsZW5ndGggb2YgZGFzaGVkIGxpbmUgaW4gcHgsIGcgPSBnYXAgaW4gcHgpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5MiwgbCwgZykge1xuICAgIGNvbnN0IHBjID0gdGhpcy5kaXN0KHgxLCB5MSwgeDIsIHkyKSAvIDEwMDtcbiAgICBsZXQgcGNDb3VudCA9IDE7XG4gICAgbGV0IGxQZXJjZW50LCBnUGVyY2VudCA9IDA7XG4gICAgbGV0IGN1cnJlbnRQb3MgPSAwO1xuICAgIGxldCB4eDEsIHl5MSwgeHgyLCB5eTIgPSAwO1xuXG4gICAgd2hpbGUgKHRoaXMuaW50KHBjQ291bnQgKiBwYykgPCBsKSB7XG4gICAgICAgIHBjQ291bnQrK1xuICAgIH1cbiAgICBsUGVyY2VudCA9IHBjQ291bnQ7XG4gICAgcGNDb3VudCA9IDE7XG4gICAgd2hpbGUgKHRoaXMuaW50KHBjQ291bnQgKiBwYykgPCBnKSB7XG4gICAgICAgIHBjQ291bnQrK1xuICAgIH1cbiAgICBnUGVyY2VudCA9IHBjQ291bnQ7XG5cbiAgICBsUGVyY2VudCA9IGxQZXJjZW50IC8gMTAwO1xuICAgIGdQZXJjZW50ID0gZ1BlcmNlbnQgLyAxMDA7XG4gICAgd2hpbGUgKGN1cnJlbnRQb3MgPCAxKSB7XG4gICAgICAgIHh4MSA9IHRoaXMubGVycCh4MSwgeDIsIGN1cnJlbnRQb3MpO1xuICAgICAgICB5eTEgPSB0aGlzLmxlcnAoeTEsIHkyLCBjdXJyZW50UG9zKTtcbiAgICAgICAgeHgyID0gdGhpcy5sZXJwKHgxLCB4MiwgY3VycmVudFBvcyArIGxQZXJjZW50KTtcbiAgICAgICAgeXkyID0gdGhpcy5sZXJwKHkxLCB5MiwgY3VycmVudFBvcyArIGxQZXJjZW50KTtcbiAgICAgICAgaWYgKHgxID4geDIpIHtcbiAgICAgICAgICAgIGlmICh4eDIgPCB4Mikge1xuICAgICAgICAgICAgICAgIHh4MiA9IHgyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh4MSA8IHgyKSB7XG4gICAgICAgICAgICBpZiAoeHgyID4geDIpIHtcbiAgICAgICAgICAgICAgICB4eDIgPSB4MjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoeTEgPiB5Mikge1xuICAgICAgICAgICAgaWYgKHl5MiA8IHkyKSB7XG4gICAgICAgICAgICAgICAgeXkyID0geTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkxIDwgeTIpIHtcbiAgICAgICAgICAgIGlmICh5eTIgPiB5Mikge1xuICAgICAgICAgICAgICAgIHl5MiA9IHkyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5saW5lKHh4MSwgeXkxLCB4eDIsIHl5Mik7XG4gICAgICAgIGN1cnJlbnRQb3MgPSBjdXJyZW50UG9zICsgbFBlcmNlbnQgKyBnUGVyY2VudDtcbiAgICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQmFzdG91IG9uIDA5LzA0LzIwMTguXG4gKi9cblxuY29uc3QgZGF0YXMgPSB7XG4gICAgJ21vbnRocyc6IFsnU0VQLicsJ09DVC4nLCdOT1YuJywnREVDLicsJ0pBTi4nLCdGRUIuJywnTUFSLicsJ0FQUi4nXSxcbiAgICAnZGF0ZVJhbmdlJzogW1xuICAgICAgICAnMjAxNy0wOS0wMVQwMDowMDowMCcsXG4gICAgICAgICcyMDE4LTA0LTAxVDAwOjAwOjAwJ1xuICAgIF0sXG4gICAgJ2NvbG9ycyc6IHtcbiAgICAgICAgJ3BhbGVJbGFjJzogJ3JnYmEoMjI5LCAyMjcsIDI1NSknLFxuICAgICAgICAncGFsZUlsYWNUcmFuc3BhcmVudCc6ICdyZ2JhKDIyOSwgMjI3LCAyNTUsIDAuMiknLFxuICAgICAgICAnZGFya0JsdWVHcmV5JzogJ3JnYigyMiwgMjAsIDU5KScsXG4gICAgICAgICdkYXJrU2VhZm9hbSc6ICdyZ2IoMzYsIDE4MSwgMTMxKScsXG4gICAgICAgICdicmlnaHRTa3lCbHVlJzogJ3JnYig0LCAxOTAsIDI1NCknLFxuICAgICAgICAncmVkUGluayc6ICdyZ2IoMjQ4LCA0NCwgMTAzKScsXG4gICAgICAgICdwYWxlWWVsbG93JzogJ3JnYigyNTAsIDI1NSwgMTMxKSdcbiAgICB9LFxuICAgICdjYXRlZ29yaWVzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnZWNvbG9neScsXG4gICAgICAgICAgICAnY29sb3InOiAncmdiKDM2LCAxODEsIDEzMSknLCAvLyBkYXJrU2VhZm9hbVxuICAgICAgICAgICAgJ3Bvcyc6IDFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2hvdXNlJyxcbiAgICAgICAgICAgICdjb2xvcic6ICdyZ2IoNCwgMTkwLCAyNTQpJywgLy8gYnJpZ2h0U2t5Qmx1ZVxuICAgICAgICAgICAgJ3Bvcyc6IDJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ3NlY3VyaXR5JyxcbiAgICAgICAgICAgICdjb2xvcic6ICdyZ2IoMjQ4LCA0NCwgMTAzKScsIC8vIHJlZFBpbmtcbiAgICAgICAgICAgICdwb3MnOiAzXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdjb21mb3J0JyxcbiAgICAgICAgICAgICdjb2xvcic6ICdyZ2IoMjUwLCAyNTUsIDEzMSknLCAvLyBicmlnaHRTa3lCbHVlXG4gICAgICAgICAgICAncG9zJzogNFxuICAgICAgICB9XG4gICAgXVxufTtcbmV4cG9ydCBkZWZhdWx0IGRhdGFzO1xuIiwiLy9pbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbSwgc3VtIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgc2tldGNoIGZyb20gJy4vc2tldGNoJztcbmltcG9ydCBUb29scyBmcm9tICcuL1Rvb2xzJztcblxuXG4vLyBnbG9iYWwgdG9vbHNcbndpbmRvdy50b29scyA9IG5ldyBUb29scygpO1xuXG5pZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZWxpbmUnKSkge1xuICAgIG5ldyBwNShza2V0Y2gsICd0aW1lbGluZScpO1xufVxuXG4iLCIvL2ltcG9ydCBCdWJibGUgZnJvbSAnLi9idWJibGUnO1xuaW1wb3J0IGRhc2hlZExpbmUgZnJvbSAnLi9kYXNoZWRMaW5lJztcbmltcG9ydCBBcnRpY2xlIGZyb20gJy4vYXJ0aWNsZSc7XG5pbXBvcnQgZGF0YXMgZnJvbSAnLi9kYXRhcyc7XG5pbXBvcnQgQ2F0ZWdvcnkgZnJvbSAnLi9jYXRlZ29yeSc7XG5cbi8vIEFkZCBleHRlbnNpb24gdG8gUDVcbnA1LnByb3RvdHlwZS5kYXNoZWRMaW5lID0gZGFzaGVkTGluZTtcblxuLy8gU2V0dXAgdGltZWxpbmVcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCBwICkge1xuICAgIGxldCBhcnRpY2xlcyA9IFtdO1xuICAgIGxldCBjYXRlZ29yaWVzID0gW107XG4gICAgbGV0IGZvbnQ7XG5cbiAgICAvLyBUSU1FTElORSBDT05GSUdTIC8vLy8vLy8vL1xuICAgIGNvbnN0IHBhZGRpbmcgPSBbMCwgODBdO1xuICAgIGxldCBXID0gcC53aW5kb3dXaWR0aDtcbiAgICBsZXQgSCA9IHAud2luZG93SGVpZ2h0O1xuICAgIGNvbnN0IGNhdFBvc1kgPSBbXG4gICAgICAgIChILzQgKyA0NSksXG4gICAgICAgIChILzMgKyA0NSksXG4gICAgICAgIChIIC0gSC8zIC0gNDUpLFxuICAgICAgICAoSCAtIEgvNCAtIDQ1KVxuICAgIF07XG4gICAgcC50bFN0YXRlcyA9IHtcbiAgICAgICAgJ2NhdGVnb3J5U2VsZWN0ZWQnOiBmYWxzZSxcbiAgICAgICAgJ3BhbmVsT3BlbmVkJzogZmFsc2UsXG4gICAgICAgICdsb2FkZWQnOiBmYWxzZVxuICAgIH07XG4gICAgLy8gRU5EIFRJTUVMSU5FIENPTkZJR1MgLy8vLy8vL1xuXG4gICAgLy8gVEwgUEFORUwgLy8vLy8vLy8vLy8vXG4gICAgY29uc3QgdWlQYW5lbCA9IHtcbiAgICAgICAgJ2NvbnRhaW5lcicgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGwtYXJ0aWNsZS1wYW5lbCcpLFxuICAgICAgICAnZGF0ZScgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJ0aWNsZS1kYXRlJyksXG4gICAgICAgICd0aXRsZScgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJ0aWNsZS10aXRsZScpLFxuICAgICAgICAnY29udGVudCcgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJ0aWNsZS1jb250ZW50JyksXG4gICAgICAgICdsaW5rJyA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcnRpY2xlLWxpbmsnKSxcbiAgICAgICAgJ2Nsb3NlQnV0dG9uJyA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZS1idXR0b24nKSxcbiAgICB9O1xuXG4gICAgLy8gVWkgY2xvc2Ugb24gYnV0dG9uIGNsaWNrXG4gICAgdWlQYW5lbC5jbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgY2xvc2VQYW5lbCgpIH0pO1xuXG4gICAgZnVuY3Rpb24gY2xvc2VQYW5lbCgpIHtcbiAgICAgICAgaWYodWlQYW5lbC5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVuJykpIHtcbiAgICAgICAgICAgIHVpUGFuZWwuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcbiAgICAgICAgICAgIHAudGxTdGF0ZXMucGFuZWxPcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNFVFVQIFA1IERBVEFTIC8vLy8vLy8vXG5cbiAgICBsZXQgUGNvbG9ycyA9IE9iamVjdC5rZXlzKGRhdGFzLmNvbG9ycykucmVkdWNlKGZ1bmN0aW9uKHByZXZpb3VzLCBjdXJyZW50KSB7XG4gICAgICAgIHByZXZpb3VzW2N1cnJlbnRdID0gcC5jb2xvcihkYXRhcy5jb2xvcnNbY3VycmVudF0pO1xuICAgICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgfSwge30pO1xuXG4gICAgLy8gUGFyc2UgY2F0ZWdvcmllc1xuICAgIGRhdGFzLmNhdGVnb3JpZXMuZm9yRWFjaCgoYywga2V5KSA9PiB7XG4gICAgICAgIGxldCBjdXJyZW50Q2F0ID0gbmV3IENhdGVnb3J5KE9iamVjdC5hc3NpZ24oYyx7cH0pKTtcbiAgICAgICAgY3VycmVudENhdC5wb3NZID0gY2F0UG9zWVtjLnBvcyAtIDFdOyAvLyBTZXQgWSBwb3NcbiAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGN1cnJlbnRDYXQpO1xuICAgICAgICBjYXRlZ29yaWVzW2tleV0uaW5pdCgpO1xuICAgIH0pO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLy8gRU5EIFRJTUVMSU5FIENPTkZJR1MgLy8vLy8vLy8vXG5cbiAgICBsZXQgY3YgPSBudWxsO1xuXG4gICAgcC5wcmVsb2FkID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIExvYWQgZm9udFxuICAgICAgICBmb250ID0gcC5sb2FkRm9udCgnLi9mb250L2thcmxhLnR0ZicpO1xuXG4gICAgICAgIC8vIEdldCBhbGwgYXJ0aWNsZXMgZnJvbSBnZW5lcmF0ZWQgaHVnbyBqc29uXG4gICAgICAgIGNvbnN0IHVybCA9ICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArICcvYXJ0aWNsZXMvaW5kZXguanNvbic7XG4gICAgICAgIHAubG9hZEpTT04odXJsLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5hcnRpY2xlcy5mb3JFYWNoKCAoYXJ0aWNsZSwga2V5KSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxldCBhcnRpY2xlQ2F0ZWdvcnkgPSBjYXRlZ29yaWVzLmZpbHRlciggKGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5pZCA9PT0gYXJ0aWNsZS5jYXRlZ29yaWVzWzBdXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBhcnRpY2xlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBuZXcgQXJ0aWNsZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwOiBwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRvb2xzLmdldExhc3RQYXJ0VXJsKGFydGljbGUudXJsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBhcnRpY2xlLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGFydGljbGUuY2F0ZWdvcmllc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGFydGljbGUuZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYXJ0aWNsZS51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sOiBhcnRpY2xlWydjb250ZW50X2h0bWwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhcnRpY2xlQ2F0ZWdvcnlbMF0uY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBtYWtlIGluIGFydGljbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHNldERhdGVUb1Bvc1goYXJ0aWNsZS5kYXRlLGRhdGFzLmRhdGVSYW5nZVswXSxkYXRhcy5kYXRlUmFuZ2VbMV0scGFkZGluZ1sxXSwgVyAtIHBhZGRpbmdbMV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJ0aWNsZUNhdGVnb3J5WzBdLnBvc1ksXG4gICAgICAgICAgICAgICAgICAgICAgICB1aVBhbmVsOiB1aVBhbmVsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBhcnRpY2xlc1trZXldLmluaXQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNvcnQgYXJ0aWNsZXNcbiAgICAgICAgYXJ0aWNsZXMuc29ydChmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgICAgIGxldCBzb3J0UGFyYW0gPSAnZGF0ZSc7XG4gICAgICAgICAgICByZXR1cm4gKGFbc29ydFBhcmFtXSA+IGJbc29ydFBhcmFtXSkgPyAxIDogKChiW3NvcnRQYXJhbV0gPiBhW3NvcnRQYXJhbV0pID8gLTEgOiAwKVxuICAgICAgICB9KVxuICAgIH07XG5cbiAgICBwLnNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGN2ID0gcC5jcmVhdGVDYW52YXMoVywgSCk7XG4gICAgICAgIGN2Lm1vdXNlQ2xpY2tlZChjdk1vdXNlQ2xpY2tlZCk7XG5cbiAgICAgICAgc2V0dXBBcnRpY2xlc0xpbmVzKCk7XG4gICAgfTtcblxuICAgIHAuZHJhdyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHAuY2xlYXIoKTtcblxuICAgICAgICAvLyBDVVJTT1IgU1RBVEVcbiAgICAgICAgcC5jdXJzb3IocC5BUlJPVyk7XG5cbiAgICAgICAgLy8gRk9OVFxuICAgICAgICBwLnRleHRGb250KGZvbnQpO1xuXG4gICAgICAgIC8vLy8vLy8gTU9OVEhTIC8vLy8vLy8vXG5cbiAgICAgICAgLy8gTW9udGhzIGxpbmVcbiAgICAgICAgcC5zdHJva2UoUGNvbG9ycy5wYWxlSWxhY1RyYW5zcGFyZW50KTtcbiAgICAgICAgcC5zdHJva2VXZWlnaHQoMSk7XG5cbiAgICAgICAgLy8gTW9udGhzXG4gICAgICAgIHAubGluZShwYWRkaW5nWzFdLCBILzIsIFctcGFkZGluZ1sxXSwgSC8yKTtcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8ZGF0YXMubW9udGhzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIGxldCBhbXQgPSAoIGkvKGRhdGFzLm1vbnRocy5sZW5ndGggLSAxKSApICogMTtcbiAgICAgICAgICAgIGxldCBtb250aFggPSBwLmxlcnAocGFkZGluZ1sxXSwgVy1wYWRkaW5nWzFdLCBhbXQpO1xuICAgICAgICAgICAgbGV0IHRleHRPZmZlc3QgPSAoKGkrMSkgJSAyID09IDApID8gMzAgOiAtMjA7XG5cbiAgICAgICAgICAgIC8vIGNpcmNsZSBhbmQgdmVydGljYWwgZGFzaCBsaW5lXG4gICAgICAgICAgICBpZihpICE9PSAwICYmIGkgIT09IGRhdGFzLm1vbnRocy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgcC5lbGxpcHNlKG1vbnRoWCwgSC8yLCA5KTtcbiAgICAgICAgICAgICAgICBwLnN0cm9rZShQY29sb3JzLnBhbGVJbGFjVHJhbnNwYXJlbnQpO1xuICAgICAgICAgICAgICAgIHAuZGFzaGVkTGluZShtb250aFgsSC80LG1vbnRoWCxILUgvNCwxLDE1KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdGV4dFxuICAgICAgICAgICAgcC5ub1N0cm9rZSgpO1xuICAgICAgICAgICAgcC5maWxsKFBjb2xvcnMucGFsZUlsYWMpO1xuICAgICAgICAgICAgcC50ZXh0U2l6ZSgxNCk7XG4gICAgICAgICAgICBwLnRleHRBbGlnbihwLkNFTlRFUik7XG4gICAgICAgICAgICBwLnB1c2goKTtcbiAgICAgICAgICAgIHAudGV4dChkYXRhcy5tb250aHNbaV0sIG1vbnRoWCwgSC8yK3RleHRPZmZlc3QpO1xuICAgICAgICB9XG4gICAgICAgIHAucG9wKCk7XG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvLy8vLy8vIENBVEVHT1JJRVMgLy8vLy8vLy9cblxuICAgICAgICAvLyBDbGljayBmaWx0ZXJcbiAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoKCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgIGNhdGVnb3J5LmhvdmVyZWQocC5tb3VzZVgscC5tb3VzZVkpO1xuICAgICAgICAgICAgY2F0ZWdvcnkuc2hvdygpO1xuXG4gICAgICAgICAgICAvLyBjbGlja1xuICAgICAgICAgICAgaWYoY2F0ZWdvcnkuaXNDbGlja2VkKSB7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoKCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkuaXNDbGlja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcnkuaXNDbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoY2F0ZWdvcnkuaXNDbGlja2VkKSB7XG4gICAgICAgICAgICAgICAgcC50bFN0YXRlcy5jYXRlZ29yeVNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmaWx0ZXJBcnRpY2xlcyhjYXRlZ29yeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHAudGxTdGF0ZXMuY2F0ZWdvcnlTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBIb3ZlciBmaWx0ZXJcbiAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoKCBmdW5jdGlvbihjYXRlZ29yeSkge1xuICAgICAgICAgICAgLy8gaG92ZXJcbiAgICAgICAgICAgIGlmKGNhdGVnb3J5LmlzSG92ZXJlZCkge1xuICAgICAgICAgICAgICAgIGZpbHRlckFydGljbGVzKGNhdGVnb3J5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VsZWN0IHN0YXRlXG4gICAgICAgICAgICBpZihjYXRlZ29yeS5pc0hvdmVyZWQgfHwgY2F0ZWdvcnkuaXNDbGlja2VkKSB7XG4gICAgICAgICAgICAgICAgcC50bFN0YXRlcy5jYXRlZ29yeVNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcC50bFN0YXRlcy5jYXRlZ29yeVNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG4gICAgICAgIC8vLy8vLy8gQVJUSUNMRVMgLy8vLy8vLy9cbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCggZnVuY3Rpb24gKGFydGljbGUpIHtcbiAgICAgICAgICAgIGFydGljbGUuaG92ZXJlZChwLm1vdXNlWCxwLm1vdXNlWSk7XG4gICAgICAgICAgICBhcnRpY2xlLnNob3coKTtcbiAgICAgICAgICAgIGlmKCFwLnRsU3RhdGVzLmNhdGVnb3J5U2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBhcnRpY2xlLmRhcmtlbmVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gVFdFRU5TIC8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICBUV0VFTi51cGRhdGUoKTtcbiAgICB9O1xuXG4gICAgcC53aW5kb3dSZXNpemVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBXID0gcC53aW5kb3dXaWR0aDtcbiAgICAgICAgSCA9IHAud2luZG93SGVpZ2h0O1xuICAgICAgICBwLnJlc2l6ZUNhbnZhcyhXLCBIKTtcblxuICAgICAgICAvLyBUT0RPOiByZS1jYWxjdWwgYXJ0aWNsZSBwb3MgYW5kIGNhdGVnb3JpZXMgcG9zXG4gICAgfTtcblxuICAgIC8vIElOVEVSQUNUSU9OUyAvLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGZ1bmN0aW9uIGN2TW91c2VDbGlja2VkICgpIHtcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCggZnVuY3Rpb24gKGFydGljbGUpIHtcbiAgICAgICAgICAgIGFydGljbGUuY2xpY2tlZChwLm1vdXNlWCxwLm1vdXNlWSlcbiAgICAgICAgfSk7XG4gICAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCggZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG4gICAgICAgICAgICBjYXRlZ29yeS5pc0NsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNhdGVnb3J5LmNsaWNrZWQocC5tb3VzZVgscC5tb3VzZVkpXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gTGVzIHRyYWl0cyAhXG4gICAgLy8gVE9ETzogaW4gY2xhc3MgYXJ0aWNsZXNNYW5hZ2VyID9cbiAgICBmdW5jdGlvbiBzZXR1cEFydGljbGVzTGluZXMoKSB7XG4gICAgICAgIGxldCBsYXN0TW9udGggPSAwO1xuICAgICAgICBsZXQgbGFzdENvb3JkcyA9IHt4OjAseTowfTtcblxuICAgICAgICBkYXRhcy5jYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xuICAgICAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaChhcnRpY2xlID0+IHtcbiAgICAgICAgICAgICAgICBpZihhcnRpY2xlLmNhdGVnb3J5ID09PSBjYXRlZ29yeS5pZCkge1xuICAgICAgICAgICAgICAgICAgICBpZihsYXN0TW9udGggPT09IG5ldyBEYXRlKGFydGljbGUuZGF0ZSkuZ2V0TW9udGgoKSArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFydGljbGUuaGFzTGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpY2xlLmxpbmVUby54ID0gbGFzdENvb3Jkcy54O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZS5saW5lVG8ueSA9IGxhc3RDb29yZHMueTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9udGggPSBuZXcgRGF0ZShhcnRpY2xlLmRhdGUpLmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBsYXN0Q29vcmRzLnggPSBhcnRpY2xlLng7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RDb29yZHMueSA9IGFydGljbGUueTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvLyBURU1QIFVUSUxTIC8vLy8vLy8vL1xuXG4gICAgLy8gVE9ETzogYWRkIHRvIGFydGljbGVzTWFuYWdlciA/XG4gICAgLypcbiAgICAgKiAgZGF0ZVRvUG9zWFxuICAgICAqXG4gICAgICogIFRyYW5zZm9ybSB0aW1lc3RhbXAgdG8gcG9zaXRpb24gaW4gcGl4ZWwgIHdpdGhpbiBhIHJhbmdlXG4gICAgICogIHJldHVybiBwb3NpdGlvbiBpbiBwaXhlbHMgKGludClcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXREYXRlVG9Qb3NYKGRhdGUsIGJlZ2luRGF0ZSwgRW5kRGF0ZSwgYmVnaW5YLCBlbmRYKSB7XG4gICAgICAgIC8vIERhdGUgVHJhbnNmb3JtXG4gICAgICAgIGNvbnN0IGRhdGVBcnJheSA9IFtkYXRlLCBiZWdpbkRhdGUsIEVuZERhdGVdO1xuICAgICAgICBjb25zdCBkYXRlVGltZXMgPSBbXTtcbiAgICAgICAgZGF0ZUFycmF5LmZvckVhY2goIGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgICAgICBkYXRlVGltZXMucHVzaChuZXcgRGF0ZShkYXRlKS5nZXRUaW1lKCkpXG4gICAgICAgIH0pO1xuICAgICAgICAvLyByZXR1cm4gcG9zIGluIHBpeGVsXG4gICAgICAgIHJldHVybiBwLm1hcChkYXRlVGltZXNbMF0sIGRhdGVUaW1lc1sxXSwgZGF0ZVRpbWVzWzJdLCBiZWdpblgsIGVuZFgpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogZmlsdGVyQXJ0aWNsZXNcbiAgICAgKlxuICAgICAqIFNldCBhcnRpY2xlIG9wYWNpdHkgd2l0aCBzZWxlY3RlZCBjYXRlZ29yaWVzXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlsdGVyQXJ0aWNsZXMoY2F0ZWdvcnkpIHtcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCggZnVuY3Rpb24gKGFydGljbGUpIHtcbiAgICAgICAgICAgIGlmKGFydGljbGUuY2F0ZWdvcnkgIT09IGNhdGVnb3J5LmlkKSB7XG4gICAgICAgICAgICAgICAgYXJ0aWNsZS5kYXJrZW5lZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFydGljbGUuZGFya2VuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbn0iXX0=
