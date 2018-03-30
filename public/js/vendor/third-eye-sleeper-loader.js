 // Init vars
 var $mainCont, cv, ctx, osCv, osCtx, osPersoCv, osPersoCtx, osLzCv, osLzCtx, center, windowSize, startX, startY, mouse, resizeWithContext;

 // Init CONTROL vars
 var P_WIDTH = 192;
 var P_HEIGHT = 172;
 var BG_COLOR = "#0E112B";
 var PERSO_COLOR = "#f5f7f9";
 var APPROACH = 250;
 var FORCE = 50;

 // Constructeur scene
 function Scene() {
     this.reset = false;
     this.inverted = false;
     this.pageLoadTime = pageLoadTime();
 }

 Scene.prototype.resize = function() {
     windowSize = {
         w: window.innerWidth,
         h: window.innerHeight
     };

     center = {
         x: Math.round(windowSize.w / 2),
         y: Math.round(windowSize.h / 2)
     };

     cv.width = windowSize.w;
     cv.height = windowSize.h;
     osCv.width = windowSize.w;
     osCv.height = windowSize.h;
     osLzCv.width = windowSize.w;
     osLzCv.height = windowSize.h;

     setStartPosition();
     createPerso();
     createLazer();
 };

 // Init scene
 Scene.prototype.init = function() {

     // Création et initialisation du canvas
     this.createOffScreenCanvas();

     // Récupération du conteneur principal
     $mainCont = document.getElementById('canvas-loader-container');
     // Récupération de la balise canvas
     cv = document.getElementById('canvas');
     // Déclaration du contexte : 2d
     ctx = cv.getContext('2d');

     // Définit la couleur de fond
     this.setBgColor(BG_COLOR);

     // Position du curseur de base
     mouse = {
         x: 0,
         y: 0
     };

     p_center = {
         x: P_WIDTH / 2,
         y: P_HEIGHT / 2
     };

     // On associe l'évenement onresize à resize
     //window.onresize = this.resize;

     resizeWithContext = this.resize.bind(this);
     window.addEventListener('resize', resizeWithContext);

     //window.addEventListener('resize', this.resize, true);
     // On associe le mouvement de la souris sur le canvas à onMouseMove
     canvas.onmousemove = onMouseMove;

    this.resize();
     draw();
 };

 // Création des canvas offscreen pour une meilleure perf
 Scene.prototype.createOffScreenCanvas = function() {
     // Canvas du contexte
     osCv = document.createElement('canvas');
     osCtx = osCv.getContext('2d');

     // Canvas du perso
     osPersoCv = document.createElement('canvas');
     osPersoCtx = osPersoCv.getContext('2d');
     osPersoCtx.scale(2, 2);

     // Canvas du lazer
     osLzCv = document.createElement('canvas');
     osLzCtx = osLzCv.getContext('2d');

     // On dessine le perso
     createPerso(this);
     createLazer();

     aPerso.draw();
     aLazer.draw();
 };

 Scene.prototype.setBgColor = function() {
     $mainCont.style.backgroundColor = BG_COLOR;
 };

 Scene.prototype.changeBgColor = function() {
     if ($mainCont.style.backgroundColor == BG_COLOR) {
         $mainCont.style.backgroundColor = PERSO_COLOR;
     } else {
         $mainCont.style.backgroundColor = BG_COLOR;
     }
 };

 Scene.prototype.resetScenetoNegatif = function() {
    var that = this;
     //console.log('reset');
     // Scene negative
     this.changeBgColor();
     aPerso.hide();
     //aPerso.changeColor();

     // Reset lazer
     aLazer.activated = false;
     aLazer.step = 0;

     // Reset and reveal Perso
     aPerso.reveil.count = 0;
     aPerso.oeil.mvt = aPerso.oeil.max;
     //setTimeout(aPerso.fadeInUp(), 10000);
     //setTimeout(function () { aPerso.fadeInUp() }, 800);

     this.reset = false;
     this.inverted = this.inverted ? false : true;

     
    if(window.removeEventListener) {
          window.removeEventListener('resize', resizeWithContext);
     }

     // Load home page
     loadHome();

 };

 Scene.prototype.render = function() {
     ctx.clearRect(0, 0, cv.width, cv.height);
     osCtx.clearRect(0, 0, osCv.width, osCv.height);
     osLzCtx.clearRect(0, 0, osLzCv.width, osLzCv.height);

     // Lazer Phase
     if (aLazer.activated && !this.reset) {
         aLazer.draw();
         aLazer.update();
         osCtx.drawImage(osLzCv, 0, 0, windowSize.w, windowSize.h, 0, 0, windowSize.w, windowSize.h);

     } else {
         aPerso.update();
         aPerso.draw();
     }

     // Negative and reset scene
     if (this.reset) {
         this.resetScenetoNegatif();
     }

     osCtx.drawImage(osPersoCv, 0, 0, aPerso.width, aPerso.height, aPerso.x - aPerso.width / 2, aPerso.y - aPerso.height / 2, aPerso.width, aPerso.height);
     ctx.drawImage(osCv, 0, 0, windowSize.w, windowSize.h, 0, 0, windowSize.w, windowSize.h);

 };

 function draw() {
     requestAnimationFrame(draw);
     scene.render();
 }

 function setStartPosition() {
     startX = center.x - p_center.x;
     startY = center.y - p_center.y;
 }

 function createPerso() {
     aPerso = new Perso(startX, startY);
     aPerso.color = scene.inverted ? BG_COLOR : PERSO_COLOR;
 }

 function createLazer() {
     aLazer = new Lazer();
 }

 function onMouseMove(e) {
     mouse.x = e.pageX;
     mouse.y = e.pageY;
 }


 // Constructeur Perso
 function Perso(x, y) {

     this.width = osPersoCv.width;
     this.height = osPersoCv.height;

     this.center = {
         x: this.width / 2,
         y: this.height / 2
     };

     this.oX = x + this.center.x;
     this.oY = y + this.center.y;

     // Position du
     this.x = x + this.center.x;
     this.y = y + this.center.y;

     this.offsetX = 0;
     this.offsetY = 0;

     this.color = PERSO_COLOR;
     this.changeColor = function() {
         this.color = (this.color == PERSO_COLOR) ? BG_COLOR : PERSO_COLOR;
     };

     this.alpha = 1;
     this.reveal = false;
     this.hide = function() {
         this.alpha = 0;
     };
     this.fadeInUp = function() {
         this.reveal = true;
         this.y += this.y / 4;
     };
     this.corps = {
         rotation: 0,
         rotate: 0,
         speed: 0.01,
         max_rotation: 0.115
     };
     this.oeil = {
         max: 15,
         min: -2,
         mvt: 0, // Incrémentation max : oeil fermé
         mvtCp: 0, // Incrémentation courbes de bezier de
         speed: 0.1
     };
     this.oeil.mvt = this.oeil.max;
     this.oeil.mvtCp = this.oeil.mvt + 1;
     this.oeil.loadSpeed = function() {
         var pageLoadTime = scene.pageLoadTime,
             minSpeed = 0.01, // 0.2 for dev, base value = 0.05
             maxSpeed = 0.09,
             loadSpeed = maxSpeed - pageLoadTime.map(400, 11000, minSpeed, maxSpeed);

         return 0.2;
     };
     this.oreille = {
         oX: 172.7,
         oY: 188.4,
         diry: 0,
         dirx: 0,
         dirRangex: 0,
         maxX: 5,
         minX: -2,
         maxY: 3,
         minY: -5
     };
     this.oreille.x = this.oreille.oX;
     this.oreille.y = this.oreille.oY;
     this.pieds = {
         maxX: 6,
         minX: -6,
         mvt: 0
     };
     this.reveil = {
         eveille: false,
         reveillage: false,
         count: 0,
         max: 500
     };

     // Charge du rayon
     this.chargeRayonActivated = true;

 };

 Perso.prototype.update = function() {


     // On récupère la distance entre le point et la position de la souris
     distX = this.x - mouse.x;
     distY = this.y - mouse.y;

     //On calcule l'hypotenuse qui est la distance entre le point et la position de la souris

     dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
     /*
      * Si la distance est inférieur à la valeur d'approche
      */
     if (dist <= APPROACH && this.reveil.count < this.reveil.max && this.alpha >= 1) {
         // Prevent flickering at approach limit
         var divisor = APPROACH / FORCE;
         // On récupère l'angle en radian
         // On calcule l'angle de la direction par rapport au point dist(x, y) avec le côté opposé et adjacent du triangle
         angle = Math.atan2(distY, distX);
         // On récupère les longueurs x et y et on les incrémentes pour entammer la procédure d'esquive de la souris
         dirX = (Math.cos(angle) * APPROACH - distX) / divisor;
         dirY = (Math.sin(angle) * APPROACH - distY) / divisor;

         this.x += dirX;
         this.y += dirY;

         if (dist < P_WIDTH && this.reveil.eveille === false) {
             this.reveil.count++;
             this.reveil.eveille = true;

         } else if (dist > P_WIDTH && this.reveil.eveille === true) {
             this.reveil.eveille = false;
         }

         if (dist < P_WIDTH && this.oeil.mvt > (this.oeil.max * 0.6) && this.reveil.count > 1)
             this.oeil.mvt -= 1 * this.oeil.speed;


         // Si la position x du this est supèrieure à sa position d'origine
         if (this.x < this.oX) {
             if (this.corps.rotate < this.corps.max_rotation)
                 this.corps.rotate += 1 * this.corps.speed;
             if (this.oreille.dirx <= 5)
                 this.oreille.dirx += 1;

             if (this.pieds.mvt < this.pieds.maxX)
                 this.pieds.mvt += 1;

         } else {
             if (this.corps.rotate > -this.corps.max_rotation)
                 this.corps.rotate -= 1 * this.corps.speed;
             if (this.oreille.dirx > -2)
                 this.oreille.dirx -= 1;

             if (this.pieds.mvt > this.pieds.minX)
                 this.pieds.mvt -= 1;

         }

         if (this.y < this.oY) {

             if (this.oreille.diry <= 3)
                 this.oreille.diry += 1;

         } else {

             if (this.oreille.diry > -5)
                 this.oreille.diry -= 1;

         }

     } else {

         this.corps.rotate *= .5;
         this.oreille.dirx *= .1;
         this.oreille.diry *= .1;
         this.pieds.mvt *= .1;
     }


     this.corps.rotation = this.corps.rotate;

     this.oreille.x = this.oreille.dirx;
     this.oreille.y = this.oreille.diry;

     /*
      * Retour au point de départ
      *
      * # On soustrait l'origine o(x, y) à la position actuelle (x, y)
      * On multiplie par 0.1 pour animer un retour progressif au point d'origine
      */
     this.x += (this.oX - this.x) * .1;
     this.y += (this.oY - this.y) * .1;

     // Annoying activation

     if (this.reveil.count >= this.reveil.max && Math.round(this.x) === this.oX && Math.round(this.y) === this.oY) {
         if (this.oeil.mvt > this.oeil.min) {
             this.oeil.mvt -= 4 * this.oeil.speed;
         } else {
             aLazer.activated = true;
             this.chargeRayonActivated = true;
         }
     };


     if (this.reveal && this.alpha <= 1) {
         this.alpha += 0.07;
     } else {
         this.reveal = false;
     };


     /* Loader
     -------------- */

     // Increment eye
     if (this.oeil.mvt > this.oeil.min + 3) {
         this.oeil.mvt -= this.oeil.loadSpeed();
         //this.reveillage = false;
     } else if (!this.reveillage) {
         this.reveillage = true;
         this.reveil.count = this.reveil.max;
         //aLazer.activated = true;
         //this.chargeRayonActivated = true;
     };


 };

 // Fonction de dessin du point sur le canvas
 Perso.prototype.draw = function() {
     // On défini la taille du point
     osPersoCv.width = P_WIDTH;
     osPersoCv.height = P_HEIGHT;

     // On dessine le point

     // Rotation à partir du centre
     // Move registration point to the center of the canvas
     osPersoCtx.translate(osPersoCv.width / 2, osPersoCv.width / 2);

     // Rotate 1 degree
     osPersoCtx.rotate((Math.PI / 180) + this.corps.rotation);

     // Move registration point back to the top left corner of canvas
     osPersoCtx.translate(-osPersoCv.width / 2, -osPersoCv.width / 2);

     osPersoCtx.save();
     osPersoCtx.translate(-153.3, -170.4);

     osPersoCtx.globalAlpha = this.alpha;

     osPersoCtx.strokeStyle = this.color;
     osPersoCtx.lineCap = 'butt';
     osPersoCtx.lineJoin = 'round';
     osPersoCtx.fillStyle = "rgba(0, 0, 0, 0)";
     osPersoCtx.strokeStyle = this.color;
     osPersoCtx.lineWidth = 2.5;
     osPersoCtx.miterLimit = 10;
     osPersoCtx.save();
     osPersoCtx.save();

     // Oreille gauche
     osPersoCtx.save();
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(204.5, 190.2);
     osPersoCtx.bezierCurveTo(190.6, 197.39, 181.9, 206.1, 179.6, 208.39);
     osPersoCtx.lineTo(172.7 + this.oreille.x, 188.4 + this.oreille.y); // x + 5 ou -5 // y + 5 ou -5
     osPersoCtx.lineTo(204.5, 190.2);
     osPersoCtx.closePath();
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();

     // Oreille droite
     osPersoCtx.save();
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(293.9, 190.6);
     osPersoCtx.bezierCurveTo(307.9, 197.79, 316.5, 206.4, 318.9, 208.79);
     osPersoCtx.lineTo(325.7 + this.oreille.x, 188.7 + this.oreille.y);
     osPersoCtx.lineTo(293.9, 190.6);
     osPersoCtx.closePath();
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();

     // Forme Visage
     osPersoCtx.save();
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(249.6, 179.2);
     osPersoCtx.bezierCurveTo(231.29, 179.1, 216.1, 184.2, 204.5, 190.2);
     osPersoCtx.bezierCurveTo(190.6, 197.39, 181.9, 206.1, 179.6, 208.39);
     osPersoCtx.bezierCurveTo(189.7, 238.29, 217.8, 258.5, 249.39, 258.5);
     osPersoCtx.bezierCurveTo(280.7, 258.5, 308.7, 238.5, 319, 208.8);
     osPersoCtx.bezierCurveTo(314.5, 204.3, 289.6, 179.4, 249.6, 179.2);
     osPersoCtx.closePath();
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();

     // Bouche
     osPersoCtx.save();
     osPersoCtx.lineWidth = 2;
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(252.1, 248.9);
     osPersoCtx.lineTo(247.1, 248.9);
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();

     // Nez
     osPersoCtx.save();
     osPersoCtx.fillStyle = this.color;
     osPersoCtx.strokeStyle = "rgba(0, 0, 0, 0)";
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(252.3, 245.7);
     osPersoCtx.lineTo(246.6, 245.7);
     osPersoCtx.lineTo(248.0, 242.1);
     osPersoCtx.bezierCurveTo(248.4, 241.2, 248.80, 239.79, 249.30, 238.9);
     osPersoCtx.bezierCurveTo(249.80, 239.8, 250.30, 241.3, 250.80, 242.3);
     osPersoCtx.lineTo(252.3, 245.7);
     osPersoCtx.closePath();
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();

     // Oeil droit
     osPersoCtx.save();
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(262, 237.6);
     osPersoCtx.bezierCurveTo(271.1, 240.5, 280.9, 235.4, 283.7, 226.2);
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();

     // Oeil Gauche
     osPersoCtx.save();
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(236.3, 237.6);
     osPersoCtx.bezierCurveTo(227.1, 240.4, 217.4, 235.2, 214.6, 226.1);
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();

     // 3ème oeil
     this.oeil.mvtCp = this.oeil.mvt + 1; // Persos de controles ont + 1

     osPersoCtx.save();
     osPersoCtx.fillStyle = this.color;
     osPersoCtx.strokeStyle = this.color;
     osPersoCtx.miterLimit = 10;
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(278.6, 206.5); // Perso 0

     osPersoCtx.bezierCurveTo(277.5, 208.1, 267.3, 221.8 - this.oeil.mvtCp, 249.5, 221.9 - this.oeil.mvt);
     osPersoCtx.bezierCurveTo(231.4, 222 - this.oeil.mvtCp, 220.9, 207.8, 219.9, 206.3);
     osPersoCtx.bezierCurveTo(221, 204.8, 231.4, 190.7 + this.oeil.mvtCp, 249.5, 190.9 + this.oeil.mvt);
     osPersoCtx.bezierCurveTo(267.4, 191.1 + this.oeil.mvtCp, 277.5, 205, 278.6, 206.5);
     osPersoCtx.closePath();
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();

     // 3ème oeil rayon
     if (aLazer.activated && this.chargeRayonActivated) {
         osPersoCtx.save();
         osPersoCtx.beginPath();
         osPersoCtx.moveTo(250, 205);
         osPersoCtx.arc(250, 205, 34, 0, Math.PI * 2);
         osPersoCtx.moveTo(250, 205);
         osPersoCtx.lineTo(0, 0);

         osPersoCtx.lineTo(250, 205);
         osPersoCtx.lineTo(250, 30);
         osPersoCtx.lineTo(250, 205);
         osPersoCtx.lineTo(220, 500);
         osPersoCtx.lineTo(250, 205);
         osPersoCtx.lineTo(500, 300);
         osPersoCtx.lineTo(250, 205);
         osPersoCtx.lineTo(300, 200);
         osPersoCtx.lineTo(250, 205);
         osPersoCtx.lineTo(210, 220);
         osPersoCtx.fill();
         osPersoCtx.stroke();
         osPersoCtx.closePath();
         osPersoCtx.restore();
         this.chargeRayonActivated = false;
     };

     // Corps
     osPersoCtx.save();
     osPersoCtx.lineJoin = "round";
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(285.6, 248.9);
     osPersoCtx.lineTo(297.2, 322.7);
     osPersoCtx.bezierCurveTo(297.2, 322.7, 285.1, 320.0, 249.5, 320.0);
     osPersoCtx.bezierCurveTo(213.9, 320.0, 204.4, 322.4, 204.4, 322.4);
     osPersoCtx.lineTo(212.8, 249.0);
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();
     osPersoCtx.save();
     osPersoCtx.save();

     // Main gauche
     osPersoCtx.save();
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(234.5, 273.4);
     osPersoCtx.lineTo(243.5, 279.5);
     osPersoCtx.bezierCurveTo(247.1, 277.2, 249.7, 279.4, 249.7, 279.4);
     osPersoCtx.lineTo(249.7, 291);
     osPersoCtx.bezierCurveTo(244.6, 291, 234.5, 291, 234.5, 291);
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();
     osPersoCtx.restore();
     osPersoCtx.save();

     // Main droite
     osPersoCtx.save();
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(265, 273.4);
     osPersoCtx.lineTo(256, 279.5);
     osPersoCtx.bezierCurveTo(252.4, 277.2, 249.8, 279.4, 249.8, 279.4);
     osPersoCtx.bezierCurveTo(249.8, 279.4, 249.7, 290.8, 249.8, 290.8);
     osPersoCtx.bezierCurveTo(254.9, 290.8, 265, 290.8, 265, 290.8);
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();
     osPersoCtx.restore();
     osPersoCtx.restore();
     osPersoCtx.save();
     osPersoCtx.save();

     // Pied gauche
     osPersoCtx.save();
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(210.4, 321.3);
     osPersoCtx.bezierCurveTo(210.4, 321.3, 209.5 + this.pieds.mvt, 333.7, 216.6 + this.pieds.mvt, 334.1);
     osPersoCtx.bezierCurveTo(223.7 + this.pieds.mvt, 334.5, 224, 320.5, 224, 320.5);
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();
     osPersoCtx.restore();
     osPersoCtx.save();
     // Pied droit
     osPersoCtx.save();
     osPersoCtx.beginPath();
     osPersoCtx.moveTo(288.5, 321.3);
     osPersoCtx.bezierCurveTo(288.5, 321.3, 289.3 + this.pieds.mvt, 333.7, 282.3 + this.pieds.mvt, 334.1);
     osPersoCtx.bezierCurveTo(275.3 + this.pieds.mvt, 334.5, 274.9, 320.5, 274.9, 320.5);
     osPersoCtx.fill();
     osPersoCtx.stroke();
     osPersoCtx.restore();
     osPersoCtx.restore();
     osPersoCtx.restore();
     osPersoCtx.restore();
     osPersoCtx.restore();
     osPersoCtx.restore();

 };

 // Constructeur lazer
 function Lazer() {
     this.step = 0;
     this.activated = false;
     this.update = function() {
         //this.step += 0.1;
         this.step++;
     }
 };

 Lazer.prototype.draw = function() {


     osLzCtx.save();
     osLzCtx.translate(osLzCv.width / 2, osLzCv.height / 2 - 50);

     // Step 1
     if (this.step <= 3) {
         //console.log('step 1');
         osPersoCtx.save();
         osLzCtx.strokeStyle = aPerso.color;
         osLzCtx.lineCap = 'butt';
         osLzCtx.lineJoin = 'miter';
         osLzCtx.miterLimit = 4;
         osLzCtx.setLineDash([30, 15, 200, 30, 10, 5, 200]);

         osLzCtx.beginPath();
         osLzCtx.moveTo(0, 0);
         osLzCtx.lineTo(0, osLzCv.height);
         osLzCtx.stroke();
         osLzCtx.restore();
         osLzCtx.restore();
     } else if (this.step <= 6) {
         //console.log('step 2');
         osLzCtx.save();
         osLzCtx.translate(0, 0);
         osLzCtx.fillStyle = aPerso.color;
         osLzCtx.lineCap = 'butt';
         osLzCtx.lineJoin = 'miter';
         osLzCtx.miterLimit = 4;
         osLzCtx.translate(-52, 0);
         osLzCtx.beginPath();
         osLzCtx.moveTo(0, 0);
         osLzCtx.lineTo(104.7, 0);
         osLzCtx.lineTo(104.7, 519.6);
         osLzCtx.lineTo(0, 519.6);
         osLzCtx.closePath();
         osLzCtx.clip();
         osLzCtx.translate(0, 0);
         osLzCtx.translate(0, 0);
         osLzCtx.scale(1, 1);

         osLzCtx.beginPath();
         osLzCtx.moveTo(51.4, 0.6);
         osLzCtx.bezierCurveTo(46.196, 19.20, 42.09, 38.1, 36.7, 56.7);
         osLzCtx.bezierCurveTo(31.20, 75.5, 22.6, 92.9, 15.500, 111.1);
         osLzCtx.bezierCurveTo(12.000, 120.19, 8.800, 129.5, 6.006, 138.79);
         osLzCtx.bezierCurveTo(3.606, 146.7, 0.2073, 155.39, 3.552713678800501e-15, 163.79);
         osLzCtx.bezierCurveTo(-0.09645, 170.79, 2.006, 175.2, 8.60, 177.79);
         osLzCtx.bezierCurveTo(18.000, 181.4, 27.70, 184.6, 37.300, 187.79);
         osLzCtx.bezierCurveTo(59.300, 195.29, 81.5, 202.39, 103.7, 209.1);
         osLzCtx.bezierCurveTo(103.50, 206.29, 103.2, 203.6, 103.00, 200.79);
         osLzCtx.bezierCurveTo(90.9, 246.0, 70.30, 288.7, 42.2, 326.2);
         osLzCtx.bezierCurveTo(38.8, 330.7, 35.3, 335.2, 31.707, 339.5);
         osLzCtx.bezierCurveTo(28.406, 343.5, 24.008, 347.4, 21.906, 352.2);
         osLzCtx.bezierCurveTo(18.406, 360.4, 21.606, 368.0, 27.707, 373.63);
         osLzCtx.bezierCurveTo(36.106, 381.2, 38.7, 390.8, 38.8, 401.9);
         osLzCtx.bezierCurveTo(38.9, 413.8, 38.106, 425.63, 38.7, 437.5);
         osLzCtx.bezierCurveTo(40.106, 465.5, 45.106, 493.2, 50.4, 520.8);
         osLzCtx.bezierCurveTo(51.5, 526.3, 52.3, 518.0, 52.0, 516.1);
         osLzCtx.bezierCurveTo(47.3, 491.8, 42.9, 467.4, 41.1, 442.7);
         osLzCtx.bezierCurveTo(40.24, 430.9, 40.6, 419.4, 40.86, 407.5);
         osLzCtx.bezierCurveTo(41.0, 398.5, 40.86, 389.2, 38.1, 380.7);
         osLzCtx.bezierCurveTo(37.0, 377, 35.36, 373.4, 33.0, 370.2);
         osLzCtx.bezierCurveTo(31.13, 367.5, 23.4, 362.7, 23.4, 359.5);
         osLzCtx.bezierCurveTo(23.4, 358.0, 26.1, 355.7, 27.1, 354.5);
         osLzCtx.bezierCurveTo(28.9, 352.4, 30.8, 350.2, 32.6, 348.0);
         osLzCtx.bezierCurveTo(36.24, 343.7, 39.74, 339.2, 43.1, 334.7);
         osLzCtx.bezierCurveTo(56.5, 316.9, 68.3, 297.7, 78.2, 277.7);
         osLzCtx.bezierCurveTo(89.2, 255.5, 98.00, 232.2, 104.4, 208.3);
         osLzCtx.bezierCurveTo(104.8, 206.9, 105.6, 200.66, 103.7, 200.0);
         osLzCtx.bezierCurveTo(86.1, 194.73, 68.50, 189.13, 51.106, 183.3);
         osLzCtx.bezierCurveTo(42.2, 180.3, 33.30, 177.3, 24.504, 174.3);
         osLzCtx.bezierCurveTo(20.204, 172.8, 16.004, 171.3, 11.704, 169.8);
         osLzCtx.bezierCurveTo(9.303, 168.9, 3.303, 167.5, 2.303, 164.9);
         osLzCtx.bezierCurveTo(1.8031, 163.5, 3.703, 159.4, 4.103, 157.9);
         osLzCtx.bezierCurveTo(4.703, 155.8, 5.2035, 153.8, 5.803, 151.7);
         osLzCtx.bezierCurveTo(7.103, 147.3, 8.403, 142.9, 9.803, 138.5);
         osLzCtx.bezierCurveTo(12.504, 130.16, 15.504, 121.7, 18.903, 113.5);
         osLzCtx.bezierCurveTo(25.3, 97.5, 32.6, 82, 37.6, 65.2);
         osLzCtx.bezierCurveTo(43.2, 46.40, 47.3, 27.20, 52.6, 8.300);
         osLzCtx.bezierCurveTo(53.1, 6.400, 53.2, 4.100, 52.800, 2.2006);
         osLzCtx.bezierCurveTo(52.7, 1.7, 51.9, -1.2, 51.4, 0.6);
         osLzCtx.lineTo(51.4, 0.6);
         osLzCtx.closePath();
         osLzCtx.fill();
         osLzCtx.stroke();
         osLzCtx.restore();
         osLzCtx.restore();
         osLzCtx.restore();
     } else if (this.step <= 10) {
         osLzCtx.translate(-110, 0);
         osLzCtx.save();
         osLzCtx.fillStyle = aPerso.color;
         osLzCtx.beginPath();
         osLzCtx.moveTo(110.9, 0);
         if (this.step <= 7) {
             //console.log('step 3');
             osLzCtx.lineTo(50, osLzCv.height / 2 + 50);
             osLzCtx.lineTo(166, osLzCv.height / 2 + 50);
         } else if (this.step <= 8) {
             //console.log('step 4');
             osLzCtx.lineTo(0 - osLzCv.width / 10, osLzCv.height / 2 + 50);
             osLzCtx.lineTo(216 + osLzCv.width / 10, osLzCv.height / 2 + 50);
         } else if (this.step <= 9) {
             //console.log('step 5');
             osLzCtx.lineTo(0 - osLzCv.width / 6, osLzCv.height / 2 + 50);
             osLzCtx.lineTo(216 + osLzCv.width / 6, osLzCv.height / 2 + 50);
         } else {
             //console.log('step 6');
             osLzCtx.lineTo(0 - osLzCv.width / 2 + 110.9, osLzCv.height / 2 + 50);
             osLzCtx.lineTo(216 + osLzCv.width / 2 - 110.9, osLzCv.height / 2 + 50);
         }
         osLzCtx.lineTo(110.9, 0);
         osLzCtx.closePath();
         osLzCtx.fill();
         osLzCtx.restore();
         osLzCtx.restore();
         osLzCtx.restore();
     } else if (this.step <= 11) {
         //console.log('step 7');

         osLzCtx.save();
         osLzCtx.translate(0, 0);

         osLzCtx.fillStyle = aPerso.color;
         osLzCtx.beginPath();
         osLzCtx.moveTo(0, 0);
         osLzCtx.lineTo(osLzCv.width / 2, 100);
         osLzCtx.lineTo(osLzCv.width / 2, osLzCv.height / 2 + 100);
         osLzCtx.lineTo(-osLzCv.width / 2, osLzCv.height / 2 + 100);
         osLzCtx.lineTo(-osLzCv.width / 2, 100);
         osLzCtx.closePath();
         osLzCtx.fill();
         osLzCtx.restore();
         osLzCtx.restore();
         osLzCtx.restore();
     } else if (this.step <= 12) {
         osLzCtx.save();
         osLzCtx.translate(-osLzCv.width / 2, -osLzCv.height / 2);
         osLzCtx.fillStyle = aPerso.color;
         osLzCtx.fillRect(0, 0, osLzCv.width, osLzCv.height);
         osLzCtx.fill();
         osLzCtx.restore();
         osLzCtx.restore();
         osLzCtx.restore();

     } else {

         scene.reset = true;

     }
 };


 /* TOOLS
 ------------------------------------------*/

 /* For Debuging shape in canvas */
 function showPerso(x, y, ctx) {
     ctx.save();
     ctx.fillStyle = "yellow";
     ctx.beginPath();
     ctx.arc(x, y, 1, 0, Math.PI * 2);
     ctx.fill();
     ctx.stroke();
     ctx.restore();
 };

 function ready(fn) {
     if (document.readyState != 'loading') {
         fn();
     } else {
         document.addEventListener('DOMContentLoaded', fn);
     }
 };

 function pageLoadTime() {
     var now = new Date().getTime();
     var page_load_time = now - performance.timing.navigationStart;
     //console.log("User-perceived page loading time: " + page_load_time);
     return page_load_time;
 };

 // map a range of numbers to another range of numbers
 Number.prototype.map = function(in_min, in_max, out_min, out_max) {
     return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
 };

/* INIT SCENE
------------------------------------------*/

 // Init new scene
 var scene = new Scene();
 ready(scene.init.bind(scene));