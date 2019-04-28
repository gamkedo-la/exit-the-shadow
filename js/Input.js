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

function setUpInput() {
	//canvas.addEventListener('mousemove', updateMousePos);
	
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);
	
	Player.setupInput(KEY_W, KEY_A, KEY_S, KEY_D, KEY_SPACE, KEY_E, KEY_K, KEY_L);
}

var gamePaused = false;

function keySet(evt, player, isPressed) {
  	if (isPressed && evt.keyCode == KEY_P) {
  		gamePaused = !gamePaused;
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
	
	evt.preventDefault();
}

function keyPressed(evt) {	
	keySet(evt, Player, true);
	var helpScreenKey = KEY_H;
	
	if (evt.keyCode == helpScreenKey) {
		if (helpScreen) {
			mainGameState = true;
			gamePaused = false;
			helpScreen = false;
		} else {
			mainGameState = false;
			helpScreen = true;
		}
	}
}

function keyReleased(evt) {
	keySet(evt, Player, false);
}

