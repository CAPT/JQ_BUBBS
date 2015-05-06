/*function Vector(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
 
	this.addX = function(x) {
		this.x += x;
	};
		
	this.addY = function(y) {
		this.y += y;
	};
		
	this.addZ = function(z) {
		this.z += z;
	};
 
	this.set = function(x, y, z) {
		this.x = x; 
		this.y = y;
		this.z = z;
	};
}

function PointCollection() {
    this.mousePos = new Vector(0, 0);
    this.pointCollectionX = 0;
    this.pointCollectionY = 0;
    this.points = []

    this.newPoint = function (x, y, z) {
        var point = new Point(x, y, z);
        this.points.push(point);
        return point;
    };

    this.update = function () {
        for(var i=0; i<this.points.length; i++) {
            var point = this.points[i];

            if (point === null) {
                continue;
            }

            var dx = this.mousePos.x - point.curPos.x;
            var dy = this.mousePos.y - point.curPos.y;
            var dd = (dx * dx) + (dy * dy);
            var d = Math.sqrt(dd);

            if (d < 150) {
                point.targetPos.x = (this.mousePos.x < point.curPos.x) ? point.curPos.x - dx : point.curPos.x - dx;
                point.targetPos.y = (this.mousePos.y < point.curPos.y) ? point.curPos.y - dy : point.curPos.y - dy;
            }
            else {
                point.targetPos.x = point.originalPos.x;
                point.targetPos.y = point.originalPos.y;
            }

            point.update();
        }
    }
    
    this.shake = function() {
        var randomNum = Math.floor(Math.random() * 5) - 2;
        
        for(var i=0; i<this.points.length; i++) {
            var point = this.points[i];
            
            if(point === null) {
                continue;
            }
            
            var dx = this.mousePos.x - point.curPos.x;
            var dy = this.mousePos.y - point.curPos.y;
            var dd = (dx * dx) + (dy * dy);
            var d = Math.sqrt(dd);
            if(d < 50) {
                //point.curPos.x = point.originalPos.x + randomNum;
                //point.curPos.y = point.originalPos.y + randomNum;
                this.pointCollectionX = Math.floor(Math.random() * 5) - 2;
                this.pointCollectionY = Math.floor(Math.random() * 5) - 2;
            }
            point.draw(bubbleShape, this.pointCollectionX, this.pointCollectionY);
        }
    }

    this.draw = function (bubbleShape) {
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];

            if (point === null)
                continue;

            point.draw(bubbleShape, this.pointCollectionX, this.pointCollectionY);
            //point.draw(bubbleShape);
        }
    }
}

function Point(x, y, z, size, color) {
    this.curPos = new Vector(x, y, z);
    this.color = color;
    
    this.friction = document.Friction;
    this.rotationForce = document.rotationForce;
    this.springStrength = 0.1;

    this.originalPos = new Vector(x, y, z);
    this.radius = size;
    this.size = size;
    this.targetPos = new Vector(x, y, z);
    this.velocity = new Vector(0.0, 0.0, 0.0);

    this.update = function () {
        var dx = this.targetPos.x - this.curPos.x;
        var dy = this.targetPos.y - this.curPos.y;
        // Orthogonal vector is [-dy,dx]
        var ax = dx * this.springStrength - this.rotationForce * dy;
        var ay = dy * this.springStrength + this.rotationForce * dx;

        this.velocity.x += ax;
        this.velocity.x *= this.friction;
        this.curPos.x += this.velocity.x;

        this.velocity.y += ay;
        this.velocity.y *= this.friction;
        this.curPos.y += this.velocity.y;

        var dox = this.originalPos.x - this.curPos.x;
        var doy = this.originalPos.y - this.curPos.y;
        var dd = (dox * dox) + (doy * doy);
        var d = Math.sqrt(dd);

        this.targetPos.z = d / 100 + 1;
        var dz = this.targetPos.z - this.curPos.z;
        var az = dz * this.springStrength;
        this.velocity.z += az;
        this.velocity.z *= this.friction;
        this.curPos.z += this.velocity.z;

        this.radius = this.size * this.curPos.z;
        if (this.radius < 1) this.radius = 1;
    }

    this.draw = function(bubbleShape, dx, dy) {
        ctx.fillStyle = this.color;
        if(bubbleShape == "square") {
            ctx.beginPath();
            ctx.fillRect(this.curPos.x+dx, this.curPos.y+dy, this.radius*1.5, this.radius*1.5);
        }
        else {
            ctx.beginPath();
            ctx.arc(this.curPos.x+dx, this.curPos.y+dy, this.radius, 0, Math.PI * 2, true);
            ctx.fill();
        }
    }
}

var canvas = $("#Canv");
var canvasHeight = 500;
var canvasWidth = 1000;
var screenWidth = canvasWidth;
var ctx;
var dt = 0.1;

var pointCollection;

document.rotationForce = 0.0;
document.Friction = 0.85;

/* 
// RGB
var white = [255, 255, 255];
var black = [68, 68, 68];
var red = [255, 68, 68];
var orange = [255, 187, 51];
var green = [153, 204, 0];
var blue = [51, 181, 229];
var purple = [170, 102, 204];
*/

// HSL
var white = [0, 0, 100];
var black = [0, 0, 27];
var red = [0, 100, 63];
var orange = [40, 100, 60];
var green = [75, 100, 40];
var blue = [196, 77, 55];
var purple = [280, 50, 60];

var offset = 0;

var mouseX = 0;

function makeColor(hslList, fade) {
    var hue = hslList[0] /*- 17.0 * fade / 1000.0*/;
	var sat = hslList[1] /*+ 81.0 * fade / 1000.0*/;
	var lgt = hslList[2] /*+ 58.0 * fade / 1000.0*/;
	return "hsl("+hue+","+sat+"%,"+lgt+"%)";
}

function phraseToHex(phrase) {
	var hexphrase = "";
	for(var i=0; i<phrase.length; i++) {
        hexphrase += phrase.charCodeAt(i).toString(16);
	}
	return hexphrase;
}

function initEventListeners() {
	$(window).bind('resize', updateCanvasDimensions).bind('mousemove', onMove);

	canvas.ontouchmove = function(e) {	
        e.preventDefault();
		onTouchMove(e);
	}

	canvas.ontouchstart = function(e) {
		e.preventDefault();
	}
}

function updateCanvasDimensions() {
	canvas.attr({height: 500, width: 1000});
	canvasWidth = canvas.width();
	canvasHeight = canvas.height();

	draw();
}
	
function onMove(e) {
	if (pointCollection) {
		pointCollection.mousePos.set(e.pageX, e.pageY);
	}
}
	
function onTouchMove(e) {
	if (pointCollection) {
		pointCollection.mousePos.set(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
	}
}
	
function bounceName() {
    shake();
    //update();
    
    setTimeout(function() { bounceName() }, 30);
}

function stopName() {
    // pass
}

function bounceBubbles() {
	draw();
	update();
		
	setTimeout(function() { bounceBubbles() }, 30);
}

function stopBubbles() {
    // pass
}

function draw() {
	var tmpCanvas = canvas.get(0);

	if (tmpCanvas.getContext === null) {
		return; 
	}
		
	ctx = tmpCanvas.getContext('2d');
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	
    bubbleShape = typeof bubbleShape !== 'undefined' ? bubbleShape : "circle";
    
	if (pointCollection) {
		pointCollection.draw(bubbleShape);
    }
}

function shake() {
    var tmpCanvas = canvas.get(0);

	if (tmpCanvas.getContext === null) {
		return; 
	}
		
	ctx = tmpCanvas.getContext('2d');
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	
    bubbleShape = typeof bubbleShape !== 'undefined' ? bubbleShape : "circle";
    
	if (pointCollection) {
		pointCollection.shake(bubbleShape);
    }
}
	
function update() {		
	if (pointCollection)
		pointCollection.update();
}

$("#Canv").keypress(function(event) {
    console.log(e);
});

function drawName(name, letterColors) {
    updateCanvasDimensions();
    
    var g = []
    var offset = 0;
    
    function addLetter(cc_hex, ix, letterCols) {
        if(typeof letterCols !== 'undefined') {
            if(Object.prototype.toString.call(letterCols) === '[object Array]' && letterCols.length == 3) {
                letterColors = [letterCols];
            }
            if(Object.prototype.toString.call(letterCols) === '[object Array]' && letterCols.length > 3) {
                letterColors = letterCols;
            }
        }
        else {
            letterColors = [black];
        }
        
        if (document.alphabet.hasOwnProperty(cc_hex)) {
			var chr_data = document.alphabet[cc_hex].P;
			var bc = letterColors[ix % letterColors.length];
			
			for (var i=0; i<chr_data.length; ++i) {
				point = chr_data[i];
				
				g.push(new Point(point[0]+offset,
				point[1],
				0.0,
				point[2],
				makeColor(bc,point[3])));
			}
			offset += document.alphabet[cc_hex].W;
		}
	}
	
    var hexphrase = phraseToHex(name);
    
    var col_ix = -1;
    for(var i=0; i<hexphrase.length; i+=2) {
        var cc_hex = "A" + hexphrase.charAt(i) + hexphrase.charAt(i+1);
        if(cc_hex != "A20") {
            col_ix++;
        }
        addLetter(cc_hex, col_ix, letterColors);
    }
    
    for (var j=0; j<g.length; j++) {
        g[j].curPos.x = (canvasWidth/2 - offset/2) + g[j].curPos.x;
		g[j].curPos.y = (canvasHeight/2 - 180) + g[j].curPos.y;
		g[j].originalPos.x = (canvasWidth/2 - offset/2) + g[j].originalPos.x;
		g[j].originalPos.y = (canvasHeight/2 - 180) + g[j].originalPos.y;
    }
    
    pointCollection = new PointCollection();
    pointCollection.points = g;
    initEventListeners();
    //timeout();
}
*/
function Vector(e,n,t){this.x=e,this.y=n,this.z=t,this.addX=function(e){this.x+=e},this.addY=function(e){this.y+=e},this.addZ=function(e){this.z+=e},this.set=function(e,n,t){this.x=e,this.y=n,this.z=t}}function PointCollection(){this.mousePos=new Vector(0,0),this.pointCollectionX=0,this.pointCollectionY=0,this.points=[],this.newPoint=function(e,n,t){var r=new Point(e,n,t);return this.points.push(r),r},this.update=function(){for(var e=0;e<this.points.length;e++){var n=this.points[e];if(null!==n){var t=this.mousePos.x-n.curPos.x,r=this.mousePos.y-n.curPos.y,i=t*t+r*r,o=Math.sqrt(i);150>o?(n.targetPos.x=this.mousePos.x<n.curPos.x?n.curPos.x-t:n.curPos.x-t,n.targetPos.y=this.mousePos.y<n.curPos.y?n.curPos.y-r:n.curPos.y-r):(n.targetPos.x=n.originalPos.x,n.targetPos.y=n.originalPos.y),n.update()}}},this.shake=function(){for(var e=(Math.floor(5*Math.random())-2,0);e<this.points.length;e++){var n=this.points[e];if(null!==n){var t=this.mousePos.x-n.curPos.x,r=this.mousePos.y-n.curPos.y,i=t*t+r*r,o=Math.sqrt(i);50>o&&(this.pointCollectionX=Math.floor(5*Math.random())-2,this.pointCollectionY=Math.floor(5*Math.random())-2),n.draw(bubbleShape,this.pointCollectionX,this.pointCollectionY)}}},this.draw=function(e){for(var n=0;n<this.points.length;n++){var t=this.points[n];null!==t&&t.draw(e,this.pointCollectionX,this.pointCollectionY)}}}function Point(e,n,t,r,i){this.curPos=new Vector(e,n,t),this.color=i,this.friction=document.Friction,this.rotationForce=document.rotationForce,this.springStrength=.1,this.originalPos=new Vector(e,n,t),this.radius=r,this.size=r,this.targetPos=new Vector(e,n,t),this.velocity=new Vector(0,0,0),this.update=function(){var e=this.targetPos.x-this.curPos.x,n=this.targetPos.y-this.curPos.y,t=e*this.springStrength-this.rotationForce*n,r=n*this.springStrength+this.rotationForce*e;this.velocity.x+=t,this.velocity.x*=this.friction,this.curPos.x+=this.velocity.x,this.velocity.y+=r,this.velocity.y*=this.friction,this.curPos.y+=this.velocity.y;var i=this.originalPos.x-this.curPos.x,o=this.originalPos.y-this.curPos.y,a=i*i+o*o,u=Math.sqrt(a);this.targetPos.z=u/100+1;var s=this.targetPos.z-this.curPos.z,c=s*this.springStrength;this.velocity.z+=c,this.velocity.z*=this.friction,this.curPos.z+=this.velocity.z,this.radius=this.size*this.curPos.z,this.radius<1&&(this.radius=1)},this.draw=function(e,n,t){ctx.fillStyle=this.color,"square"==e?(ctx.beginPath(),ctx.fillRect(this.curPos.x+n,this.curPos.y+t,1.5*this.radius,1.5*this.radius)):(ctx.beginPath(),ctx.arc(this.curPos.x+n,this.curPos.y+t,this.radius,0,2*Math.PI,!0),ctx.fill())}}function makeColor(e){var n=e[0],t=e[1],r=e[2];return"hsl("+n+","+t+"%,"+r+"%)"}function phraseToHex(e){for(var n="",t=0;t<e.length;t++)n+=e.charCodeAt(t).toString(16);return n}function initEventListeners(){$(window).bind("resize",updateCanvasDimensions).bind("mousemove",onMove),canvas.ontouchmove=function(e){e.preventDefault(),onTouchMove(e)},canvas.ontouchstart=function(e){e.preventDefault()}}function updateCanvasDimensions(){canvas.attr({height:500,width:1e3}),canvasWidth=canvas.width(),canvasHeight=canvas.height(),draw()}function onMove(e){pointCollection&&pointCollection.mousePos.set(e.pageX,e.pageY)}function onTouchMove(e){pointCollection&&pointCollection.mousePos.set(e.targetTouches[0].pageX,e.targetTouches[0].pageY)}function bounceName(){shake(),setTimeout(function(){bounceName()},30)}function stopName(){}function bounceBubbles(){draw(),update(),setTimeout(function(){bounceBubbles()},30)}function stopBubbles(){}function draw(){var e=canvas.get(0);null!==e.getContext&&(ctx=e.getContext("2d"),ctx.clearRect(0,0,canvasWidth,canvasHeight),bubbleShape="undefined"!=typeof bubbleShape?bubbleShape:"circle",pointCollection&&pointCollection.draw(bubbleShape))}function shake(){var e=canvas.get(0);null!==e.getContext&&(ctx=e.getContext("2d"),ctx.clearRect(0,0,canvasWidth,canvasHeight),bubbleShape="undefined"!=typeof bubbleShape?bubbleShape:"circle",pointCollection&&pointCollection.shake(bubbleShape))}function update(){pointCollection&&pointCollection.update()}function drawName(e,n){function t(e,t,o){if(void 0!==o?("[object Array]"===Object.prototype.toString.call(o)&&3==o.length&&(n=[o]),"[object Array]"===Object.prototype.toString.call(o)&&o.length>3&&(n=o)):n=[black],document.alphabet.hasOwnProperty(e)){for(var a=document.alphabet[e].P,u=n[t%n.length],s=0;s<a.length;++s)point=a[s],r.push(new Point(point[0]+i,point[1],0,point[2],makeColor(u,point[3])));i+=document.alphabet[e].W}}updateCanvasDimensions();for(var r=[],i=0,o=phraseToHex(e),a=-1,u=0;u<o.length;u+=2){var s="A"+o.charAt(u)+o.charAt(u+1);"A20"!=s&&a++,t(s,a,n)}for(var c=0;c<r.length;c++)r[c].curPos.x=canvasWidth/2-i/2+r[c].curPos.x,r[c].curPos.y=canvasHeight/2-180+r[c].curPos.y,r[c].originalPos.x=canvasWidth/2-i/2+r[c].originalPos.x,r[c].originalPos.y=canvasHeight/2-180+r[c].originalPos.y;pointCollection=new PointCollection,pointCollection.points=r,initEventListeners()}var canvas=$("#Canv"),canvasHeight=500,canvasWidth=1e3,screenWidth=canvasWidth,ctx,dt=.1,pointCollection;document.rotationForce=0,document.Friction=.85;var white=[0,0,100],black=[0,0,27],red=[0,100,63],orange=[40,100,60],green=[75,100,40],blue=[196,77,55],purple=[280,50,60],offset=0,mouseX=0;$("#Canv").keypress(function(){console.log(e)});
