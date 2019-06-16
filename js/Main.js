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
var finalBossPlatformTorches = [];
var finalBossRoomTorches = [];
var shadowBossDarks = [];
var framesPerSecond = 30;
var drawCursorCoordinates = false;

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
	Menu.resizingCanvas();
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
					onscreenLights.push([
						OverlayingArt[i].x+ILLUM_OFFSET_X, 
						OverlayingArt[i].y+ILLUM_OFFSET_Y,
						OverlayingArt[i].r, 
						OverlayingArt[i].g, 
						OverlayingArt[i].b,
						OverlayingArt[i].range
					]);
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
	const lightColors = [];
	const lightRanges = [];
	const slowCounter = frameCounter / 3;
	for(let i = 0; i < maxLights; i++) {
		if(i < onscreenLights.length) {
			lightPoses.push(onscreenLights[i][0] - camPanX + (Math.sin(i*1234+slowCounter*1.331)));//x position
			lightPoses.push(canvas.height - (onscreenLights[i][1] - camPanY) + (Math.sin(i*1234+slowCounter/2.012)*2.5));//y position
			lightColors.push(onscreenLights[i][2]);//red component
			lightColors.push(onscreenLights[i][3]);//green component
			lightColors.push(onscreenLights[i][4]);//blue component
			lightRanges.push(onscreenLights[i][5] + (Math.sin(i*1234+slowCounter/2.012)*2.5));//range of this light
		} else {//finish filling the buffers with empty data
			lightPoses.push(0);//x position
			lightPoses.push(0);//y position
			lightColors.push(0);//red component
			lightColors.push(0);//green component
			lightColors.push(0);//blue component
			lightRanges.push(0);//range of this light
		}
	}
	
	const darkPoses = [
		shadowBossDarks[0].x - camPanX, canvas.height + camPanY - shadowBossDarks[0].y,
		shadowBossDarks[1].x - camPanX, canvas.height + camPanY - shadowBossDarks[1].y,
		shadowBossDarks[2].x - camPanX, canvas.height + camPanY - shadowBossDarks[2].y,
	];

	const darkRanges = [shadowBossDarks[0].range, shadowBossDarks[1].range, shadowBossDarks[2].range];

	const shadowOverlay = illuminator.getShadowOverlay(lightPoses, lightColors, lightRanges, darkPoses, darkRanges);
	canvasContext.drawImage(shadowOverlay, 0, 0);

	drawUI();

	if (drawCursorCoordinates) {
		colorText((mouseX + camPanX) + ', ' + (mouseY + camPanY), mouseX, mouseY, 'white');
	}
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
		// floor debris - one little rock
		{x:3435, y:3478, imgName: 'debris1'},
		{x:3399, y:3346, imgName: 'debris1'},
		{x:3415, y:3329, imgName: 'debris1'},
		{x:3570, y:3053, imgName: 'debris1'},
		{x:3411, y:2815, imgName: 'debris1'},
		{x:3460, y:2569, imgName: 'debris1'},
		{x:3250, y:2129, imgName: 'debris1'},
		{x:3224, y:2133, imgName: 'debris1'},
		{x:3658, y:2402, imgName: 'debris1'},
		{x:3677, y:2418, imgName: 'debris1'},
		{x:3670, y:2395, imgName: 'debris1'},
		{x:3484, y:1768, imgName: 'debris1'},
		{x:3471, y:1778, imgName: 'debris1'},
		{x:3217, y:1430, imgName: 'debris1'},
		{x:3594, y:1341, imgName: 'debris1'},
		{x:3608, y:1380, imgName: 'debris1'},
		{x:2748, y:3208, imgName: 'debris1'},
		{x:1531, y:3150, imgName: 'debris1'},
		{x:1542, y:3133, imgName: 'debris1'},
		{x:1012, y:2894, imgName: 'debris1'},
		{x:987, y:2926, imgName: 'debris1'},
		{x:3472, y:3376, imgName: 'debris2'},
// two small rocks
{x:3401, y:3362, imgName: 'debris2'},
{x:3260, y:3093, imgName: 'debris2'},
{x:3420, y:2807, imgName: 'debris2'},
{x:3771, y:3152, imgName: 'debris2'},
{x:4259, y:3214, imgName: 'debris2'},
{x:4794, y:3162, imgName: 'debris2'},
{x:5304, y:3154, imgName: 'debris2'},
{x:5491, y:2842, imgName: 'debris2'},
{x:5883, y:3199, imgName: 'debris2'},
{x:2776, y:3160, imgName: 'debris2'},
{x:1547, y:3230, imgName: 'debris2'},
{x:1163, y:3020, imgName: 'debris2'},
{x:1002, y:2882, imgName: 'debris2'},
{x:665, y:2555, imgName: 'debris2'},
{x:637, y:3313, imgName: 'debris2'},
// medium rocks
{x:3353, y:3607, imgName: 'debris3'},
{x:3416, y:3479, imgName: 'debris3'},
{x:3112, y:3236, imgName: 'debris3'},
{x:3379, y:3044, imgName: 'debris3'},
{x:3765, y:3133, imgName: 'debris3'},
{x:5314, y:3150, imgName: 'debris3'},
{x:5332, y:2555, imgName: 'debris3'},
{x:6057, y:3018, imgName: 'debris3'},
{x:4159, y:2779, imgName: 'debris3'},
{x:1549, y:3145, imgName: 'debris3'},
{x:1343, y:2951, imgName: 'debris3'},
{x:1066, y:3343, imgName: 'debris3'},
// large rock cluster
{x:3380, y:3338, imgName: 'debris4'},
{x:3415, y:2521, imgName: 'debris4'},
{x:3416, y:1784, imgName: 'debris4'},
{x:3408, y:1773, imgName: 'debris4'},
{x:3484, y:1467, imgName: 'debris4'},
{x:3096, y:1335, imgName: 'debris4'},
{x:3125, y:957, imgName: 'debris4'},
{x:3470, y:954, imgName: 'debris4'},
{x:4146, y:3161, imgName: 'debris4'},
{x:6186, y:2555, imgName: 'debris4'},
{x:5541, y:3343, imgName: 'debris4'},
{x:2191, y:2877, imgName: 'debris4'},
{x:1884, y:2913, imgName: 'debris4'},
{x:653, y:3330, imgName: 'debris4'},
// cracks
{x:3493, y:3625, imgName: 'debris5'},
{x:3605, y:3257, imgName: 'debris5'},
{x:3336, y:3108, imgName: 'debris5'},
{x:2339, y:3175, imgName: 'debris5'},
{x:1552, y:3159, imgName: 'debris5'},
{x:1138, y:2560, imgName: 'debris5'},
// small cracks
{x:3457, y:3324, imgName: 'debris6'},
{x:3750, y:3150, imgName: 'debris6'},
{x:3564, y:2811, imgName: 'debris6'},
{x:3732, y:2411, imgName: 'debris6'},
{x:3798, y:2402, imgName: 'debris6'},
{x:3796, y:2419, imgName: 'debris6'},
{x:3928, y:2519, imgName: 'debris6'},
{x:3918, y:2525, imgName: 'debris6'},
{x:3925, y:2524, imgName: 'debris6'},
{x:3452, y:1992, imgName: 'debris6'},
{x:3593, y:1648, imgName: 'debris6'},
{x:3324, y:1553, imgName: 'debris6'},
{x:3459, y:1294, imgName: 'debris6'},
{x:3778, y:1118, imgName: 'debris6'},
{x:3218, y:2182, imgName: 'debris6'},
{x:3129, y:2262, imgName: 'debris6'},
{x:5042, y:3204, imgName: 'debris6'},
{x:5662, y:3076, imgName: 'debris6'},
{x:6179, y:2965, imgName: 'debris6'},
{x:6080, y:3067, imgName: 'debris6'},
{x:4177, y:2789, imgName: 'debris6'},
{x:2261, y:2880, imgName: 'debris6'},
{x:1921, y:2938, imgName: 'debris6'},
{x:2132, y:2982, imgName: 'debris6'},
{x:2340, y:2931, imgName: 'debris6'},
{x:2407, y:3014, imgName: 'debris6'},
{x:1766, y:3189, imgName: 'debris6'},
{x:1701, y:3196, imgName: 'debris6'},
{x:1350, y:2853, imgName: 'debris6'},
{x:654, y:3313, imgName: 'debris6'},
// small wall chunk
{x:3476, y:3363, imgName: 'debris7'},
{x:3417, y:3493, imgName: 'debris7'},
{x:3502, y:3697, imgName: 'debris7'},
{x:3509, y:3045, imgName: 'debris7'},
{x:3387, y:2808, imgName: 'debris7'},
{x:3099, y:1647, imgName: 'debris7'},
{x:3214, y:2308, imgName: 'debris7'},
{x:3722, y:2397, imgName: 'debris7'},
{x:3867, y:2380, imgName: 'debris7'},
{x:3916, y:2509, imgName: 'debris7'},
{x:4781, y:3051, imgName: 'debris7'},
{x:5303, y:3141, imgName: 'debris7'},
{x:5562, y:3327, imgName: 'debris7'},
{x:5973, y:3026, imgName: 'debris7'},
{x:3131, y:3118, imgName: 'debris7'},
{x:2034, y:2876, imgName: 'debris7'},
{x:1553, y:3220, imgName: 'debris7'},
// medium wall chunk
{x:3526, y:3605, imgName: 'debris8'},
{x:3490, y:3363, imgName: 'debris8'},
{x:3428, y:2827, imgName: 'debris8'},
{x:3800, y:2394, imgName: 'debris8'},
{x:3793, y:2413, imgName: 'debris8'},
{x:3807, y:2579, imgName: 'debris8'},
{x:3125, y:2129, imgName: 'debris8'},
{x:3410, y:1755, imgName: 'debris8'},
{x:3487, y:957, imgName: 'debris8'},
{x:3473, y:204, imgName: 'debris8'},
// broken wall
{x:3415, y:3539, imgName: 'debris9'},
{x:3474, y:3519, imgName: 'debris9'},
{x:3386, y:3035, imgName: 'debris9'},
{x:3469, y:2803, imgName: 'debris9'},
{x:3129, y:3037, imgName: 'debris9'},
{x:2405, y:3160, imgName: 'debris9'},
{x:2411, y:3170, imgName: 'debris9'},
{x:2254, y:2878, imgName: 'debris9'},
{x:1537, y:3156, imgName: 'debris9'},
{x:1535, y:3221, imgName: 'debris9'},
{x:1509, y:3222, imgName: 'debris9'},
{x:5302, y:3232, imgName: 'debris9'},
{x:5328, y:3148, imgName: 'debris9'},
{x:4161, y:3018, imgName: 'debris9'},
{x:4396, y:3039, imgName: 'debris9'},
{x:3473, y:1796, imgName: 'debris9'},
{x:3414, y:1798, imgName: 'debris9'},

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
	finalBossPlatformTorches = [
		{x:3085, y:2120, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255},
		{x:2840, y:2121, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255},
	];

	finalBossRoomTorches = [
		{x:3550, y:1210, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255},
		{x:3440, y:1035, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255},
		{x:3330, y:1210, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255},
	];

	OverlayingArt = [
		{x: 3750, y: 3018, imgName: "painting"},
	
		// torches
		{x:3484, y:3535, imgName: 'torchPic', range:100, r:1, g:252/255, b:206/255},
		{x:3405, y:3535, imgName: 'torchPic', range:100, r:1, g:252/255, b:206/255},
		{x:3589, y:3026, imgName: 'torchPic', range:100, r:1, g:252/255, b:206/255},
		{x:3297, y:3022, imgName: 'torchPic', range:100, r:1, g:252/255, b:206/255},
		{x:3084, y:3144, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:206/255},
		{x:3803, y:3145, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:20/255},
		{x:3483, y:2792, imgName: 'torchPic', range:100, r:1, g:25/255, b:20/255},
		{x:3403, y:2791, imgName: 'torchPic', range:100, r:1, g:25/255, b:20/255},
		// house on right side of path to final boss
		{x:3721, y:2358, imgName: 'torchPic', range:100, r:1, g:25/255, b:20/255},
		{x:3810, y:2358, imgName: 'torchPic', range:100, r:1, g:25/255, b:20/255},
		//final boss torches
		finalBossRoomTorches[0],
		finalBossRoomTorches[1],
		finalBossRoomTorches[2],
		// path to the beast boss room torches
		{x:4816, y:3145, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:20/255},
		{x:5280, y:3146, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:20/255},
		// beast boss room torches
		{x:6210, y:2549, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:20/255},
		{x:5316, y:2551, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:20/255},
		// shadow boss room torches
		{x:645, y:2549, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:206/255},
		{x:1540, y:2551, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:206/255},
		// path to shadow boss room torches
		{x:2179, y:3145, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:206/255},
		{x:1563, y:3145, imgName: 'torchPic', range:100, r:1/255, g:252/255, b:206/255},
		// platform final boss stands on
		finalBossPlatformTorches[0],
		finalBossPlatformTorches[1],
		//
		{x:3944, y:2500, imgName: 'torchPic', range:100, r:1, g:25/255, b:20/255},
	];
}