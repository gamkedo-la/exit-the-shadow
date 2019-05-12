// inherit from EntityClass
EvilPlayerBoss.prototype = new EntityClass();
EvilPlayerBoss.prototype.constructor = EvilPlayerBoss;

function EvilPlayerBoss() {
	// PHASES
	const PRE_NOT_IN_BATTLE = 0;
	const NOT_IN_BATTLE = 1;
	const PHASE_1 = 2;
	const PHASE_2 = 3;
	const PLAYER_DEAD = 4;
	
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOW = 1;
	const SIMPLE_ATTACK = 2;
	const SHIELD = 3;
	const DASH_TOWARDS = 4;
	const DASH_AWAY = 5;
	const TELEPORT_BEHIND_PLAYER = 6;
	const HEAVY_ATTACK = 7;
	
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
		shield: {startFrame: 11, endFrame: 11, animationSpeed: 1},
		teleportOut: {startFrame: 12, endFrame: 15, animationSpeed: 2},
		teleportIn: {startFrame: 16, endFrame: 19, animationSpeed: 1},
		heavyAttackCharge: {startFrame: 20, endFrame: 20, animationSpeed: 1},
		heavyAttack: {startFrame: 21, endFrame: 21, animationSpeed: 1}
	}
	
	let spritePadding = 50;
	this.AnimatedSprite = new AnimatedSpriteClass(evilPlayerSheet, this.width, this.height, spritePadding, this.states);

	this.directionFacing = DOWN;
	
	// motion blur trail effect
	this.trail = new TrailFX(bossTrailImage);

	let phase = PRE_NOT_IN_BATTLE;
	let behaviour = FOLLOW;
	
	let isDashing = false;
	let dashRemaining;
	let dashCooldown = 0;
	let dashDirection = NO_DIRECTION;
	let dashSpeed = 30;
	let diagonalDashSpeed = Math.sqrt((dashSpeed*dashSpeed) / 2);
	let dashAway = false;
	
	let attackCooldown = 0;
	let Attack = null;
	let attackWidth = 40;
	let attackHeight = 40;
	let isAttacking = false;

	let shieldCooldown = 0;
	let isShielding = false;
	let shield = false;
	
	let timeSincePlayerDeath = 0;
	
	let teleportTime = 0;
	let isTeleportingOut = false;
	let isTeleportingIn = false;
	let timeSinceLastTeleport = 0;
	
	let HeavyAttack = null;
	let timeSinceLastHeavyAttack = 0;
	let heavyAttackTime = 0;
	let isChargingHeavyAttack = false;
	let isHeavyAttacking = false;
	let heavyAttackWidth = 50;
	let heavyAttackLength = 50;
	let isTiredFromHeavyAttack = false;
		
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
		if (phase == PRE_NOT_IN_BATTLE) {
			if (Player.y < 1900) {
				teleportTime++;
				if (teleportTime < 5) {
					isTeleportingOut = true;
				}
				else if (teleportTime < 30) {
					isTeleportingOut = false;
					this.startX = this.x = this.nextX = 3443.5;
					this.startY = this.y = this.nextY = 1063;
				}
				else {
					teleportTime = 0;
					this.progressPhase();
				}
			}
		}
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
				
				this.handleDash(this.movementDirection, 150);
			}
			else if (behaviour == DASH_AWAY) {
				var movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
				if (Math.abs(Player.y - this.y) > 10) {
					if (Player.y < this.y) {
						movementDirection[DOWN] = true;
					}
		
					if (Player.y > this.y) {
						movementDirection[UP] = true;
					}
				}
		
				if (Math.abs(Player.x - this.x) > 10) {
					if (Player.x > this.x) {
						movementDirection[LEFT] = true;
					}

					if (Player.x < this.x) {
						movementDirection[RIGHT] = true;
					}
				}
				
				this.handleDash(movementDirection, 100);
			}
			else if (behaviour == TELEPORT_BEHIND_PLAYER) {
				teleportTime++;
				if (teleportTime < 5) {
					isTeleportingOut = true;
				}
				else if (teleportTime < 50) {
					isTeleportingOut = false;
					this.x = this.nextX = -100;
					this.y = this.nextY = -100;
				}
				else if (teleportTime < 55) {
					isTeleportingIn = true;
					this.x = this.nextX = Player.x;
					this.y = this.nextY = Player.y + 50;
				}
				else {
					this.directionFacing = UP;
					isTeleportingIn = false
					timeSinceLastTeleport = 0;
				}
			}
			else if (behaviour == HEAVY_ATTACK) {
				heavyAttackTime++
				if (heavyAttackTime < 30) {
					isChargingHeavyAttack = true;
				}
				else if (heavyAttackTime < 35) {
					isChargingHeavyAttack = false;
					this.initiateHeavyAttack();
				}
				else if (heavyAttackTime < 60) {
					isHeavyAttacking = false;
					isTiredFromHeavyAttack = true;
				}
				else {
					isTiredFromHeavyAttack = false;
					timeSinceLastHeavyAttack = 0;
				}
			}
			this.updateAttack();
			this.updateShield();
			this.updateDashCooldown();
			this.updateHeavyAttack();
			
			timeSinceLastTeleport++;
			timeSinceLastHeavyAttack++;
			
			if (this.HP <= this.maxHP / 2) {
				this.progressPhase();
			}
		}
		if (phase == PLAYER_DEAD) {
			timeSincePlayerDeath++;
			if (timeSincePlayerDeath > 50) {
				// move back to original position
				if (Math.abs(this.startY - this.y) > 2) {
					if (this.startY < this.y) {
						this.movementDirection[UP] = true;
					}
	
					if (this.startY > this.y) {
						this.movementDirection[DOWN] = true;
					}
				}
	
				if (Math.abs(this.startX - this.x) > 2) {
					if (this.startX > this.x) {
						this.movementDirection[RIGHT] = true;
					}

					if (this.startX < this.x) {
						this.movementDirection[LEFT] = true;
					}
				}
			
				if (this.startX - this.x <= 2 && this.startY - this.y <= 2) {
					this.directionFacing = DOWN;
				}
			}
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
		else if (isTeleportingOut) {
			this.AnimatedSprite.changeState("teleportOut");
		}
		else if (isTeleportingIn) {
			this.AnimatedSprite.changeState("teleportIn");
		}
		else if (isChargingHeavyAttack) {
			this.AnimatedSprite.changeState("heavyAttackCharge");
		}
		else if (isHeavyAttacking) {
			this.AnimatedSprite.changeState("heavyAttack");
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
		if (isDashing || dashCooldown > 17)
			this.trail.draw(); 
		
		EntityClass.prototype.draw.call(this);
	}
	
	this.progressPhase = function() {
		if (phase == PRE_NOT_IN_BATTLE) {
			phase = NOT_IN_BATTLE;
		}
		else if (phase == NOT_IN_BATTLE) {
			phase = PHASE_1;
			this.isActive = true;
		}
		else if (phase == PHASE_1) {
			phase = PHASE_2;
		}
	}
	
	this.updateBehaviour = function() {
		var distFromPlayer = distanceBetweenEntities(this, Player);
		
		if (isDashing || isShielding || isTeleportingIn || isTeleportingOut || isChargingHeavyAttack || isHeavyAttacking || isTiredFromHeavyAttack) {
			return; // to prevent going into a different behaviour mid dash or mid shield
		}
		else if (dashAway) {
			dashAway = false;
			behaviour = DASH_AWAY;
		}
		else if (shield && !isShielding) {
			shield = false;
			behaviour = SHIELD;
		}
		else if (timeSinceLastHeavyAttack > 100 && phase == PHASE_2 && this.playerIsInAttackRange(false)) {
			if (heavyAttackTime > 60) {
				heavyAttackTime = 0;
			}
			behaviour = HEAVY_ATTACK;
		}
		else if (this.playerIsInAttackRange(false)) {
			this.directionFacing = this.playerIsInAttackRange(true);
			behaviour = SIMPLE_ATTACK;
		}
		else if (timeSinceLastTeleport > 300 && phase == PHASE_2) {
			if (teleportTime > 55) {
				teleportTime = 0;
			}
			behaviour = TELEPORT_BEHIND_PLAYER;
		}
		else if (distFromPlayer > 200) {
			behaviour = DASH_TOWARDS;
		}
		else if (distFromPlayer > 5) {
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
			isAttacking = true;
			
			attackCooldown = 30;
			
			switch(Math.floor(Math.random() * 2)) {
			case 0:
				dashAway = true;
				break;
			default:
				shield = true;
				break;
			}
		}
	}
	
	this.initiateHeavyAttack = function() {
		if (!isHeavyAttacking && HeavyAttack == null) {
			let centerX = this.x + this.width / 2, centerY = this.y + this.height / 2;
			let velocityX = 0, velocityY = 0;
		
			switch(this.directionFacing) {
			case UP:
				centerY -= ((this.collisionBoxHeight / 2) + (heavyAttackLength / 2) - (this.collisionBoxHeight / 2));
				velocityY = -1;
				break;
			case DOWN:
				centerY += ((this.collisionBoxHeight / 2) + (heavyAttackLength / 2) + (this.collisionBoxHeight / 2));
				velocityY = 1;
				break;
			case LEFT:
				centerX -= ((this.width / 2) + (heavyAttackWidth / 2));
				velocityX = -1;
				break;
			case RIGHT:
				centerX += ((this.width / 2) + (heavyAttackWidth / 2));
				velocityX = 1;
				break;
			}
		
			let attackOptions = {
				centerX: centerX,
				centerY: centerY,
				width: heavyAttackWidth,
				height: heavyAttackLength,
				damage: 2,
				velocityX: velocityX,
				velocityY: velocityY,
				frameLength: 5
			}
		
			HeavyAttack = new ProjectileClass(attackOptions);
			sfx[ATTACK_SFX].play();
			isHeavyAttacking = true;
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
	
	this.updateHeavyAttack = function() {
		if (HeavyAttack != null) {
			HeavyAttack.update();
			if (HeavyAttack.attackFinished) {
				HeavyAttack = null;
			}
		}
		this.checkIfPlayerIsDead();
	}
	
	this.initiateShield = function() {
		if (shieldCooldown <= 0) {
			this.isInvulnerable = true;
			isShielding = true;
			shieldCooldown = 25;
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
	
	this.handleDash = function(movementDirection, dashLength) {
		if (dashCooldown <= 0 && !isDashing) {
			isDashing = true;
			dashRemaining = dashLength / dashSpeed;
			dashDirection = this.calculateDashDirection(movementDirection);
		}
		if (isDashing) {
			dashRemaining--;
			switch(dashDirection) {
			case UP:
				this.nextY -= dashSpeed;
				break;
			case LEFT:
				this.nextX -= dashSpeed;
				break;
			case DOWN:
				this.nextY += dashSpeed;
				break;
			case RIGHT:
				this.nextX += dashSpeed;
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
				dashCooldown = 20;
			}
		}
	}
	
	this.updateDashCooldown = function() {
		if (dashCooldown > 0) {
			dashCooldown--;
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
			isAttacking = false;
			isHeavyAttacking = false;
			phase = PLAYER_DEAD;
			timeSincePlayerDeath = 0;
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
	
	this.deathHandle = function()
	{
		if(this.isDead) 
		{
			// Add boss name to player's boss-list.
			Player.bossesKilled.push(this.name);
			
			bossIsDefeated = true;
			showBossDefeated = function() {
					// show death message on screen
					deathTextDisplay("DARK REFLECTION SUBDUED", 'grey', 'black');
			}
		}
		return this.isDead;
	}	
}