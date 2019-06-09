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
var shadowBossName = 'Shadow';
var beastBossName = 'Beast';
var evilPlayerBossName = 'Self';
var illuminator;

var Entities = [
	Player
];

var GroundArt = [];

var SortedArt = [];

var OverlayingArt = [];

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

	illuminator = new Illuminator();
	
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
	resetWorld();
	loadLevel(levelOne);
	initialiseEntityPositions();
	generateFloorTiles();
	generateTileEntities();
	loadArt();
}

function removeDefeatedBosses() {
    for(var i=Entities.length-1; i>=0;i--) {
        var entity = Entities[i];
        
        Player.bossesKilled.forEach(boss => {
            if(entity.name == boss) {
                Entities.splice(i, 1);
            }
        });
    }
}

function loadArtAndCollisionForBossDefeatedRooms() {
    Player.bossesKilled.forEach(boss => {
        if(boss == shadowBossName) {
			// load shadow boss room art
            var shadowBoss = new ShadowBoss(1);
			shadowBoss.addHealingStatue();
        }
		else if (boss == beastBossName) {
			// load beast boss room object collision data
            var beastBoss = new BeastBoss();
			beastBoss.addHealingStatue();
		}
		else if (boss == evilPlayerBossName) {
			// load final boss room object collision data
		}
    });
	
	generateTileEntities();
	generateFloorTiles();
}

function restartGame() {
	gameRestartPending = false;
	resetPlayer();
	startWorld();

	removeDefeatedBosses();
	loadArtAndCollisionForBossDefeatedRooms();
	
	if (!bg_music[AMBIENT_MUSIC].isPlaying()) {
		switchMusic(AMBIENT_MUSIC, BOSS_MUSIC_FADE_OUT_RATE, AMBIENT_MUSIC_FADE_IN_RATE);
	}
}

function startGame() {
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

	setUpInput();
	startWorld();
}

function updateAll() {
	frameCounter++;
	
	// update music (for fades)
	for (var i = 0; i < bg_music.length; i++) {
		bg_music[i].update();
	}

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
	const onscreenLights = [];
	for (i = 0; i < OverlayingArt.length; i++)
	{
		canvasContext.drawImage(window[OverlayingArt[i].imgName], OverlayingArt[i].x, OverlayingArt[i].y);
		
		// an overlay that glows - like a wall torch
		if (OverlayingArt[i].imgName == 'torchPic') {
			LightSourcesThisFrame.push([OverlayingArt[i].x-36, OverlayingArt[i].y-42]);
			if((OverlayingArt[i].x-36 - camPanX >= -torchRange) && (OverlayingArt[i].x-36 - camPanX <= canvas.width + torchRange)) {
				if((OverlayingArt[i].y-42 - camPanY >= -torchRange) && (OverlayingArt[i].y-42 - camPanY <= canvas.height + torchRange)) {
					onscreenLights.push([OverlayingArt[i].x, OverlayingArt[i].y]);
				}
			}
		}

	}

//	Player.drawGradient(); // draw circular darkess around the player

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

	const lightPoses = [Player.x - camPanX, canvas.height - (Player.y - camPanY)];
	for(let i = 0; i < onscreenLights.length; i++) {
		lightPoses.push(onscreenLights[i][0] - camPanX);
		lightPoses.push(canvas.height - (onscreenLights[i][1] - camPanY));
	}

	const shadowOverlay = illuminator.getShadowOverlayWithLightList(lightPoses);
	canvasContext.drawImage(shadowOverlay, 0, 0);

	drawUI();

	colorText((mouseX + camPanX) + ', ' + (mouseY + camPanY), mouseX, mouseY, 'white');
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

function loadArt() {
	loadGroundArt();
	loadSortedArt();
	loadOverlayingArt();
}

function loadGroundArt() {
	GroundArt = [
		{x: 3736, y: 2400, imgName: "pathway"},
		{x: 3040, y: 2016, imgName: "platform"},
	];
}

function loadSortedArt() {
	SortedArt = [
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
		{x: 2144, y: 2624, imgName: "entrance"},
		{x: 3296, y: 2920, imgName: "gateway"},
		{x: 4192, y: 2875, imgName: "cage"},
		{x: 4608, y: 2875, imgName: "cage"},
		{x: 4416, y: 2800, imgName: "ruins"},
		{x: 2144, y: 3296, imgName: "ruins"},
	];
	
	// fill in height (/2) for art that needs sorting
	SortedArt.forEach(function(art) {
		art.height = window[art.imgName].height;
	});
}

function loadOverlayingArt() {
	OverlayingArt = [
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
		// house on right side of path to final boss
		{x:3721, y:2358, imgName: 'torchPic'},
		{x:3810, y:2358, imgName: 'torchPic'},
		//
		{x:3445, y:1142, imgName: 'torchPic'},
		{x:3494, y:1099, imgName: 'torchPic'},
		{x:3395, y:1098, imgName: 'torchPic'},
		{x:4816, y:3145, imgName: 'torchPic'},
		{x:5280, y:3146, imgName: 'torchPic'},
		// beast boss room torches
		{x:6210, y:2549, imgName: 'torchPic'},
		{x:5316, y:2551, imgName: 'torchPic'},
		// shadow boss room torches
		{x:645, y:2549, imgName: 'torchPic'},
		{x:1540, y:2551, imgName: 'torchPic'},
		// 
		{x:2179, y:3145, imgName: 'torchPic'},
		{x:1563, y:3145, imgName: 'torchPic'},
		// platform final boss stands on
		{x:3085, y:2120, imgName: 'torchPic'},
		{x:2840, y:2121, imgName: 'torchPic'},
		//
		{x:3944, y:2500, imgName: 'torchPic'},
	];
}