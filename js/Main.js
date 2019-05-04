var canvas, canvasContext;
var Player = new PlayerClass();
var mainGameState = true;
var helpScreen = false;
var camShakeOn = false;
var deathScreenTime = 0;
var gameRestartPending = false;
var visibleTileEntities = [];

var Entities = [
	Player
];

var GroundArt = [
	{x: 3736, y: 2400, imgName: "pathway"},
	{x: 3040, y: 2016, imgName: "platform"},
];

var SortedArt = [
	{x: 3136, y: 3008, imgName: "healingStatue"},
	{x: 3712, y: 3040, imgName: "typewriter"},
	{x: 3680, y: 2144, imgName: "entrance"},
	{x: 3296, y: 2920, imgName: "gateway"},
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

function resetPlayer() {
	Player.resetStats();
	Entities = [Player];
}

function startWorld() {
	loadLevel(levelOne);
	initialiseEntityPositions();
	generateFloorTiles();
	generateTileEntities();
}

function restartGame() {
	gameRestartPending = false;
	resetPlayer();
	startWorld();
}

function startGame() {
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);
	
	// fill in height (/2) for art that needs sorting
	SortedArt.forEach(function(art) {
		art.height = window[art.imgName].height;
	});

	setUpInput();
	startWorld();
}

function updateAll() {
	if (gamePaused == false) { //Updates only if the game is not paused
		animateAll();
		drawAll();
		moveAll();
		camScreenshake();
		
		// death screen
		if (gameRestartPending) {
			deathTextDisplay();
			deathScreenTime++;
			if (deathScreenTime > 150) {
				deathScreenTime = 0;
				restartGame();
			}
		}
	}
	else {
		canvasContext.save();
		canvasContext.font = "30px Arial";
		canvasContext.textAlign = "center";
		colorText("Paused", canvas.width/2, 50, 'grey');
		canvasContext.restore();
	}
}

function moveAll() {
	for (var i = 0; i < Entities.length ; i++) {
		Entities[i].move();
	}
}

function sortByFloorPosition(a, b) {
	return (a.y+a.height)-(b.y+b.height);
}

function drawGame() {
	colorRect(0, 0, canvas.width, canvas.height, 'white'); // canvas

	drawFloorTiles();
	visibleTileEntities = getVisibleTileEntities();

	canvasContext.save();
	canvasContext.translate(-camPanX, -camPanY);

	// ground art
	for (i = 0; i < GroundArt.length; i++)
	{
		canvasContext.drawImage(window[GroundArt[i].imgName], GroundArt[i].x, GroundArt[i].y);
	}

	// sorted art
	SortedDrawList = [];

	SortedDrawList = SortedDrawList.concat(Entities, SortedArt, visibleTileEntities);
	SortedDrawList.sort(sortByFloorPosition); // defined once above
	for (var i = 0; i < SortedDrawList.length; i++)
	{
		if (typeof SortedDrawList[i].imgName !== 'undefined')
		{ // sorted environment art
			canvasContext.drawImage(window[SortedDrawList[i].imgName], SortedDrawList[i].x, SortedDrawList[i].y);
		}
		else
		{ // entities
			SortedDrawList[i].draw();
		}
	}

	// overlaying art
	for (i = 0; i < OverlayingArt.length; i++)
	{
		canvasContext.drawImage(window[OverlayingArt[i].imgName], OverlayingArt[i].x, OverlayingArt[i].y);
	}

	Player.drawGradient();

	canvasContext.restore();

	drawUI();

	colorText((mouseX + camPanX) + ', ' + (mouseY + camPanY), mouseX, mouseY, 'black');
}

function drawAll() {
	if(mainGameState) {
		drawGame();
		if (m_helpScreenTrasitioningOut) { helpBlock();}

	} else if (helpScreen) {
		// DISPLAY CONTROLS / ANY OTHER HELP HERE
		drawGame();
		helpBlock();
	}
}

function animateAll() {
	for (var i = 0; i < Entities.length ; i++) {
		Entities[i].animate();
	}
}

function handleDeadEntities() {
	for (var i = Entities.length - 1; i >= 0; --i) {
		if (Entities[i].deathHandle()) {
			Entities.splice(i, 1); // remove dead entity
		}
	}
}