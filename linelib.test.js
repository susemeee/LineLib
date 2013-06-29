var c = document.getElementById("main");
var ctx = c.getContext("2d");
var z;
var rects = [];
var lines = [];
var point;
//degree -> radian
var D2R = Math.PI / 180;
//radian -> degree
var R2D = 180 / Math.PI;

setCanvas(c);

function regenerate()
{
var len = document.getElementById("linecount").value;
var angle = document.getElementById("angle").value;
var sx = document.getElementById("x").value;
var sy = document.getElementById("y").value;
var b = document.getElementById("bounds").value;
	
	console.log("new query");
	point = new Point(sx,sy);

	lines = [];
	for(var k = 0; k<len; k++)
	{
		lines.push([new Line(D2R*(k+Number(angle)), Number(sx), Number(sy), null, Color())]);
	}

/*	for(var i=0; i<lines.length; i++)
		for(var j=0; j<b; j+
			*/
if(b > 1)
	for(var i=0; i<lines.length; i++)
		getRLine(i,0);

	function getRLine(i,j)
	{
		lines[i][j+1] = lines[i][j].getReflectiveLine();
		if(j < b-1)
			setTimeout(function(){getRLine(i,j+1)}, 10);
	}
}

function draw()
	{
		if(point)
		{
			point.draw();
		}

		ctx.clearRect(0,0,c.width, c.height);
		ctx.font = "50px Sans-serif"	

		for(var i=0; i<rects.length; i++)
		{
			rects[i].draw(ctx);
		}

		for(var i=0; i<lines.length; i++)
		{
			//lines[i].theta -= D2R*1;
			for(j=0; j<lines[i].length; j++)
				lines[i][j].draw(ctx);//, i%2 == 0 ? "blue" : "red");
			//new Point(lines[i].ytox(300), 300).draw();
		}
/*
		var b = lines[0][0].matchesRect(rects[0]);
		ctx.fillStyle = 'black';
		if(b == true)
			ctx.fillText("true", 10, 50);
		
		else
			ctx.fillText("false", 10, 50);*/
		
		ctx.font = "20px Sans-serif"
		ctx.fillText(lines[0][0].ytox(0), 10, 100);
	}

	z = setInterval(draw, 1000/60);
	
regenerate();

