const DASH_LENGTH = 150;
const DASH_SPEED = 50;
const DASH_COOLDOWN = 5;
const ATTACK_COOLDOWN = 5;
const SHIELD_MAX_TIME = 10;
const SHIELD_COOLDOWN = 5;

// inherit from EntityClass
PlayerClass.prototype = new EntityClass();
PlayerClass.prototype.constructor = PlayerClass;

function PlayerClass() {
	// public
	this.width = 25;
	this.height = 50;
	this.hp = 2;
	
	this.collisionBoxHeight = this.width;
	
	this.moveSpeed = 5;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.25},
		dash: {startFrame: 8, endFrame: 9, animationSpeed: 1},
		attack: {startFrame: 10, endFrame: 10, animationSpeed: 1},
		shield: {startFrame: 11, endFrame: 11, animationSpeed: 1}
	}
	
	this.AnimatedSprite = new AnimatedSpriteClass(playerSheet, this.width, this.height, this.states);
	
	this.keyHeld_Up = false;
	this.keyHeld_Down = false;
	this.keyHeld_Left = false;
	this.keyHeld_Right = false;
	this.keyHeld_Dash = false;
	this.keyHeld_Attack = false;
	this.keyHeld_Shield = false;
	
	this.controlKeyUp;
	this.controlKeyLeft;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyDash;
	this.controlKeyAttack;
	this.controlKeyShield;
	
	// private
	let isDashing = false;
	let dashRemaining = DASH_LENGTH/DASH_SPEED;
	let dashCooldown = 0;
	let dashDirection = NO_DIRECTION;
	let diagonalDashSpeed = Math.sqrt((DASH_SPEED*DASH_SPEED) / 2);
	
	let Attack;
	let attackCooldown = 0;
	let attackWidth = 40;
	let attackHeight = 40;
	
	let isShielding = false;
	let shieldRemaining = SHIELD_MAX_TIME;
	let shieldCooldown = SHIELD_COOLDOWN;
	
	this.setupInput = function(upKey, leftKey, downKey, rightKey, dashKey, attackKey, shieldKey) {
		this.controlKeyUp = upKey;
		this.controlKeyLeft = leftKey;
		this.controlKeyDown = downKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDash = dashKey;
		this.controlKeyAttack = attackKey;
		this.controlKeyShield = shieldKey;
	}
	
	this.move = function () {

		// MOVEMENT
		this.movementDirection = [false, false, false, false]; // up, left, down, right
		
		if (!isDashing && !isShielding) {
			if (this.keyHeld_Up) {
				this.movementDirection[UP] = true;
			}
		
			if (this.keyHeld_Down) {
				this.movementDirection[DOWN] = true;
			}
		
			if (this.keyHeld_Right) {
				this.movementDirection[RIGHT] = true;
			}

			if (this.keyHeld_Left) {
				this.movementDirection[LEFT] = true;
			}
		}
		
		// DASH
		if (this.keyHeld_Dash && !isDashing && dashCooldown <= 0 &&
		   (this.movementDirection[UP] || this.movementDirection[DOWN] || this.movementDirection[RIGHT] || this.movementDirection[LEFT])) {
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
				dashCooldown = DASH_COOLDOWN;
			}
		}
		if (dashCooldown > 0) {
			dashCooldown--;
			if (dashCooldown <= 0 && !this.keyHeld_Dash) {
				dashRemaining = DASH_LENGTH/DASH_SPEED;
			}
			else if (dashCooldown <= 0 && this.keyHeld_Dash) {
				dashCooldown = 1; // prevent repeatedly dashing if keyheld
			}
		}
		
		// ATTACK
		if (this.keyHeld_Attack && attackCooldown <= 0 && !isShielding && !isDashing) { // not attacking right now & is able to
			if (Attack == null) {
				let centerX = this.x + this.width / 2, centerY = this.y + this.height / 2;
				let attackX, attackY;
				
				switch(this.directionFacing) {
				case UP:
					centerY -= ((this.height / 2) + (attackHeight / 2));
					break;
				case DOWN:
					centerY += ((this.height / 2) + (attackHeight / 2));
					break;
				case LEFT:
					centerX -= ((this.width / 2) + (attackWidth / 2));
					break;
				case RIGHT:
					centerX += ((this.width / 2) + (attackWidth / 2));
					break;
				}
				
				let attackOptions = {
					centerX: centerX,
					centerY: centerY,
					width: attackWidth,
					height: attackHeight,
					damage: 1,
					velocityX: 0,
					velocityY: 0,
					frameLength: 1
				}
				
				Attack = new ProjectileClass(attackOptions);
			}
		}
		if (Attack != null){ // currently attacking
			if (!Attack.attackFinished) {
				Attack.update();
			}
			else {
				Attack = null;
				attackCooldown = ATTACK_COOLDOWN;
			}
		}
		if (attackCooldown > 0) {
			attackCooldown--;
			
			// prevent being able to just hold down the key
			if (attackCooldown <= 0 && this.keyHeld_Attack) {
				attackCooldown = 1;
			}
		}
		
		// SHIELD
		if (this.keyHeld_Shield && !isShielding && shieldCooldown <= 0 && !isDashing && Attack == null) { // not currently shielding & is able to
			isShielding = true; // prevents taking damage
		}
		if (isShielding){ // currently shielding
			shieldRemaining--;
			
			if (shieldRemaining <= 0 || !this.keyHeld_Shield) {
				isShielding = false;
				shieldCooldown = SHIELD_COOLDOWN;
			}
		}
		if (shieldCooldown > 0) {
			shieldCooldown--;
			
			if (shieldCooldown <= 0 && !this.keyHeld_Shield) {
				shieldRemaining = SHIELD_MAX_TIME;
			}
			else if (shieldCooldown <= 0 && this.keyHeld_Shield) {
				shieldCooldown = 1; // prevent repeatedly shielding if keyheld
			}
		}

		this.updateState(); // update animation state
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
		else if (Attack != null) {
			this.AnimatedSprite.changeState("attack");
		}
		else if (isShielding) {
			this.AnimatedSprite.changeState("shield");
		}
		else if (this.movementDirection[UP] || this.movementDirection[LEFT] || this.movementDirection[DOWN] || this.movementDirection[RIGHT]) {
			this.AnimatedSprite.changeState("walk");
		}
		else {
			this.AnimatedSprite.changeState("idle");
		}
	}
	
	this.draw = function() {
		EntityClass.prototype.draw.call(this);
	}
}