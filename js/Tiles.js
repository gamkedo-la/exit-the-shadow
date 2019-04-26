const TILE_PATH = 0;
const TILE_OBSTACLE_BOX = 1; 
const TILE_OBSTACLE_LEFT_UP_DIAG = 2;
const TILE_OBSTACLE_RIGHT_UP_DIAG = 3;
const TILE_OBSTACLE_LEFT_DOWN_DIAG = 4;
const TILE_OBSTACLE_RIGHT_DOWN_DIAG = 5;
const TILE_WALL_TOP = 6;
const TILE_WALL_RIGHT_EDGE = 7;
const TILE_WALL_BOT_RIGHT_DIAG = 8;
const TILE_OBSTACLE_BOT_LEFT_DOWN_DIAG = 9;
const TILE_WALL_LEFT_EDGE = 10;
const TILE_WALL_FRONT_1 = 11;
const TILE_WALL_BOT_LEFT_LINER = 12;
const TILE_WALL_ROOF = 13;
const TILE_WALL_TOP_RIGHT_LINER = 14;
const TILE_WALL_FRONT_2 = 15;
const TILE_WALL_FRONT_3 = 16;
const TILE_WALL_FRONT_4 = 17;
const TILE_WALL_FRONT_5 = 18;
const TILE_WALL_FRONT_6 = 19;
const TILE_WALL_FRONT_7 = 20;
const TILE_WALL_FRONT_8 = 21;
const TILE_WALL_FRONT_9 = 22;
const TILE_WALL_LEFT_TOP_LINER = 23;
const TILE_WALL_LEFT_BOT_LINER = 24;
const UPPER_RIGHT_CORNER = 25;
const UPPER_LEFT_CORNER = 26;
const LEFT_VERTICAL_TRANSITION = 27;
const RIGHT_VERTICAL_TRANSITION = 28;
const VERTICAL_TO_DIAG_RIGHT = 29;
const VERTICAL_TO_DIAG_LEFT = 30;
const VERTICAL_TO_RIGHT = 31;
const VERTICAL_TO_LEFT = 32;
const HORZ_TO_VERT_LEFT_SKULL = 33;
const HORZ_TO_VERT_RIGHT_SKULL = 34;
const HORZ_TO_VERT_LEFT = 35;
const HORZ_TO_VERT_RIGHT = 36;
const PLATFORM_1 = 37;
const PLATFORM_2 = 38;
const PLATFORM_3 = 39;
const PLATFORM_4 = 40;
const PLATFORM_5 = 41;
const PLATFORM_6 = 42;
const PLATFORM_7 = 43;
const PLATFORM_8 = 44;
const PLATFORM_9 = 45;
const PLATFORM_10 = 46;
const PLATFORM_11 = 47;
const PLATFORM_12 = 48;
const PLATFORM_13 = 49;
const PLATFORM_14 = 50;
const PLATFORM_15 = 51;
const PLATFORM_16 = 52;
const PLATFORM_17 = 53;
const PLATFORM_18 = 54;
const PLATFORM_19 = 55;
const PLATFORM_20 = 56;
const PLATFORM_21 = 57;
const PLATFORM_22 = 58;
const PLATFORM_23 = 59;
const PLATFORM_24 = 60;
const PLATFORM_25 = 61;
const PLATFORM_26 = 62;
const PLATFORM_27 = 63;

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

//6
TILE_WALL_TOP_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: TILE_H/2}, topRightVertex: {x: TILE_W, y: TILE_H/2},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//7
TILE_WALL_RIGHT_EDGE_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//8
TILE_WALL_BOT_RIGHT_DIAG_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: false,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: TILE_W, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: 0}
},
//9
TILE_OBSTACLE_BOT_LEFT_DOWN_DIAG_COLLISION_DATA = {
	leftWallCollider: false, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: TILE_W, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: 0}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//10
TILE_WALL_LEFT_EDGE_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//11
TILE_WALL_FRONT_1_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//12
TILE_WALL_BOT_LEFT_LINER_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//13
TILE_WALL_ROOF_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//14
TILE_WALL_TOP_RIGHT_LINER_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//15
TILE_WALL_FRONT_2_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//16
TILE_WALL_FRONT_3_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//17
TILE_WALL_FRONT_4_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//18
TILE_WALL_FRONT_5_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//19
TILE_WALL_FRONT_6_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//20
TILE_WALL_FRONT_7_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//21
TILE_WALL_FRONT_8_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//22
TILE_WALL_FRONT_9_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//23
TILE_WALL_LEFT_TOP_LINER_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//24
TILE_WALL_LEFT_BOT_LINER_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//25
UPPER_RIGHT_CORNER_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: false,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: TILE_H},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//26
UPPER_LEFT_CORNER_COLLISION_DATA = {
	leftWallCollider: false, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: TILE_H}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//27
LEFT_VERTICAL_TRANSITION_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},
//28
RIGHT_VERTICAL_TRANSITION_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//29
VERTICAL_TO_DIAG_RIGHT_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//30
VERTICAL_TO_DIAG_LEFT_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//31
VERTICAL_TO_RIGHT_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//32
VERTICAL_TO_LEFT_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//33
HORZ_TO_VERT_LEFT_SKULL_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//34
HORZ_TO_VERT_RIGHT_SKULL_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//35
HORZ_TO_VERT_LEFT_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//36
HORZ_TO_VERT_RIGHT_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

//37
PLATFORM_1_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 4}, topRightVertex: {x: TILE_W, y: 4},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

 PLATFORM_2_COLLISION_DATA ={
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 4}, topRightVertex: {x: TILE_W, y: 4},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

 PLATFORM_3_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 4}, topRightVertex: {x: TILE_W - 7, y: 4},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W - 7, y: TILE_H}
},

 PLATFORM_4_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: 6, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: 6, y: TILE_H}
},

 PLATFORM_5_COLLISION_DATA = {
	leftWallCollider: false, rightWallCollider: false,
	topWallCollider: false, bottomWallCollider: false,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: 0, y: 0},
	bottomLeftVertex: {x: 0, y: 0}, bottomRightVertex: {x: 0, y: 0}	
},

 PLATFORM_6_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: TILE_W - 13, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: TILE_W - 13, y: TILE_H - 11}, bottomRightVertex: {x: TILE_W, y: TILE_H - 11}
},

 PLATFORM_7_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H - 11}, bottomRightVertex: {x: TILE_W, y: TILE_H - 11}
},

 PLATFORM_8_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H - 11}, bottomRightVertex: {x: TILE_W, y: TILE_H - 11}
},

 PLATFORM_9_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: false,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: TILE_H / 2},
	bottomLeftVertex: {x: 0, y: TILE_H - 11}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

 PLATFORM_10_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: false,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: TILE_H - 12}, topRightVertex: {x: 13, y: TILE_H},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: 13, y: TILE_H}
},

 PLATFORM_11_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: 6, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: 6, y: TILE_H}
},

 PLATFORM_12_COLLISION_DATA = {
	leftWallCollider: false, rightWallCollider: false,
	topWallCollider: false, bottomWallCollider: false,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: 0, y: 0},
	bottomLeftVertex: {x: 0, y: 0}, bottomRightVertex: {x: 0, y: 0}
},

 PLATFORM_13_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: TILE_W - 13, y: TILE_H - 16}, topRightVertex: {x: TILE_W, y: TILE_H - 16},
	bottomLeftVertex: {x: TILE_W - 13, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

 PLATFORM_14_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: TILE_H - 16}, topRightVertex: {x: TILE_W, y: TILE_H - 16},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

 PLATFORM_15_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: TILE_H - 16}, topRightVertex: {x: TILE_W, y: TILE_H - 16},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

 PLATFORM_16_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: false,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: TILE_H - 16}, topRightVertex: {x: TILE_W, y: TILE_H},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W - 3, y: TILE_H}
},

 PLATFORM_17_COLLISION_DATA = {
	leftWallCollider: false, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W - 11, y: 6},
	bottomLeftVertex: {x: 0, y: 0}, bottomRightVertex: {x: TILE_W - 11, y: 18}
},

 PLATFORM_18_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 8},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

 PLATFORM_19_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 8}, topRightVertex: {x: TILE_W, y: 8},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W, y: TILE_H}
},

 PLATFORM_20_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 8}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H}, bottomRightVertex: {x: TILE_W - 6, y: TILE_H - 4}
},

 PLATFORM_21_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H - 4}, bottomRightVertex: {x: TILE_W, y: TILE_H - 4}
},

 PLATFORM_22_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H - 4}, bottomRightVertex: {x: TILE_W, y: TILE_H - 4}
},

 PLATFORM_23_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W - 4, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H - 4}, bottomRightVertex: {x: TILE_W, y: TILE_H - 4}
},

 PLATFORM_24_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 6}, topRightVertex: {x: TILE_W - 10, y: TILE_H - 12},
	bottomLeftVertex: {x: 0, y: TILE_H - 4}, bottomRightVertex: {x: TILE_W - 10, y: TILE_H - 4}
},

 PLATFORM_25_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H  -12}, bottomRightVertex: {x: TILE_W, y: TILE_H - 12}
},

 PLATFORM_26_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H - 12}, bottomRightVertex: {x: TILE_W, y: TILE_H - 12}
},

 PLATFORM_27_COLLISION_DATA = {
	leftWallCollider: true, rightWallCollider: true,
	topWallCollider: true, bottomWallCollider: true,
	topLeftVertex: {x: 0, y: 0}, topRightVertex: {x: TILE_W - 6, y: 0},
	bottomLeftVertex: {x: 0, y: TILE_H - 12}, bottomRightVertex: {x: TILE_W - 6, y: TILE_H - 12}
},


];