const TILE_PATH = 0;
const TILE_OBSTACLE_BOX = 1;
const TILE_OBSTACLE_LEFT_UP_DIAG = 2;
const TILE_OBSTACLE_RIGHT_UP_DIAG = 3;
const TILE_OBSTACLE_LEFT_DOWN_DIAG = 4;
const TILE_OBSTACLE_RIGHT_DOWN_DIAG = 5;

var TILE_COLLISION_DATA = [
// 0	
TILE_PATH_COLLISION_DATA = {
	leftWallCollider: false, rightWallCollider: false,
	topWallCollider: false, bottomWallCollider: false,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: 0, y: 0},
	bottomLeftVertex: {x: 0, y: 0}, bottomRightVertex: {x: 0, y: 0}		
},	

// 1
TILE_OBSTACLE_BOX_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}		
},	

// 2
TILE_OBSTACLE_LEFT_UP_DIAG_COLLISION_DATA = {
	leftWallCollider: false, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: TILE_H}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}		
},	

// 3
TILE_OBSTACLE_RIGHT_UP_DIAG_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: false,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: TILE_H},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}		
},	

// 4
TILE_OBSTACLE_LEFT_DOWN_DIAG_COLLISION_DATA = {
	leftWallCollider: false, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: TILE_W, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: 0}, bottomRightVertex: {x: TILE_W, y: TILE_H}		
},	

// 5
TILE_OBSTACLE_RIGHT_DOWN_DIAG_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: false,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: TILE_W, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: 0}		
},							
								  
];