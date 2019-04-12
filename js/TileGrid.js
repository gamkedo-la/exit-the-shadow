const TILE_W = 32;
const TILE_H = 32;
const TILE_ROWS = 40;
const TILE_COLS = 40;

var tileGrid = [];
var floorTiles = [0, 5, 6, 3, 6, 4, 0, 6, 0, 5, 8, 8, 8, 6, 6, 1, 5, 8, 2, 8, 6, 1, 4, 6, 7, 3, 4, 2, 6, 0, 3, 6, 7, 7, 4, 3, 8, 4, 5, 4, 
				3, 1, 0, 0, 4, 7, 2, 2, 7, 2, 3, 7, 1, 4, 5, 3, 4, 0, 2, 5, 7, 8, 0, 8, 7, 7, 0, 3, 7, 7, 4, 6, 3, 0, 6, 3, 3, 1, 4, 4, 
				2, 1, 0, 6, 4, 2, 0, 5, 7, 2, 0, 8, 4, 7, 6, 8, 0, 6, 8, 5, 8, 1, 7, 4, 7, 2, 4, 2, 8, 1, 4, 0, 7, 2, 4, 1, 6, 0, 8, 7, 
				4, 6, 7, 1, 3, 7, 2, 5, 8, 2, 2, 4, 7, 8, 5, 1, 8, 0, 8, 7, 5, 4, 5, 2, 2, 4, 6, 6, 3, 3, 4, 7, 7, 8, 4, 1, 6, 6, 0, 5, 
				5, 8, 7, 7, 2, 3, 8, 2, 2, 4, 3, 1, 5, 8, 4, 0, 6, 3, 0, 2, 5, 4, 7, 8, 8, 8, 1, 8, 4, 7, 2, 2, 1, 0, 1, 3, 7, 4, 8, 2, 
				1, 3, 3, 8, 2, 3, 0, 1, 8, 3, 0, 3, 0, 0, 1, 0, 4, 0, 4, 3, 8, 5, 1, 4, 0, 8, 7, 7, 6, 2, 2, 5, 4, 7, 4, 5, 7, 3, 3, 6, 
				6, 0, 7, 8, 1, 5, 5, 4, 5, 8, 3, 8, 7, 6, 4, 0, 0, 7, 1, 4, 6, 8, 6, 0, 5, 0, 6, 1, 2, 1, 8, 8, 1, 8, 2, 4, 6, 6, 5, 4, 
				0, 1, 3, 1, 5, 2, 7, 6, 4, 7, 0, 5, 4, 2, 7, 2, 1, 7, 6, 6, 6, 3, 2, 4, 8, 5, 7, 0, 6, 4, 0, 4, 1, 2, 6, 3, 7, 7, 4, 5, 
				0, 0, 7, 0, 3, 3, 6, 7, 6, 0, 2, 7, 0, 3, 4, 2, 0, 0, 0, 7, 6, 8, 7, 4, 1, 4, 7, 3, 2, 1, 4, 6, 1, 0, 3, 0, 3, 5, 7, 1, 
				2, 2, 8, 7, 2, 8, 8, 4, 4, 4, 1, 3, 3, 4, 8, 3, 7, 8, 0, 7, 3, 0, 4, 2, 2, 8, 5, 2, 2, 1, 4, 6, 6, 3, 1, 0, 5, 4, 0, 0, 
				7, 1, 1, 2, 5, 0, 3, 7, 1, 1, 8, 7, 0, 8, 2, 3, 0, 1, 0, 4, 0, 7, 2, 8, 6, 7, 3, 2, 0, 7, 5, 2, 5, 7, 8, 2, 8, 1, 5, 3, 
				4, 4, 8, 6, 7, 2, 5, 6, 7, 6, 7, 1, 0, 8, 8, 7, 4, 7, 7, 6, 6, 4, 8, 7, 5, 8, 2, 3, 8, 7, 5, 7, 6, 2, 8, 3, 3, 2, 3, 3, 
				5, 8, 6, 3, 6, 2, 3, 5, 5, 0, 7, 0, 2, 8, 0, 0, 1, 4, 2, 1, 3, 8, 6, 0, 7, 0, 7, 3, 5, 6, 5, 5, 8, 3, 2, 2, 1, 3, 2, 6, 
				5, 5, 4, 1, 4, 6, 8, 6, 0, 8, 3, 2, 1, 1, 2, 8, 5, 0, 5, 3, 6, 3, 2, 8, 0, 6, 4, 0, 0, 4, 3, 6, 7, 4, 8, 6, 0, 0, 5, 5, 
				3, 0, 3, 0, 1, 6, 8, 0, 8, 5, 1, 8, 2, 2, 8, 3, 8, 0, 6, 6, 3, 1, 7, 8, 6, 4, 7, 3, 5, 0, 8, 6, 4, 4, 7, 4, 2, 6, 1, 7, 
				4, 4, 5, 5, 6, 5, 1, 4, 6, 5, 6, 7, 1, 5, 2, 0, 5, 4, 1, 3, 7, 5, 6, 4, 6, 8, 4, 7, 5, 6, 3, 3, 1, 6, 8, 5, 3, 7, 2, 6, 
				5, 4, 6, 1, 6, 4, 7, 4, 4, 0, 1, 3, 5, 7, 6, 4, 1, 2, 6, 2, 7, 2, 7, 3, 4, 0, 2, 3, 5, 1, 1, 2, 8, 0, 5, 0, 0, 3, 5, 6, 
				4, 1, 4, 3, 2, 8, 7, 3, 6, 3, 7, 5, 7, 2, 8, 3, 5, 2, 0, 1, 3, 8, 2, 8, 2, 6, 4, 8, 4, 6, 4, 5, 6, 7, 7, 5, 8, 0, 5, 0, 
				4, 5, 5, 6, 3, 5, 6, 0, 4, 3, 2, 2, 8, 7, 0, 2, 1, 7, 2, 2, 1, 7, 0, 4, 1, 8, 7, 1, 5, 0, 6, 3, 3, 5, 7, 0, 5, 1, 1, 4, 
				6, 4, 7, 6, 4, 6, 6, 3, 3, 6, 2, 7, 1, 0, 7, 5, 2, 8, 4, 5, 3, 1, 0, 0, 6, 8, 2, 7, 4, 5, 2, 4, 0, 5, 6, 4, 2, 7, 3, 0, 
				8, 2, 6, 0, 3, 5, 8, 3, 0, 2, 3, 5, 3, 2, 8, 7, 7, 1, 1, 4, 2, 2, 3, 7, 3, 3, 7, 4, 5, 4, 8, 1, 7, 4, 1, 1, 0, 0, 7, 8, 
				4, 3, 0, 2, 8, 0, 7, 2, 2, 8, 2, 7, 8, 0, 8, 1, 8, 6, 0, 2, 7, 4, 7, 5, 3, 7, 1, 1, 7, 3, 1, 3, 6, 1, 2, 8, 6, 1, 6, 2, 
				8, 7, 8, 3, 5, 2, 8, 3, 2, 7, 0, 7, 6, 2, 3, 6, 1, 7, 8, 1, 3, 4, 6, 4, 2, 0, 8, 7, 3, 7, 0, 5, 5, 3, 2, 2, 8, 4, 8, 5, 
				5, 7, 3, 5, 3, 3, 5, 6, 5, 5, 1, 2, 6, 3, 4, 3, 6, 0, 6, 3, 7, 2, 5, 8, 1, 3, 8, 1, 4, 2, 7, 5, 6, 7, 6, 1, 6, 1, 0, 1, 
				7, 4, 1, 4, 4, 4, 1, 7, 1, 1, 0, 8, 0, 3, 4, 5, 5, 2, 2, 1, 8, 8, 7, 0, 8, 0, 0, 0, 2, 0, 2, 5, 5, 3, 6, 6, 3, 3, 2, 3, 
				3, 7, 6, 6, 4, 4, 6, 5, 8, 1, 8, 6, 5, 2, 4, 5, 7, 1, 4, 2, 4, 2, 4, 5, 5, 6, 5, 1, 8, 3, 3, 7, 6, 5, 1, 8, 1, 5, 3, 4, 
				1, 7, 5, 8, 2, 3, 2, 5, 2, 8, 0, 3, 4, 7, 8, 7, 5, 2, 2, 0, 1, 1, 0, 0, 7, 0, 5, 8, 8, 4, 1, 6, 8, 7, 1, 4, 0, 2, 7, 2, 
				8, 6, 7, 6, 1, 2, 4, 0, 8, 6, 3, 5, 8, 8, 1, 8, 7, 3, 6, 3, 2, 2, 1, 4, 1, 6, 0, 8, 6, 1, 1, 4, 1, 5, 1, 8, 7, 7, 5, 4, 
				1, 4, 2, 7, 1, 1, 0, 6, 8, 4, 0, 1, 7, 1, 3, 3, 8, 2, 6, 4, 0, 4, 4, 3, 1, 5, 8, 8, 2, 7, 4, 6, 3, 6, 2, 5, 1, 0, 8, 1, 
				6, 4, 1, 6, 8, 7, 7, 4, 5, 7, 4, 6, 3, 2, 6, 0, 4, 6, 3, 7, 0, 1, 6, 8, 7, 1, 7, 6, 2, 4, 4, 2, 4, 4, 8, 4, 1, 4, 2, 7, 
				1, 6, 3, 1, 6, 4, 7, 7, 2, 5, 4, 6, 0, 8, 3, 3, 3, 5, 1, 8, 4, 4, 5, 1, 6, 4, 6, 6, 6, 5, 2, 2, 6, 3, 8, 1, 8, 1, 5, 4, 
				7, 3, 8, 5, 0, 0, 3, 4, 4, 3, 3, 8, 7, 8, 4, 6, 2, 6, 6, 0, 0, 7, 4, 3, 2, 1, 6, 0, 5, 3, 3, 8, 8, 6, 5, 8, 1, 8, 8, 5, 
				2, 7, 3, 5, 8, 0, 1, 5, 8, 8, 0, 7, 4, 0, 4, 5, 7, 8, 6, 2, 5, 7, 7, 8, 0, 2, 8, 6, 4, 8, 4, 2, 3, 7, 5, 2, 5, 2, 8, 4, 
				0, 3, 7, 5, 3, 0, 4, 0, 4, 8, 2, 7, 6, 2, 8, 0, 5, 0, 1, 5, 3, 6, 8, 6, 5, 4, 8, 7, 5, 1, 5, 7, 3, 7, 2, 2, 8, 8, 6, 2, 
				7, 4, 4, 2, 8, 2, 0, 5, 0, 4, 3, 6, 4, 0, 5, 6, 7, 8, 6, 2, 8, 2, 4, 1, 1, 7, 8, 4, 7, 3, 0, 2, 1, 5, 0, 6, 6, 4, 4, 6, 
				6, 2, 8, 7, 5, 3, 6, 4, 4, 8, 5, 1, 1, 0, 2, 5, 1, 8, 5, 4, 2, 4, 2, 0, 0, 0, 1, 4, 0, 0, 2, 2, 1, 7, 0, 2, 4, 1, 8, 8, 
				3, 8, 3, 0, 2, 0, 2, 7, 2, 8, 1, 0, 2, 7, 3, 2, 8, 6, 7, 1, 4, 4, 4, 3, 8, 5, 3, 0, 3, 8, 7, 4, 7, 3, 2, 2, 7, 8, 7, 4, 
				7, 0, 0, 3, 6, 0, 8, 1, 2, 3, 8, 2, 4, 7, 7, 5, 5, 2, 1, 5, 4, 2, 7, 3, 2, 4, 7, 0, 2, 7, 3, 8, 7, 0, 4, 8, 0, 7, 0, 3, 
				7, 0, 3, 7, 3, 1, 7, 3, 3, 2, 7, 5, 4, 7, 4, 2, 3, 6, 7, 4, 1, 1, 1, 2, 0, 2, 4, 1, 2, 0, 6, 3, 0, 1, 8, 0, 8, 2, 0, 5, 
				1, 5, 4, 0, 7, 4, 3, 6, 5, 4, 5, 3, 5, 0, 5, 6, 7, 4, 2, 0, 5, 8, 7, 1, 3, 0, 7, 7, 2, 8, 0, 0, 4, 3, 1, 6, 3, 4, 1, 2];

var levelOne = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-2, 0, 0, 0, 0, 0,-2, 0, 0, 0, 0, 0, 0,-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 
				1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
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
	var enemyNumber = 0;

	var tileType;
	var row, col;
	for (row = 0; row < TILE_ROWS; row++) {
		for (col = 0; col < TILE_COLS; col++) {
			tileType = tileTypeAtColRow(col, row);
			switch(tileType) {
			case PLAYER:
				Player.initialisePosition(col*TILE_W + (TILE_W/2), row*TILE_H + (TILE_H/2));
				moveCamToPlayer();
				var arrayIndex = colRowToArrayIndex(col, row);
				tileGrid[arrayIndex] = 0;
				break;
			case TEST_ENEMY:
				let enemy = new TestEnemyClass(enemyNumber++);
				enemy.initialisePosition(col*TILE_W + (TILE_W/2), row*TILE_H + (TILE_H/2));
				Entities.push(enemy);
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

	var floorType;
	var floorRow, floorCol;
	for(floorRow = camTopMostRow; floorRow < camBottomMostRow; floorRow++) {
		for(floorCol = camLeftMostCol; floorCol < camRightMostCol; floorCol++) {
			floorType = tileTypeAtColRow(floorCol, floorRow);
			switch(floorType) {
				//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
				case 0:
					canvasContext.drawImage(floorTileset, 0, 0, TILE_W, TILE_H, floorCol*TILE_W, floorRow*TILE_H, TILE_W, TILE_H);
					break;
				case 1:
					canvasContext.drawImage(floorTileset, TILE_W, 0, TILE_W, TILE_H, floorCol*TILE_W, floorRow*TILE_H, TILE_W, TILE_H);
					break;
				case 2:
					canvasContext.drawImage(floorTileset, 2 * TILE_W, 0, TILE_W, TILE_H, floorCol*TILE_W, floorRow*TILE_H, TILE_W, TILE_H);
					break;
				case 3:
					canvasContext.drawImage(floorTileset, 0, TILE_H, TILE_W, TILE_H, floorCol*TILE_W, floorRow*TILE_H, TILE_W, TILE_H);
					break;
				case 4:
					canvasContext.drawImage(floorTileset, TILE_W, TILE_H, TILE_W, TILE_H, floorCol*TILE_W, floorRow*TILE_H, TILE_W, TILE_H);
					break;
				case 5:
					canvasContext.drawImage(floorTileset, 2 * TILE_W, TILE_H, TILE_W, TILE_H, floorCol*TILE_W, floorRow*TILE_H, TILE_W, TILE_H);
					break;
				case 6:
					canvasContext.drawImage(floorTileset, 0, 2 * TILE_H, TILE_W, TILE_H, floorCol*TILE_W, floorRow*TILE_H, TILE_W, TILE_H);
					break;
				case 7:
					canvasContext.drawImage(floorTileset, TILE_W, 2 * TILE_H, TILE_W, TILE_H, floorCol*TILE_W, floorRow*TILE_H, TILE_W, TILE_H);
					break;
				case 8:
					canvasContext.drawImage(floorTileset, 2 * TILE_W, 2 * TILE_H, TILE_W, TILE_H, floorCol*TILE_W, floorRow*TILE_H, TILE_W, TILE_H);
					break;
			}
		}
	}
	
	var tileType;
	var row, col;
	for (row = camTopMostRow; row < camBottomMostRow; row++) {
		for (col = camLeftMostCol; col < camRightMostCol; col++) {
			tileType = tileTypeAtColRow(col, row);
			switch(tileType) {
//			case TILE_PATH:
//				colorRect(col*TILE_W,row*TILE_H, TILE_W, TILE_H, 'white');
//				break
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