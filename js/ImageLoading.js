var playerSheet = document.createElement("img");

picsToLoad = 0;

function loadImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "images/"+fileName;
}

function loadImages() {
	var imageList = [
		{varName: playerSheet, fileName: "playersheet.png"}
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