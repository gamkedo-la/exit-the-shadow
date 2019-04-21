var canvas, canvasContext;
var Player = new PlayerClass();
var mainGameState = true;
var helpScreen = false;
var camShakeOn = false;

var Entities = [
	Player
];

var GroundArt = [
	{x: 750, y: 3000, imgName: "platform"}
];

var SortedArt = [

];

var OverlayingArt = [
];

var SortedDrawList = [];

var mouseX, mouseY;
function displayMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}
	
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	window.addEventListener("resize", resizeCanvas);
	window.addEventListener('focus', function () {
		gamePaused = false;
		}
	);
    window.addEventListener('blur', function() {
		gamePaused = true;
		}
	);
	resizeCanvas();

	colorRect(0,0, canvas.width,canvas.height, 'white');
	
	loadImages();
	
	canvas.addEventListener('mousemove', displayMousePos);
	
	initAudio();
	loadAudio();
}

function resizeCanvas() {
	console.log("resizing canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
	generateFloorTiles();
}

function updateAll() {
	if (gamePaused == false) { //Updates only if the game is not paused
		animateAll();
		drawAll();
		moveAll();
		camScreenshake();
	}
}

function moveAll() {
	for (var i = 0; i < Entities.length ; i++) {
		Entities[i].move();
	}
}

function drawAll() {
	if(mainGameState){
		colorRect(0,0, canvas.width,canvas.height, 'white'); // canvas
		
		drawTiles(); // CAN TAKE THIS OUT AS ART IS GOING ON TOP OF IT

		canvasContext.save();
		canvasContext.translate(-camPanX, -camPanY);

		// ground art
		for (i = 0; i < GroundArt.length; i++) {
			canvasContext.drawImage(window[GroundArt[i].imgName], GroundArt[i].x, GroundArt[i].y);
		}
		
		// sorted art
		SortedDrawList = [];
		SortedDrawList = SortedDrawList.concat(Entities, SortedArt);
		SortedDrawList.sort(function(a, b){return (a.y+a.height)-(b.y+b.height)});
		for (var i = 0; i < SortedDrawList.length ; i++) {
			if (typeof SortedDrawList[i].imgName !== 'undefined') { // sorted environment art
				canvasContext.drawImage(window[SortedDrawList[i].imgName], SortedDrawList[i].x, SortedDrawList[i].y);
			}
			else { // entities
				SortedDrawList[i].draw();
			}
		}

		// overlaying art
		for (i = 0; i < OverlayingArt.length; i++) {
			canvasContext.drawImage(window[OverlayingArt[i].imgName], OverlayingArt[i].x, OverlayingArt[i].y);
		}

		canvasContext.restore();
		
		playerLife(); // leaving this here temporarily
		colorText((mouseX+camPanX) + ', ' + (mouseY+camPanY), mouseX,mouseY, 'green');
	} else if(helpScreen){
		colorRect(0,0, canvas.width,canvas.height, 'white'); // canvas

		// DISPLAY CONTROLS / ANY OTHER HELP HERE

		gamePaused = true;
	}
}

function animateAll() {
	for (var i = 0; i < Entities.length ; i++) {
		Entities[i].animate();
	}
}

function handleDeadEntities() {
	for (var i = 0; i < Entities.length; i++) {
		if (Entities[i].isDead) {
			Entities.splice(i, 1); // remove dead entity
		}
	}
}