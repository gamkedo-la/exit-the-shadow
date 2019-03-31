var canvas, canvasContext;
var Player = new PlayerClass();
var TestEnemy = new TestEnemyClass();

var Entities = [
	Player,
	TestEnemy,
]

var GroundArt = [
	
]

var SortedArt = [
	{x: 191, y: 575, imgName: "hexagonObstacle"}
]

var OverlayingArt = [
	
]

var SortedDrawList = [
	
]
	
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	colorRect(0,0, canvas.width,canvas.height, 'white');
	
	loadImages();
}

function startGame() {
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);
	
	// fill in height (/2) for art that needs sorting
	SortedArt.forEach(function(art) {
		art.height = window[art.imgName].height/2;
	});

	setUpInput();
	loadLevel(levelOne);
	initialiseEntityPositions();
}

function updateAll() {
	animateAll();
	drawAll();
	moveAll();
}

function moveAll() {
	for (var i = 0; i < Entities.length ; i++) {
		Entities[i].move();
	}
}

function drawAll() {
	colorRect(0,0, canvas.width,canvas.height, 'white'); // canvas
	
	drawTiles(); // CAN TAKE THIS OUT AS ART IS GOING ON TOP OF IT
	
	SortedDrawList = [];
	SortedDrawList = SortedDrawList.concat(Entities, SortedArt);
	SortedDrawList.sort(function(a, b){return (a.y+a.height)-(b.y+b.height)});
	canvasContext.save();
	canvasContext.translate(-camPanX, -camPanY);
	for (var i = 0; i < SortedDrawList.length ; i++) {
		if (typeof SortedDrawList[i].imgName !== 'undefined') { // sorted art
			canvasContext.drawImage(window[SortedDrawList[i].imgName], SortedDrawList[i].x, SortedDrawList[i].y);
		}
		else { // entities
			SortedDrawList[i].draw();
		}
	}
	canvasContext.restore();
}

function animateAll() {
	for (var i = 0; i < Entities.length ; i++) {
		Entities[i].animate();
	}
}