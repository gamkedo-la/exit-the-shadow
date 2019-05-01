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
const OBSTACLE_BUT_NO_DRAW = 64;

function collisionPointsForTileType(type) {
	switch(type) {
		case TILE_PATH://0
		case PLATFORM_5://41
		case PLATFORM_12://48
		case PLATFORM_13://49
		case PLATFORM_14://50
		case PLATFORM_15://51
		case PLATFORM_16://52
		case PLATFORM_17://53
			return [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];
		case TILE_OBSTACLE_BOX://1
		case TILE_WALL_RIGHT_EDGE://7
		case TILE_WALL_LEFT_EDGE://10
		case TILE_WALL_FRONT_1://11
		case TILE_WALL_BOT_LEFT_LINER://12
		case TILE_WALL_ROOF://13
		case TILE_WALL_FRONT_2://15
		case TILE_WALL_FRONT_3://16
		case TILE_WALL_FRONT_4://17
		case TILE_WALL_FRONT_5://18
		case TILE_WALL_FRONT_6://19
		case TILE_WALL_FRONT_7://20
		case TILE_WALL_FRONT_8://21
		case TILE_WALL_FRONT_9://22
		case TILE_WALL_LEFT_BOT_LINER://24
		case LEFT_VERTICAL_TRANSITION://27
		case RIGHT_VERTICAL_TRANSITION://28
		case VERTICAL_TO_DIAG_RIGHT://29
		case VERTICAL_TO_DIAG_LEFT://30
		case VERTICAL_TO_RIGHT://31
		case VERTICAL_TO_LEFT://32
		case HORZ_TO_VERT_LEFT_SKULL://33
		case HORZ_TO_VERT_RIGHT_SKULL://34
		case HORZ_TO_VERT_LEFT://35
		case HORZ_TO_VERT_RIGHT://36
		case OBSTACLE_BUT_NO_DRAW://64
			return [{x: 0, y: 0}, {x: 0, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: 0}];
		case TILE_OBSTACLE_LEFT_UP_DIAG://2
			return [{x: TILE_W / 3, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: TILE_H / 2}];
		case TILE_OBSTACLE_RIGHT_UP_DIAG://3
			return [{x: 0, y: TILE_H/2}, {x: 0, y: TILE_H}, {x: 2 * TILE_W / 3, y: TILE_H}];
		case TILE_OBSTACLE_LEFT_DOWN_DIAG://4
		case TILE_OBSTACLE_BOT_LEFT_DOWN_DIAG://9
			return [{x: TILE_W, y: 0}, {x: 0, y: 0}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: 0}];
		case TILE_OBSTACLE_RIGHT_DOWN_DIAG://5
		case TILE_WALL_BOT_RIGHT_DIAG://8
			return [{x: TILE_W, y: 0}, {x: 0, y: TILE_H}, {x: TILE_W, y: 0}, {x: TILE_W, y: 0}];
		case TILE_WALL_TOP://6
		case TILE_WALL_TOP_RIGHT_LINER://14
		case TILE_WALL_LEFT_TOP_LINER://23
		case PLATFORM_1://37
		case PLATFORM_2://38
		case PLATFORM_3://39
		case PLATFORM_7://43
		case PLATFORM_8://44
			return [{x: 0, y: TILE_H/2}, {x: 0, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: TILE_H/2}];
		case UPPER_RIGHT_CORNER://25
			return [{x: 0, y: 0}, {x: 0, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: TILE_H/2}, {x: 2 * TILE_W / 3, y:0}];
		case UPPER_LEFT_CORNER://26
			return [{x: 0, y: TILE_H / 2}, {x: 0, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: 0}, {x: TILE_W / 3, y:0}];
		case PLATFORM_4://40
		case PLATFORM_11://47
			return [{x: 0, y: 0}, {x: 0, y: TILE_H}, {x: 6, y: TILE_H}, {x: 6, y: 0}];
		case PLATFORM_6://42
			return [{x: TILE_W - 13, y: 0}, {x: TILE_W - 13, y: TILE_H - 11}, {x: TILE_W, y: TILE_H - 11}, {x: TILE_W, y: 0}];
		case PLATFORM_9://45
			return [{x: 0, y: 0}, {x: 0, y: TILE_H - 11}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: TILE_H / 2}];
		case PLATFORM_10://46
			return [{x: 0, y: TILE_H - 12}, {x: 0, y: TILE_H}, {x: 13, y: TILE_H}, {x: 13, y: TILE_H}];
		case PLATFORM_13://49
			return [{x: TILE_W - 13, y: TILE_H - 16}, {x: TILE_W - 13, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: TILE_H - 16}];
		case PLATFORM_14://50
		case PLATFORM_15://51
			return [{x: 0, y: TILE_H - 16}, {x: 0, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: TILE_H - 16}];
		case PLATFORM_16://52
			return [{x: 0, y: TILE_H - 16}, {x: 0, y: TILE_H}, {x: TILE_W - 3, y: TILE_H}, {x: TILE_W, y: TILE_H}];
		case PLATFORM_17://53
			return [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];
//			return [{x: 0, y: 0}, {x: 0, y: 0}, {x: TILE_W - 11, y: 18}, {x: TILE_W - 11, y: 6}];
		case PLATFORM_18://54
			return [{x: 0, y: 0}, {x: 0, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: 8}];
		case PLATFORM_19://55
			return [{x: 0, y: 8}, {x: 0, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: 8}];
		case PLATFORM_20://56
			return [{x: 0, y: 8}, {x: 0, y: TILE_H}, {x: TILE_W - 6, y: TILE_H - 4}, {x: TILE_W, y: 0}];
		case PLATFORM_21://57
		case PLATFORM_22://58
			return [{x: 0, y: 0}, {x: 0, y: TILE_H - 4}, {x: TILE_W, y: TILE_H - 4}, {x: TILE_W, y: 0}];
		case PLATFORM_23://59
			return [{x: 0, y: 0}, {x: 0, y: TILE_H - 4}, {x: TILE_W, y: TILE_H - 4}, {x: TILE_W - 4, y: 0}];
		case PLATFORM_24://60
			return [{x: 0, y: 6}, {x: 0, y: TILE_H - 4}, {x: TILE_W - 10, y: TILE_H - 4}, {x: TILE_W - 10, y: TILE_H - 12}];
		case PLATFORM_25://61
		case PLATFORM_26://62
			return [{x: 0, y: 0}, {x: 0, y: TILE_H - 12}, {x: TILE_W, y: TILE_H - 12}, {x: TILE_W, y: 0}];
		case PLATFORM_27://63
			return [{x: 0, y: 0}, {x: 0, y: TILE_H - 12}, {x: TILE_W - 6, y: TILE_H - 12}, {x: TILE_W - 6, y: 0}];
		default://shouldn't get here
			return [{x: 0, y: 0}, {x: 0, y: TILE_H}, {x: TILE_W, y: TILE_H}, {x: TILE_W, y: 0}];
	}
}