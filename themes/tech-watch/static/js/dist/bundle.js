(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

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
        key: "de2ra",
        value: function de2ra(degree) {
            return degree * (Math.PI / 180);
        }
    }, {
        key: "isOdd",
        value: function isOdd(num) {
            return num % 2;
        }
    }, {
        key: "Log",
        value: function Log(value) {
            if (this.logPrevValue == null || this.logPrevValue.toString() !== value.toString() || Math.round(this.logPrevValue * 1000) / 1000 !== Math.round(value * 1000) / 1000) {
                console.log(value);
            }
            this.logPrevValue = value;
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
            this.p.fill(this.color);
            this.p.push();
            this.p.ellipse(this.x, this.y, this._r);
            this.p.pop();

            if (this.hasLine) {
                this.p.stroke(this.color);
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
            this.color.setAlpha(40);
            this.p.fill(this.color);
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
            this.color.setAlpha(255);
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
            this.color.setAlpha(this.uiTitleAlpha.a);
            this.p.noStroke();
            this.p.fill(this.color);
            this.p.push();
            this.p.textAlign(this.p.CENTER);
            this.p.text(this.title, this.x, this.y - 30);
            this.p.pop();
            this.color.setAlpha(255);
        }
    }]);

    return Article;
}();

exports.default = Article;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Bastou on 06/04/2018.
 */

var Category = function Category(props) {
    _classCallCheck(this, Category);

    this.name = props.name;
    this.color = props.color;
    this.posY = props.posY;
};

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

var _sketch = require('./sketch');

var _sketch2 = _interopRequireDefault(_sketch);

var _Tools = require('./Tools');

var _Tools2 = _interopRequireDefault(_Tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// global tools
//import { generateRandom, sum } from './utils';
window.tools = new _Tools2.default();

new p5(_sketch2.default, 'timeline');

},{"./Tools":1,"./sketch":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (p) {

    // TIMELINE CONFIGS /////////
    var padding = [0, 80];
    var W = p.windowWidth;
    var H = p.windowHeight;
    var months = ['SEP.', 'OCT.', 'NOV.', 'DEC.', 'JAN.', 'FEB.', 'MAR.', 'APR.'];
    var dateRange = ['2017-09-01T00:00:00', '2018-04-01T00:00:00'];
    var colors = {
        'paleIlac': p.color('rgba(229, 227, 255)'),
        'paleIlacTransparent': p.color('rgba(229, 227, 255, 0.2)'),
        'darkBlueGrey': p.color('rgb(22, 20, 59)'),
        'darkSeafoam': p.color('rgb(36, 181, 131)'),
        'brightSkyBlue': p.color('rgb(4, 190, 254)'),
        'redPink': p.color('rgb(248, 44, 103)'),
        'paleYellow': p.color('rgb(250, 255, 131)')
    };
    var categories = [{
        'id': 'ecology',
        'color': colors.darkSeafoam,
        'posY': H / 4 + 45
    }, {
        'id': 'house',
        'color': colors.brightSkyBlue,
        'posY': H / 3 + 45
    }, {
        'id': 'security',
        'color': colors.redPink,
        'posY': H - H / 4 - 45
    }, {
        'id': 'comfort',
        'color': colors.paleYellow,
        'posY': H - H / 3 - 45
    }];
    var articles = [];
    // END TIMELINE CONFIGS /////////

    var cv = null;

    p.preload = function () {
        // Get all articles from generated hugo json
        var url = '//' + window.location.host + '/articles/index.json';
        p.loadJSON(url, function (data) {
            data.articles.forEach(function (article) {
                var articleCategory = categories.filter(function (el) {
                    return el.id === article.categories[0];
                });

                articles.push(new _article2.default({
                    p: p,
                    id: slugifyUrl(article.url),
                    title: article.title,
                    category: article.categories[0],
                    date: article.date,
                    url: article.url,
                    html: article['content_html'],
                    color: articleCategory[0].color,
                    x: dateToPosX(article.date, dateRange[0], dateRange[1], padding[1], W - padding[1]),
                    y: articleCategory[0].posY
                }));
            });
        });
    };

    p.setup = function () {
        cv = p.createCanvas(W, H);
        cv.mousePressed(cvMousePressed);
        // let firstArticle = new Article({
        //     p: p,
        //     id:'firstArticle',
        //     category: 'ecology',
        //     date: new Date('1995-12-17T03:24:00')
        // })

        // test tween
        //tween.start();

        // Sort articles
        articles.sort(function (a, b) {
            var sortParam = 'date';
            return a[sortParam] > b[sortParam] ? 1 : b[sortParam] > a[sortParam] ? -1 : 0;
        });

        // TODO: move away
        tlArticlesLines();
    };

    p.draw = function () {
        //p.background('#020126');
        p.clear();

        // CURSOR STATE
        p.cursor(p.ARROW);

        /////// MONTHS ////////

        // Months line
        p.stroke(colors.paleIlacTransparent);
        p.strokeWeight(1);

        // Months
        p.line(padding[1], H / 2, W - padding[1], H / 2);
        for (var i = 0; i < months.length; i++) {
            var amt = i / (months.length - 1) * 1;
            var monthX = p.lerp(padding[1], W - padding[1], amt);
            var textOffest = (i + 1) % 2 == 0 ? 30 : -20;

            // circle and vertical dash line
            if (i !== 0 && i !== months.length - 1) {
                p.ellipse(monthX, H / 2, 9);
                p.stroke(colors.paleIlacTransparent);
                p.dashedLine(monthX, H / 4, monthX, H - H / 4, 1, 15);
            }

            // text
            p.noStroke();
            p.fill(colors.paleIlac);
            p.push();
            p.textAlign(p.CENTER);
            p.text(months[i], monthX, H / 2 + textOffest);
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
    };

    // INTERACTIONS //////////////////

    function cvMousePressed() {
        articles.forEach(function (article) {
            article.clicked(p.mouseX, p.mouseY);
        });
    }

    // Les traits !
    function tlArticlesLines() {
        var lastMonth = 0;
        var lastCoords = { x: 0, y: 0 };

        categories.forEach(function (category) {
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
            console.groupEnd();
        });
    }

    // TEMP UTILS /////////

    /*
     *  slugifyUrl
     *  get last part of url
     *
     */
    function slugifyUrl(url) {
        var re = '[^/]+(?=\/$|$)';
        return url.match(re)[0];
    }

    /*
     *  dateToPosX
     *
     *  Transform timestamp to position in pixel  within a range
     *  return position in pixels (int)
     */
    function dateToPosX(date, beginDate, EndDate, beginX, endX) {
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

var _category = require('./category');

var _category2 = _interopRequireDefault(_category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Add extension to P5
p5.prototype.dashedLine = _dashedLine2.default;

// Setup timeline
//import Bubble from './bubble';

},{"./article":2,"./category":3,"./dashedLine":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvanMvVG9vbHMuanMiLCJzdGF0aWMvanMvYXJ0aWNsZS5qcyIsInN0YXRpYy9qcy9jYXRlZ29yeS5qcyIsInN0YXRpYy9qcy9kYXNoZWRMaW5lLmpzIiwic3RhdGljL2pzL21haW4uanMiLCJzdGF0aWMvanMvc2tldGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBO0lBQ3FCLEs7QUFFakIscUJBQWM7QUFBQTs7QUFDVixhQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDSDs7Ozs4QkFFSyxNLEVBQVE7QUFDVixtQkFBTyxVQUFRLEtBQUssRUFBTCxHQUFRLEdBQWhCLENBQVA7QUFDSDs7OzhCQUNLLEcsRUFBSztBQUFFLG1CQUFPLE1BQU0sQ0FBYjtBQUFlOzs7NEJBQ3hCLEssRUFBTztBQUNQLGdCQUFJLEtBQUssWUFBTCxJQUFxQixJQUFyQixJQUE2QixLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsT0FBaUMsTUFBTSxRQUFOLEVBQTlELElBQW1GLEtBQUssS0FBTCxDQUFXLEtBQUssWUFBTCxHQUFvQixJQUEvQixJQUF1QyxJQUF4QyxLQUFtRCxLQUFLLEtBQUwsQ0FBVyxRQUFRLElBQW5CLElBQTJCLElBQXBLLEVBQTJLO0FBQ3ZLLHdCQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0g7QUFDRCxpQkFBSyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0g7Ozs7OztrQkFoQmdCLEs7QUFpQnBCOzs7Ozs7Ozs7Ozs7O0FDbEJEOzs7O0lBSXFCLE87QUFDakIscUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBOztBQUNmLGdCQUFRLFNBQVMsRUFBakIsQ0FEZSxDQUNNOztBQUVyQjtBQUNBLGFBQUssQ0FBTCxHQUFTLE1BQU0sQ0FBZjs7QUFFQTtBQUNBLGFBQUssRUFBTCxHQUFVLE1BQU0sRUFBaEI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsTUFBTSxRQUF0QjtBQUNBLGFBQUssS0FBTCxHQUFhLE1BQU0sS0FBbkI7QUFDQSxhQUFLLElBQUwsR0FBWSxNQUFNLElBQWxCO0FBQ0EsYUFBSyxHQUFMLEdBQVcsTUFBTSxHQUFqQjtBQUNBLGFBQUssSUFBTCxHQUFZLE1BQU0sSUFBbEI7O0FBRUE7QUFDQSxhQUFLLENBQUwsR0FBUyxNQUFNLENBQWY7QUFDQSxhQUFLLENBQUwsR0FBUyxNQUFNLENBQWY7QUFDQSxhQUFLLEtBQUwsR0FBYSxNQUFNLEtBQW5COztBQUVBO0FBQ0EsYUFBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLGFBQUssTUFBTCxHQUFjLEVBQUMsR0FBRSxDQUFILEVBQUssR0FBRTs7QUFFckI7QUFGYyxTQUFkLENBR0EsS0FBSyxFQUFMLEdBQVUsRUFBVjs7QUFFQTs7QUFFQTtBQUNBLGFBQUssZUFBTCxHQUF1QixDQUF2QjtBQUNBLGFBQUssZ0JBQUwsR0FBd0IsQ0FBeEI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsSUFBSSxLQUFKLENBQVUsS0FBSyxlQUFmLEVBQWdDLElBQWhDLENBQXFDLENBQXJDLEVBQXdDLEdBQXhDLENBQTRDO0FBQUEsbUJBQU0sRUFBQyxHQUFFLE1BQUssQ0FBUixFQUFXLEdBQUUsTUFBSyxDQUFsQixFQUFvQixHQUFFLENBQXRCLEVBQU47QUFBQSxTQUE1QyxDQUFyQjs7QUFFQTtBQUNBLGFBQUssWUFBTCxHQUFvQixFQUFDLEdBQUUsQ0FBSCxFQUFwQixDQWxDZSxDQWtDWTtBQUMzQixhQUFLLFFBQUwsR0FBZ0I7QUFDWixxQkFBUyxFQUFDLEdBQUUsQ0FBSCxFQUFNLEdBQUUsQ0FBUixFQURHO0FBRVosMkJBQWUsRUFBQyxHQUFFLEdBQUgsRUFGSDtBQUdaLHFCQUFTLElBQUksTUFBTSxLQUFWLENBQWdCLEtBQUssWUFBckIsRUFDSixFQURJLENBQ0QsRUFBQyxHQUFHLEdBQUosRUFEQyxFQUNTLEdBRFQsRUFFSixNQUZJLENBRUcsTUFBTSxNQUFOLENBQWEsU0FBYixDQUF1QixFQUYxQixFQUdKLFFBSEksQ0FHSyxZQUFNO0FBQ1o7QUFDSCxhQUxJLENBSEc7QUFTWix1QkFBVztBQVRDLFNBQWhCO0FBWUg7Ozs7Z0NBRU8sRSxFQUFJLEUsRUFBSTtBQUNaLGdCQUFHLEtBQUssZ0JBQUwsQ0FBc0IsRUFBdEIsRUFBeUIsRUFBekIsQ0FBSCxFQUFpQztBQUM3Qix3QkFBUSxHQUFSLENBQVksdUJBQXVCLEdBQXZCLEdBQTZCLEtBQUssS0FBbEMsR0FBMEMsR0FBdEQ7QUFDSDtBQUNKOzs7Z0NBRU8sRSxFQUFJLEUsRUFBSTs7QUFFWixnQkFBRyxLQUFLLGdCQUFMLENBQXNCLEVBQXRCLEVBQXlCLEVBQXpCLENBQUgsRUFBaUM7QUFDN0I7QUFDQSxxQkFBSyxTQUFMOztBQUVBO0FBQ0EscUJBQUssaUJBQUw7O0FBRUEscUJBQUssQ0FBTCxDQUFPLE1BQVAsQ0FBYyxLQUFLLENBQUwsQ0FBTyxJQUFyQjtBQUNILGFBUkQsTUFRTztBQUNIO0FBQ0EscUJBQUssU0FBTCxDQUFlLElBQWY7O0FBRUE7QUFDQSxxQkFBSyxpQkFBTCxDQUF1QixJQUF2QjtBQUNIO0FBQ0o7Ozt5Q0FFZ0IsRSxFQUFHLEUsRUFBSTtBQUNwQixnQkFBSSxJQUFJLEtBQUssQ0FBTCxDQUFPLElBQVAsQ0FBWSxFQUFaLEVBQWdCLEVBQWhCLEVBQW9CLEtBQUssQ0FBekIsRUFBNEIsS0FBSyxDQUFqQyxDQUFSO0FBQ0EsZ0JBQUcsSUFBSSxLQUFLLEVBQVosRUFBZ0I7QUFDWix1QkFBTyxJQUFQO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsdUJBQU8sS0FBUDtBQUNIO0FBQ0o7OzsrQkFFTTtBQUNILGlCQUFLLENBQUwsQ0FBTyxRQUFQO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLElBQVAsQ0FBWSxLQUFLLEtBQWpCO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLElBQVA7QUFDQSxpQkFBSyxDQUFMLENBQU8sT0FBUCxDQUFlLEtBQUssQ0FBcEIsRUFBdUIsS0FBSyxDQUE1QixFQUErQixLQUFLLEVBQXBDO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLEdBQVA7O0FBRUEsZ0JBQUcsS0FBSyxPQUFSLEVBQWlCO0FBQ2IscUJBQUssQ0FBTCxDQUFPLE1BQVAsQ0FBYyxLQUFLLEtBQW5CO0FBQ0EscUJBQUssQ0FBTCxDQUFPLFlBQVAsQ0FBb0IsQ0FBcEI7QUFDQSxxQkFBSyxDQUFMLENBQU8sSUFBUDtBQUNBLHFCQUFLLENBQUwsQ0FBTyxJQUFQLENBQVksS0FBSyxDQUFqQixFQUFvQixLQUFLLENBQXpCLEVBQTRCLEtBQUssTUFBTCxDQUFZLENBQXhDLEVBQTJDLEtBQUssTUFBTCxDQUFZLENBQXZEO0FBQ0EscUJBQUssQ0FBTCxDQUFPLEdBQVA7QUFDSDtBQUNKOzs7NENBRThCO0FBQUE7O0FBQUEsZ0JBQWIsR0FBYSx1RUFBUCxLQUFPOztBQUMzQixnQkFBRyxPQUFPLEtBQUssYUFBTCxDQUFtQixDQUFuQixLQUF5QixDQUFuQyxFQUFzQztBQUN0QyxpQkFBSyxDQUFMLENBQU8sUUFBUDtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEVBQXBCO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLElBQVAsQ0FBWSxLQUFLLEtBQWpCO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLElBQVA7QUFDQSxpQkFBSyxhQUFMLENBQW1CLE9BQW5CLENBQTJCLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTtBQUNqQztBQUNBLG9CQUFHLEdBQUgsRUFBUTtBQUNKLHNCQUFFLENBQUYsSUFBUSxDQUFDLElBQUksRUFBRSxDQUFQLElBQWEsSUFBckI7QUFDSCxpQkFGRCxNQUVTO0FBQ0wsMkJBQUssZ0JBQUwsSUFBeUIsS0FBekI7QUFDQSx3QkFBSSxJQUFJLE9BQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxPQUFLLGdCQUFsQixJQUFvQyxHQUE1QztBQUNBLHNCQUFFLENBQUYsSUFBUSxDQUFHLE9BQUssRUFBTCxHQUFVLENBQVYsR0FBZSxJQUFJLEVBQUosR0FBUyxDQUF6QixHQUFnQyxFQUFFLENBQXBDLElBQTBDLEdBQWxEO0FBQ0g7QUFDRCx1QkFBSyxDQUFMLENBQU8sT0FBUCxDQUFlLEVBQUUsQ0FBakIsRUFBb0IsRUFBRSxDQUF0QixFQUF5QixFQUFFLENBQTNCO0FBQ0gsYUFWRDtBQVdBLGlCQUFLLENBQUwsQ0FBTyxHQUFQO0FBQ0EsaUJBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsR0FBcEI7QUFDSDs7O29DQUVzQjtBQUFBLGdCQUFiLEdBQWEsdUVBQVAsS0FBTzs7QUFDbkIsZ0JBQUcsR0FBSCxFQUFRO0FBQ0oscUJBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsSUFBcEI7QUFDQSxxQkFBSyxRQUFMLENBQWMsT0FBZCxHQUF3QixLQUF4QjtBQUNBLHFCQUFLLFlBQUwsQ0FBa0IsQ0FBbEIsR0FBc0IsQ0FBdEI7QUFDSDtBQUNELGdCQUFHLENBQUMsS0FBSyxRQUFMLENBQWMsT0FBZixJQUEwQixDQUFDLEdBQTlCLEVBQW1DO0FBQy9CLHFCQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLEtBQXBCO0FBQ0EscUJBQUssUUFBTCxDQUFjLE9BQWQsR0FBd0IsSUFBeEI7QUFDSDtBQUNELGdCQUFHLEdBQUgsRUFBUTtBQUNSLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEtBQUssWUFBTCxDQUFrQixDQUF0QztBQUNBLGlCQUFLLENBQUwsQ0FBTyxRQUFQO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLElBQVAsQ0FBWSxLQUFLLEtBQWpCO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLElBQVA7QUFDQSxpQkFBSyxDQUFMLENBQU8sU0FBUCxDQUFpQixLQUFLLENBQUwsQ0FBTyxNQUF4QjtBQUNBLGlCQUFLLENBQUwsQ0FBTyxJQUFQLENBQVksS0FBSyxLQUFqQixFQUF3QixLQUFLLENBQTdCLEVBQWdDLEtBQUssQ0FBTCxHQUFTLEVBQXpDO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLEdBQVA7QUFDQSxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixHQUFwQjtBQUNIOzs7Ozs7a0JBNUlnQixPOzs7Ozs7Ozs7OztBQ0pyQjs7OztJQUlxQixRLEdBQ2pCLGtCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFDZixTQUFLLElBQUwsR0FBWSxNQUFNLElBQWxCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsTUFBTSxLQUFuQjtBQUNBLFNBQUssSUFBTCxHQUFZLE1BQU0sSUFBbEI7QUFDSCxDOztrQkFMZ0IsUTs7Ozs7Ozs7O2tCQ0FOLFVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0IsRUFBdEIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBZ0M7QUFDM0MsUUFBTSxLQUFLLEtBQUssSUFBTCxDQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCLEVBQXRCLElBQTRCLEdBQXZDO0FBQ0EsUUFBSSxVQUFVLENBQWQ7QUFDQSxRQUFJLGlCQUFKO0FBQUEsUUFBYyxXQUFXLENBQXpCO0FBQ0EsUUFBSSxhQUFhLENBQWpCO0FBQ0EsUUFBSSxZQUFKO0FBQUEsUUFBUyxZQUFUO0FBQUEsUUFBYyxZQUFkO0FBQUEsUUFBbUIsTUFBTSxDQUF6Qjs7QUFFQSxXQUFPLEtBQUssR0FBTCxDQUFTLFVBQVUsRUFBbkIsSUFBeUIsQ0FBaEMsRUFBbUM7QUFDL0I7QUFDSDtBQUNELGVBQVcsT0FBWDtBQUNBLGNBQVUsQ0FBVjtBQUNBLFdBQU8sS0FBSyxHQUFMLENBQVMsVUFBVSxFQUFuQixJQUF5QixDQUFoQyxFQUFtQztBQUMvQjtBQUNIO0FBQ0QsZUFBVyxPQUFYOztBQUVBLGVBQVcsV0FBVyxHQUF0QjtBQUNBLGVBQVcsV0FBVyxHQUF0QjtBQUNBLFdBQU8sYUFBYSxDQUFwQixFQUF1QjtBQUNuQixjQUFNLEtBQUssSUFBTCxDQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLFVBQWxCLENBQU47QUFDQSxjQUFNLEtBQUssSUFBTCxDQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLFVBQWxCLENBQU47QUFDQSxjQUFNLEtBQUssSUFBTCxDQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLGFBQWEsUUFBL0IsQ0FBTjtBQUNBLGNBQU0sS0FBSyxJQUFMLENBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsYUFBYSxRQUEvQixDQUFOO0FBQ0EsWUFBSSxLQUFLLEVBQVQsRUFBYTtBQUNULGdCQUFJLE1BQU0sRUFBVixFQUFjO0FBQ1Ysc0JBQU0sRUFBTjtBQUNIO0FBQ0o7QUFDRCxZQUFJLEtBQUssRUFBVCxFQUFhO0FBQ1QsZ0JBQUksTUFBTSxFQUFWLEVBQWM7QUFDVixzQkFBTSxFQUFOO0FBQ0g7QUFDSjtBQUNELFlBQUksS0FBSyxFQUFULEVBQWE7QUFDVCxnQkFBSSxNQUFNLEVBQVYsRUFBYztBQUNWLHNCQUFNLEVBQU47QUFDSDtBQUNKO0FBQ0QsWUFBSSxLQUFLLEVBQVQsRUFBYTtBQUNULGdCQUFJLE1BQU0sRUFBVixFQUFjO0FBQ1Ysc0JBQU0sRUFBTjtBQUNIO0FBQ0o7O0FBRUQsYUFBSyxJQUFMLENBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsR0FBekI7QUFDQSxxQkFBYSxhQUFhLFFBQWIsR0FBd0IsUUFBckM7QUFDSDtBQUNKLEM7Ozs7O0FDbkREOzs7O0FBQ0E7Ozs7OztBQUdBO0FBTEE7QUFNQSxPQUFPLEtBQVAsR0FBZSxxQkFBZjs7QUFHQSxJQUFJLEVBQUosbUJBQWUsVUFBZjs7Ozs7Ozs7O2tCQ0FlLFVBQVUsQ0FBVixFQUFjOztBQUV6QjtBQUNBLFFBQU0sVUFBVSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWhCO0FBQ0EsUUFBSSxJQUFJLEVBQUUsV0FBVjtBQUNBLFFBQUksSUFBSSxFQUFFLFlBQVY7QUFDQSxRQUFNLFNBQVMsQ0FBQyxNQUFELEVBQVEsTUFBUixFQUFlLE1BQWYsRUFBc0IsTUFBdEIsRUFBNkIsTUFBN0IsRUFBb0MsTUFBcEMsRUFBMkMsTUFBM0MsRUFBa0QsTUFBbEQsQ0FBZjtBQUNBLFFBQU0sWUFBWSxDQUNkLHFCQURjLEVBRWQscUJBRmMsQ0FBbEI7QUFJQSxRQUFNLFNBQVM7QUFDWCxvQkFBWSxFQUFFLEtBQUYsQ0FBUSxxQkFBUixDQUREO0FBRVgsK0JBQXVCLEVBQUUsS0FBRixDQUFRLDBCQUFSLENBRlo7QUFHWCx3QkFBZ0IsRUFBRSxLQUFGLENBQVEsaUJBQVIsQ0FITDtBQUlYLHVCQUFlLEVBQUUsS0FBRixDQUFRLG1CQUFSLENBSko7QUFLWCx5QkFBaUIsRUFBRSxLQUFGLENBQVEsa0JBQVIsQ0FMTjtBQU1YLG1CQUFXLEVBQUUsS0FBRixDQUFRLG1CQUFSLENBTkE7QUFPWCxzQkFBYyxFQUFFLEtBQUYsQ0FBUSxvQkFBUjtBQVBILEtBQWY7QUFTQSxRQUFNLGFBQWEsQ0FDZjtBQUNJLGNBQU0sU0FEVjtBQUVJLGlCQUFTLE9BQU8sV0FGcEI7QUFHSSxnQkFBUSxJQUFFLENBQUYsR0FBTTtBQUhsQixLQURlLEVBTWY7QUFDSSxjQUFNLE9BRFY7QUFFSSxpQkFBUyxPQUFPLGFBRnBCO0FBR0ksZ0JBQVEsSUFBRSxDQUFGLEdBQU07QUFIbEIsS0FOZSxFQVdmO0FBQ0ksY0FBTSxVQURWO0FBRUksaUJBQVMsT0FBTyxPQUZwQjtBQUdJLGdCQUFRLElBQUksSUFBRSxDQUFOLEdBQVU7QUFIdEIsS0FYZSxFQWdCZjtBQUNJLGNBQU0sU0FEVjtBQUVJLGlCQUFTLE9BQU8sVUFGcEI7QUFHSSxnQkFBUSxJQUFJLElBQUUsQ0FBTixHQUFVO0FBSHRCLEtBaEJlLENBQW5CO0FBc0JBLFFBQUksV0FBVyxFQUFmO0FBQ0E7O0FBRUEsUUFBSSxLQUFLLElBQVQ7O0FBRUEsTUFBRSxPQUFGLEdBQVksWUFBWTtBQUNwQjtBQUNBLFlBQU0sTUFBTSxPQUFPLE9BQU8sUUFBUCxDQUFnQixJQUF2QixHQUE4QixzQkFBMUM7QUFDQSxVQUFFLFFBQUYsQ0FBVyxHQUFYLEVBQWdCLFVBQVUsSUFBVixFQUFnQjtBQUM1QixpQkFBSyxRQUFMLENBQWMsT0FBZCxDQUF1QixVQUFVLE9BQVYsRUFDdkI7QUFDSSxvQkFBSSxrQkFBa0IsV0FBVyxNQUFYLENBQW1CLFVBQUMsRUFBRCxFQUFRO0FBQzdDLDJCQUFPLEdBQUcsRUFBSCxLQUFVLFFBQVEsVUFBUixDQUFtQixDQUFuQixDQUFqQjtBQUNILGlCQUZxQixDQUF0Qjs7QUFJQSx5QkFBUyxJQUFULENBQ0ksc0JBQVk7QUFDUix1QkFBRyxDQURLO0FBRVIsd0JBQUksV0FBVyxRQUFRLEdBQW5CLENBRkk7QUFHUiwyQkFBTyxRQUFRLEtBSFA7QUFJUiw4QkFBVSxRQUFRLFVBQVIsQ0FBbUIsQ0FBbkIsQ0FKRjtBQUtSLDBCQUFNLFFBQVEsSUFMTjtBQU1SLHlCQUFLLFFBQVEsR0FOTDtBQU9SLDBCQUFNLFFBQVEsY0FBUixDQVBFO0FBUVIsMkJBQU8sZ0JBQWdCLENBQWhCLEVBQW1CLEtBUmxCO0FBU1IsdUJBQUcsV0FBVyxRQUFRLElBQW5CLEVBQXdCLFVBQVUsQ0FBVixDQUF4QixFQUFxQyxVQUFVLENBQVYsQ0FBckMsRUFBa0QsUUFBUSxDQUFSLENBQWxELEVBQThELElBQUUsUUFBUSxDQUFSLENBQWhFLENBVEs7QUFVUix1QkFBRyxnQkFBZ0IsQ0FBaEIsRUFBbUI7QUFWZCxpQkFBWixDQURKO0FBZUgsYUFyQkQ7QUFzQkgsU0F2QkQ7QUF3QkgsS0EzQkQ7O0FBNkJBLE1BQUUsS0FBRixHQUFVLFlBQVc7QUFDakIsYUFBSyxFQUFFLFlBQUYsQ0FBZSxDQUFmLEVBQWtCLENBQWxCLENBQUw7QUFDQSxXQUFHLFlBQUgsQ0FBZ0IsY0FBaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGlCQUFTLElBQVQsQ0FBYyxVQUFTLENBQVQsRUFBVyxDQUFYLEVBQWM7QUFDeEIsZ0JBQUksWUFBWSxNQUFoQjtBQUNBLG1CQUFRLEVBQUUsU0FBRixJQUFlLEVBQUUsU0FBRixDQUFoQixHQUFnQyxDQUFoQyxHQUFzQyxFQUFFLFNBQUYsSUFBZSxFQUFFLFNBQUYsQ0FBaEIsR0FBZ0MsQ0FBQyxDQUFqQyxHQUFxQyxDQUFqRjtBQUNILFNBSEQ7O0FBS0E7QUFDQTtBQUNILEtBckJEOztBQXVCQSxNQUFFLElBQUYsR0FBUyxZQUFXO0FBQ2hCO0FBQ0EsVUFBRSxLQUFGOztBQUVBO0FBQ0EsVUFBRSxNQUFGLENBQVMsRUFBRSxLQUFYOztBQUVBOztBQUVBO0FBQ0EsVUFBRSxNQUFGLENBQVMsT0FBTyxtQkFBaEI7QUFDQSxVQUFFLFlBQUYsQ0FBZSxDQUFmOztBQUVBO0FBQ0EsVUFBRSxJQUFGLENBQU8sUUFBUSxDQUFSLENBQVAsRUFBbUIsSUFBRSxDQUFyQixFQUF3QixJQUFFLFFBQVEsQ0FBUixDQUExQixFQUFzQyxJQUFFLENBQXhDO0FBQ0EsYUFBSyxJQUFJLElBQUUsQ0FBWCxFQUFhLElBQUUsT0FBTyxNQUF0QixFQUE2QixHQUE3QixFQUFrQztBQUM5QixnQkFBSSxNQUFRLEtBQUcsT0FBTyxNQUFQLEdBQWdCLENBQW5CLENBQUYsR0FBNEIsQ0FBdEM7QUFDQSxnQkFBSSxTQUFTLEVBQUUsSUFBRixDQUFPLFFBQVEsQ0FBUixDQUFQLEVBQW1CLElBQUUsUUFBUSxDQUFSLENBQXJCLEVBQWlDLEdBQWpDLENBQWI7QUFDQSxnQkFBSSxhQUFjLENBQUMsSUFBRSxDQUFILElBQVEsQ0FBUixJQUFhLENBQWQsR0FBbUIsRUFBbkIsR0FBd0IsQ0FBQyxFQUExQzs7QUFFQTtBQUNBLGdCQUFHLE1BQU0sQ0FBTixJQUFXLE1BQU0sT0FBTyxNQUFQLEdBQWdCLENBQXBDLEVBQXVDO0FBQ25DLGtCQUFFLE9BQUYsQ0FBVSxNQUFWLEVBQWtCLElBQUUsQ0FBcEIsRUFBdUIsQ0FBdkI7QUFDQSxrQkFBRSxNQUFGLENBQVMsT0FBTyxtQkFBaEI7QUFDQSxrQkFBRSxVQUFGLENBQWEsTUFBYixFQUFvQixJQUFFLENBQXRCLEVBQXdCLE1BQXhCLEVBQStCLElBQUUsSUFBRSxDQUFuQyxFQUFxQyxDQUFyQyxFQUF1QyxFQUF2QztBQUNIOztBQUVEO0FBQ0EsY0FBRSxRQUFGO0FBQ0EsY0FBRSxJQUFGLENBQU8sT0FBTyxRQUFkO0FBQ0EsY0FBRSxJQUFGO0FBQ0EsY0FBRSxTQUFGLENBQVksRUFBRSxNQUFkO0FBQ0EsY0FBRSxJQUFGLENBQU8sT0FBTyxDQUFQLENBQVAsRUFBa0IsTUFBbEIsRUFBMEIsSUFBRSxDQUFGLEdBQUksVUFBOUI7QUFDSDtBQUNELFVBQUUsR0FBRjtBQUNBOztBQUVBO0FBQ0EsaUJBQVMsT0FBVCxDQUFrQixVQUFVLE9BQVYsRUFBbUI7QUFDakMsb0JBQVEsT0FBUixDQUFnQixFQUFFLE1BQWxCLEVBQXlCLEVBQUUsTUFBM0I7QUFDQSxvQkFBUSxJQUFSO0FBQ0gsU0FIRDtBQUlBOztBQUVBO0FBQ0EsY0FBTSxNQUFOO0FBRUgsS0EvQ0Q7O0FBaURBLE1BQUUsYUFBRixHQUFrQixZQUFZO0FBQzFCLFlBQUksRUFBRSxXQUFOO0FBQ0EsWUFBSSxFQUFFLFlBQU47QUFDQSxVQUFFLFlBQUYsQ0FBZSxDQUFmLEVBQWtCLENBQWxCO0FBQ0gsS0FKRDs7QUFNQTs7QUFFQSxhQUFTLGNBQVQsR0FBMkI7QUFDdkIsaUJBQVMsT0FBVCxDQUFrQixVQUFVLE9BQVYsRUFBbUI7QUFDakMsb0JBQVEsT0FBUixDQUFnQixFQUFFLE1BQWxCLEVBQXlCLEVBQUUsTUFBM0I7QUFDSCxTQUZEO0FBR0g7O0FBRUQ7QUFDQSxhQUFTLGVBQVQsR0FBMkI7QUFDdkIsWUFBSSxZQUFZLENBQWhCO0FBQ0EsWUFBSSxhQUFhLEVBQUMsR0FBRSxDQUFILEVBQUssR0FBRSxDQUFQLEVBQWpCOztBQUVBLG1CQUFXLE9BQVgsQ0FBbUIsb0JBQVk7QUFDM0IscUJBQVMsT0FBVCxDQUFpQixtQkFBVztBQUN4QixvQkFBRyxRQUFRLFFBQVIsS0FBcUIsU0FBUyxFQUFqQyxFQUFxQztBQUNqQyx3QkFBRyxjQUFjLElBQUksSUFBSixDQUFTLFFBQVEsSUFBakIsRUFBdUIsUUFBdkIsS0FBb0MsQ0FBckQsRUFBd0Q7QUFDcEQsZ0NBQVEsT0FBUixHQUFrQixJQUFsQjtBQUNBLGdDQUFRLE1BQVIsQ0FBZSxDQUFmLEdBQW1CLFdBQVcsQ0FBOUI7QUFDQSxnQ0FBUSxNQUFSLENBQWUsQ0FBZixHQUFtQixXQUFXLENBQTlCO0FBQ0g7QUFDRCxnQ0FBWSxJQUFJLElBQUosQ0FBUyxRQUFRLElBQWpCLEVBQXVCLFFBQXZCLEtBQW9DLENBQWhEO0FBQ0EsK0JBQVcsQ0FBWCxHQUFlLFFBQVEsQ0FBdkI7QUFDQSwrQkFBVyxDQUFYLEdBQWUsUUFBUSxDQUF2QjtBQUNIO0FBQ0osYUFYRDtBQVlBLG9CQUFRLFFBQVI7QUFDSCxTQWREO0FBZUg7O0FBR0Q7O0FBRUE7Ozs7O0FBS0EsYUFBUyxVQUFULENBQW9CLEdBQXBCLEVBQXlCO0FBQ3JCLFlBQU0sS0FBSyxnQkFBWDtBQUNBLGVBQU8sSUFBSSxLQUFKLENBQVUsRUFBVixFQUFjLENBQWQsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7QUFNQSxhQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsU0FBMUIsRUFBcUMsT0FBckMsRUFBOEMsTUFBOUMsRUFBc0QsSUFBdEQsRUFBNEQ7QUFDeEQ7QUFDQSxZQUFNLFlBQVksQ0FBQyxJQUFELEVBQU8sU0FBUCxFQUFrQixPQUFsQixDQUFsQjtBQUNBLFlBQU0sWUFBWSxFQUFsQjtBQUNBLGtCQUFVLE9BQVYsQ0FBbUIsVUFBVSxJQUFWLEVBQWdCO0FBQy9CLHNCQUFVLElBQVYsQ0FBZSxJQUFJLElBQUosQ0FBUyxJQUFULEVBQWUsT0FBZixFQUFmO0FBQ0gsU0FGRDtBQUdBO0FBQ0EsZUFBTyxFQUFFLEdBQUYsQ0FBTSxVQUFVLENBQVYsQ0FBTixFQUFvQixVQUFVLENBQVYsQ0FBcEIsRUFBa0MsVUFBVSxDQUFWLENBQWxDLEVBQWdELE1BQWhELEVBQXdELElBQXhELENBQVA7QUFDSDs7QUFFRDtBQUVILEM7O0FBaE9EOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDQSxHQUFHLFNBQUgsQ0FBYSxVQUFiOztBQUVBO0FBUkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIi8vIFRvb2xzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29scyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5sb2dQcmV2VmFsdWUgPSBudWxsXG4gICAgICAgIHRoaXMubG9nQ291bnQgPSAwXG4gICAgfVxuXG4gICAgZGUycmEoZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBkZWdyZWUqKE1hdGguUEkvMTgwKTtcbiAgICB9XG4gICAgaXNPZGQobnVtKSB7IHJldHVybiBudW0gJSAyfVxuICAgIExvZyh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5sb2dQcmV2VmFsdWUgPT0gbnVsbCB8fCB0aGlzLmxvZ1ByZXZWYWx1ZS50b1N0cmluZygpICE9PSB2YWx1ZS50b1N0cmluZygpIHx8IChNYXRoLnJvdW5kKHRoaXMubG9nUHJldlZhbHVlICogMTAwMCkgLyAxMDAwKSAhPT0gKE1hdGgucm91bmQodmFsdWUgKiAxMDAwKSAvIDEwMDApKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dQcmV2VmFsdWUgPSB2YWx1ZVxuICAgIH1cbn07XG5cblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEJhc3RvdSBvbiAwNi8wNC8yMDE4LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFydGljbGUge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHByb3BzID0gcHJvcHMgfHwge307IC8vdGhpcyBpcyBkZWZhdWx0IHZhbHVlIGZvciBwYXJhbS5cblxuICAgICAgICAvLyBQNVxuICAgICAgICB0aGlzLnAgPSBwcm9wcy5wO1xuXG4gICAgICAgIC8vIEFydGljbGUgbWV0YXNcbiAgICAgICAgdGhpcy5pZCA9IHByb3BzLmlkO1xuICAgICAgICB0aGlzLmNhdGVnb3J5ID0gcHJvcHMuY2F0ZWdvcnk7XG4gICAgICAgIHRoaXMudGl0bGUgPSBwcm9wcy50aXRsZTtcbiAgICAgICAgdGhpcy5kYXRlID0gcHJvcHMuZGF0ZTtcbiAgICAgICAgdGhpcy51cmwgPSBwcm9wcy51cmw7XG4gICAgICAgIHRoaXMuaHRtbCA9IHByb3BzLmh0bWw7XG5cbiAgICAgICAgLy8gQXJ0aWNsZSBjYW52YXMgc2hhcGVcbiAgICAgICAgdGhpcy54ID0gcHJvcHMueDtcbiAgICAgICAgdGhpcy55ID0gcHJvcHMueTtcbiAgICAgICAgdGhpcy5jb2xvciA9IHByb3BzLmNvbG9yO1xuXG4gICAgICAgIC8vIEFydGljbGUgbGluZSBpZiBjb25uZWN0ZWQgdG8gYW5vdGhlciBhcnRpY2xlXG4gICAgICAgIHRoaXMuaGFzTGluZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxpbmVUbyA9IHt4OjAseTowfVxuXG4gICAgICAgIC8vIHByaXZhdGVcbiAgICAgICAgdGhpcy5fciA9IDEwO1xuXG4gICAgICAgIC8vIEFyb3VuZCBjaXJjbGVzXG5cbiAgICAgICAgLy8gVE9ETzogcHV0IHRoYXQgc3R1ZmYgaW4gYW4gb2JqZWN0IGZ1Y2sgb2ZmXG4gICAgICAgIHRoaXMuYXJvdW5kQ2lyY2xlc05iID0gNDtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVST2ZmID0gMDtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVzID0gbmV3IEFycmF5KHRoaXMuYXJvdW5kQ2lyY2xlc05iKS5maWxsKDApLm1hcChjID0+ICh7eDp0aGlzLngsIHk6dGhpcy55LHI6MH0pKTtcblxuICAgICAgICAvLyB0aXRsZSBpbiBWaWV3XG4gICAgICAgIHRoaXMudWlUaXRsZUFscGhhID0ge2E6MH07IC8vIG11c3QgIGJlIGFuIG9iamVjdCBmb3IgVHdlZW5cbiAgICAgICAgdGhpcy51aVRpdGxlUCA9IHtcbiAgICAgICAgICAgICdhbHBoYSc6IHt4OjAsIHk6MH0sXG4gICAgICAgICAgICAnYWxwaGFUYXJnZXQnOiB7YToyNTV9LFxuICAgICAgICAgICAgJ3R3ZWVuJzogbmV3IFRXRUVOLlR3ZWVuKHRoaXMudWlUaXRsZUFscGhhKVxuICAgICAgICAgICAgICAgIC50byh7YTogMjU1fSwgNTAwKVxuICAgICAgICAgICAgICAgIC5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YWRyYXRpYy5JbilcbiAgICAgICAgICAgICAgICAub25VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMudWlUaXRsZUFscGhhLmEpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgJ3N0YXJ0ZWQnOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgY2xpY2tlZChweCwgcHkpIHtcbiAgICAgICAgaWYodGhpcy5wb2ludGVySW5BcnRpY2xlKHB4LHB5KSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrZWQgb24gYXJ0aWNsZScgKyAnXCInICsgdGhpcy50aXRsZSArICdcIicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaG92ZXJlZChweCwgcHkpIHtcblxuICAgICAgICBpZih0aGlzLnBvaW50ZXJJbkFydGljbGUocHgscHkpKSB7XG4gICAgICAgICAgICAvLyB0aXRsZSBpblxuICAgICAgICAgICAgdGhpcy5kcmF3VGl0bGUoKTtcblxuICAgICAgICAgICAgLy8gY2lyY2xlcyBpblxuICAgICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlc0Fyb3VuZCgpXG5cbiAgICAgICAgICAgIHRoaXMucC5jdXJzb3IodGhpcy5wLkhBTkQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGl0bGUgb3V0XG4gICAgICAgICAgICB0aGlzLmRyYXdUaXRsZSh0cnVlKTtcblxuICAgICAgICAgICAgLy8gY2lyY2xlcyBvdXRcbiAgICAgICAgICAgIHRoaXMuZHJhd0NpcmNsZXNBcm91bmQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwb2ludGVySW5BcnRpY2xlKHB4LHB5KSB7XG4gICAgICAgIGxldCBkID0gdGhpcy5wLmRpc3QocHgsIHB5LCB0aGlzLngsIHRoaXMueSk7XG4gICAgICAgIGlmKGQgPCB0aGlzLl9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLmNvbG9yKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5wLmVsbGlwc2UodGhpcy54LCB0aGlzLnksIHRoaXMuX3IpO1xuICAgICAgICB0aGlzLnAucG9wKCk7XG5cbiAgICAgICAgaWYodGhpcy5oYXNMaW5lKSB7XG4gICAgICAgICAgICB0aGlzLnAuc3Ryb2tlKHRoaXMuY29sb3IpO1xuICAgICAgICAgICAgdGhpcy5wLnN0cm9rZVdlaWdodCg0KTtcbiAgICAgICAgICAgIHRoaXMucC5wdXNoKCk7XG4gICAgICAgICAgICB0aGlzLnAubGluZSh0aGlzLngsIHRoaXMueSwgdGhpcy5saW5lVG8ueCwgdGhpcy5saW5lVG8ueSk7XG4gICAgICAgICAgICB0aGlzLnAucG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkcmF3Q2lyY2xlc0Fyb3VuZChvdXQgPSBmYWxzZSkge1xuICAgICAgICBpZihvdXQgJiYgdGhpcy5hcm91bmRDaXJjbGVzLnIgPT09IDApIHJldHVybjtcbiAgICAgICAgdGhpcy5wLm5vU3Ryb2tlKCk7XG4gICAgICAgIHRoaXMuY29sb3Iuc2V0QWxwaGEoNDApO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLmNvbG9yKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVzLmZvckVhY2goKGMsIGkpID0+IHtcbiAgICAgICAgICAgIC8vIGVhc2UgcmFkaXVzIHNpemVcbiAgICAgICAgICAgIGlmKG91dCkge1xuICAgICAgICAgICAgICAgIGMuciAgKz0gKDAgLSBjLnIgKSAqIDAuMTM7XG4gICAgICAgICAgICB9ICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcm91bmRDaXJjbGVST2ZmICs9IDAuMDA3O1xuICAgICAgICAgICAgICAgIGxldCBuID0gdGhpcy5wLm5vaXNlKHRoaXMuYXJvdW5kQ2lyY2xlUk9mZikqMS41O1xuICAgICAgICAgICAgICAgIGMuciAgKz0gKCAodGhpcy5fciArIG4gKyAoaSAqIDEyICogbikgKSAtIGMuciApICogMC4xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wLmVsbGlwc2UoYy54LCBjLnksIGMucilcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICAgICAgdGhpcy5jb2xvci5zZXRBbHBoYSgyNTUpO1xuICAgIH1cblxuICAgIGRyYXdUaXRsZShvdXQgPSBmYWxzZSkge1xuICAgICAgICBpZihvdXQpIHtcbiAgICAgICAgICAgIHRoaXMudWlUaXRsZVAudHdlZW4uc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy51aVRpdGxlUC5zdGFydGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnVpVGl0bGVBbHBoYS5hID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZighdGhpcy51aVRpdGxlUC5zdGFydGVkICYmICFvdXQpIHtcbiAgICAgICAgICAgIHRoaXMudWlUaXRsZVAudHdlZW4uc3RhcnQoKTtcbiAgICAgICAgICAgIHRoaXMudWlUaXRsZVAuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYob3V0KSByZXR1cm47XG4gICAgICAgIHRoaXMuY29sb3Iuc2V0QWxwaGEodGhpcy51aVRpdGxlQWxwaGEuYSk7XG4gICAgICAgIHRoaXMucC5ub1N0cm9rZSgpO1xuICAgICAgICB0aGlzLnAuZmlsbCh0aGlzLmNvbG9yKTtcbiAgICAgICAgdGhpcy5wLnB1c2goKTtcbiAgICAgICAgdGhpcy5wLnRleHRBbGlnbih0aGlzLnAuQ0VOVEVSKTtcbiAgICAgICAgdGhpcy5wLnRleHQodGhpcy50aXRsZSwgdGhpcy54LCB0aGlzLnkgLSAzMCk7XG4gICAgICAgIHRoaXMucC5wb3AoKTtcbiAgICAgICAgdGhpcy5jb2xvci5zZXRBbHBoYSgyNTUpO1xuICAgIH1cbn0iLCIvKipcbiAqIENyZWF0ZWQgYnkgQmFzdG91IG9uIDA2LzA0LzIwMTguXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2F0ZWdvcnkge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgICAgIHRoaXMuY29sb3IgPSBwcm9wcy5jb2xvcjtcbiAgICAgICAgdGhpcy5wb3NZID0gcHJvcHMucG9zWTtcbiAgICB9XG59IiwiLypcbiBEcmF3IGRhc2hlZCBsaW5lcyB3aGVyZVxuIChsID0gbGVuZ3RoIG9mIGRhc2hlZCBsaW5lIGluIHB4LCBnID0gZ2FwIGluIHB4KVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIsIGwsIGcpIHtcbiAgICBjb25zdCBwYyA9IHRoaXMuZGlzdCh4MSwgeTEsIHgyLCB5MikgLyAxMDA7XG4gICAgbGV0IHBjQ291bnQgPSAxO1xuICAgIGxldCBsUGVyY2VudCwgZ1BlcmNlbnQgPSAwO1xuICAgIGxldCBjdXJyZW50UG9zID0gMDtcbiAgICBsZXQgeHgxLCB5eTEsIHh4MiwgeXkyID0gMDtcblxuICAgIHdoaWxlICh0aGlzLmludChwY0NvdW50ICogcGMpIDwgbCkge1xuICAgICAgICBwY0NvdW50KytcbiAgICB9XG4gICAgbFBlcmNlbnQgPSBwY0NvdW50O1xuICAgIHBjQ291bnQgPSAxO1xuICAgIHdoaWxlICh0aGlzLmludChwY0NvdW50ICogcGMpIDwgZykge1xuICAgICAgICBwY0NvdW50KytcbiAgICB9XG4gICAgZ1BlcmNlbnQgPSBwY0NvdW50O1xuXG4gICAgbFBlcmNlbnQgPSBsUGVyY2VudCAvIDEwMDtcbiAgICBnUGVyY2VudCA9IGdQZXJjZW50IC8gMTAwO1xuICAgIHdoaWxlIChjdXJyZW50UG9zIDwgMSkge1xuICAgICAgICB4eDEgPSB0aGlzLmxlcnAoeDEsIHgyLCBjdXJyZW50UG9zKTtcbiAgICAgICAgeXkxID0gdGhpcy5sZXJwKHkxLCB5MiwgY3VycmVudFBvcyk7XG4gICAgICAgIHh4MiA9IHRoaXMubGVycCh4MSwgeDIsIGN1cnJlbnRQb3MgKyBsUGVyY2VudCk7XG4gICAgICAgIHl5MiA9IHRoaXMubGVycCh5MSwgeTIsIGN1cnJlbnRQb3MgKyBsUGVyY2VudCk7XG4gICAgICAgIGlmICh4MSA+IHgyKSB7XG4gICAgICAgICAgICBpZiAoeHgyIDwgeDIpIHtcbiAgICAgICAgICAgICAgICB4eDIgPSB4MjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoeDEgPCB4Mikge1xuICAgICAgICAgICAgaWYgKHh4MiA+IHgyKSB7XG4gICAgICAgICAgICAgICAgeHgyID0geDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkxID4geTIpIHtcbiAgICAgICAgICAgIGlmICh5eTIgPCB5Mikge1xuICAgICAgICAgICAgICAgIHl5MiA9IHkyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh5MSA8IHkyKSB7XG4gICAgICAgICAgICBpZiAoeXkyID4geTIpIHtcbiAgICAgICAgICAgICAgICB5eTIgPSB5MjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGluZSh4eDEsIHl5MSwgeHgyLCB5eTIpO1xuICAgICAgICBjdXJyZW50UG9zID0gY3VycmVudFBvcyArIGxQZXJjZW50ICsgZ1BlcmNlbnQ7XG4gICAgfVxufVxuIiwiLy9pbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbSwgc3VtIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgc2tldGNoIGZyb20gJy4vc2tldGNoJztcbmltcG9ydCBUb29scyBmcm9tICcuL1Rvb2xzJztcblxuXG4vLyBnbG9iYWwgdG9vbHNcbndpbmRvdy50b29scyA9IG5ldyBUb29scygpO1xuXG5cbm5ldyBwNShza2V0Y2gsICd0aW1lbGluZScpO1xuXG4iLCIvL2ltcG9ydCBCdWJibGUgZnJvbSAnLi9idWJibGUnO1xuaW1wb3J0IGRhc2hlZExpbmUgZnJvbSAnLi9kYXNoZWRMaW5lJztcbmltcG9ydCBBcnRpY2xlIGZyb20gJy4vYXJ0aWNsZSc7XG5pbXBvcnQgQ2F0ZWdvcnkgZnJvbSAnLi9jYXRlZ29yeSc7XG5cbi8vIEFkZCBleHRlbnNpb24gdG8gUDVcbnA1LnByb3RvdHlwZS5kYXNoZWRMaW5lID0gZGFzaGVkTGluZTtcblxuLy8gU2V0dXAgdGltZWxpbmVcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCBwICkge1xuXG4gICAgLy8gVElNRUxJTkUgQ09ORklHUyAvLy8vLy8vLy9cbiAgICBjb25zdCBwYWRkaW5nID0gWzAsIDgwXTtcbiAgICBsZXQgVyA9IHAud2luZG93V2lkdGg7XG4gICAgbGV0IEggPSBwLndpbmRvd0hlaWdodDtcbiAgICBjb25zdCBtb250aHMgPSBbJ1NFUC4nLCdPQ1QuJywnTk9WLicsJ0RFQy4nLCdKQU4uJywnRkVCLicsJ01BUi4nLCdBUFIuJ107XG4gICAgY29uc3QgZGF0ZVJhbmdlID0gW1xuICAgICAgICAnMjAxNy0wOS0wMVQwMDowMDowMCcsXG4gICAgICAgICcyMDE4LTA0LTAxVDAwOjAwOjAwJ1xuICAgIF1cbiAgICBjb25zdCBjb2xvcnMgPSB7XG4gICAgICAgICdwYWxlSWxhYyc6IHAuY29sb3IoJ3JnYmEoMjI5LCAyMjcsIDI1NSknKSxcbiAgICAgICAgJ3BhbGVJbGFjVHJhbnNwYXJlbnQnOiBwLmNvbG9yKCdyZ2JhKDIyOSwgMjI3LCAyNTUsIDAuMiknKSxcbiAgICAgICAgJ2RhcmtCbHVlR3JleSc6IHAuY29sb3IoJ3JnYigyMiwgMjAsIDU5KScpLFxuICAgICAgICAnZGFya1NlYWZvYW0nOiBwLmNvbG9yKCdyZ2IoMzYsIDE4MSwgMTMxKScpLFxuICAgICAgICAnYnJpZ2h0U2t5Qmx1ZSc6IHAuY29sb3IoJ3JnYig0LCAxOTAsIDI1NCknKSxcbiAgICAgICAgJ3JlZFBpbmsnOiBwLmNvbG9yKCdyZ2IoMjQ4LCA0NCwgMTAzKScpLFxuICAgICAgICAncGFsZVllbGxvdyc6IHAuY29sb3IoJ3JnYigyNTAsIDI1NSwgMTMxKScpXG4gICAgfTtcbiAgICBjb25zdCBjYXRlZ29yaWVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnZWNvbG9neScsXG4gICAgICAgICAgICAnY29sb3InOiBjb2xvcnMuZGFya1NlYWZvYW0sXG4gICAgICAgICAgICAncG9zWSc6IEgvNCArIDQ1XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdob3VzZScsXG4gICAgICAgICAgICAnY29sb3InOiBjb2xvcnMuYnJpZ2h0U2t5Qmx1ZSxcbiAgICAgICAgICAgICdwb3NZJzogSC8zICsgNDVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ3NlY3VyaXR5JyxcbiAgICAgICAgICAgICdjb2xvcic6IGNvbG9ycy5yZWRQaW5rLFxuICAgICAgICAgICAgJ3Bvc1knOiBIIC0gSC80IC0gNDVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2NvbWZvcnQnLFxuICAgICAgICAgICAgJ2NvbG9yJzogY29sb3JzLnBhbGVZZWxsb3csXG4gICAgICAgICAgICAncG9zWSc6IEggLSBILzMgLSA0NVxuICAgICAgICB9XG4gICAgXTtcbiAgICBsZXQgYXJ0aWNsZXMgPSBbXTtcbiAgICAvLyBFTkQgVElNRUxJTkUgQ09ORklHUyAvLy8vLy8vLy9cblxuICAgIGxldCBjdiA9IG51bGw7XG5cbiAgICBwLnByZWxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEdldCBhbGwgYXJ0aWNsZXMgZnJvbSBnZW5lcmF0ZWQgaHVnbyBqc29uXG4gICAgICAgIGNvbnN0IHVybCA9ICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArICcvYXJ0aWNsZXMvaW5kZXguanNvbic7XG4gICAgICAgIHAubG9hZEpTT04odXJsLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5hcnRpY2xlcy5mb3JFYWNoKCBmdW5jdGlvbiAoYXJ0aWNsZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJ0aWNsZUNhdGVnb3J5ID0gY2F0ZWdvcmllcy5maWx0ZXIoIChlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuaWQgPT09IGFydGljbGUuY2F0ZWdvcmllc1swXVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgYXJ0aWNsZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgbmV3IEFydGljbGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcDogcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBzbHVnaWZ5VXJsKGFydGljbGUudXJsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBhcnRpY2xlLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGFydGljbGUuY2F0ZWdvcmllc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGFydGljbGUuZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYXJ0aWNsZS51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sOiBhcnRpY2xlWydjb250ZW50X2h0bWwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhcnRpY2xlQ2F0ZWdvcnlbMF0uY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBkYXRlVG9Qb3NYKGFydGljbGUuZGF0ZSxkYXRlUmFuZ2VbMF0sZGF0ZVJhbmdlWzFdLHBhZGRpbmdbMV0sIFctcGFkZGluZ1sxXSksXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBhcnRpY2xlQ2F0ZWdvcnlbMF0ucG9zWVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwLnNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGN2ID0gcC5jcmVhdGVDYW52YXMoVywgSCk7XG4gICAgICAgIGN2Lm1vdXNlUHJlc3NlZChjdk1vdXNlUHJlc3NlZCk7XG4gICAgICAgIC8vIGxldCBmaXJzdEFydGljbGUgPSBuZXcgQXJ0aWNsZSh7XG4gICAgICAgIC8vICAgICBwOiBwLFxuICAgICAgICAvLyAgICAgaWQ6J2ZpcnN0QXJ0aWNsZScsXG4gICAgICAgIC8vICAgICBjYXRlZ29yeTogJ2Vjb2xvZ3knLFxuICAgICAgICAvLyAgICAgZGF0ZTogbmV3IERhdGUoJzE5OTUtMTItMTdUMDM6MjQ6MDAnKVxuICAgICAgICAvLyB9KVxuXG4gICAgICAgIC8vIHRlc3QgdHdlZW5cbiAgICAgICAgLy90d2Vlbi5zdGFydCgpO1xuXG4gICAgICAgIC8vIFNvcnQgYXJ0aWNsZXNcbiAgICAgICAgYXJ0aWNsZXMuc29ydChmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgICAgIGxldCBzb3J0UGFyYW0gPSAnZGF0ZSc7XG4gICAgICAgICAgICByZXR1cm4gKGFbc29ydFBhcmFtXSA+IGJbc29ydFBhcmFtXSkgPyAxIDogKChiW3NvcnRQYXJhbV0gPiBhW3NvcnRQYXJhbV0pID8gLTEgOiAwKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFRPRE86IG1vdmUgYXdheVxuICAgICAgICB0bEFydGljbGVzTGluZXMoKTtcbiAgICB9O1xuXG4gICAgcC5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vcC5iYWNrZ3JvdW5kKCcjMDIwMTI2Jyk7XG4gICAgICAgIHAuY2xlYXIoKTtcblxuICAgICAgICAvLyBDVVJTT1IgU1RBVEVcbiAgICAgICAgcC5jdXJzb3IocC5BUlJPVyk7XG5cbiAgICAgICAgLy8vLy8vLyBNT05USFMgLy8vLy8vLy9cblxuICAgICAgICAvLyBNb250aHMgbGluZVxuICAgICAgICBwLnN0cm9rZShjb2xvcnMucGFsZUlsYWNUcmFuc3BhcmVudCk7XG4gICAgICAgIHAuc3Ryb2tlV2VpZ2h0KDEpO1xuXG4gICAgICAgIC8vIE1vbnRoc1xuICAgICAgICBwLmxpbmUocGFkZGluZ1sxXSwgSC8yLCBXLXBhZGRpbmdbMV0sIEgvMik7XG4gICAgICAgIGZvciAobGV0IGk9MDtpPG1vbnRocy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICBsZXQgYW10ID0gKCBpLyhtb250aHMubGVuZ3RoIC0gMSkgKSAqIDE7XG4gICAgICAgICAgICBsZXQgbW9udGhYID0gcC5sZXJwKHBhZGRpbmdbMV0sIFctcGFkZGluZ1sxXSwgYW10KTtcbiAgICAgICAgICAgIGxldCB0ZXh0T2ZmZXN0ID0gKChpKzEpICUgMiA9PSAwKSA/IDMwIDogLTIwO1xuXG4gICAgICAgICAgICAvLyBjaXJjbGUgYW5kIHZlcnRpY2FsIGRhc2ggbGluZVxuICAgICAgICAgICAgaWYoaSAhPT0gMCAmJiBpICE9PSBtb250aHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIHAuZWxsaXBzZShtb250aFgsIEgvMiwgOSk7XG4gICAgICAgICAgICAgICAgcC5zdHJva2UoY29sb3JzLnBhbGVJbGFjVHJhbnNwYXJlbnQpO1xuICAgICAgICAgICAgICAgIHAuZGFzaGVkTGluZShtb250aFgsSC80LG1vbnRoWCxILUgvNCwxLDE1KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdGV4dFxuICAgICAgICAgICAgcC5ub1N0cm9rZSgpO1xuICAgICAgICAgICAgcC5maWxsKGNvbG9ycy5wYWxlSWxhYyk7XG4gICAgICAgICAgICBwLnB1c2goKTtcbiAgICAgICAgICAgIHAudGV4dEFsaWduKHAuQ0VOVEVSKTtcbiAgICAgICAgICAgIHAudGV4dChtb250aHNbaV0sIG1vbnRoWCwgSC8yK3RleHRPZmZlc3QpO1xuICAgICAgICB9XG4gICAgICAgIHAucG9wKCk7XG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvLy8vLy8vIEFSVElDTEVTIC8vLy8vLy8vXG4gICAgICAgIGFydGljbGVzLmZvckVhY2goIGZ1bmN0aW9uIChhcnRpY2xlKSB7XG4gICAgICAgICAgICBhcnRpY2xlLmhvdmVyZWQocC5tb3VzZVgscC5tb3VzZVkpO1xuICAgICAgICAgICAgYXJ0aWNsZS5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gVFdFRU5TIC8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICBUV0VFTi51cGRhdGUoKTtcblxuICAgIH1cblxuICAgIHAud2luZG93UmVzaXplZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVyA9IHAud2luZG93V2lkdGg7XG4gICAgICAgIEggPSBwLndpbmRvd0hlaWdodDtcbiAgICAgICAgcC5yZXNpemVDYW52YXMoVywgSCk7XG4gICAgfVxuXG4gICAgLy8gSU5URVJBQ1RJT05TIC8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgZnVuY3Rpb24gY3ZNb3VzZVByZXNzZWQgKCkge1xuICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKCBmdW5jdGlvbiAoYXJ0aWNsZSkge1xuICAgICAgICAgICAgYXJ0aWNsZS5jbGlja2VkKHAubW91c2VYLHAubW91c2VZKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBMZXMgdHJhaXRzICFcbiAgICBmdW5jdGlvbiB0bEFydGljbGVzTGluZXMoKSB7XG4gICAgICAgIGxldCBsYXN0TW9udGggPSAwO1xuICAgICAgICBsZXQgbGFzdENvb3JkcyA9IHt4OjAseTowfTtcblxuICAgICAgICBjYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xuICAgICAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaChhcnRpY2xlID0+IHtcbiAgICAgICAgICAgICAgICBpZihhcnRpY2xlLmNhdGVnb3J5ID09PSBjYXRlZ29yeS5pZCkge1xuICAgICAgICAgICAgICAgICAgICBpZihsYXN0TW9udGggPT09IG5ldyBEYXRlKGFydGljbGUuZGF0ZSkuZ2V0TW9udGgoKSArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFydGljbGUuaGFzTGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpY2xlLmxpbmVUby54ID0gbGFzdENvb3Jkcy54O1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZS5saW5lVG8ueSA9IGxhc3RDb29yZHMueTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9udGggPSBuZXcgRGF0ZShhcnRpY2xlLmRhdGUpLmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBsYXN0Q29vcmRzLnggPSBhcnRpY2xlLng7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RDb29yZHMueSA9IGFydGljbGUueTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvLyBURU1QIFVUSUxTIC8vLy8vLy8vL1xuXG4gICAgLypcbiAgICAgKiAgc2x1Z2lmeVVybFxuICAgICAqICBnZXQgbGFzdCBwYXJ0IG9mIHVybFxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2x1Z2lmeVVybCh1cmwpIHtcbiAgICAgICAgY29uc3QgcmUgPSAnW14vXSsoPz1cXC8kfCQpJ1xuICAgICAgICByZXR1cm4gdXJsLm1hdGNoKHJlKVswXTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqICBkYXRlVG9Qb3NYXG4gICAgICpcbiAgICAgKiAgVHJhbnNmb3JtIHRpbWVzdGFtcCB0byBwb3NpdGlvbiBpbiBwaXhlbCAgd2l0aGluIGEgcmFuZ2VcbiAgICAgKiAgcmV0dXJuIHBvc2l0aW9uIGluIHBpeGVscyAoaW50KVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRhdGVUb1Bvc1goZGF0ZSwgYmVnaW5EYXRlLCBFbmREYXRlLCBiZWdpblgsIGVuZFgpIHtcbiAgICAgICAgLy8gRGF0ZSBUcmFuc2Zvcm1cbiAgICAgICAgY29uc3QgZGF0ZUFycmF5ID0gW2RhdGUsIGJlZ2luRGF0ZSwgRW5kRGF0ZV07XG4gICAgICAgIGNvbnN0IGRhdGVUaW1lcyA9IFtdO1xuICAgICAgICBkYXRlQXJyYXkuZm9yRWFjaCggZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgIGRhdGVUaW1lcy5wdXNoKG5ldyBEYXRlKGRhdGUpLmdldFRpbWUoKSlcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHJldHVybiBwb3MgaW4gcGl4ZWxcbiAgICAgICAgcmV0dXJuIHAubWFwKGRhdGVUaW1lc1swXSwgZGF0ZVRpbWVzWzFdLCBkYXRlVGltZXNbMl0sIGJlZ2luWCwgZW5kWCk7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxufSJdfQ==
