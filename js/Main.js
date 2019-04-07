var canvas, canvasContext;
var Player = new PlayerClass();
var TestEnemy = new TestEnemyClass();
var mainGameState = true;
var helpScreen = false;

var Entities = [
	Player
	// Test enemy dynamically added from map
]

var GroundArt = [
	
]

var SortedArt = [
	{x: 480, y: 192, imgName: "octagonObstacle"}
]

var OverlayingArt = [
	
]

var SortedDrawList = [
	
] 

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
		
		colorText((mouseX+camPanX) + ', ' + (mouseY+camPanY), mouseX,mouseY, 'green');
	} else if(helpScreen){
		colorRect(0,0, canvas.width,canvas.height, 'white'); // canvas
		gamePause == true;
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