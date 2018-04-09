//import Bubble from './bubble';
import dashedLine from './dashedLine';
import Article from './article';
import Category from './category';

// Add extension to P5
p5.prototype.dashedLine = dashedLine;

// Setup timeline
export default function( p ) {

    // TIMELINE CONFIGS /////////
    const padding = [0, 80];
    let W = p.windowWidth;
    let H = p.windowHeight;

    /////////////////////////

    // TODO: add all to class data
    const months = ['SEP.','OCT.','NOV.','DEC.','JAN.','FEB.','MAR.','APR.'];
    const dateRange = [
        '2017-09-01T00:00:00',
        '2018-04-01T00:00:00'
    ]
    const colors = {
        'paleIlac': p.color('rgba(229, 227, 255)'),
        'paleIlacTransparent': p.color('rgba(229, 227, 255, 0.2)'),
        'darkBlueGrey': p.color('rgb(22, 20, 59)'),
        'darkSeafoam': p.color('rgb(36, 181, 131)'),
        'brightSkyBlue': p.color('rgb(4, 190, 254)'),
        'redPink': p.color('rgb(248, 44, 103)'),
        'paleYellow': p.color('rgb(250, 255, 131)')
    };
    const categories = [
        {
            'id': 'ecology',
            'color': colors.darkSeafoam,
            'posY': H/4 + 45
        },
        {
            'id': 'house',
            'color': colors.brightSkyBlue,
            'posY': H/3 + 45
        },
        {
            'id': 'security',
            'color': colors.redPink,
            'posY': H - H/4 - 45
        },
        {
            'id': 'comfort',
            'color': colors.paleYellow,
            'posY': H - H/3 - 45
        }
    ];
    /////////////////////////

    let articles = [];
    // END TIMELINE CONFIGS /////////

    let cv = null;

    p.preload = function () {

        // Get all articles from generated hugo json
        const url = '//' + window.location.host + '/articles/index.json';
        p.loadJSON(url, function (data) {
            data.articles.forEach( function (article)
            {
                let articleCategory = categories.filter( (el) => {
                    return el.id === article.categories[0]
                });

                articles.push(
                    new Article({
                        p: p,
                        id: slugifyUrl(article.url),
                        title: article.title,
                        category: article.categories[0],
                        date: article.date,
                        url: article.url,
                        html: article['content_html'],
                        color: articleCategory[0].color,
                        x: dateToPosX(article.date,dateRange[0],dateRange[1],padding[1], W - padding[1]),
                        y: articleCategory[0].posY
                    })
                );

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
        tlArticlesLines();
    };

    p.draw = function() {
        //p.background('#020126');
        p.clear();

        // CURSOR STATE
        p.cursor(p.ARROW);

        /////// MONTHS ////////

        // Months line
        p.stroke(colors.paleIlacTransparent);
        p.strokeWeight(1);

        // Months
        p.line(padding[1], H/2, W-padding[1], H/2);
        for (let i=0;i<months.length;i++) {
            let amt = ( i/(months.length - 1) ) * 1;
            let monthX = p.lerp(padding[1], W-padding[1], amt);
            let textOffest = ((i+1) % 2 == 0) ? 30 : -20;

            // circle and vertical dash line
            if(i !== 0 && i !== months.length - 1) {
                p.ellipse(monthX, H/2, 9);
                p.stroke(colors.paleIlacTransparent);
                p.dashedLine(monthX,H/4,monthX,H-H/4,1,15);
            }

            // text
            p.noStroke();
            p.fill(colors.paleIlac);
            p.push();
            p.textAlign(p.CENTER);
            p.text(months[i], monthX, H/2+textOffest);
        }
        p.pop();
        /////////////////////////

        /////// ARTICLES ////////
        articles.forEach( function (article) {
            article.hovered(p.mouseX,p.mouseY);
            article.show();
        });
        /////////////////////////

        // TWEENS //////////////////
        TWEEN.update();

    }

    p.windowResized = function () {
        W = p.windowWidth;
        H = p.windowHeight;
        p.resizeCanvas(W, H);

        // TODO: re-calcul article pos)
    }

    // INTERACTIONS //////////////////

    function cvMousePressed () {
        articles.forEach( function (article) {
            article.clicked(p.mouseX,p.mouseY)
        });
    }

    // Les traits !
    // TODO: in class articlesManager ?
    function tlArticlesLines() {
        let lastMonth = 0;
        let lastCoords = {x:0,y:0};

        categories.forEach(category => {
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
        const re = '[^/]+(?=\/$|$)'
        return url.match(re)[0];
    }

    // TODO : add to article
    /*
     *  dateToPosX
     *
     *  Transform timestamp to position in pixel  within a range
     *  return position in pixels (int)
     */
    function dateToPosX(date, beginDate, EndDate, beginX, endX) {
        // Date Transform
        const dateArray = [date, beginDate, EndDate];
        const dateTimes = [];
        dateArray.forEach( function (date) {
            dateTimes.push(new Date(date).getTime())
        });
        // return pos in pixel
        return p.map(dateTimes[0], dateTimes[1], dateTimes[2], beginX, endX);
    }

    ///////////////////////

}