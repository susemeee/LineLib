/*
 *	LineLib v1.0 #20130628
 *	(c) susemine. 
 *	susemeee@gmail.com, http://github.com/susemine
 *
 */
(function() {

this.setCanvas = function(canvas){
	c = canvas;
}
//canvas
var c;
//degree -> radian
var D2R = Math.PI / 180;
//radian -> degree
var R2D = 180 / Math.PI;
//rectangles that is reflective to lines
var crects = [];
this.crects = function() {return crects;}

var distance = function(x1,y1,x2,y2){
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}
//canvas y coord starts from top, but a y of a normal mathematical coord starts from bottom.
var convertY = function(y){
	return c.height - y;
}
//used for tracing algorithm
var convertX = function(x){
	return x >= 0 ? c.width - x : -1;
}


var Line = function(theta, posx, posy, len, color, prevt, dt)
{
	//"y = 2x + 5"
	if(typeof(theta) == "string")
	{
		//later
	}
	else
	{
		//every line should have different scan path
		if(dt == undefined)
			this.dt = 1;
		else
			this.dt = dt;		
		
		this.theta = theta;
		this.posx = posx;
		this.posy = posy;
		if(len != null)
			this.len = len;
		else
			this.len = distance(0,0,c.width, c.height);
		this.prevt = prevt;
		this.color = color;
	}
}

Line.prototype.getReflectiveLine = function(mdt){
	
	var topx = this.ytox(c.height); 
	var botx = this.ytox(0); 
	var lefy = this.xtoy(0); 
	var rigy = this.xtoy(c.width);
	var result;

	if(mdt == 1 || mdt == -1)
		this.dt = mdt;

	//tracing algorithm
	console.log("getting");
	var t = this.posx;
	if(this.prevt == "right" || this.prevt == "left")
		this.dt = -(this.dt);	
	//else if(t)
	do
	{
		t += this.dt;
		//console.log("t:"+t+",xtoy(t):"+this.xtoy(t)+", prevt:"+this.prevt+", dt:"+this.dt);

		if(this.prevt != "top" && this.xtoy(t) >= c.height)
		{
			result = topx; 
			console.log("top"); 
			break;
		}
		else if(this.prevt != "bottom" && this.xtoy(t) < 0)
		{
			result = botx; 
			console.log("bottom"); 
			break;
		}
		else if(this.prevt != "left" && t <= 0)
		{
			result = lefy;
			console.log("left"); 
			break;
		}
		for(var i in crects)
		{
			if(crects[i].containsPoint(t, xtoy(t)))
			{
				result = crects[i];
				break;
			}
		}

	}while(t < c.width && t > 0);

	if(this.prevt != "right" && t >= c.width)
	{
		result = rigy;
		console.log("right");
	}
	else if(this.prevt != "left" && t <= 0)
	{
		result = lefy;
		console.log("left"); 
	}
	if(result == undefined)
		console.log("!result is null");

	//top-bound
	//0:top, 1:right, 2:bottom, 3:left
	if(result == topx)		//top
	{
		return new Line(Math.PI - this.theta, topx, c.height, this.len, this.color, "top", this.dt);
	}
	else if(result == botx)	//bot
	{
		return new Line(Math.PI - this.theta, botx, 0, this.len, this.color, "bottom", this.dt);
	}
	else if(result == lefy)	//lef
	{
		return new Line(Math.PI - this.theta, 0, lefy, this.len, this.color, "left", this.dt);
	}
	else if(result == rigy)	//rig
	{
		return new Line(Math.PI - this.theta, c.width, rigy, this.len, this.color, "right", this.dt);
	}
	else if(result != undefined)
	{
		//since rectangle is just perpendicular to canvas, we simply do not care about its complex degree.
		//it should be changed further.
		return new Line(Math.PI - this.theta, t, xtoy(t), this.len, this.color, "rect", this.dt);
	}
	else
		return null;

}

//y = tan(theta) (x - posx) + posy	
//y-posy + tposx = tx
//x = posx + 1/t(y-posy)
Line.prototype.ytox = function(y){
	return (1/Math.tan(this.theta))*(y-this.posy) + this.posx;
}
Line.prototype.xtoy = function(x){
	return Math.tan(this.theta)*(x-this.posx) + this.posy;
}

Line.prototype.draw = function(ctx){

	ctx.strokeStyle = this.color;
	ctx.beginPath();
    ctx.moveTo(this.posx, convertY(this.posy));
    //one side
    ctx.lineTo(this.posx + this.len*Math.cos(this.theta), convertY(this.posy + this.len*Math.sin(this.theta)));
    //another side
    ctx.lineTo(this.posx - this.len*Math.cos(this.theta), convertY(this.posy - this.len*Math.sin(this.theta)));
    ctx.closePath();
	ctx.stroke();
}

Line.prototype.matchesRect = function(rect){
	//console.log(rect);
	i = 0;
	while(i<this.len)
	{
/*		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(this.posx, this.posy);
		ctx.lineTo(this.posx + i*Math.cos(this.theta), this.posy - i*Math.sin(this.theta));
		ctx.closePath();
		ctx.stroke();
*/
		if(rect.containsPoint(this.posx + i*Math.cos(this.theta), this.posy - i*Math.sin(this.theta)) == true)
			return true;
		i += 0.5;
	}
	return false;
}
var Square = function(x, y, len, center, color)
{
	if(center == true)
	{
		return new Rect(x, y, len, len, color, center);
	}
	else
	{
		return new Rect(x,y,len,len,color);
	}
}


var Rect = function(x, y, width, height, color, center)
{
	if(center == true)
	{
		this.x = x - width/2;
		this.y = y - height/2;
	}
	else
	{
		this.x = x; 
		this.y = y;
	} 
	this.width = width; this.height = height; this.color = color;

	return this;
}

Rect.prototype.draw = function(ctx){

	ctx.fillStyle = this.color;
	ctx.rect(this.x,this.y,this.width,this.height);
	ctx.fill();
}

Rect.prototype.containsPoint = function(x,y){

	if(x >= this.x && x <= this.width+this.x && y >= this.y && y <= this.height+this.y)
		return true;
	else
		return false;
}

var Point = function(x,y){
	this.x = x; this.y = y;
}

Point.prototype.draw = function(){
	ctx.fillStyle = "black";
	ctx.arc(this.x,convertY(this.y),10,Math.PI*2,false);
	ctx.fill();
}

var Color = function(r,g,b){
	if(r == undefined)
		return "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
	else if(r && g == undefined && r.indexOf("#") == 0)
		return r;
	else
		return "rgb("+r+","+g+","+b+")";
}

	window.Point = Point;
	window.Line = Line;
	window.Rect = Rect;
	window.Color = Color;
	window.Square = Square;

})();
