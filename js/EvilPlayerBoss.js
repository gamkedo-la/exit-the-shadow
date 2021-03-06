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
	
	const HP = 120;
	if (assistedModeOn) { // half health if assisted mode on
		this.HP = HP / 2;
	}
	else {
		this.HP = HP;
	}
	this.maxHP = this.HP;
	this.weight = 2; // 0-10 (10 means can't be pushed by anything)
	
	this.name = finalBossName;
	this.isActive = false;
	
	let attackChargeTime = 10;
	let heavyAttackChargeTime = 30;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.1},
		dash: {startFrame: 8, endFrame: 9, animationSpeed: 1},
		attackCharge: {startFrame: 10, endFrame: 12, animationSpeed: calculateAnimationSpeed(attackChargeTime, 3)},
		attack: {startFrame: 13, endFrame: 13, animationSpeed: 1},
		shield: {startFrame: 14, endFrame: 14, animationSpeed: 1},
		teleportOut: {startFrame: 15, endFrame: 18, animationSpeed: 2},
		teleportIn: {startFrame: 19, endFrame: 22, animationSpeed: 1},
		heavyAttackCharge: {startFrame: 23, endFrame: 26, animationSpeed: calculateAnimationSpeed(heavyAttackChargeTime, 4)},
		heavyAttack: {startFrame: 27, endFrame: 27, animationSpeed: 1},
	}
	
	let spritePadding = 50;
	this.AnimatedSprite = new AnimatedSpriteClass(evilPlayerSheet, this.width, this.height, spritePadding, this.states);

	this.directionFacing = DOWN;
	
	// motion blur trail effect
	this.trail = new TrailFX(bossTrailImage);

	this.phase = PRE_NOT_IN_BATTLE;
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
	let isChargingAttack = false;
	let attackTime = 0;

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

	const deepRed = {r:1, g:0, b:0};
	const brightRed = {r:1, g:1, b:1};
	const minTorchDist = 50;
	const maxTorchDist = 500;
	
	this.finalPositionX = 3443.5;
	this.finalPositionY = 1063;
		
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
		if (this.phase == PRE_NOT_IN_BATTLE) {
			if (Player.y < 1900) {
				teleportTime++;
				if (teleportTime < 5) {
					fadeOutPlatformTorches();
					isTeleportingOut = true;
				}
				else if (teleportTime < 30) {
					fadeInPlatformTorches();
					isTeleportingOut = false;
					this.startX = this.x = this.nextX = this.finalPositionX;
					this.startY = this.y = this.nextY = this.finalPositionY;
				}
				else {
					teleportTime = 0;
					this.progressPhase();
				}
			}
		}
		if (this.phase == NOT_IN_BATTLE) {
			if (distanceBetweenEntities(this, Player) < 150) {
				switchMusic(FINAL_BOSS, 1, 1);
				this.progressPhase();
				this.closeArena();
			}
		}
		if (this.phase == PHASE_1 || this.phase == PHASE_2) {
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
				if (attackCooldown <= 0) {
					attackTime++;
					if (attackTime < attackChargeTime) {
						isChargingAttack = true;
					}
					else if (attackTime >= attackChargeTime) {
						isChargingAttack = false;
						attackTime = 0;
						this.initiateAttack();
					}
				}
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
				if (heavyAttackTime < heavyAttackChargeTime - 1) {
					isChargingHeavyAttack = true;
				}
				else if (heavyAttackTime < heavyAttackChargeTime) {
					isChargingHeavyAttack = false;
					this.initiateHeavyAttack();
				}
				else if (heavyAttackTime < heavyAttackChargeTime*2) {
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
		if (this.phase == PLAYER_DEAD) {
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
		if (this.phase == PHASE_END_GAME) {
			this.moveSpeed = 2;
			this.movementDirection[UP] = true;
			if (this.centerY() < canvas.height/2 - 5) {
				this.movementDirection[UP] = false;
				this.directionFacing = DOWN;
			}
		}
		
		this.updateBehaviour();
		this.updateState();
		EntityClass.prototype.move.call(this); // call superclass function
		updateBossRoomTorchColors(this.centerX(), this.centerY(), deepRed, brightRed, minTorchDist, maxTorchDist);
	}
	
	const fadeOutPlatformTorches = function() {
		finalBossPlatformTorches[0].range -= 40;
		finalBossPlatformTorches[1].range -= 40;
	}

	const fadeInPlatformTorches = function() {
		if(finalBossPlatformTorches[0].range <= 100) {
			finalBossPlatformTorches[0].r = 1;
			finalBossPlatformTorches[0].g = 252/255;
			finalBossPlatformTorches[0].b = 206/255;
			finalBossPlatformTorches[1].r = 1;
			finalBossPlatformTorches[1].g = 252/255;
			finalBossPlatformTorches[1].b = 206/255;

			finalBossPlatformTorches[0].range += 40;
			finalBossPlatformTorches[1].range += 40;	
		}
	}

	const updateBossRoomTorchColors = function(x, y, deepRed, brightRed, minDist, maxDist) {
		for(let i = 0; i < finalBossRoomTorches.length; i++) {
			const deltaX = finalBossRoomTorches[i].x - x;
			const deltaY = finalBossRoomTorches[i].y - y;
			const dist = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

			if(dist <= minDist) {//use deep red
				finalBossRoomTorches[i].r = deepRed.r;
				finalBossRoomTorches[i].g = deepRed.g;
				finalBossRoomTorches[i].b = deepRed.b;
			} else if(dist >= maxDist) {//use bright red
				finalBossRoomTorches[i].r = brightRed.r;
				finalBossRoomTorches[i].g = brightRed.g;
				finalBossRoomTorches[i].b = brightRed.b;
			} else {//interpolate the color
				const lerpValue = (dist - minDist) / (maxDist - minDist);
				const deltaR = brightRed.r - deepRed.r;
				const deltaG = brightRed.g - deepRed.g;
				const deltaB = brightRed.b - deepRed.b;

				finalBossRoomTorches[i].r = deepRed.r + deltaR * lerpValue;
				finalBossRoomTorches[i].g = deepRed.g + deltaG * lerpValue;
				finalBossRoomTorches[i].b = deepRed.b + deltaB * lerpValue;
			}
		}
	}
	
	this.updateState = function() {
		if (isChargingAttack) {
			this.AnimatedSprite.changeState("attackCharge");
		}
		else if (isAttacking) {
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
		if (this.phase == PRE_NOT_IN_BATTLE) {
			this.phase = NOT_IN_BATTLE;
		}
		else if (this.phase == NOT_IN_BATTLE) {
			this.phase = PHASE_1;
			this.isActive = true;
		}
		else if (this.phase == PHASE_1) {
			this.phase = PHASE_2;
		}
	}
	
	this.updateBehaviour = function() {
		var distFromPlayer = distanceBetweenEntities(this, Player);
		
		if (isDashing || isShielding || isTeleportingIn || isTeleportingOut || isChargingAttack || isChargingHeavyAttack || isHeavyAttacking || isTiredFromHeavyAttack) {
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
		else if (timeSinceLastHeavyAttack > 100 && this.phase == PHASE_2 && this.playerIsInAttackRange(false)) {
			if (heavyAttackTime > 60) {
				heavyAttackTime = 0;
			}
			behaviour = HEAVY_ATTACK;
		}
		else if (this.playerIsInAttackRange(false)) {
			this.directionFacing = this.playerIsInAttackRange(true);
			behaviour = SIMPLE_ATTACK;
		}
		else if (timeSinceLastTeleport > 300 && this.phase == PHASE_2) {
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
				frameLength: 1,
				immuneEntities: [this]
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
			this.phase = PLAYER_DEAD;
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
	
	this.closeArena = function() {
		tileGrid[56 * TILE_COLS + 106] = 6;
		tileGrid[56 * TILE_COLS + 107] = 6;
		tileGrid[56 * TILE_COLS + 108] = 6;
		tileGrid[56 * TILE_COLS + 109] = 6;
		
		for (var i = 57 * TILE_COLS; i < 70 * TILE_COLS; i += TILE_COLS) {
			for (var j = 106; j <= 109; j++) {
				tileGrid[i + j] = 1;
			}
		}
		
		generateTileEntities();
	}
	
	this.openFinalPath = function() {
		resetWorld();
		loadLevel(levelOne);
		
		// remove all entity numbers to avoid crashing
		for (var i = 0; i < tileGrid.length; i++) {
			if (tileGrid[i] < 0) {
				tileGrid[i] = 0;
			}
		}
				
		for (i = 0 * TILE_COLS; i < 30 * TILE_COLS; i += TILE_COLS) {
			for (var j = 106, k = 0; j <= 109; j++, k++) {
				if (k == 0) {
					if (i == 29 * TILE_COLS) {
						tileGrid[i + j] = 34;
					}
					else {
						tileGrid[i + j] = 10;
					}
				}
				else if (k == 3) {
					if (i == 29 * TILE_COLS) {
						tileGrid[i + j] = 33;
					}
					else {
						tileGrid[i + j] = 7;
					}
				}
				else {
					tileGrid[i + j] = 0;
				}
			}
		}
		
		this.closeArena();
		
		generateFloorTiles();
		generateTileEntities();
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
					textDisplay("DARK REFLECTION SUBDUED", textDisplayTextColour, bossDefeatedTextBackgroundColour);
			}
			
			switchMusic(AMBIENT_MUSIC, BOSS_MUSIC_FADE_OUT_RATE, AMBIENT_MUSIC_FADE_IN_RATE);
			
			this.openFinalPath();
		}
		return this.isDead;
	}	
}