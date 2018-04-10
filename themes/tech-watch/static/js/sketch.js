//import Bubble from './bubble';
import dashedLine from './dashedLine';
import Article from './article';
import datas from './datas';
import Category from './category';

// Add extension to P5
p5.prototype.dashedLine = dashedLine;

// Setup timeline
export default function( p ) {

    // TIMELINE CONFIGS /////////
    const padding = [0, 80];
    let W = p.windowWidth;
    let H = p.windowHeight;
    const catPosY = [
        (H/4 + 45),
        (H/3 + 45),
        (H - H/3 - 45),
        (H - H/4 - 45)
    ];
    let font;
    let states = {
        'categorySelected': false,
    }

    /////////////////////////

    let Pcolors = Object.keys(datas.colors).reduce(function(previous, current) {
        previous[current] = p.color(datas.colors[current]);
        return previous;
    }, {});

    let categories = [];
    // Parse categories
    datas.categories.forEach((c, key) => {
        let currentCat = new Category(Object.assign(c,{p}));
        currentCat.posY = catPosY[c.pos - 1]; // Set Y pos
        categories.push(currentCat);
        categories[key].init();
    });

    // categories = datas.categories.map(c => {
    //     return new Category(Object.assign(c,{p}));
    // });
    /////////////////////////

    let articles = [];
    // END TIMELINE CONFIGS /////////

    let cv = null;

    p.preload = function () {

        // Load font
        font = p.loadFont('./font/karla.ttf');

        // Get all articles from generated hugo json
        const url = '//' + window.location.host + '/articles/index.json';
        p.loadJSON(url, function (data) {
            data.articles.forEach( (article, key) =>
            {
                let articleCategory = categories.filter( (el) => {
                    return el.id === article.categories[0]
                });

                articles.push(
                    new Article({
                        p: p,
                        id: tools.getLastPartUrl(article.url),
                        title: article.title,
                        category: article.categories[0],
                        date: article.date,
                        url: article.url,
                        html: article['content_html'],
                        color: articleCategory[0].color,
                        // TODO: make in article
                        x: setDateToPosX(article.date,datas.dateRange[0],datas.dateRange[1],padding[1], W - padding[1]),
                        y: articleCategory[0].posY
                    })
                );
                articles[key].init();
            })
        });

        // Sort articles
        articles.sort(function(a,b) {
            let sortParam = 'date';
            return (a[sortParam] > b[sortParam]) ? 1 : ((b[sortParam] > a[sortParam]) ? -1 : 0)
        })
    };

    p.setup = function() {
        cv = p.createCanvas(W, H);
        cv.mousePressed(cvMousePressed);


        // TODO: move away
        setupArticlesLines();
    };

    p.draw = function() {
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
        p.line(padding[1], H/2, W-padding[1], H/2);
        for (let i=0;i<datas.months.length;i++) {
            let amt = ( i/(datas.months.length - 1) ) * 1;
            let monthX = p.lerp(padding[1], W-padding[1], amt);
            let textOffest = ((i+1) % 2 == 0) ? 30 : -20;

            // circle and vertical dash line
            if(i !== 0 && i !== datas.months.length - 1) {
                p.ellipse(monthX, H/2, 9);
                p.stroke(Pcolors.paleIlacTransparent);
                p.dashedLine(monthX,H/4,monthX,H-H/4,1,15);
            }

            // text
            p.noStroke();
            p.fill(Pcolors.paleIlac);
            p.textSize(14);
            p.textAlign(p.CENTER);
            p.push();
            p.text(datas.months[i], monthX, H/2+textOffest);
        }
        p.pop();
        /////////////////////////

        /////// CATEGORIES ////////
        categories.forEach( function (category) {
            category.hovered(p.mouseX,p.mouseY);
            category.show();

            // click
            if(category.isClicked) {
                categories.forEach( function (category) {
                    category.isClicked = false;
                });
                category.isClicked = true;
            }

            if(category.isClicked) {
                states.categorySelected = true;
                filterArticles(category);
            } else {
                states.categorySelected = false;
            }

            // hover
            if(category.isHovered) {
                filterArticles(category);
            }

            // select state
            if(category.isHovered || category.isClicked) {
                states.categorySelected = true;
            } else {
                states.categorySelected = false;
            }

            p.text(category.id + ': ' + states.categorySelected, 20 ,200 + 20 * category.pos);
        });
        /////////////////////////


        /////// ARTICLES ////////
        articles.forEach( function (article) {
            article.hovered(p.mouseX,p.mouseY);
            article.show();
            if(!states.categorySelected) {
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

    function cvMousePressed () {
        articles.forEach( function (article) {
            article.clicked(p.mouseX,p.mouseY)
        });
        categories.forEach( function (category) {
            category.isClicked = false;
            category.clicked(p.mouseX,p.mouseY)
        });
    }

    // Les traits !
    // TODO: in class articlesManager ?
    function setupArticlesLines() {
        let lastMonth = 0;
        let lastCoords = {x:0,y:0};

        datas.categories.forEach(category => {
            articles.forEach(article => {
                if(article.category === category.id) {
                    if(lastMonth === new Date(article.date).getMonth() + 1) {
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
        const dateArray = [date, beginDate, EndDate];
        const dateTimes = [];
        dateArray.forEach( function (date) {
            dateTimes.push(new Date(date).getTime())
        });
        // return pos in pixel
        return p.map(dateTimes[0], dateTimes[1], dateTimes[2], beginX, endX);
    }

    function filterArticles(category) {
        articles.forEach( function (article) {
            if(article.category !== category.id) {
                article.darkened = true;
            } else {
                article.darkened = false;
            }
        });
    }
    ///////////////////////

}