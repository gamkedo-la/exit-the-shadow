var playerSheet = document.createElement("img");
var beastSheet = document.createElement("img");
var shadowSheet = document.createElement("img");
var evilPlayerSheet = document.createElement("img");
var platform = document.createElement("img");
var playerConcept = document.createElement("img");
var playerLifeIcon = document.createElement("img");
var floorTileset = document.createElement("img");
var wallsTileset = document.createElement("img");
var trailImage = document.createElement("img");

picsToLoad = 0;

function loadImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "images/"+fileName;
}

function loadImages() {
	var imageList = [
		{varName: playerSheet, fileName: "player_sheet_underprogress.png"},
		{varName: beastSheet, fileName: "BeastSpriteSheet.png"},
		{varName: shadowSheet, fileName: "ShadowSpriteSheet.png"},
		{varName: evilPlayerSheet, fileName: "EvilPlayerSheet.png"},
		{varName: platform, fileName: "platform.png"},
		{varName: playerConcept, fileName: "player.png"},
		{varName: playerLifeIcon, fileName: "life_placeholder.png"},
		{varName: floorTileset, fileName: "floor_tiles.png"},
		{varName: wallsTileset, fileName: "walls_tileset.png"},
		{varName: trailImage, fileName: "trail.png"}
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