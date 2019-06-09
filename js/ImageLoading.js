var playerSheet = document.createElement("img");
var beastSheet = document.createElement("img");
var shadowSheet = document.createElement("img");
var evilPlayerSheet = document.createElement("img");
var platform = document.createElement("img");
var playerConcept = document.createElement("img");
var playerLifeIcon = document.createElement("img");
var playerLifeIconBackground = document.createElement("img");
var floorTileset = document.createElement("img");
var wallsTileset = document.createElement("img");
var trailImage = document.createElement("img");
var bossTrailImage = document.createElement("img");
var bossHealthBarOutline = document.createElement("img");
var bossHealth = document.createElement("img");
var playerGradient = document.createElement("img");
var shadowBossGradient = document.createElement("img");
var healingStatue = document.createElement("img");
var typewriter = document.createElement("img");
var bed = document.createElement("img");
var painting = document.createElement("img");
var plant = document.createElement("img");
var table = document.createElement("img");
var entrance = document.createElement("img");
var pathway = document.createElement("img");
var gateway = document.createElement("img");
var titlePic = document.createElement("img"); 
var logoPic = document.createElement("img");
var arrowPic = document.createElement("img");
var glowPic = document.createElement("img");
var torchPic = document.createElement("img");
var beastHealingStatue = document.createElement("img");
var shadowHealingStatue = document.createElement("img");
var cage = document.createElement("img");
var ruins = document.createElement("img");

picsToLoad = 0;

function loadImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "images/"+fileName;
}

function loadImages() {
	var imageList = [
		{varName: logoPic, fileName: "playerShadow.png"},
		{varName: titlePic, fileName: "gradient.png"},
		{varName: arrowPic, fileName: "player.png"},
		{varName: playerSheet, fileName: "player_sheet.png"},
		{varName: beastSheet, fileName: "BeastSpriteSheet.png"},
		{varName: shadowSheet, fileName: "ShadowSpriteSheet.png"},
		{varName: evilPlayerSheet, fileName: "EvilPlayerSheet.png"},
		{varName: platform, fileName: "platform.png"},
		{varName: playerConcept, fileName: "player.png"},
		{varName: playerLifeIcon, fileName: "life_placeholder.png"},
		{varName: playerLifeIconBackground, fileName: "life_placeholder_background.png"},
		{varName: floorTileset, fileName: "floor_tiles.png"},
		{varName: wallsTileset, fileName: "walls_tileset_v2.png"},
		{varName: trailImage, fileName: "trail.png"},
		{varName: bossTrailImage, fileName: "bossTrail.png"},
		{varName: bossHealthBarOutline, fileName: "BossHealthBarOutline.png"},
		{varName: bossHealth, fileName: "BossHealthBar.png"},
		{varName: playerGradient, fileName: "gradient.png"},
		{varName: shadowBossGradient, fileName: "ShadowBossGradient.png"},
		{varName: healingStatue, fileName: "healing_statue.png"},
		{varName: typewriter, fileName: "tw_room_typewriter.png"},
		{varName: bed, fileName: "tw_room_bed.png"},
		{varName: painting, fileName: "tw_room_painting.png"},
		{varName: plant, fileName: "tw_room_plant.png"},
		{varName: table, fileName: "tw_room_table.png"},
		{varName: entrance, fileName: "entrance.png"},
		{varName: pathway, fileName: "pathway.png"},
		{varName: gateway, fileName: "gateway.png"},
		{varName: glowPic, fileName: "glow.png"},
		{varName: torchPic, fileName: "torch.png"},
		{varName: beastHealingStatue, fileName: "healing_statue_2.png"},
		{varName: shadowHealingStatue, fileName: "healing_statue_2.png"},
		{varName: cage, fileName: "cage_tileset.png"},
		{varName: ruins, fileName: "ruins_1.png"},
	];
	
	picsToLoad = imageList.length;
	
	for (var i=0; i < imageList.length; i++) {
		loadImage(imageList[i].varName, imageList[i].fileName);
	}
}

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	if(picsToLoad == 0) {
		startGame();
	}
}