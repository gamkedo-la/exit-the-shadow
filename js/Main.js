var canvas, canvasContext;
var Player = new PlayerClass();
var TestEnemy = new TestEnemyClass();

// maybe still keep entities in an object but then have a arrays for things like "moveable" - all have a move card or "sortable" - need depth sorting etc

var Entities = [
	Player,
	TestEnemy
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
	drawTiles();
	
	// PUT ALL THINGS THAT NEED DEPTH SORTING IN ONE ARRAY 
	Entities.sort(function(a, b){return (a.y+a.height)-(b.y+b.height)});
	for (var i = 0; i < Entities.length ; i++) {
		Entities[i].draw();
	}
}

function animateAll() {
	for (var i = 0; i < Entities.length ; i++) {
		Entities[i].animate();
	}
}