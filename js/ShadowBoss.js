// inherit from EntityClass
ShadowBoss.prototype = new EntityClass();
ShadowBoss.prototype.constructor = ShadowBoss;

function ShadowBoss(name, id) {
	//IDs
	const LEFT_SHADOW = 0;
	const MIDDLE_SHADOW = 1;
	const RIGHT_SHADOW = 2;
	
	// PHASES
	const NOT_IN_BATTLE = 0;
	const PHASE_1 = 1;
	const PHASE_2 = 2;
	const PLAYER_DEAD = 3;
	
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOW = 1;
	const ATTACK = 2;
	
	this.id = id;
	
	this.width = 48;
	this.height = 128;
	
	this.collisionBoxHeight = this.width;
	
	const HP = 50;
	if (assistedModeOn) { // half health if assisted mode on
		this.HP = HP / 2;
	}
	else {
		this.HP = HP;
	}
	this.maxHP = this.HP;
	this.weight = 7; // 0-10 (10 means can't be pushed by anything)
	
	this.name = name;
	this.isActive = false;
	
	let timeForAttackInFrames = 40;
	let numberOfAttackFrames = 4;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.1},
		attack: {startFrame: 8, endFrame: 11, animationSpeed: calculateAnimationSpeed(timeForAttackInFrames, numberOfAttackFrames)}
	}
	
	let spritePadding = 64;
	this.AnimatedSprite = new AnimatedSpriteClass(shadowSheet, this.width, this.height, spritePadding, this.states);
	this.AnimatedSprite.opacity = 0.7;
	let darkRange = 200;
	this.dark = {x:0, y:0, imgName: 'torchPic', range:darkRange, r:0, g:0, b:0};
	shadowBossDarks.push(this.dark);
	
	this.directionFacing = DOWN;

	let behaviour = IDLE;
	let phase = NOT_IN_BATTLE;
	
	let spaceToLeaveBetweenPlayer = 150;
	let distanceFromDestinationX;
	let distanceFromDestinationY;
	
	let Attack = null;
	let attackTime = 0;
	let isChargingAttack = false;
	let isAttacking = false;
	let maxAttackCooldown = 120;
	let minAttackCooldown = 30;
	let attackCooldown = Math.round(Math.random()*(maxAttackCooldown-minAttackCooldown)) + minAttackCooldown;
	let attackPadding = 32;
	let attackWidth = this.width + (attackPadding*2);
	let attackHeight = this.collisionBoxHeight + (attackPadding*2);
	let attackDestinationX;
	let attackDestinationY;
	let attackChargeTime = 0;
	
	let timeSincePlayerDeath = 0;
	
	let timeSinceBattleBegan = 0;
		
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
		if (phase == NOT_IN_BATTLE) {
			if (distanceBetweenEntities(this, Player) < 200 && this.name == shadowBossName) {
				switchMusic(SHADOW_BOSS, 1, 1);
				this.progressPhaseTogether();
				this.closeArena();
			}
		}
		else if (phase == PHASE_1 || phase == PHASE_2) {
			timeSinceBattleBegan++;
			switch(behaviour) {
			case FOLLOW:
				// get center of player and us
				destinationX = Player.centerX();
				destinationY = Player.centerY();
				
				bossX = this.centerX();
				bossY = this.centerY();
				
				if (timeSinceBattleBegan > 100) {
					this.updateIds();
				}
				// decide where around the player to move to
				switch(this.id) {
				case LEFT_SHADOW:
					destinationX -= spaceToLeaveBetweenPlayer;
					destinationY += spaceToLeaveBetweenPlayer;
					break;
					
				case MIDDLE_SHADOW:
					destinationY -= spaceToLeaveBetweenPlayer;
					break;
					
				case RIGHT_SHADOW:
					destinationX += spaceToLeaveBetweenPlayer;
					destinationY += spaceToLeaveBetweenPlayer;
					break;
				}
				
				// move faster if further away
				var distFromPlayer = distanceBetweenEntities(this, Player);
				if (distFromPlayer < 100) {
					distFromPlayer = 250;
				}
				this.moveSpeed = distFromPlayer / 75;
				
				// move towards this location
				distanceFromDestinationY = Math.abs(destinationY - bossY);
				if (distanceFromDestinationY > 2) {
					if (destinationY < bossY) {
						this.movementDirection[UP] = true;
					}
		
					if (destinationY > bossY) {
						this.movementDirection[DOWN] = true;
					}
				}
				
				distanceFromDestinationX = Math.abs(destinationX - bossX);
				if (distanceFromDestinationX > 2) {
					if (destinationX > bossX) {
						this.movementDirection[RIGHT] = true;
					}

					if (destinationX < bossX) {
						this.movementDirection[LEFT] = true;
					}
				}
				break;

			case ATTACK:
				attackTime++;
				isAttacking = true;
				if (attackTime < timeForAttackInFrames * 0.75) {
					attackChargeTime++;
					this.chargeAttackTowardsAttackDestination();
				}
				else if (attackTime < timeForAttackInFrames) {
					if (attackTime == timeForAttackInFrames * 0.75) {
						attackChargeTime = 0;
						this.initiateAttack();
					}
				}
				else if (attackTime < timeForAttackInFrames + (timeForAttackInFrames * 0.75)) {
					attackChargeTime++;
					this.chargeAttackTowardsAttackDestination();
				}
				else if (attackTime < timeForAttackInFrames*2) {
					if (attackTime == timeForAttackInFrames + (timeForAttackInFrames * 0.75)) {
						attackChargeTime = 0;
						this.initiateAttack();
					}
				}
				else {
					isAttacking = false;
					attackTime = 0
					attackCooldown = Math.round(Math.random()*(maxAttackCooldown-minAttackCooldown)) + minAttackCooldown;
				}
				break;
			}
			
			this.updateAttack();
			this.checkIfPlayerIsDead();
			
			if (this.HP <= this.maxHP / 2) {
				this.progressPhase();
			}
		}
		else if (phase == PLAYER_DEAD) {
			timeSincePlayerDeath++;
			if (timeSincePlayerDeath > 50) {
				// move back to original position
				this.moveSpeed = 3;
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
		this.dark.x = this.centerX();
		this.dark.y = this.centerY() - 10;//-10 to adjust vertical placement of shadow for aesthetics
	}
	
	this.updateState = function() {
		if (isAttacking) {
			this.AnimatedSprite.changeState("attack");
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

/*		canvasContext.drawImage(shadowBossGradient, 
								0, 0, //x, y of where to start clipping
								shadowBossGradient.width, shadowBossGradient.height, //width, height of how much to clip
								this.centerX() - shadowBossGradient.width/3, this.centerY() - shadowBossGradient.height/3 - 40, //x, y where to position image
								shadowBossGradient.width/1.5, shadowBossGradient.height/1.5); //width, height of how big to draw image*/
	}
	
	this.progressPhaseTogether = function() {
		for (var i = 0; i < Entities.length; i++) {
			if (Entities[i].name == this.name) {
				Entities[i].progressPhase();
			}
		}
	}
	
	this.progressPhase = function() {
		if (phase == NOT_IN_BATTLE) {
			phase = PHASE_1;
			this.isActive = true;
		}
		else if (phase == PHASE_1) {
			phase = PHASE_2;
			minAttackCooldown = 15;
			maxAttackCooldown = 60;
		}
	}
	
	this.updateBehaviour = function() {
		var distFromPlayer = distanceBetweenEntities(this, Player);
		
		if (isAttacking || isChargingAttack) { // prevent changing behaviour mid attack
			return;
		}
		if (distFromPlayer < 250 && attackCooldown <= 0) {
			if (attackTime == 0) {
				this.setAttackDestination();
			}
			behaviour = ATTACK;
		}
		else if (distFromPlayer > 2) {
			behaviour = FOLLOW;
		}
		else {
			behaviour = IDLE;
		}
	}
	
	this.setAttackDestination = function() {
		let playerX = Player.centerX();
		let playerY = Player.centerY();
		if (phase == PHASE_1) {
			attackDestinationX = playerX + (relativeDistanceBetweenEntitiesX(this, Player) * 100); // multiply by large enough number so that 
			attackDestinationY = playerY + (relativeDistanceBetweenEntitiesY(this, Player) * 100); // we always move in one direction
		}
		else {
			attackDestinationX = playerX + relativeDistanceBetweenEntitiesX(this, Player);
			attackDestinationY = playerY + relativeDistanceBetweenEntitiesY(this, Player);
		}
	}
	
	this.chargeAttackTowardsAttackDestination = function() {
		var speed = attackChargeTime / 4;
		if (phase == PHASE_2) {
			speed *= 2;
			this.setAttackDestination();
		}
		
		let x = this.centerX();
		let y = this.centerY();
		
		let angle = Math.atan2(attackDestinationY - y, attackDestinationX - x);
		this.nextX += speed * Math.cos(angle);
		this.nextY += speed * Math.sin(angle);
		
		let angleDegrees = angle * (180/Math.PI);
		angleDegrees += 90; // not sure why I need this to get the angle right??
		
		// calculate direction facing based on angle
		if (angleDegrees > 30 && angleDegrees < 150) {
			this.movementDirection[RIGHT] = true;
		}
		else if (angleDegrees > 150 && angleDegrees < 210) {
			this.movementDirection[DOWN] = true;
		}
		else if ((angleDegrees > 210 && angleDegrees < 330) || angleDegrees < -30) {
			this.movementDirection[LEFT] = true;
		}
		else {
			this.movementDirection[UP] = true;
		}
		
		this.moveSpeed = 0; // set to zero so that setting movement direction doesn't move us (we want to override movement)
	}
	
	this.initiateAttack = function() {
		if (Attack == null) {
			let velocityX = 0, velocityY = 0;
			
			let angle = Math.atan2(Player.centerY() - this.centerY(), Player.centerX() - this.centerX()) * (180/Math.PI);
			angle += 90; // not sure why I need this to get the angle right??
			
			if (angle >= -135 && angle < -45) { // left
				velocityX = -5;
			}
			else if (angle >= -45 && angle < 45) { // up
				velocityY = -5;
			}
			else if (angle >= 45 && angle < 135) { // right
				velocityX = 5;
			}
			else { // down
				velocityY = 5;
			}
			
			let immuneEntities = [];
			for (var i = 0; i < Entities.length; i++) {
				if (Entities[i].name == this.name) {
					immuneEntities.push(Entities[i]);
				}
			}
			
			let attackOptions = {
				centerX: this.centerX(),
				centerY: this.centerY(),
				width: attackWidth,
				height: attackHeight,
				damage: 1,
				velocityX: velocityX,
				velocityY: velocityY,
				frameLength: 1,
				immuneEntities: immuneEntities
			}
			
			Attack = new ProjectileClass(attackOptions);
			sfx[ATTACK_SFX].play();
		}
	}
	
	this.updateAttack = function() {
		if (Attack != null) {
			Attack.update();
			if (Attack.attackFinished) {
				Attack = null;
			}
		}
		
		if (attackCooldown > 0) {
			attackCooldown--;
		}
	}
	
	this.updateIds = function() { // TODO: Improve this so it isn't first come first served per destination for each entity and instead finds the optimal solution for each entity to each destination
		var uniqueId;
		for (var i = 0; i < Entities.length; i++) {
			if (Entities[i].name == "Shadow") {
				uniqueId = Entities[i].id;
			}
		}
		
		if (this.id == uniqueId) { // only need one shadow to update the ids for everyone
			var playerX = Player.centerX()
			var playerY = Player.centerY();
			
			var x = [];
			var y = [];
			
			// bottom left of player
			x.push(playerX - spaceToLeaveBetweenPlayer);
			y.push(playerY + spaceToLeaveBetweenPlayer);
		
			// above player
			x.push(playerX);
			y.push(playerY - spaceToLeaveBetweenPlayer);
		
			// bottom right of player
			x.push(playerX + spaceToLeaveBetweenPlayer);
			y.push(playerY + spaceToLeaveBetweenPlayer);
			
			var allDistancesFromDestinations = [];
			
			// get distances of each destination for each entity
			for (i = 0; i < Entities.length; i++) {
				if (Entities[i].name == "Shadow") {
					var distancesFromDestinations = [];
					// check optimal places to move to
					for (var j = 0; j < 3; j++) {
						distancesFromDestinations.push(distanceBetweenEntityObject(Entities[i], x[j],y[j], 1,1));
					}
					allDistancesFromDestinations.push(distancesFromDestinations);
				}
			}
			
			// find which is closest for each entity
			var newIds = [];
			var destinationsTaken = [false, false, false];
			for (i = 0; i < allDistancesFromDestinations.length; i++) { // entities
				var closest = -1;
				for (j = 0; j < 3; j++) { // destinations
					if (destinationsTaken[j]) { // destination already taken by another entity, skip
						continue; // OR REPLACE / REMOVE & THIS WHOLE SECTION JUST ORDERS THE DESTINATIONS ????
					}
					else if (closest == -1) { // first pass, just set as this destination
						closest = j;
					}
					else if (allDistancesFromDestinations[i][j] < allDistancesFromDestinations[i][closest]) {
						closest = j; // choose destination that's closest
					}
				}
				newIds.push(closest);
				destinationsTaken[closest] = true;
			}
			
			// set new ids
			for (var i = 0, idIndex = 0; i < Entities.length; i++) {
				if (Entities[i].name == "Shadow") {
					Entities[i].id = newIds[idIndex];
					idIndex++;
				}
			}
		}
	}
	
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
			phase = PLAYER_DEAD;
			timeSincePlayerDeath = 0;
		}
	}
	
	this.closeArena = function() {
		tileGrid[98 * TILE_COLS + 49] = 7;
		tileGrid[99 * TILE_COLS + 49] = 7;
		tileGrid[100 * TILE_COLS + 49] = 7;
		tileGrid[101 * TILE_COLS + 49] = 7;
		
		for (var i = 98 * TILE_COLS; i <= 101 * TILE_COLS; i += TILE_COLS) {
			for (var j = 50; j < 70; j++) {
				tileGrid[i + j] = 1;
			}
		}

		generateTileEntities();
	}
	
	this.addHealingStatue = function() {
		let xPos = 1088, yPos = 2592;
		let xCollisionStart = 34, xCollisionEnd = 35, yCollisionStart = 83, yCollisionEnd = 84;
		if ((Player.x + Player.width) < (xCollisionStart * TILE_W) || Player.x > (xCollisionEnd * TILE_W + TILE_W) ||
			(Player.y + Player.height) < (yCollisionStart * TILE_H) || Player.y - (Player.collisionBoxHeight - Player.height) > (yCollisionEnd * TILE_H + TILE_H)) {
				SortedArt.push({x: xPos, y: yPos, imgName: "shadowHealingStatue", height: window["shadowHealingStatue"].height});
		
				OverlayingArt.push({x: xPos + 19, y: yPos + 32, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255});
		
				addHealingStatueCollisionData(xCollisionStart, xCollisionEnd, yCollisionStart, yCollisionEnd);
		
				generateTileEntities();
				generateFloorTiles();
			}
		else {
			let shadowBoss = new ShadowBoss(1);
			setTimeout(shadowBoss.addHealingStatue, 100);
		}
	}

	this.deathHandle = function()
	{
		if(this.isDead) 
		{
			this.addDeathTorch();
			var shadowCount = 0;
			for(var i = 0; i < Entities.length; i++) {
				if(Entities[i].name == this.name) {
					shadowCount++;
					Entities[i].dark.range *= 1.5;
				}
			}

			// make sure this is the last shadow
			if(shadowCount == 1) {
				// Add boss name to player's boss-list.
				Player.bossesKilled.push(this.name);

				bossIsDefeated = true;
				showBossDefeated = function() {
						// show death message on screen
						textDisplay("SHADOW DEFEATED", textDisplayTextColour, bossDefeatedTextBackgroundColour);

				}
				
				this.addHealingStatue();
				
				switchMusic(AMBIENT_MUSIC, BOSS_MUSIC_FADE_OUT_RATE, AMBIENT_MUSIC_FADE_IN_RATE);
			} 
		}
		
		return this.isDead;
	}

	this.addDeathTorch = function() {
		OverlayingArt.push(
			{x:this.centerX(), y:this.centerY() - 10, imgName: 'torchPic', range:150, r:1, g:1, b:1}
		);

		this.dark.range = 0;
	}
}