const DASH_LENGTH = 300;
const DASH_SPEED = 50;
const DASH_COOLDOWN = 5;
const ATTACK_COOLDOWN = 5;
const SHIELD_MAX_TIME = 15;
const SHIELD_COOLDOWN = 5;
const GRADIENT_HALF_W = 640;
const GRADIENT_HALF_H = 620;

// if true, player isn't drawn when dashing
const HIDE_PLAYER_WHEN_DASHING = false;

// inherit from EntityClass
PlayerClass.prototype = new EntityClass();
PlayerClass.prototype.constructor = PlayerClass;

function PlayerClass() {

	// public
	this.width = 25;
	this.height = 50;
	this.HP = 5;
	this.maxHP = this.HP;
	this.HP = 1;
	
	this.collisionBoxHeight = this.width;
	
	this.moveSpeed = 5;
	
	// string array with names of bosses killed. used by save game system
	this.bossesKilled = new Array();

	// motion blur trail effect
	this.trail = new TrailFX(trailImage);
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.5},
		dash: {startFrame: 8, endFrame: 9, animationSpeed: 1},
		attack: {startFrame: 10, endFrame: 10, animationSpeed: 1},
		shield: {startFrame: 11, endFrame: 11, animationSpeed: 1}
	}
	
	let spritePadding = 50;
	this.AnimatedSprite = new AnimatedSpriteClass(playerSheet, this.width, this.height, spritePadding, this.states);
	//this.shadow = playerShadowSprite;
	
	this.keyHeld_Up = false;
	this.keyHeld_Down = false;
	this.keyHeld_Left = false;
	this.keyHeld_Right = false;
	this.keyHeld_Dash = false;
	this.keyHeld_Interact = false;
	this.keyHeld_Attack = false;
	this.keyHeld_Shield = false;
	
	this.controlKeyUp;
	this.controlKeyLeft;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyDash;
	this.controlKeyInteract;
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
	
	this.regainHealthMeter = 0;
	this.regainHealthThreshold = 10;
	
	this.setupInput = function(upKey, leftKey, downKey, rightKey, dashKey, interactKey, attackKey, shieldKey) {
		this.controlKeyUp = upKey;
		this.controlKeyLeft = leftKey;
		this.controlKeyDown = downKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDash = dashKey;
		this.controlKeyInteract = interactKey;
		this.controlKeyAttack = attackKey;
		this.controlKeyShield = shieldKey;
	}

	this.resetStats = function () {
		this.HP = 5;
		this.maxHP = this.HP;
		this.HP = 1;
		this.regainHealthMeter = 0;
		this.isDead = false;
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
				let velocityX = 0, velocityY = 0;
				
				switch(this.directionFacing) {
				case UP:
					centerY -= ((this.collisionBoxHeight / 2) + (attackHeight / 2) - (this.collisionBoxHeight / 2));
					velocityY = -1;
					break;
				case DOWN:
					centerY += ((this.collisionBoxHeight / 2) + (attackHeight / 2) + (this.collisionBoxHeight / 2));
					velocityY = 1;
					break;
				case LEFT:
					centerX -= ((this.width / 2) + (attackWidth / 2));
					velocityX = -1;
					break;
				case RIGHT:
					centerX += ((this.width / 2) + (attackWidth / 2));
					velocityX = 1;
					break;
				}
				
				let attackOptions = {
					centerX: centerX,
					centerY: centerY,
					width: attackWidth,
					height: attackHeight,
					damage: 1,
					velocityX: velocityX,
					velocityY: velocityY,
					frameLength: 1,
					immuneEntities: [Player],
					isPlayerAttack: true
				}
				
				Attack = new ProjectileClass(attackOptions);
				sfx[ATTACK_SFX].play();
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
			isShielding = true;
			this.isInvulnerable = true;
			console.log('shield activated');
		}
		if (isShielding){ // currently shielding
			shieldRemaining--;
			
			if (shieldRemaining <= 0 || !this.keyHeld_Shield) {
				isShielding = false;
				this.isInvulnerable = false;
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
		
		if (this.keyHeld_Interact) {
			// interact with nearby things here
			for (var i = 0; i < SortedArt.length; i++) {
				if (SortedArt[i].imgName == "healingStatue") {
					let object = SortedArt[i];
					let objectWidth = window[object.imgName].width;
					let objectHeight = window[object.imgName].height;
					let distanceX = distanceBetweenEntityObjectX(this, object.x, objectWidth);
					let distanceY = distanceBetweenEntityObjectY(this, object.y, objectHeight);
					if (distanceX <= (objectWidth/2 + this.width/2)+1 &&
						distanceY <= (objectHeight/2 + this.collisionBoxHeight/2)+1) {
							console.log("healing");
							this.regainHealthMeter++;
					}
				}
				else if (SortedArt[i].imgName == "typewriter") {
					let object = SortedArt[i];
					let objectWidth = window[object.imgName].width;
					let objectHeight = window[object.imgName].height;
					let distanceX = distanceBetweenEntityObjectX(this, object.x, objectWidth);
					let distanceY = distanceBetweenEntityObjectY(this, object.y, objectHeight);
					if (distanceX <= (objectWidth/2 + this.width/2)+1 &&
						distanceY <= (objectHeight/2 + this.collisionBoxHeight/2)+1) {
							console.log("load save game screen here");
					}
				}
			}
		}
		
		this.checkForRegainHealth();

		this.updateState(); // update animation state
		EntityClass.prototype.move.call(this); // call superclass function

		//clamp player position to on the map
		this.clampPositionToScreen();
		
		cameraFollow();
	}

	this.clampPositionToScreen = function() {
		if(this.x < camPanX) {
			this.x = camPanX;
		} else if(this.x > camPanX + canvas.width - this.width) {
			this.x = camPanX + canvas.width - this.width;
		}

		if(this.y < camPanY) {
			this.y = camPanY;
		} else if(this.y > camPanY + canvas.height - this.height) {
			this.y = camPanY + canvas.height - this.height;
		}
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
		// motion blur effect
		this.trail.update(this.x+10,this.y+24);
		if (isDashing || dashCooldown > 1)
			this.trail.draw(); 
		
		if (HIDE_PLAYER_WHEN_DASHING) {
			if (!isDashing) {
				EntityClass.prototype.draw.call(this);
				return;
			}
		} else {
			EntityClass.prototype.draw.call(this);
		}
	}

	this.drawGradient = function() {
		const gradientX = this.x-GRADIENT_HALF_W;
		const gradientY = this.y-GRADIENT_HALF_H;
		for(var i = 0; i < 3; i++) {
			canvasContext.drawImage(playerGradient, gradientX, gradientY, 1280, 1280);
		}

		if(gradientX > camPanX) {
			const leftWidth = gradientX - camPanX;
			colorRect(camPanX, camPanY, leftWidth, canvas.height, 'black'); // canvas
		}

		if(gradientX + 1280 < camPanX + canvas.width) {
			const rightWidth = (camPanX + canvas.width) - (gradientX + 1280);
			colorRect(gradientX + 1279, camPanY, rightWidth + 1, canvas.height, 'black'); // canvas
		}

		if(gradientY > camPanY) {
			const topHeight = gradientY - camPanY;
			colorRect(camPanX, camPanY, canvas.width, topHeight, 'black'); // canvas
		}

		if(gradientY + 1280 < camPanY + canvas.height) {
			const bottomHeight = (camPanY + canvas.height) - (gradientY + 1280);
			colorRect(camPanX, gradientY + 1280, canvas.width, bottomHeight, 'black'); // canvas
		}
	}
	
	this.isAttacking = function() {
		if (Attack != null) {
			return true;
		}
		return false;
	}
	
	this.checkForRegainHealth = function() {
		if (this.HP < this.maxHP) {
			if (this.regainHealthMeter >= this.regainHealthThreshold) {
				this.HP++;
				this.regainHealthMeter = this.regainHealthMeter % this.regainHealthThreshold;
			}
		}
		else {
			this.regainHealthMeter = 0;
		}
		
		if (this.regainHealthMeter > 0) {
			this.regainHealthMeter -= 0.01;
		}
		else {
			this.regainHealthMeter = 0;
		}
	}
	
	this.regainHealthFromAttack = function() {
		this.regainHealthMeter++;
	}

	this.deathHandle = function ()
	{
		if (this.isDead)
		{
			gameRestartPending = true;
			return true;
		}
		return false;
	}
}