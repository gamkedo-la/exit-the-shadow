var canvas, canvasContext;
var Player = new PlayerClass();
	
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
	moveAll();
	animateAll();
	drawAll();
}

function moveAll() {
	Player.move();
}

function drawAll() {
	colorRect(0,0, canvas.width,canvas.height, 'white'); // canvas
	drawTiles();
	Player.draw();
}

function animateAll() {
	Player.animate();
}