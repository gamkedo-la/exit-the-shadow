const DASH_LENGTH = 150;
const DASH_SPEED = 50;
const DASH_COOLDOWN = 5;

// inherit from EntityClass
PlayerClass.prototype = new EntityClass();
PlayerClass.prototype.constructor = PlayerClass;

function PlayerClass() {
	// public
	this.width = 25;
	this.height = 50;
	
	this.collisionBoxHeight = this.width;
	
	this.moveSpeed = 5;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.25},
		dash: {startFrame: 8, endFrame: 9, animationSpeed: 1}
	}
	
	this.AnimatedSprite = new AnimatedSpriteClass(playerSheet, this.width, this.height, this.states);
	
	this.keyHeld_Up = false;
	this.keyHeld_Down = false;
	this.keyHeld_Left = false;
	this.keyHeld_Right = false;
	this.keyHeld_Dash = false;
	
	this.controlKeyUp;
	this.controlKeyLeft;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyDash;
	
	// private
	let isDashing = false;
	let dashIsCoolingDown = false;
	let dashRemaining = DASH_LENGTH/DASH_SPEED;
	let dashCooldown = DASH_COOLDOWN;
	let dashDirection = NO_DIRECTION;
	let diagonalDashSpeed = Math.sqrt((DASH_SPEED*DASH_SPEED) / 2);
	
	this.setupInput = function(upKey, leftKey, downKey, rightKey, dashKey) {
		this.controlKeyUp = upKey;
		this.controlKeyLeft = leftKey;
		this.controlKeyDown = downKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDash = dashKey;
	}
	
	this.move = function () {

		this.movementDirection = [false, false, false, false]; // up, left, down, right
		if (this.keyHeld_Up && !isDashing) {
			this.movementDirection[UP] = true;
		}
		
		if (this.keyHeld_Down && !isDashing) {
			this.movementDirection[DOWN] = true;
		}
		
		if (this.keyHeld_Right && !isDashing) {
			this.movementDirection[RIGHT] = true;
		}

		if (this.keyHeld_Left && !isDashing) {
			this.movementDirection[LEFT] = true;
		}
		
		if (this.keyHeld_Dash && !isDashing && !dashIsCoolingDown
			&& (this.movementDirection[UP] || this.movementDirection[DOWN] || this.movementDirection[RIGHT] || this.movementDirection[LEFT])) {
			isDashing = true;
			dashDirection = this.calculateDashDirection(this.movementDirection);
		}
		
		if (isDashing) {
			dashRemaining--;
			switch(dashDirection) {
			case UP:
				this.nextY -= DASH_SPEED;
				break;
			case LEFT:
				this.nextX -= DASH_SPEED;
				break;
			case DOWN:
				this.nextY += DASH_SPEED;
				break;
			case RIGHT:
				this.nextX += DASH_SPEED;
				break;
			case UP_LEFT:
				this.nextX -= diagonalDashSpeed;
				this.nextY -= diagonalDashSpeed;
				break;
			case DOWN_LEFT:
				this.nextX -= diagonalDashSpeed;
				this.nextY += diagonalDashSpeed;
				break;
			case DOWN_RIGHT:
				this.nextX += diagonalDashSpeed;
				this.nextY += diagonalDashSpeed;
				break;
			case UP_RIGHT:
				this.nextX += diagonalDashSpeed;
				this.nextY -= diagonalDashSpeed;
				break;
			}
			if (dashRemaining <= 0) {
				isDashing = false;
				dashIsCoolingDown = true;
			}
		}
		if (dashIsCoolingDown) {
			dashCooldown--;
			if (dashCooldown <= 0 && !this.keyHeld_Dash) {
				dashIsCoolingDown = false;
				dashCooldown = DASH_COOLDOWN;
				dashRemaining = DASH_LENGTH/DASH_SPEED;
			}
		}

		this.updateState();
		EntityClass.prototype.move.call(this); // call superclass function
		
		cameraFollow();
	}
	
	this.calculateDashDirection = function(movementDirection) {
		if (movementDirection[UP] && movementDirection[LEFT]) {
			return UP_LEFT;
		}
		else if (movementDirection[DOWN] && movementDirection[LEFT]) {
			return DOWN_LEFT;
		}
		else if (movementDirection[DOWN] && movementDirection[RIGHT]) {
			return DOWN_RIGHT;
		}
		else if (movementDirection[UP] && movementDirection[RIGHT]) {
			return UP_RIGHT;
		}
		else if (movementDirection[UP]) {
			return UP;
		}
		else if (movementDirection[LEFT]) {
			return LEFT;
		}
		else if (movementDirection[DOWN]) {
			return DOWN;
		}
		else if (movementDirection[RIGHT]) {
			return RIGHT;
		}
	}

	this.cancelDash = function() {
		isDashing = false;
		dashIsCoolingDown = true;
	}
	
	this.updateState = function() {
		if (isDashing) {
			this.AnimatedSprite.changeState("dash");
		}
		else if (this.movementDirection[UP] || this.movementDirection[LEFT] || this.movementDirection[DOWN] || this.movementDirection[RIGHT]) {
			this.AnimatedSprite.changeState("walk");
		}
		else {
			this.AnimatedSprite.changeState("idle");
		}
	}
	
	this.draw = function() {
		canvasContext.save();
		canvasContext.translate(-camPanX, -camPanY);
		
		EntityClass.prototype.draw.call(this);
		
		canvasContext.restore();
	}
}