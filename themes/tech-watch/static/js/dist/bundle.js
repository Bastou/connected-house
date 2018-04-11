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
        _classCallCheck(this, Article);

        props = props || {}; //this is default value for param.

        // P5
        this.p = props.p;

        // Article metas
        this.id = props.id;
        this.category = props.category;
        this.title = props.title;
        this.date = props.date;
        this.link = props.link;
        this.html = props.html;

        this.hTitle;
        this.hWordTitleLenght = 6;

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
        this.aroundCircles;

        // title in View
        this.tlTitlePos = {};
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
        this.afterOnTop = false; // Si articles d'après de la même date et au dessu
    }

    _createClass(Article, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.x += this._r / 2;
            if (this.isOnTop) {
                this.y -= 20;
            }
            this.aroundCircles = new Array(this.aroundCirclesNb).fill(0).map(function (c) {
                return { x: _this.x, y: _this.y, r: 0 };
            });
            this.setPcolor(this.color);
            this.setTlTitle(this.title);
            if (this.afterOnTop) {
                this.tlTitlePos = { x: this.x - 90, y: this.y - 70 };
            } else {
                this.tlTitlePos = { x: this.x - 90, y: this.y - 50 };
            }
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
            this.p.text(this.hTitle, this.tlTitlePos.x, this.tlTitlePos.y, 180, 50);
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
            this.uiPanel.link.setAttribute('href', this.link);
            this.uiPanel.closeButton.style.color = this.color;
            this.uiPanel.container.classList.add('open');
            this.p.tlStates.panelOpened = true;
        }
    }, {
        key: 'setTlTitle',
        value: function setTlTitle(title) {
            var titleLength = this.title.split(" ").length;
            if (titleLength > this.hWordTitleLenght) {
                this.hTitle = title.split(" ").splice(0, this.hWordTitleLenght).join(" ") + "...";
            } else {
                this.hTitle = title;
            }
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

            // Map json data with class articles
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
                    link: article.link,
                    html: article['content_html'],
                    color: articleCategory[0].color,
                    // TODO: make in article
                    x: setDateToPosX(article.date, _datas2.default.dateRange[0], _datas2.default.dateRange[1], padding[1], W - padding[1]),
                    y: articleCategory[0].posY,
                    uiPanel: uiPanel
                }));
                //articles[key].init();
            });

            // Sort articles
            articles.sort(function (a, b) {
                var sortParam = 'date';
                return a[sortParam] > b[sortParam] ? 1 : b[sortParam] > a[sortParam] ? -1 : 0;
            });

            // Special articles options
            setupArticlesLines();

            // distribute particles of same date on Y
            setupArticlesOnTop();

            // Init articles
            articles.forEach(function (article) {
                article.init();
            });
        });
    };

    p.setup = function () {
        cv = p.createCanvas(W, H);
        cv.mouseClicked(cvMouseClicked);

        // Special articles options
        setupArticlesLines();
        // TODO: add before articles init
        //setupArticlesOnTop();
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
        var wasOnTop = false;

        _datas2.default.categories.forEach(function (category) {
            articles.forEach(function (article) {
                if (article.category === category.id) {
                    if (lastMonth === new Date(article.date).getMonth() + 1 && !wasOnTop) {
                        article.hasLine = true;
                        article.lineTo.x = lastCoords.x;
                        article.lineTo.y = lastCoords.y;
                    }
                    lastMonth = new Date(article.date).getMonth() + 1;
                    lastCoords.x = article.x;
                    lastCoords.y = article.y;
                    wasOnTop = article.isOnTop;
                }
            });
        });
    }

    function setupArticlesOnTop() {
        var lastArticle = null;

        _datas2.default.categories.forEach(function (category) {
            articles.forEach(function (article, key) {
                if (article.category === category.id) {
                    if (lastArticle && lastArticle.date === article.date) {
                        article.isOnTop = true;
                        if (key >= 0) {
                            lastArticle.afterOnTop = true;
                        }
                    }
                    lastArticle = article;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvanMvVG9vbHMuanMiLCJzdGF0aWMvanMvYXJ0aWNsZS5qcyIsInN0YXRpYy9qcy9jYXRlZ29yeS5qcyIsInN0YXRpYy9qcy9kYXNoZWRMaW5lLmpzIiwic3RhdGljL2pzL2RhdGFzLmpzIiwic3RhdGljL2pzL21haW4uanMiLCJzdGF0aWMvanMvc2tldGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBO0lBQ3FCLEs7QUFFakIscUJBQWM7QUFBQTs7QUFDVixhQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDSDs7Ozs4QkFFSyxNLEVBQVE7QUFDVixtQkFBTyxVQUFRLEtBQUssRUFBTCxHQUFRLEdBQWhCLENBQVA7QUFDSDs7OzhCQUNLLEcsRUFBSztBQUFFLG1CQUFPLE1BQU0sQ0FBYjtBQUFlOzs7NEJBQ3hCLEssRUFBTztBQUNQLGdCQUFJLEtBQUssWUFBTCxJQUFxQixJQUFyQixJQUE2QixLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsT0FBaUMsTUFBTSxRQUFOLEVBQTlELElBQW1GLEtBQUssS0FBTCxDQUFXLEtBQUssWUFBTCxHQUFvQixJQUEvQixJQUF1QyxJQUF4QyxLQUFtRCxLQUFLLEtBQUwsQ0FBVyxRQUFRLElBQW5CLElBQTJCLElBQXBLLEVBQTJLO0FBQ3ZLLHdCQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0g7QUFDRCxpQkFBSyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0g7QUFDRDs7Ozs7Ozs7dUNBS2UsRyxFQUFLO0FBQ2hCLGdCQUFNLEtBQUssZ0JBQVg7QUFDQSxtQkFBTyxJQUFJLEtBQUosQ0FBVSxFQUFWLEVBQWMsQ0FBZCxDQUFQO0FBQ0g7Ozs7OztrQkF6QmdCLEs7QUEwQnBCOzs7Ozs7Ozs7Ozs7O0FDM0JEOzs7O0lBSXFCLE87QUFDakIscUJBQVksS0FBWixFQUFtQjtBQUFB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QWpDLEVBQXFDO0FBQ2pDLHdCQUFRLFFBQVIsR0FBbUIsSUFBbkI7QUFDSCxhQUZELE1BRU87QUFDSCx3QkFBUSxRQUFSLEdBQW1CLEtBQW5CO0FBQ0g7QUFDSixTQU5EO0FBT0g7QUFDRDtBQUVILEM7O0FBL1VEOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTtBQU5BO0FBT0EsR0FBRyxTQUFILENBQWEsVUFBYjs7QUFFQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiLy8gVG9vbHNcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2xzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxvZ1ByZXZWYWx1ZSA9IG51bGxcbiAgICAgICAgdGhpcy5sb2dDb3VudCA9IDBcbiAgICB9XG5cbiAgICBkZTJyYShkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSooTWF0aC5QSS8xODApO1xuICAgIH1cbiAgICBpc09kZChudW0pIHsgcmV0dXJuIG51bSAlIDJ9XG4gICAgTG9nKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmxvZ1ByZXZWYWx1ZSA9PSBudWxsIHx8IHRoaXMubG9nUHJldlZhbHVlLnRvU3RyaW5nKCkgIT09IHZhbHVlLnRvU3RyaW5nKCkgfHwgKE1hdGgucm91bmQodGhpcy5sb2dQcmV2VmFsdWUgKiAxMDAwKSAvIDEwMDApICE9PSAoTWF0aC5yb3VuZCh2YWx1ZSAqIDEwMDApIC8gMTAwMCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ1ByZXZWYWx1ZSA9IHZhbHVlXG4gICAgfVxuICAgIC8qXG4gICAgICogIHNsdWdpZnlVcmxcbiAgICAgKiAgZ2V0IGxhc3QgcGFydCBvZiB1cmxcbiAgICAgKlxuICAgICAqL1xuICAgIGdldExhc3RQYXJ0VXJsKHVybCkge1xuICAgICAgICBjb25zdCByZSA9ICdbXi9dKyg/PVxcLyR8JCknXG4gICAgICAgIHJldHVybiB1cmwubWF0Y2gocmUpWzBdO1xuICAgIH1cbn07XG5cblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEJhc3RvdSBvbiAwNi8wNC8yMDE4LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFydGljbGUge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHByb3BzID0gcHJvcHMgfHwge307IC8vdGhpcyBpcyBkZWZhdWx0IHZhbHVlIGZvciBwYXJhbS5cblxuICAgICAgICAvLyBQNVxuICAgICAgICB0aGlzLnAgPSBwcm9wcy5wO1xuXG4gICAgICAgIC8vIEFydGljbGUgbWV0YXNcbiAgICAgICAgdGhpcy5pZCA9IHByb3BzLmlkO1xuICAgICAgICB0aGlzLmNhdGVnb3J5ID0gcHJvcHMuY2F0ZWdvcnk7XG4gICAgICAgIHRoaXMudGl0bGUgPSBwcm9wcy50aXRsZTtcbiAgICAgICAgdGhpcy5kYXRlID0gcHJvcHMuZGF0ZTtcbiAgICAgICAgdGhpcy5saW5rID0gcHJvcHMubGluaztcbiAgICAgICAgdGhpcy5odG1sID0gcHJvcHMuaHRtbDtcblxuICAgICAgICB0aGlzLmhUaXRsZTtcbiAgICAgICAgdGhpcy5oV29yZFRpdGxlTGVuZ2h0ID0gNjtcblxuICAgICAgICAvLyBBcnRpY2xlIGNhbnZhcyBzaGFwZVxuICAgICAgICB0aGlzLnggPSBwcm9wcy54O1xuICAgICAgICB0aGlzLnkgPSBwcm9wcy55O1xuICAgICAgICB0aGlzLmNvbG9yID0gcHJvcHMuY29sb3I7XG4gICAgICAgIHRoaXMucENvbG9yO1xuICAgICAgICB0aGlzLmNvbG9yQWxwaGEgPSB7XG4gICAgICAgICAgICBhOjAsXG4gICAgICAgICAgICBpbjogMCxcbiAgICAgICAgICAgIG91dDoyNTVcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kYXJrZW5lZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIHBhbmVsXG4gICAgICAgIHRoaXMudWlQYW5lbCA9IHByb3BzLnVpUGFuZWw7XG5cbiAgICAgICAgLy8gQXJ0aWNsZSBsaW5lIGlmIGNvbm5lY3RlZCB0byBhbm90aGVyIGFydGljbGVcbiAgICAgICAgdGhpcy5oYXNMaW5lID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGluZVRvID0ge3g6MCx5OjB9O1xuXG4gICAgICAgIC8vIHByaXZhdGVcbiAgICAgICAgdGhpcy5fciA9IDEwO1xuXG4gICAgICAgIC8vIEFyb3VuZCBjaXJjbGVzXG5cbiAgICAgICAgLy8gVE9ETzogcHV0IHRoYXQgc3R1ZmYgaW4gYW4gb2JqZWN0IGZ1Y2sgb2ZmXG4gICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlc05iID0gNDtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVST2ZmID0gMDtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVzO1xuXG4gICAgICAgIC8vIHRpdGxlIGluIFZpZXdcbiAgICAgICAgdGhpcy50bFRpdGxlUG9zID0ge307XG4gICAgICAgIHRoaXMudWlUaXRsZUFscGhhID0ge2E6MH07IC8vIG11c3QgIGJlIGFuIG9iamVjdCBmb3IgVHdlZW5cbiAgICAgICAgdGhpcy51aVRpdGxlUCA9IHtcbiAgICAgICAgICAgICdhbHBoYSc6IHt4OjAsIHk6MH0sXG4gICAgICAgICAgICAnYWxwaGFUYXJnZXQnOiB7YToyNTV9LFxuICAgICAgICAgICAgJ3R3ZWVuJzogbmV3IFRXRUVOLlR3ZWVuKHRoaXMudWlUaXRsZUFscGhhKVxuICAgICAgICAgICAgICAgIC50byh7YTogMjU1fSwgNTAwKVxuICAgICAgICAgICAgICAgIC5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YWRyYXRpYy5JbilcbiAgICAgICAgICAgICAgICAub25VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMudWlUaXRsZUFscGhhLmEpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgJ3N0YXJ0ZWQnOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIElzIG9uVG9wXG4gICAgICAgIHRoaXMuaXNPblRvcCA9IGZhbHNlOyAvLyBTaSBhcnRpY2xlcyBkZSBsYSBtw6ptZSBkYXRlIGFsb3JzIGxlIHByw6ljw6lkZW50IGF1IGRlc3N1c1xuICAgICAgICB0aGlzLmFmdGVyT25Ub3AgPSBmYWxzZTsgLy8gU2kgYXJ0aWNsZXMgZCdhcHLDqHMgZGUgbGEgbcOqbWUgZGF0ZSBldCBhdSBkZXNzdVxuXG4gICAgfVxuXG4gICAgaW5pdCAoKSB7XG4gICAgICAgIHRoaXMueCArPSB0aGlzLl9yLzI7XG4gICAgICAgIGlmKHRoaXMuaXNPblRvcCkge1xuICAgICAgICAgICAgdGhpcy55IC09IDIwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlcyA9IG5ldyBBcnJheSh0aGlzLmFyb3VuZENpcmNsZXNOYikuZmlsbCgwKS5tYXAoYyA9PiAoe3g6dGhpcy54LCB5OnRoaXMueSxyOjB9KSk7XG4gICAgICAgIHRoaXMuc2V0UGNvbG9yKHRoaXMuY29sb3IpO1xuICAgICAgICB0aGlzLnNldFRsVGl0bGUodGhpcy50aXRsZSk7XG4gICAgICAgIGlmKHRoaXMuYWZ0ZXJPblRvcCkge1xuICAgICAgICAgICAgdGhpcy50bFRpdGxlUG9zID0ge3g6dGhpcy54IC0gOTAsIHk6dGhpcy55IC0gNzB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRsVGl0bGVQb3MgPSB7eDp0aGlzLnggLSA5MCwgeTp0aGlzLnkgLSA1MH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsaWNrZWQocHgsIHB5KSB7XG4gICAgICAgIGlmKHRoaXMucG9pbnRlckluQXJ0aWNsZShweCxweSkpIHtcbiAgICAgICAgICAgIHRoaXMub3BlblBhbmVsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBob3ZlcmVkKHB4LCBweSkge1xuICAgICAgICBpZih0aGlzLnBvaW50ZXJJbkFydGljbGUocHgscHkpKSB7XG4gICAgICAgICAgICAvLyB0aXRsZSBpblxuICAgICAgICAgICAgdGhpcy5kcmF3VGl0bGUoKTtcblxuICAgICAgICAgICAgLy8gY2lyY2xlcyBpblxuICAgICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlc0Fyb3VuZCgpXG5cbiAgICAgICAgICAgIHRoaXMucC5jdXJzb3IodGhpcy5wLkhBTkQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGl0bGUgb3V0XG4gICAgICAgICAgICB0aGlzLmRyYXdUaXRsZSh0cnVlKTtcblxuICAgICAgICAgICAgLy8gY2lyY2xlcyBvdXRcbiAgICAgICAgICAgIHRoaXMuZHJhd0NpcmNsZXNBcm91bmQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwb2ludGVySW5BcnRpY2xlKHB4LHB5KSB7XG4gICAgICAgIGxldCBkID0gdGhpcy5wLmRpc3QocHgsIHB5LCB0aGlzLngsIHRoaXMueSk7XG4gICAgICAgIGlmKGQgPCB0aGlzLl9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIC8vIEFuaW1hdGUgYWxwaGFcbiAgICAgICAgdGhpcy5jb2xvckFscGhhLmEgKz0gKCB0aGlzLmNvbG9yQWxwaGEub3V0IC0gdGhpcy5jb2xvckFscGhhLmEpICogMC4xOTtcblxuICAgICAgICB0aGlzLnAubm9TdHJva2UoKTtcbiAgICAgICAgaWYodGhpcy5kYXJrZW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xvckFscGhhLm91dCA9IDQwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb2xvckFscGhhLm91dCA9IDI1NTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBDb2xvci5zZXRBbHBoYSh0aGlzLmNvbG9yQWxwaGEuYSk7XG4gICAgICAgIHRoaXMucC5maWxsKHRoaXMucENvbG9yKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5wLmVsbGlwc2UodGhpcy54LCB0aGlzLnksIHRoaXMuX3IpO1xuICAgICAgICB0aGlzLnAucG9wKCk7XG5cbiAgICAgICAgaWYodGhpcy5oYXNMaW5lKSB7XG4gICAgICAgICAgICB0aGlzLnAuc3Ryb2tlKHRoaXMucENvbG9yKTtcbiAgICAgICAgICAgIHRoaXMucC5zdHJva2VXZWlnaHQoNCk7XG4gICAgICAgICAgICB0aGlzLnAucHVzaCgpO1xuICAgICAgICAgICAgdGhpcy5wLmxpbmUodGhpcy54LCB0aGlzLnksIHRoaXMubGluZVRvLngsIHRoaXMubGluZVRvLnkpO1xuICAgICAgICAgICAgdGhpcy5wLnBvcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhd0NpcmNsZXNBcm91bmQob3V0ID0gZmFsc2UpIHtcbiAgICAgICAgaWYob3V0ICYmIHRoaXMuYXJvdW5kQ2lyY2xlcy5yID09PSAwKSByZXR1cm47XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnBDb2xvci5zZXRBbHBoYSg0MCk7XG4gICAgICAgIHRoaXMucC5maWxsKHRoaXMucENvbG9yKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVzLmZvckVhY2goKGMsIGkpID0+IHtcbiAgICAgICAgICAgIC8vIGVhc2UgcmFkaXVzIHNpemVcbiAgICAgICAgICAgIGlmKG91dCkge1xuICAgICAgICAgICAgICAgIGMuciAgKz0gKDAgLSBjLnIgKSAqIDAuMTM7XG4gICAgICAgICAgICB9ICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVST2ZmICs9IDAuMDA3O1xuICAgICAgICAgICAgICAgIGxldCBuID0gdGhpcy5wLm5vaXNlKHRoaXMuYXJvdW5kQ2lyY2xlUk9mZikqMS41O1xuICAgICAgICAgICAgICAgIGMuciAgKz0gKCAodGhpcy5fciArIG4gKyAoaSAqIDEyICogbikgKSAtIGMuciApICogMC4xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wLmVsbGlwc2UoYy54LCBjLnksIGMucilcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICAgICAgdGhpcy5wQ29sb3Iuc2V0QWxwaGEoMjU1KTtcbiAgICB9XG5cbiAgICBkcmF3VGl0bGUob3V0ID0gZmFsc2UpIHtcbiAgICAgICAgaWYob3V0KSB7XG4gICAgICAgICAgICB0aGlzLnVpVGl0bGVQLnR3ZWVuLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMudWlUaXRsZVAuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy51aVRpdGxlQWxwaGEuYSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIXRoaXMudWlUaXRsZVAuc3RhcnRlZCAmJiAhb3V0KSB7XG4gICAgICAgICAgICB0aGlzLnVpVGl0bGVQLnR3ZWVuLnN0YXJ0KCk7XG4gICAgICAgICAgICB0aGlzLnVpVGl0bGVQLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKG91dCkgcmV0dXJuO1xuICAgICAgICB0aGlzLnBDb2xvci5zZXRBbHBoYSh0aGlzLnVpVGl0bGVBbHBoYS5hKTtcbiAgICAgICAgdGhpcy5wLm5vU3Ryb2tlKCk7XG4gICAgICAgIHRoaXMucC5maWxsKHRoaXMucENvbG9yKTtcbiAgICAgICAgdGhpcy5wLnRleHRBbGlnbih0aGlzLnAuQ0VOVEVSKTtcbiAgICAgICAgdGhpcy5wLnRleHRTaXplKDE0KTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5wLnRleHQodGhpcy5oVGl0bGUsIHRoaXMudGxUaXRsZVBvcy54LCB0aGlzLnRsVGl0bGVQb3MueSwgMTgwLCA1MCk7XG4gICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICAgICAgdGhpcy5wQ29sb3Iuc2V0QWxwaGEoMjU1KTtcbiAgICB9XG5cbiAgICBzZXRQY29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5wQ29sb3IgPSB0aGlzLnAuY29sb3IoY29sb3IpO1xuICAgIH1cblxuICAgIG9wZW5QYW5lbCgpIHtcbiAgICAgICAgdGhpcy51aVBhbmVsLmRhdGUuaW5uZXJUZXh0ID0gbmV3IERhdGUodGhpcy5kYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgICAgdGhpcy51aVBhbmVsLnRpdGxlLmlubmVyVGV4dCA9IHRoaXMudGl0bGU7XG4gICAgICAgIHRoaXMudWlQYW5lbC5jb250ZW50LmlubmVySFRNTCA9IHRoaXMuaHRtbDtcbiAgICAgICAgdGhpcy51aVBhbmVsLmxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdGhpcy5saW5rKTtcbiAgICAgICAgdGhpcy51aVBhbmVsLmNsb3NlQnV0dG9uLnN0eWxlLmNvbG9yID0gdGhpcy5jb2xvcjtcbiAgICAgICAgdGhpcy51aVBhbmVsLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgICAgIHRoaXMucC50bFN0YXRlcy5wYW5lbE9wZW5lZCA9IHRydWU7XG4gICAgfVxuXG4gICAgc2V0VGxUaXRsZSh0aXRsZSkge1xuICAgICAgICBsZXQgdGl0bGVMZW5ndGggPSB0aGlzLnRpdGxlLnNwbGl0KFwiIFwiKS5sZW5ndGg7XG4gICAgICAgIGlmKHRpdGxlTGVuZ3RoID4gdGhpcy5oV29yZFRpdGxlTGVuZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLmhUaXRsZSA9IHRpdGxlLnNwbGl0KFwiIFwiKS5zcGxpY2UoMCx0aGlzLmhXb3JkVGl0bGVMZW5naHQpLmpvaW4oXCIgXCIpICsgXCIuLi5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaFRpdGxlID0gdGl0bGU7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEJhc3RvdSBvbiAwNi8wNC8yMDE4LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhdGVnb3J5IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICAvLyBwNVxuICAgICAgICB0aGlzLnAgPSBwcm9wcy5wO1xuXG4gICAgICAgIC8vIFByb3BzXG4gICAgICAgIHRoaXMuaWQgPSBwcm9wcy5pZDtcbiAgICAgICAgdGhpcy5jb2xvciA9IHByb3BzLmNvbG9yO1xuICAgICAgICB0aGlzLnBDb2xvciA9IG51bGw7XG4gICAgICAgIHRoaXMucG9zWSA9IHByb3BzLnBvc1k7XG4gICAgICAgIHRoaXMucG9zID0gcHJvcHMucG9zO1xuXG4gICAgICAgIHRoaXMuX3IgPSAxNjtcbiAgICAgICAgdGhpcy54O1xuICAgICAgICB0aGlzLnk7XG4gICAgICAgIHRoaXMuYmJveCA9IHt9O1xuXG4gICAgICAgIHRoaXMudGV4dEZvbnQ7XG5cbiAgICAgICAgdGhpcy5pc0hvdmVyZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmlzQ2xpY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuc2V0UGNvbG9yKHRoaXMuY29sb3IpO1xuICAgICAgICB0aGlzLnNldFBvcyh0aGlzLnBvcyk7XG4gICAgICAgIHRoaXMuc2V0QmJveCgpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLnBDb2xvcik7XG4gICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgIHRoaXMucC5lbGxpcHNlKHRoaXMueCwgdGhpcy55LCB0aGlzLl9yKTtcbiAgICAgICAgdGhpcy5wLnBvcCgpO1xuXG4gICAgICAgIHRoaXMucC5maWxsKCd3aGl0ZScpO1xuICAgICAgICB0aGlzLnAudGV4dFNpemUoMjApO1xuICAgICAgICB0aGlzLnAudGV4dEFsaWduKHRoaXMucC5MRUZUKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5wLnRleHQodGhpcy5pZCwgdGhpcy54ICsgMjUsIHRoaXMueSArIHRoaXMuX3IvMyk7XG4gICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICB9XG5cbiAgICBob3ZlcmVkKHB4LCBweSkge1xuICAgICAgICBpZih0aGlzLnBvaW50ZXJJbkNhdGVnb3J5KHB4LHB5KSkge1xuICAgICAgICAgICAgdGhpcy5wLmN1cnNvcih0aGlzLnAuSEFORCk7XG4gICAgICAgICAgICB0aGlzLmlzSG92ZXJlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzSG92ZXJlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xpY2tlZChweCwgcHkpIHtcbiAgICAgICAgaWYodGhpcy5wb2ludGVySW5DYXRlZ29yeShweCxweSkpIHtcbiAgICAgICAgICAgIHRoaXMuaXNDbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvaW50ZXJJbkNhdGVnb3J5KHB4LHB5KSB7XG4gICAgICAgIGlmICggcHggPj0gdGhpcy5iYm94LnggJiYgcHggPD0gdGhpcy5iYm94LnggKyB0aGlzLmJib3gudyAmJlxuICAgICAgICAgICAgcHkgPj0gdGhpcy5iYm94LnkgJiYgcHkgPD0gdGhpcy5iYm94LnkgKyB0aGlzLmJib3guaCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRQY29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5wQ29sb3IgPSB0aGlzLnAuY29sb3IoY29sb3IpO1xuICAgIH1cblxuICAgIHNldFBvcyhwb3MpIHtcbiAgICAgICAgdGhpcy54ID0gdGhpcy5wLndpbmRvd1dpZHRoLzIgLSA1NDAgKyAoMjAwICogcG9zLTEpO1xuICAgICAgICB0aGlzLnkgPSB0aGlzLnAud2luZG93SGVpZ2h0IC0gdGhpcy5wLndpbmRvd0hlaWdodC80ICsgNDA7XG4gICAgfVxuXG4gICAgc2V0QmJveCgpIHtcbiAgICAgICAgdGhpcy5iYm94ID0ge1xuICAgICAgICAgICAgeDogdGhpcy54IC0gdGhpcy5fci8yLFxuICAgICAgICAgICAgeTogdGhpcy55IC0gdGhpcy5fci8yLFxuICAgICAgICAgICAgdzogMTUwLFxuICAgICAgICAgICAgaDogdGhpcy5fclxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETzogQWRkIGhvdmVyIGNpcmNsZXNcbn0iLCIvKlxuIERyYXcgZGFzaGVkIGxpbmVzIHdoZXJlXG4gKGwgPSBsZW5ndGggb2YgZGFzaGVkIGxpbmUgaW4gcHgsIGcgPSBnYXAgaW4gcHgpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5MiwgbCwgZykge1xuICAgIGNvbnN0IHBjID0gdGhpcy5kaXN0KHgxLCB5MSwgeDIsIHkyKSAvIDEwMDtcbiAgICBsZXQgcGNDb3VudCA9IDE7XG4gICAgbGV0IGxQZXJjZW50LCBnUGVyY2VudCA9IDA7XG4gICAgbGV0IGN1cnJlbnRQb3MgPSAwO1xuICAgIGxldCB4eDEsIHl5MSwgeHgyLCB5eTIgPSAwO1xuXG4gICAgd2hpbGUgKHRoaXMuaW50KHBjQ291bnQgKiBwYykgPCBsKSB7XG4gICAgICAgIHBjQ291bnQrK1xuICAgIH1cbiAgICBsUGVyY2VudCA9IHBjQ291bnQ7XG4gICAgcGNDb3VudCA9IDE7XG4gICAgd2hpbGUgKHRoaXMuaW50KHBjQ291bnQgKiBwYykgPCBnKSB7XG4gICAgICAgIHBjQ291bnQrK1xuICAgIH1cbiAgICBnUGVyY2VudCA9IHBjQ291bnQ7XG5cbiAgICBsUGVyY2VudCA9IGxQZXJjZW50IC8gMTAwO1xuICAgIGdQZXJjZW50ID0gZ1BlcmNlbnQgLyAxMDA7XG4gICAgd2hpbGUgKGN1cnJlbnRQb3MgPCAxKSB7XG4gICAgICAgIHh4MSA9IHRoaXMubGVycCh4MSwgeDIsIGN1cnJlbnRQb3MpO1xuICAgICAgICB5eTEgPSB0aGlzLmxlcnAoeTEsIHkyLCBjdXJyZW50UG9zKTtcbiAgICAgICAgeHgyID0gdGhpcy5sZXJwKHgxLCB4MiwgY3VycmVudFBvcyArIGxQZXJjZW50KTtcbiAgICAgICAgeXkyID0gdGhpcy5sZXJwKHkxLCB5MiwgY3VycmVudFBvcyArIGxQZXJjZW50KTtcbiAgICAgICAgaWYgKHgxID4geDIpIHtcbiAgICAgICAgICAgIGlmICh4eDIgPCB4Mikge1xuICAgICAgICAgICAgICAgIHh4MiA9IHgyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh4MSA8IHgyKSB7XG4gICAgICAgICAgICBpZiAoeHgyID4geDIpIHtcbiAgICAgICAgICAgICAgICB4eDIgPSB4MjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoeTEgPiB5Mikge1xuICAgICAgICAgICAgaWYgKHl5MiA8IHkyKSB7XG4gICAgICAgICAgICAgICAgeXkyID0geTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkxIDwgeTIpIHtcbiAgICAgICAgICAgIGlmICh5eTIgPiB5Mikge1xuICAgICAgICAgICAgICAgIHl5MiA9IHkyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5saW5lKHh4MSwgeXkxLCB4eDIsIHl5Mik7XG4gICAgICAgIGN1cnJlbnRQb3MgPSBjdXJyZW50UG9zICsgbFBlcmNlbnQgKyBnUGVyY2VudDtcbiAgICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQmFzdG91IG9uIDA5LzA0LzIwMTguXG4gKi9cblxuY29uc3QgZGF0YXMgPSB7XG4gICAgJ21vbnRocyc6IFsnU0VQLicsJ09DVC4nLCdOT1YuJywnREVDLicsJ0pBTi4nLCdGRUIuJywnTUFSLicsJ0FQUi4nXSxcbiAgICAnZGF0ZVJhbmdlJzogW1xuICAgICAgICAnMjAxNy0wOS0wMVQwMDowMDowMCcsXG4gICAgICAgICcyMDE4LTA0LTAxVDAwOjAwOjAwJ1xuICAgIF0sXG4gICAgJ2NvbG9ycyc6IHtcbiAgICAgICAgJ3BhbGVJbGFjJzogJ3JnYmEoMjI5LCAyMjcsIDI1NSknLFxuICAgICAgICAncGFsZUlsYWNUcmFuc3BhcmVudCc6ICdyZ2JhKDIyOSwgMjI3LCAyNTUsIDAuMiknLFxuICAgICAgICAnZGFya0JsdWVHcmV5JzogJ3JnYigyMiwgMjAsIDU5KScsXG4gICAgICAgICdkYXJrU2VhZm9hbSc6ICdyZ2IoMzYsIDE4MSwgMTMxKScsXG4gICAgICAgICdicmlnaHRTa3lCbHVlJzogJ3JnYig0LCAxOTAsIDI1NCknLFxuICAgICAgICAncmVkUGluayc6ICdyZ2IoMjQ4LCA0NCwgMTAzKScsXG4gICAgICAgICdwYWxlWWVsbG93JzogJ3JnYigyNTAsIDI1NSwgMTMxKSdcbiAgICB9LFxuICAgICdjYXRlZ29yaWVzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnZWNvbG9neScsXG4gICAgICAgICAgICAnY29sb3InOiAncmdiKDM2LCAxODEsIDEzMSknLCAvLyBkYXJrU2VhZm9hbVxuICAgICAgICAgICAgJ3Bvcyc6IDFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2hvdXNlJyxcbiAgICAgICAgICAgICdjb2xvcic6ICdyZ2IoNCwgMTkwLCAyNTQpJywgLy8gYnJpZ2h0U2t5Qmx1ZVxuICAgICAgICAgICAgJ3Bvcyc6IDJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ3NlY3VyaXR5JyxcbiAgICAgICAgICAgICdjb2xvcic6ICdyZ2IoMjQ4LCA0NCwgMTAzKScsIC8vIHJlZFBpbmtcbiAgICAgICAgICAgICdwb3MnOiAzXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdjb21mb3J0JyxcbiAgICAgICAgICAgICdjb2xvcic6ICdyZ2IoMjUwLCAyNTUsIDEzMSknLCAvLyBicmlnaHRTa3lCbHVlXG4gICAgICAgICAgICAncG9zJzogNFxuICAgICAgICB9XG4gICAgXVxufTtcbmV4cG9ydCBkZWZhdWx0IGRhdGFzO1xuIiwiLy9pbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbSwgc3VtIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgc2tldGNoIGZyb20gJy4vc2tldGNoJztcbmltcG9ydCBUb29scyBmcm9tICcuL1Rvb2xzJztcblxuXG4vLyBnbG9iYWwgdG9vbHNcbndpbmRvdy50b29scyA9IG5ldyBUb29scygpO1xuXG5pZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZWxpbmUnKSkge1xuICAgIG5ldyBwNShza2V0Y2gsICd0aW1lbGluZScpO1xufVxuXG4iLCIvL2ltcG9ydCBCdWJibGUgZnJvbSAnLi9idWJibGUnO1xuaW1wb3J0IGRhc2hlZExpbmUgZnJvbSAnLi9kYXNoZWRMaW5lJztcbmltcG9ydCBBcnRpY2xlIGZyb20gJy4vYXJ0aWNsZSc7XG5pbXBvcnQgZGF0YXMgZnJvbSAnLi9kYXRhcyc7XG5pbXBvcnQgQ2F0ZWdvcnkgZnJvbSAnLi9jYXRlZ29yeSc7XG5cbi8vIEFkZCBleHRlbnNpb24gdG8gUDVcbnA1LnByb3RvdHlwZS5kYXNoZWRMaW5lID0gZGFzaGVkTGluZTtcblxuLy8gU2V0dXAgdGltZWxpbmVcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCBwICkge1xuICAgIGxldCBhcnRpY2xlcyA9IFtdO1xuICAgIGxldCBjYXRlZ29yaWVzID0gW107XG4gICAgbGV0IGZvbnQ7XG5cbiAgICAvLyBUSU1FTElORSBDT05GSUdTIC8vLy8vLy8vL1xuICAgIGNvbnN0IHBhZGRpbmcgPSBbMCwgODBdO1xuICAgIGxldCBXID0gcC53aW5kb3dXaWR0aDtcbiAgICBsZXQgSCA9IHAud2luZG93SGVpZ2h0O1xuICAgIGNvbnN0IGNhdFBvc1kgPSBbXG4gICAgICAgIChILzQgKyA0NSksXG4gICAgICAgIChILzMgKyA0NSksXG4gICAgICAgIChIIC0gSC8zIC0gNDUpLFxuICAgICAgICAoSCAtIEgvNCAtIDQ1KVxuICAgIF07XG4gICAgcC50bFN0YXRlcyA9IHtcbiAgICAgICAgJ2NhdGVnb3J5U2VsZWN0ZWQnOiBmYWxzZSxcbiAgICAgICAgJ3BhbmVsT3BlbmVkJzogZmFsc2UsXG4gICAgICAgICdsb2FkZWQnOiBmYWxzZVxuICAgIH07XG4gICAgLy8gRU5EIFRJTUVMSU5FIENPTkZJR1MgLy8vLy8vL1xuXG4gICAgLy8gVEwgUEFORUwgLy8vLy8vLy8vLy8vXG4gICAgY29uc3QgdWlQYW5lbCA9IHtcbiAgICAgICAgJ2NvbnRhaW5lcicgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGwtYXJ0aWNsZS1wYW5lbCcpLFxuICAgICAgICAnZGF0ZScgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJ0aWNsZS1kYXRlJyksXG4gICAgICAgICd0aXRsZScgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJ0aWNsZS10aXRsZScpLFxuICAgICAgICAnY29udGVudCcgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJ0aWNsZS1jb250ZW50JyksXG4gICAgICAgICdsaW5rJyA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcnRpY2xlLWxpbmsnKSxcbiAgICAgICAgJ2Nsb3NlQnV0dG9uJyA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZS1idXR0b24nKSxcbiAgICB9O1xuXG4gICAgLy8gVWkgY2xvc2Ugb24gYnV0dG9uIGNsaWNrXG4gICAgdWlQYW5lbC5jbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgY2xvc2VQYW5lbCgpIH0pO1xuXG4gICAgZnVuY3Rpb24gY2xvc2VQYW5lbCgpIHtcbiAgICAgICAgaWYodWlQYW5lbC5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVuJykpIHtcbiAgICAgICAgICAgIHVpUGFuZWwuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcbiAgICAgICAgICAgIHAudGxTdGF0ZXMucGFuZWxPcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNFVFVQIFA1IERBVEFTIC8vLy8vLy8vXG5cbiAgICBsZXQgUGNvbG9ycyA9IE9iamVjdC5rZXlzKGRhdGFzLmNvbG9ycykucmVkdWNlKGZ1bmN0aW9uKHByZXZpb3VzLCBjdXJyZW50KSB7XG4gICAgICAgIHByZXZpb3VzW2N1cnJlbnRdID0gcC5jb2xvcihkYXRhcy5jb2xvcnNbY3VycmVudF0pO1xuICAgICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgfSwge30pO1xuXG4gICAgLy8gUGFyc2UgY2F0ZWdvcmllc1xuICAgIGRhdGFzLmNhdGVnb3JpZXMuZm9yRWFjaCgoYywga2V5KSA9PiB7XG4gICAgICAgIGxldCBjdXJyZW50Q2F0ID0gbmV3IENhdGVnb3J5KE9iamVjdC5hc3NpZ24oYyx7cH0pKTtcbiAgICAgICAgY3VycmVudENhdC5wb3NZID0gY2F0UG9zWVtjLnBvcyAtIDFdOyAvLyBTZXQgWSBwb3NcbiAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGN1cnJlbnRDYXQpO1xuICAgICAgICBjYXRlZ29yaWVzW2tleV0uaW5pdCgpO1xuICAgIH0pO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLy8gRU5EIFRJTUVMSU5FIENPTkZJR1MgLy8vLy8vLy8vXG5cbiAgICBsZXQgY3YgPSBudWxsO1xuXG4gICAgcC5wcmVsb2FkID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIExvYWQgZm9udFxuICAgICAgICBmb250ID0gcC5sb2FkRm9udCgnLi9mb250L2thcmxhLnR0ZicpO1xuXG4gICAgICAgIC8vIEdldCBhbGwgYXJ0aWNsZXMgZnJvbSBnZW5lcmF0ZWQgaHVnbyBqc29uXG4gICAgICAgIGNvbnN0IHVybCA9ICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArICcvYXJ0aWNsZXMvaW5kZXguanNvbic7XG4gICAgICAgIHAubG9hZEpTT04odXJsLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAvLyBNYXAganNvbiBkYXRhIHdpdGggY2xhc3MgYXJ0aWNsZXNcbiAgICAgICAgICAgIGRhdGEuYXJ0aWNsZXMuZm9yRWFjaCggKGFydGljbGUsIGtleSkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJ0aWNsZUNhdGVnb3J5ID0gY2F0ZWdvcmllcy5maWx0ZXIoIChlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuaWQgPT09IGFydGljbGUuY2F0ZWdvcmllc1swXVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgYXJ0aWNsZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgbmV3IEFydGljbGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcDogcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0b29scy5nZXRMYXN0UGFydFVybChhcnRpY2xlLnVybCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYXJ0aWNsZS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBhcnRpY2xlLmNhdGVnb3JpZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBhcnRpY2xlLmRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBhcnRpY2xlLmxpbmssXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sOiBhcnRpY2xlWydjb250ZW50X2h0bWwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhcnRpY2xlQ2F0ZWdvcnlbMF0uY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBtYWtlIGluIGFydGljbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHNldERhdGVUb1Bvc1goYXJ0aWNsZS5kYXRlLGRhdGFzLmRhdGVSYW5nZVswXSxkYXRhcy5kYXRlUmFuZ2VbMV0scGFkZGluZ1sxXSwgVyAtIHBhZGRpbmdbMV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJ0aWNsZUNhdGVnb3J5WzBdLnBvc1ksXG4gICAgICAgICAgICAgICAgICAgICAgICB1aVBhbmVsOiB1aVBhbmVsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAvL2FydGljbGVzW2tleV0uaW5pdCgpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gU29ydCBhcnRpY2xlc1xuICAgICAgICAgICAgYXJ0aWNsZXMuc29ydChmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgICAgICAgICBsZXQgc29ydFBhcmFtID0gJ2RhdGUnO1xuICAgICAgICAgICAgICAgIHJldHVybiAoYVtzb3J0UGFyYW1dID4gYltzb3J0UGFyYW1dKSA/IDEgOiAoKGJbc29ydFBhcmFtXSA+IGFbc29ydFBhcmFtXSkgPyAtMSA6IDApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU3BlY2lhbCBhcnRpY2xlcyBvcHRpb25zXG4gICAgICAgICAgICBzZXR1cEFydGljbGVzTGluZXMoKTtcblxuICAgICAgICAgICAgLy8gZGlzdHJpYnV0ZSBwYXJ0aWNsZXMgb2Ygc2FtZSBkYXRlIG9uIFlcbiAgICAgICAgICAgIHNldHVwQXJ0aWNsZXNPblRvcCgpO1xuXG4gICAgICAgICAgICAvLyBJbml0IGFydGljbGVzXG4gICAgICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKGFydGljbGUgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhcnRpY2xlLmluaXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBwLnNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGN2ID0gcC5jcmVhdGVDYW52YXMoVywgSCk7XG4gICAgICAgIGN2Lm1vdXNlQ2xpY2tlZChjdk1vdXNlQ2xpY2tlZCk7XG5cbiAgICAgICAgLy8gU3BlY2lhbCBhcnRpY2xlcyBvcHRpb25zXG4gICAgICAgIHNldHVwQXJ0aWNsZXNMaW5lcygpO1xuICAgICAgICAvLyBUT0RPOiBhZGQgYmVmb3JlIGFydGljbGVzIGluaXRcbiAgICAgICAgLy9zZXR1cEFydGljbGVzT25Ub3AoKTtcbiAgICB9O1xuXG4gICAgcC5kcmF3ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgcC5jbGVhcigpO1xuXG4gICAgICAgIC8vIENVUlNPUiBTVEFURVxuICAgICAgICBwLmN1cnNvcihwLkFSUk9XKTtcblxuICAgICAgICAvLyBGT05UXG4gICAgICAgIHAudGV4dEZvbnQoZm9udCk7XG5cbiAgICAgICAgLy8vLy8vLyBNT05USFMgLy8vLy8vLy9cblxuICAgICAgICAvLyBNb250aHMgbGluZVxuICAgICAgICBwLnN0cm9rZShQY29sb3JzLnBhbGVJbGFjVHJhbnNwYXJlbnQpO1xuICAgICAgICBwLnN0cm9rZVdlaWdodCgxKTtcblxuICAgICAgICAvLyBNb250aHNcbiAgICAgICAgcC5saW5lKHBhZGRpbmdbMV0sIEgvMiwgVy1wYWRkaW5nWzFdLCBILzIpO1xuICAgICAgICBmb3IgKGxldCBpPTA7aTxkYXRhcy5tb250aHMubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgbGV0IGFtdCA9ICggaS8oZGF0YXMubW9udGhzLmxlbmd0aCAtIDEpICkgKiAxO1xuICAgICAgICAgICAgbGV0IG1vbnRoWCA9IHAubGVycChwYWRkaW5nWzFdLCBXLXBhZGRpbmdbMV0sIGFtdCk7XG4gICAgICAgICAgICBsZXQgdGV4dE9mZmVzdCA9ICgoaSsxKSAlIDIgPT0gMCkgPyAzMCA6IC0yMDtcblxuICAgICAgICAgICAgLy8gY2lyY2xlIGFuZCB2ZXJ0aWNhbCBkYXNoIGxpbmVcbiAgICAgICAgICAgIGlmKGkgIT09IDAgJiYgaSAhPT0gZGF0YXMubW9udGhzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBwLmVsbGlwc2UobW9udGhYLCBILzIsIDkpO1xuICAgICAgICAgICAgICAgIHAuc3Ryb2tlKFBjb2xvcnMucGFsZUlsYWNUcmFuc3BhcmVudCk7XG4gICAgICAgICAgICAgICAgcC5kYXNoZWRMaW5lKG1vbnRoWCxILzQsbW9udGhYLEgtSC80LDEsMTUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0ZXh0XG4gICAgICAgICAgICBwLm5vU3Ryb2tlKCk7XG4gICAgICAgICAgICBwLmZpbGwoUGNvbG9ycy5wYWxlSWxhYyk7XG4gICAgICAgICAgICBwLnRleHRTaXplKDE0KTtcbiAgICAgICAgICAgIHAudGV4dEFsaWduKHAuQ0VOVEVSKTtcbiAgICAgICAgICAgIHAucHVzaCgpO1xuICAgICAgICAgICAgcC50ZXh0KGRhdGFzLm1vbnRoc1tpXSwgbW9udGhYLCBILzIrdGV4dE9mZmVzdCk7XG4gICAgICAgIH1cbiAgICAgICAgcC5wb3AoKTtcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vLy8vLy8gQ0FURUdPUklFUyAvLy8vLy8vL1xuXG4gICAgICAgIC8vIENsaWNrIGZpbHRlclxuICAgICAgICBjYXRlZ29yaWVzLmZvckVhY2goIGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICAgICAgY2F0ZWdvcnkuaG92ZXJlZChwLm1vdXNlWCxwLm1vdXNlWSk7XG4gICAgICAgICAgICBjYXRlZ29yeS5zaG93KCk7XG5cbiAgICAgICAgICAgIC8vIGNsaWNrXG4gICAgICAgICAgICBpZihjYXRlZ29yeS5pc0NsaWNrZWQpIHtcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLmZvckVhY2goIGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeS5pc0NsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjYXRlZ29yeS5pc0NsaWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihjYXRlZ29yeS5pc0NsaWNrZWQpIHtcbiAgICAgICAgICAgICAgICBwLnRsU3RhdGVzLmNhdGVnb3J5U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZpbHRlckFydGljbGVzKGNhdGVnb3J5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcC50bFN0YXRlcy5jYXRlZ29yeVNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEhvdmVyIGZpbHRlclxuICAgICAgICBjYXRlZ29yaWVzLmZvckVhY2goIGZ1bmN0aW9uKGNhdGVnb3J5KSB7XG4gICAgICAgICAgICAvLyBob3ZlclxuICAgICAgICAgICAgaWYoY2F0ZWdvcnkuaXNIb3ZlcmVkKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyQXJ0aWNsZXMoY2F0ZWdvcnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWxlY3Qgc3RhdGVcbiAgICAgICAgICAgIGlmKGNhdGVnb3J5LmlzSG92ZXJlZCB8fCBjYXRlZ29yeS5pc0NsaWNrZWQpIHtcbiAgICAgICAgICAgICAgICBwLnRsU3RhdGVzLmNhdGVnb3J5U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwLnRsU3RhdGVzLmNhdGVnb3J5U2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbiAgICAgICAgLy8vLy8vLyBBUlRJQ0xFUyAvLy8vLy8vL1xuICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKCBmdW5jdGlvbiAoYXJ0aWNsZSkge1xuICAgICAgICAgICAgYXJ0aWNsZS5ob3ZlcmVkKHAubW91c2VYLHAubW91c2VZKTtcbiAgICAgICAgICAgIGFydGljbGUuc2hvdygpO1xuICAgICAgICAgICAgaWYoIXAudGxTdGF0ZXMuY2F0ZWdvcnlTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIGFydGljbGUuZGFya2VuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvLyBUV0VFTlMgLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIFRXRUVOLnVwZGF0ZSgpO1xuICAgIH07XG5cbiAgICBwLndpbmRvd1Jlc2l6ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFcgPSBwLndpbmRvd1dpZHRoO1xuICAgICAgICBIID0gcC53aW5kb3dIZWlnaHQ7XG4gICAgICAgIHAucmVzaXplQ2FudmFzKFcsIEgpO1xuXG4gICAgICAgIC8vIFRPRE86IHJlLWNhbGN1bCBhcnRpY2xlIHBvcyBhbmQgY2F0ZWdvcmllcyBwb3NcbiAgICB9O1xuXG4gICAgLy8gSU5URVJBQ1RJT05TIC8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgZnVuY3Rpb24gY3ZNb3VzZUNsaWNrZWQgKCkge1xuICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKCBmdW5jdGlvbiAoYXJ0aWNsZSkge1xuICAgICAgICAgICAgYXJ0aWNsZS5jbGlja2VkKHAubW91c2VYLHAubW91c2VZKVxuICAgICAgICB9KTtcbiAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoKCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgIGNhdGVnb3J5LmlzQ2xpY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgY2F0ZWdvcnkuY2xpY2tlZChwLm1vdXNlWCxwLm1vdXNlWSlcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBMZXMgdHJhaXRzICFcbiAgICAvLyBUT0RPOiBpbiBjbGFzcyBhcnRpY2xlc01hbmFnZXIgP1xuICAgIGZ1bmN0aW9uIHNldHVwQXJ0aWNsZXNMaW5lcygpIHtcbiAgICAgICAgbGV0IGxhc3RNb250aCA9IDA7XG4gICAgICAgIGxldCBsYXN0Q29vcmRzID0ge3g6MCx5OjB9O1xuICAgICAgICBsZXQgd2FzT25Ub3AgPSBmYWxzZTtcblxuICAgICAgICBkYXRhcy5jYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xuICAgICAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaChhcnRpY2xlID0+IHtcbiAgICAgICAgICAgICAgICBpZihhcnRpY2xlLmNhdGVnb3J5ID09PSBjYXRlZ29yeS5pZCkge1xuICAgICAgICAgICAgICAgICAgICBpZihsYXN0TW9udGggPT09IG5ldyBEYXRlKGFydGljbGUuZGF0ZSkuZ2V0TW9udGgoKSArIDEgJiYgIXdhc09uVG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpY2xlLmhhc0xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZS5saW5lVG8ueCA9IGxhc3RDb29yZHMueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFydGljbGUubGluZVRvLnkgPSBsYXN0Q29vcmRzLnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vbnRoID0gbmV3IERhdGUoYXJ0aWNsZS5kYXRlKS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdENvb3Jkcy54ID0gYXJ0aWNsZS54O1xuICAgICAgICAgICAgICAgICAgICBsYXN0Q29vcmRzLnkgPSBhcnRpY2xlLnk7XG4gICAgICAgICAgICAgICAgICAgIHdhc09uVG9wID0gYXJ0aWNsZS5pc09uVG9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cEFydGljbGVzT25Ub3AoKSB7XG4gICAgICAgIGxldCBsYXN0QXJ0aWNsZSA9IG51bGw7XG5cbiAgICAgICAgZGF0YXMuY2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcbiAgICAgICAgICAgIGFydGljbGVzLmZvckVhY2goKGFydGljbGUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGFydGljbGUuY2F0ZWdvcnkgPT09IGNhdGVnb3J5LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGxhc3RBcnRpY2xlICYmIGxhc3RBcnRpY2xlLmRhdGUgPT09IGFydGljbGUuZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZS5pc09uVG9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGtleSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEFydGljbGUuYWZ0ZXJPblRvcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdEFydGljbGUgPSBhcnRpY2xlO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gVEVNUCBVVElMUyAvLy8vLy8vLy9cblxuICAgIC8vIFRPRE86IGFkZCB0byBhcnRpY2xlc01hbmFnZXIgP1xuICAgIC8qXG4gICAgICogIGRhdGVUb1Bvc1hcbiAgICAgKlxuICAgICAqICBUcmFuc2Zvcm0gdGltZXN0YW1wIHRvIHBvc2l0aW9uIGluIHBpeGVsICB3aXRoaW4gYSByYW5nZVxuICAgICAqICByZXR1cm4gcG9zaXRpb24gaW4gcGl4ZWxzIChpbnQpXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0RGF0ZVRvUG9zWChkYXRlLCBiZWdpbkRhdGUsIEVuZERhdGUsIGJlZ2luWCwgZW5kWCkge1xuICAgICAgICAvLyBEYXRlIFRyYW5zZm9ybVxuICAgICAgICBjb25zdCBkYXRlQXJyYXkgPSBbZGF0ZSwgYmVnaW5EYXRlLCBFbmREYXRlXTtcbiAgICAgICAgY29uc3QgZGF0ZVRpbWVzID0gW107XG4gICAgICAgIGRhdGVBcnJheS5mb3JFYWNoKCBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICAgICAgZGF0ZVRpbWVzLnB1c2gobmV3IERhdGUoZGF0ZSkuZ2V0VGltZSgpKVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmV0dXJuIHBvcyBpbiBwaXhlbFxuICAgICAgICByZXR1cm4gcC5tYXAoZGF0ZVRpbWVzWzBdLCBkYXRlVGltZXNbMV0sIGRhdGVUaW1lc1syXSwgYmVnaW5YLCBlbmRYKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIGZpbHRlckFydGljbGVzXG4gICAgICpcbiAgICAgKiBTZXQgYXJ0aWNsZSBvcGFjaXR5IHdpdGggc2VsZWN0ZWQgY2F0ZWdvcmllc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbHRlckFydGljbGVzKGNhdGVnb3J5KSB7XG4gICAgICAgIGFydGljbGVzLmZvckVhY2goIGZ1bmN0aW9uIChhcnRpY2xlKSB7XG4gICAgICAgICAgICBpZihhcnRpY2xlLmNhdGVnb3J5ICE9PSBjYXRlZ29yeS5pZCkge1xuICAgICAgICAgICAgICAgIGFydGljbGUuZGFya2VuZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcnRpY2xlLmRhcmtlbmVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG59Il19
