var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";
var widthSize = 50;
var heightSize = 50;
var svgCanvasRoot;
var baseLayerRoot;

//window attribute
var window_width;
var window_height;
var scale;
var offset_x;
var offset_y;

//load attribute
var x_left;
var x_right;
var y_up;
var y_down;

var x_min = 27390;
var x_max = 27484;
var y_min = 5324;
var y_max = 5370;

function loadBlock(root, x, y, toX, toY) {
	var img = document.createElementNS(svgNS, "image");
	img.setAttributeNS(null, "x", "" + toX);
	img.setAttributeNS(null, "y", "" + toY);
	img.setAttributeNS(null, "width", widthSize + "");
	img.setAttributeNS(null, "height", heightSize + "");

	img.setAttributeNS(xlinkNS, "xlink:href", "resource/svg/block/base/"+x + "/" + y)
	img.async = true; 
	root.appendChild(img);
}

function loadArea(fromX, toX, fromY, toY, root) {
	for (var i = fromX; i <= toX; i++)
		for (var j = fromY; j <= toY; j++) {
			if(i>=x_min && i<=x_max)
				if(j>=y_min && j<=y_max)
					loadBlock(root, i, j, (i - x_min) * (widthSize - 0), (j - y_min)
					* (heightSize - 0));
		}

}

function loadMap(evt) {
	root = evt.target;
	
	g = root.getElementById("viewport");
	svgCanvasRoot = g;
	var base = g.getElementsByClassName("baseLayer")[0];
	baseLayerRoot = base;
	
	if (window.getComputedStyle) {
	    style = window.getComputedStyle(root, null);
	}else{
		style = root.currentStyle;
	}
    console.log("width=" + style.width + "\nheight=" + style.height);
    
    window_width = parseInt(style.width)
	window_height = parseInt(style.height)
	//alert(g.clientWidth);
	scale = 1;
	offset_x = 0;
	offset_y = 0;

	x_left = parseInt(offset_x/widthSize)+27390;
	x_right = parseInt((offset_x+window_width)/widthSize+1)+27390;
	y_up = parseInt(offset_y/heightSize)+5324;
	y_down = parseInt((offset_y+window_height)/heightSize+1)+5324;

	console.log("width=" + window_width + " height=" + window_height);
	console.log(x_left+","+x_right+","+y_up+","+y_down);
	
	//loadLayer(g,"sch");
	// loadArea(27390,27400,5324,5334,g);
	loadArea(x_left,x_right,y_up,y_down,base);
	// loadBlock(root,27392,5367,100,100);
	// alert(root);
	initWithRoot(root);
}

function loadLayer(root, layer){
	var xmlHttp = new XMLHttpRequest();
	//console.log("form outer "+outer);
	xmlHttp.onreadystatechange = function() {

		if (xmlHttp.readyState==4 && xmlHttp.status==200)
	    {

			var g = document.createElementNS(svgNS, "g");
			g.setAttributeNS(null, "class", "layer");
			g.setAttributeNS(null, "layerid", layer);
			g.innerHTML=xmlHttp.responseText;
			root.appendChild(g);
	    }
	}

	xmlHttp.open("GET", "resource/svg/block/"+layer+"/1/1", true);
	xmlHttp.send();
}

function loadLayerBlock(root, layer, x, y){
	var xmlHttp = new XMLHttpRequest();
	//console.log("form outer "+outer);
	xmlHttp.onreadystatechange = function() {

		if (xmlHttp.readyState==4 && xmlHttp.status==200)
	    {

			var g = document.createElementNS(svgNS, "g");
			g.setAttributeNS(null, "class", "layer");
			g.setAttributeNS(null, "layerid", layer);
			g.innerHTML=xmlHttp.responseText;
			root.appendChild(g);
	    }
	}

	xmlHttp.open("GET", "resource/svg/block/"+layer+"/"+x+"/"+y, true);
	xmlHttp.send();
}

function loadLayer(layer){
	var xmlHttp = new XMLHttpRequest();
	//console.log("form outer "+outer);
	xmlHttp.onreadystatechange = function() {

		if (xmlHttp.readyState==4 && xmlHttp.status==200)
	    {

			var g = document.createElementNS(svgNS, "g");
			g.setAttributeNS(null, "class", "layer");
			g.setAttributeNS(null, "layerid", layer);
			g.innerHTML=xmlHttp.responseText;
			g.async = true;
			svgCanvasRoot.appendChild(g);
			/*g.ready(function(e) {
		        $(".entity").mouseover(function(e) {
		            showWin(e);

		        });
		        $(".entity").mouseout(function(e) {
		            hideWin(e);

		        });

		    });*/
			var entities = g.getElementsByClassName('entity');
			console.log(entities.length);
	    }
	}

	xmlHttp.open("GET", "resource/svg/block/"+layer+"/1/1", true);
	xmlHttp.send();
}

function loadLayerBlock(layer, x, y){
	var xmlHttp = new XMLHttpRequest();
	//console.log("form outer "+outer);
	xmlHttp.onreadystatechange = function() {

		if (xmlHttp.readyState==4 && xmlHttp.status==200)
	    {

			var g = document.createElementNS(svgNS, "g");
			g.setAttributeNS(null, "class", "layer");
			g.setAttributeNS(null, "layerid", layer);
			g.innerHTML=xmlHttp.responseText;
			g.async = true;
			svgCanvasRoot.appendChild(g);
			var entities = g.getElementsByClassName('entity');
			//console.log(entities.length);
			for(entity in entities){
				var temp = entities[entity];
				if(temp.nodeType == 1){
					console.log("add attributes");
					temp.setAttribute("onmouseover","showWin(evt)");
					temp.setAttribute("onmouseout","hideWin(evt)");
					/*temp.mouseover(function(e) {
/*			            showWin(e);

			        });*/
			        /*temp.mouseout(function(e) {
			            hideWin(e);

			        });*/
				}
			}
	    }
	}

	xmlHttp.open("GET", "resource/svg/block/"+layer+"/"+x+"/"+y, true);
	xmlHttp.send();
}

function removeLayer(layer){
	var layers = svgCanvasRoot.getElementsByTagName("g");
	for(ly in layers){
		var temp = layers[ly];
		if(temp.nodeType == 1 && temp.getAttribute("layerid")=="result")
			svgCanvasRoot.removeChild(temp);
	}
}

function reloadWindow(){
	console.log("scale:"+scale+" offset_x:"+offset_x+" offset_y:"+offset_y);
	x_left_new = parseInt(offset_x/widthSize)+x_min;
	x_right_new = parseInt((offset_x+window_width/scale)/widthSize+1)+x_min;
	y_up_new = parseInt(offset_y/heightSize)+y_min;
	y_down_new = parseInt((offset_y+window_height/scale)/heightSize+1)+y_min;

	
	baseLayerRoot.innerHTML="";

	loadArea(x_left_new,x_right_new,y_up_new,y_down_new,baseLayerRoot);

	console.log(x_left_new+","+x_right_new+","+y_up_new+","+y_down_new);
}