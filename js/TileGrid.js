const TILE_W = 32;
const TILE_H = 32;
const TILE_ROWS = 30;
const TILE_COLS = 40;

var tileGrid = [];
var levelOne = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 5, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 5, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 5, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 3, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 5, 0, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,-2, 0, 0,-1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 3, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

// key:
const PLAYER = -1;
const TEST_ENEMY = -2 /*
const TILE_PATH = 0;
const TILE_OBSTACLE_BOX = 1;
const TILE_OBSTACLE_LEFT_UP_DIAG = 2;
const TILE_OBSTACLE_RIGHT_UP_DIAG = 3;
const TILE_OBSTACLE_LEFT_DOWN_DIAG = 4;
const TILE_OBSTACLE_RIGHT_DOWN_DIAG = 5;
*/

function colRowToArrayIndex(col, row) {
	return col + (TILE_COLS * row);
}

function tileTypeAtColRow(col, row) {
	if (col >= 0 && col < TILE_COLS &&
		row >= 0 && row < TILE_ROWS) {
			
		var arrayIndex = colRowToArrayIndex(col, row);
		return tileGrid[arrayIndex];
	}
	else {
		return TILE_OBSTACLE_BOX;
	}
}

function loadLevel(level) {
	tileGrid = level.slice();
}

function initialiseEntityPositions() {
	var tileType;
	var row, col;
	for (row = 0; row < TILE_ROWS; row++) {
		for (col = 0; col < TILE_COLS; col++) {
			tileType = tileTypeAtColRow(col, row);
			switch(tileType) {
			case PLAYER:
				Player.initialisePosition(col*TILE_W, row*TILE_H);
				moveCamToPlayer();
				var arrayIndex = colRowToArrayIndex(col, row);
				tileGrid[arrayIndex] = 0;
				break;
			case TEST_ENEMY:
				TestEnemy.initialisePosition(col*TILE_W, row*TILE_H);
				var arrayIndex = colRowToArrayIndex(col, row);
				tileGrid[arrayIndex] = 0;
			}
		}
	}
}

function drawTiles() {
	canvasContext.save();
	canvasContext.translate(-camPanX, -camPanY);
	
	drawTilesOnScreen();
	
	canvasContext.restore();
}

function drawTilesOnScreen() {
	var camLeftMostCol = Math.floor(camPanX / TILE_W);
	var camTopMostRow = Math.floor(camPanY / TILE_H);
	
	var colsThatFitOnScreen = Math.floor(canvas.width / TILE_W);
	var rowsThatFitOnScreen = Math.floor(canvas.height / TILE_H);
	
	var camRightMostCol = camLeftMostCol + colsThatFitOnScreen + 2;
	var camBottomMostRow = camTopMostRow + rowsThatFitOnScreen + 2;
	
	var tileType;
	var row, col;
	for (row = camTopMostRow; row < camBottomMostRow; row++) {
		for (col = camLeftMostCol; col < camRightMostCol; col++) {
			tileType = tileTypeAtColRow(col, row);
			switch(tileType) {
			case TILE_PATH:
				colorRect(col*TILE_W,row*TILE_H, TILE_W, TILE_H, 'white');
				break
			case TILE_OBSTACLE_BOX:
				colorRect(col*TILE_W,row*TILE_H, TILE_W, TILE_H, 'black');
				break;
			case TILE_OBSTACLE_LEFT_UP_DIAG:
				colorTriangle((col+1)*TILE_W,row*TILE_H, (col+1)*TILE_W,(row+1)*TILE_H, col*TILE_W,(row+1)*TILE_H, 'black');
				break;
			case TILE_OBSTACLE_RIGHT_UP_DIAG:
				colorTriangle(col*TILE_W,row*TILE_H, (col+1)*TILE_W,(row+1)*TILE_H, col*TILE_W,(row+1)*TILE_H, 'black');
				break;
			case TILE_OBSTACLE_LEFT_DOWN_DIAG:
				colorTriangle(col*TILE_W,row*TILE_H, (col+1)*TILE_W,row*TILE_H, (col+1)*TILE_W,(row+1)*TILE_H, 'black');
				break;
			case TILE_OBSTACLE_RIGHT_DOWN_DIAG:
				colorTriangle(col*TILE_W,row*TILE_H, (col+1)*TILE_W,row*TILE_H, col*TILE_W,(row+1)*TILE_H, 'black');
				break;
			}
		}
	}
}