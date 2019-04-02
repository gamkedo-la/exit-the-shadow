var camPanX = 100;
var camPanY = 100;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAM_PAN_X = 20;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAM_PAN_Y = 10;

function moveCamToPlayer() {
	camPanX = Player.x + Player.width/2 - canvas.width/2;
	camPanY = Player.y + Player.height/2 - canvas.height/2;
	enforceCamBoundaries();
}

function cameraFollow() {
	var camCenterX = camPanX + canvas.width/2;
	var camCenterY = camPanY + canvas.height/2;
	
	var playerDistFromCamCenterX = Math.abs(Player.x - camCenterX);
	var playerDistFromCamCenterY = Math.abs(Player.y - camCenterY);
	
	if (playerDistFromCamCenterX > PLAYER_DIST_FROM_CENTER_BEFORE_CAM_PAN_X) {
		if (camCenterX < Player.x) {
			camPanX += Player.currentSpeedX;
		}
		else {
			camPanX -= Player.currentSpeedX;
		}
	}
	if (playerDistFromCamCenterY > PLAYER_DIST_FROM_CENTER_BEFORE_CAM_PAN_Y) {
		if (camCenterY < Player.y) {
			camPanY += Player.currentSpeedY;
		}
		else {
			camPanY -= Player.currentSpeedY;
		}
	}
	enforceCamBoundaries();
}

function enforceCamBoundaries() {
	var maxPanRight = canvas.width; //- TILE_COLS * TILE_W
	var maxPanBottom = canvas.height; //- TILE_ROWS * TILE_H
	if (camPanX < 0) {
		camPanX = 0;
	}
	else if(camPanX > maxPanRight) {
		camPanX = maxPanRight;
	}
	if (camPanY < 0) {
		camPanY = 0;
	}
	else if (camPanY > maxPanBottom) {
		camPanY = maxPanBottom
	}
}

function camWobble() {
	console.log("camera to wobble");
}