var canvas, canvasContext;
var Player = new PlayerClass();
var mainGameState = true;
var helpScreen = false;
var camShakeOn = false;
var deathScreenTime = 0;
var gameRestartPending = false;
var gameIsRunning = false;
var gameIsStarted = false;
var visibleTileEntities = [];
var bossIsDefeated = false;
var showBossDefeated = function() {}
var bossDefeatedScreenTime = 0;
var frameCounter = 0;
var savingGame = false;
var saveGameIndicationTime = 0;

var Entities = [
	Player
];

var GroundArt = [
	{x: 3736, y: 2400, imgName: "pathway"},
	{x: 3040, y: 2016, imgName: "platform"},
];

var SortedArt = [
	{x: 3136, y: 3008, imgName: "healingStatue"},
	{x: 3652, y: 3040, imgName: "typewriter"},
	{x: 3738, y: 3040, imgName: "bed"},
	{x: 3686, y: 3055, imgName: "plant"},
	{x: 1900, y: 2900, imgName: "plant"},
	{x: 1931, y: 2896, imgName: "plant"},
	{x: 1899, y: 2882, imgName: "plant"},
	{x: 1936, y: 2923, imgName: "plant"},
	{x: 1894, y: 2931, imgName: "plant"},
	{x: 3710, y: 3030, imgName: "table"},
	{x: 3680, y: 2144, imgName: "entrance"},
	{x: 2144, y: 2580, imgName: "entrance"},
	{x: 3296, y: 2920, imgName: "gateway"},
];

var OverlayingArt = [
	{x: 3750, y: 3018, imgName: "painting"},
	
	// torches
	{x:3484, y:3535, imgName: 'torchPic'},
	{x:3405, y:3535, imgName: 'torchPic'},
	{x:3589, y:3026, imgName: 'torchPic'},
	{x:3297, y:3022, imgName: 'torchPic'},
	{x:3084, y:3144, imgName: 'torchPic'},
	{x:3803, y:3145, imgName: 'torchPic'},
	{x:3483, y:2792, imgName: 'torchPic'},
	{x:3403, y:2791, imgName: 'torchPic'},
	{x:2916, y:2121, imgName: 'torchPic'},
	{x:3721, y:2358, imgName: 'torchPic'},
	{x:3477, y:1787, imgName: 'torchPic'},
	{x:3411, y:1787, imgName: 'torchPic'},
	{x:3445, y:1142, imgName: 'torchPic'},
	{x:3494, y:1099, imgName: 'torchPic'},
	{x:3395, y:1098, imgName: 'torchPic'},
	{x:4816, y:3145, imgName: 'torchPic'},
	{x:4863, y:3146, imgName: 'torchPic'},
	{x:5962, y:3069, imgName: 'torchPic'},
	{x:5880, y:3070, imgName: 'torchPic'},
	{x:5880, y:3165, imgName: 'torchPic'},
	{x:5962, y:3165, imgName: 'torchPic'},
	{x:6210, y:2549, imgName: 'torchPic'},
	{x:5316, y:2551, imgName: 'torchPic'},
	{x:2179, y:3145, imgName: 'torchPic'},
	{x:1563, y:3145, imgName: 'torchPic'},

];

var SortedDrawList = [];
var LightSourcesThisFrame = [];

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
		//gameIsStarted = false;
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
	switchMusic(AMBIENT_MUSIC, BOSS_MUSIC_FADE_OUT_RATE, AMBIENT_MUSIC_FADE_IN_RATE);
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

	frameCounter++;

	if (gameIsStarted == false) {
		Menu.update();
		return;
	}	
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

		// show boss deafeated text
		if(bossIsDefeated)
		{
			showBossDefeated();
			bossDefeatedScreenTime++;
			if(bossDefeatedScreenTime > 90) {
				bossDefeatedScreenTime = 0;
				bossIsDefeated = false;
			}
		}

		if(savingGame) {
			if(saveGameIndicationTime == 0) {
				saveGame();
			}

			showSavingIndicator();
			saveGameIndicationTime++;

			if(saveGameIndicationTime > 90) {
				saveGameIndicationTime = 0;
				savingGame = false;
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
	
	// update music (for fades)
	for (var i = 0; i < bg_music.length; i++) {
		bg_music[i].update();
	}
}

function moveAll() {
	gameIsRunning = true;
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
	LightSourcesThisFrame = [];

	SortedDrawList = SortedDrawList.concat(Entities, SortedArt, visibleTileEntities);
	SortedDrawList.sort(sortByFloorPosition); // defined once above
	for (var i = 0; i < SortedDrawList.length; i++)
	{
		if (typeof SortedDrawList[i].imgName !== 'undefined')
		{ // sorted environment art
			canvasContext.drawImage(window[SortedDrawList[i].imgName], SortedDrawList[i].x, SortedDrawList[i].y);

			// candles glow and flicker
			if (SortedDrawList[i].imgName=="table") {
				
				// defer glows till after player is drawn
				LightSourcesThisFrame.push([SortedDrawList[i].x-42, SortedDrawList[i].y-50]);
				
				/*
				// works, but gets drawn UNDERNEATH the player gradient 
				canvasContext.drawImage(
					glowPic,0,0,100,100,
					SortedDrawList[i].x-42, SortedDrawList[i].y-50,
					100-Math.sin(frameCounter*1.331),
					100-Math.sin(frameCounter/2.012)*2.5);
				*/
			}

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
		
		// an overlay that glows - like a wall torch
		if (OverlayingArt[i].imgName == 'torchPic') {
			LightSourcesThisFrame.push([OverlayingArt[i].x-36, OverlayingArt[i].y-42]);
		}

	}

	Player.drawGradient(); // draw circular darkess around the player

	// draw light glows over top of player gradient
	for (i = 0; i < LightSourcesThisFrame.length; i++)
	{
		canvasContext.drawImage(
			glowPic,0,0,100,100,
			LightSourcesThisFrame[i][0], LightSourcesThisFrame[i][1],
			100-Math.sin(i*1234+frameCounter*1.331),
			100-Math.sin(i*1234+frameCounter/2.012)*2.5);
	}

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