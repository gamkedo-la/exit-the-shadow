// inherit from EntityClass
EvilPlayerBoss.prototype = new EntityClass();
EvilPlayerBoss.prototype.constructor = EvilPlayerBoss;

function EvilPlayerBoss() {
	// PHASES
	const NOT_IN_BATTLE = 0;
	const PHASE_1 = 1;
	const PHASE_2 = 2;
	const PLAYER_DEAD = 3;
	
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOW = 1;
	const SIMPLE_ATTACK = 2;
	const SHIELD = 3;
	const DASH_TOWARDS = 4;
	const DASH_AWAY = 5;
	
	this.width = 25;
	this.height = 50;
	
	this.collisionBoxHeight = this.width;
	
	this.moveSpeed = 2;
	this.HP = 50;
	this.maxHP = this.HP;
	this.weight = 2; // 0-10 (10 means can't be pushed by anything)
	
	this.name = "Self";
	this.isActive = false;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.1},
		dash: {startFrame: 8, endFrame: 9, animationSpeed: 1},
		attack: {startFrame: 10, endFrame: 10, animationSpeed: 1},
		shield: {startFrame: 11, endFrame: 11, animationSpeed: 1}
	}
	
	let spritePadding = 50;
	this.AnimatedSprite = new AnimatedSpriteClass(evilPlayerSheet, this.width, this.height, spritePadding, this.states);

	this.directionFacing = DOWN;

	let phase = NOT_IN_BATTLE;
	let behaviour = FOLLOW;
	
	let isDashing = false;
	let dashRemaining = DASH_LENGTH/DASH_SPEED;
	let dashCooldown = 0;
	let dashDirection = NO_DIRECTION;
	let diagonalDashSpeed = Math.sqrt((DASH_SPEED*DASH_SPEED) / 2);
	
	let attackCooldown = 0;
	let Attack = null;
	let attackWidth = 40;
	let attackHeight = 40;
	let isAttacking = false;
	let partOfSameComboAsNextHit = true;

	let shieldCooldown = 0;
	let isShielding = false;
		
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
		if (phase == NOT_IN_BATTLE) {
			if (distanceBetweenEntities(this, Player) < 150) {
				this.progressPhase();
			}
		}
		if (phase == PHASE_1 || phase == PHASE_2) {
			if (behaviour == FOLLOW) {
				if (Math.abs(Player.y - this.y) > 2) {
					if (Player.y < this.y) {
						this.movementDirection[UP] = true;
					}
		
					if (Player.y > this.y) {
						this.movementDirection[DOWN] = true;
					}
				}
		
				if (Math.abs(Player.x - this.x) > 2) {
					if (Player.x > this.x) {
						this.movementDirection[RIGHT] = true;
					}

					if (Player.x < this.x) {
						this.movementDirection[LEFT] = true;
					}
				}
			}
			else if (behaviour == SIMPLE_ATTACK) {
				this.initiateAttack();
			}
			else if (behaviour == SHIELD) {
				this.initiateShield();
			}
			else if (behaviour == DASH_TOWARDS) {
				if (Math.abs(Player.y - this.y) > 100) {
					if (Player.y < this.y) {
						this.movementDirection[UP] = true;
					}
		
					if (Player.y > this.y) {
						this.movementDirection[DOWN] = true;
					}
				}
		
				if (Math.abs(Player.x - this.x) > 100) {
					if (Player.x > this.x) {
						this.movementDirection[RIGHT] = true;
					}

					if (Player.x < this.x) {
						this.movementDirection[LEFT] = true;
					}
				}
				
				this.handleDash();
			}
			this.updateAttack();
			this.updateShield();
			
			if (this.HP <= this.maxHP / 2) {
				this.progressPhase();
			}
		}
		if (phase == PHASE_2) {
			// extra phase 2 behaviours go here
		}
		
		this.updateBehaviour();
		this.updateState();
		EntityClass.prototype.move.call(this); // call superclass function
	}
	
	this.updateState = function() {
		if (isAttacking) {
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
	
	this.progressPhase = function() {
		if (phase == NOT_IN_BATTLE) {
			phase = PHASE_1;
			this.isActive = true;
		}
		else if (phase == PHASE_1) {
			phase = phase_2;
		}
	}
	
	this.updateBehaviour = function() {
		var distFromPlayer = distanceBetweenEntities(this, Player);
		
		if (isDashing) {
			return; // to prevent going into a different behaviour mid dash
		}
		else if ((Player.isAttacking() && this.playerIsInAttackRange(false)) || isShielding) {
			partOfSameComboAsNextHit = true;
			behaviour = SHIELD;
		}
		else if (this.playerIsInAttackRange(false)) {
			this.directionFacing = this.playerIsInAttackRange(true);
			behaviour = SIMPLE_ATTACK;
		}
		else if (distFromPlayer > 200) {
			partOfSameComboAsNextHit = true;
			behaviour = DASH_TOWARDS;
		}
		else if (distFromPlayer > 5) {
			partOfSameComboAsNextHit = true;
			behaviour = FOLLOW;
		}
	}
	
	this.initiateAttack = function() {
		if (attackCooldown <= 0 && Attack == null) {
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
				frameLength: 1
			}
			
			Attack = new ProjectileClass(attackOptions);
			sfx[ATTACK_SFX].play();
			
			if (partOfSameComboAsNextHit) {
				attackCooldown = 3;
				partOfSameComboAsNextHit = false;
			}
			else {
				attackCooldown = 15;
				partOfSameComboAsNextHit = true;
			}
		}
	}
	
	this.updateAttack = function() {
		if (attackCooldown > 0) {
			if (Attack.attackFinished) {
				isAttacking = false;
			}
			attackCooldown--;
			Attack.update();
		}
		else {
			Attack = null;
		}
		this.checkIfPlayerIsDead();
	}
	
	this.initiateShield = function() {
		if (shieldCooldown <= 0) {
			this.isInvulnerable = true;
			isShielding = true;
			shieldCooldown = 30;
		}
	}
	
	this.updateShield = function() {
		if (shieldCooldown > 0) {
			if (shieldCooldown <= 10) {
				this.isInvulnerable = false;
				isShielding = false;
			}
			shieldCooldown--;
		}
	}
	
	this.handleDash = function() {
		if (dashCooldown <= 0 && !isDashing) {
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
	}
	
	this.playerIsInAttackRange = function(shouldReturnDirection) {
		for (var i = 0; i < 4; i++) {
			let centerX = this.x + this.width / 2, centerY = this.y + this.height / 2;
			let velocityX = 0, velocityY = 0;
			
			switch(i) {
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
				frameLength: 1
			}
			
			let testAttack = new ProjectileClass(attackOptions);
			if (projectileHitEntity(Player, testAttack)) {
				switch(shouldReturnDirection) {
				case false:
					return true;
				case true:
					return i;
				}
			} // end of if
		} // end of for
		return false;
	} // end of func
	
	this.checkIfPlayerIsDead = function() {
		var playerAlive = false;
		for (var i = 0; i < Entities.length; i++) {
			if (Entities[i] instanceof PlayerClass) {
				playerAlive = true;
				break;
			}
		}
		
		if (!playerAlive) {
			phase = PLAYER_DEAD;
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
}