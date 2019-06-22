const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_SPACE = 32; // DASH
const KEY_E = 69; // INTERACT
const KEY_K = 75; // ATTACK
const KEY_L = 76; // SHIELD
const KEY_P = 80; // PAUSE
const KEY_H = 72; // HELP SCREEN KEY
const KEY_Q = 81; // QUIT KEY
const KEY_ENTER = 13;

const LOG_MOUSE_CLICKS = false; // debug or level editing only

function debugOnClick(e) { 
	// used for easy level editing
	// click many locations for a list of x,y

	if (!window.debugClickLocations) { //first click ignored (menu)
		window.debugClickLocations = "// CLICK LOG:\n";
		return;
	}
	
	var spritex = (mouseX+camPanX-12);
	var spritey = (mouseY+camPanY-12);
	
	// clickspam level editor for overlays
	window.debugClickLocations += "{x:"+spritex+", y:"+spritey+", imgName: 'debris9'},\n";

	// show live while playing
	GroundArt.push({x:spritex, y:spritey, imgName: 'debris9'});

}

function setUpInput() {
	canvas.addEventListener('mousemove', displayMousePos);
	canvas.addEventListener('mousedown', Menu.changeMenuStateOnClick);
	
	if (LOG_MOUSE_CLICKS)
		canvas.addEventListener('mousedown', debugOnClick);
	
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);
	
	Player.setupInput(KEY_W, KEY_A, KEY_S, KEY_D, KEY_SPACE, KEY_E, KEY_K, KEY_L);
}

var gamePaused = false;

function keySet(evt, player, isPressed) {
	if(!gameIsStarted) {
		if ((!isPressed && evt.keyCode == KEY_ENTER) || (!isPressed && evt.keyCode == KEY_SPACE)) {
			Menu.changeMenuStateOnClick();
		} else if(!isPressed && evt.keyCode == KEY_S) {
			Menu.setCursorIndex(Menu.cursor1 + 1);
		} else if(!isPressed && evt.keyCode == KEY_W) {
			Menu.setCursorIndex(Menu.cursor1 - 1);
		}
	}
	if (isPressed && evt.keyCode == KEY_P) {
  		gamePaused = !gamePaused;
  	}
  	if (isPressed && evt.keyCode == KEY_Q && gamePaused) {
		quitToMenu();
  	}
	if (evt.keyCode == player.controlKeyLeft) {
		player.keyHeld_Left = isPressed;
	}
	if (evt.keyCode == player.controlKeyRight) {
		player.keyHeld_Right = isPressed;
	}
	if (evt.keyCode == player.controlKeyUp) {
		player.keyHeld_Up = isPressed;
	}
	if (evt.keyCode == player.controlKeyDown) {
		player.keyHeld_Down = isPressed;
	}
	if (evt.keyCode == player.controlKeyDash) {
		player.keyHeld_Dash = isPressed;
	}
	if (evt.keyCode == player.controlKeyInteract) {
		player.keyHeld_Interact = isPressed;
	}
	if (evt.keyCode == player.controlKeyAttack) {
		player.keyHeld_Attack = isPressed;
	}
	if (evt.keyCode == player.controlKeyShield) {
		player.keyHeld_Shield = isPressed;
	}
	
	if (debugSaveLoadFromAnywhere) {
		// SAVE/LOAD DEBUG
		if(evt.keyCode == 66){ // b = save
			saveGame();
		}
		if(evt.keyCode == 78) { // n = load
			loadGame();
		}
	}

	evt.preventDefault();
}

function keyPressed(evt) {
	keySet(evt, Player, true);
	var helpScreenKey = KEY_H;
	
	if (helpScreen) {
		if ((evt.keyCode == helpScreenKey) || (evt.keyCode == KEY_ENTER) ||
		(evt.keyCode == KEY_E) || (evt.keyCode == KEY_SPACE)) {
			exitHelpScreen();
		}
	} else {
		if(evt.keyCode == helpScreenKey) {
			loadHelpScreen();
		}
	}
}

function keyReleased(evt) {
	keySet(evt, Player, false);
}