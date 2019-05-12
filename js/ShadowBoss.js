// inherit from EntityClass
ShadowBoss.prototype = new EntityClass();
ShadowBoss.prototype.constructor = ShadowBoss;

function ShadowBoss(id) {
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
	this.HP = 30;
	this.maxHP = this.HP;
	this.weight = 7; // 0-10 (10 means can't be pushed by anything)
	
	this.name = "Shadow";
	this.isActive = false;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.1},
		attack: {startFrame: 8, endFrame: 11, animationSpeed: 0.1}
	}
	
	let spritePadding = 64;
	this.AnimatedSprite = new AnimatedSpriteClass(shadowSheet, this.width, this.height, spritePadding, this.states);

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
	let maxAttackCooldown = 150;
	let minAttackCooldown = 50;
	let attackCooldown = Math.round(Math.random()*(maxAttackCooldown-minAttackCooldown)) + minAttackCooldown;
	let attackWidth = 64;
	let attackHeight = 64;
	let attackDestinationX;
	let attackDestinationY;
	let attackChargeTime = 0;
	
	let timeSincePlayerDeath = 0;
		
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
		if (phase == NOT_IN_BATTLE) {
			if (distanceBetweenEntities(this, Player) < 200) {
				this.progressPhaseTogether();
			}
		}
		else if (phase == PHASE_1 || phase == PHASE_2) {
			switch(behaviour) {
			case FOLLOW:
				// get center of player and us
				destinationX = Player.x + Player.width / 2;
				destinationY = collisionBoxY(Player) + Player.collisionBoxHeight / 2;
				
				bossX = this.x + this.width / 2;
				bossY = collisionBoxY(this) + this.collisionBoxHeight / 2;
				
				
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
				if (attackTime < 30) {
					attackChargeTime++;
					this.chargeAttackTowardsAttackDestination();
				}
				else if (attackTime < 40) {
					if (attackTime == 30) {
						attackChargeTime = 0;
						this.initiateAttack();
					}
				}
				else if (attackTime < 70) {
					attackChargeTime++;
					this.chargeAttackTowardsAttackDestination();
				}
				else if (attackTime < 80) {
					if (attackTime == 70) {
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
		let playerX = Player.x + Player.width / 2;
		let playerY = collisionBoxY(Player) + Player.collisionBoxHeight / 2;
		attackDestinationX = playerX + (relativeDistanceBetweenEntitiesX(this, Player) * 100); // multiply by large enough number so that 
		attackDestinationY = playerY + (relativeDistanceBetweenEntitiesY(this, Player) * 100); // we always move in one direction
	}
	
	this.chargeAttackTowardsAttackDestination = function() {
		let x = this.x + this.width / 2;
		let y = collisionBoxY(this) + this.collisionBoxHeight / 2;
		
		this.moveSpeed = attackChargeTime / 4;
		if (Math.abs(attackDestinationY - y) > 2) {
			if (attackDestinationY < y) {
				this.movementDirection[UP] = true;
			}

			if (attackDestinationY > y) {
				this.movementDirection[DOWN] = true;
			}
		}

		if (Math.abs(attackDestinationX - x) > 2) {
			if (attackDestinationX > x) {
				this.movementDirection[RIGHT] = true;
			}

			if (attackDestinationX < x) {
				this.movementDirection[LEFT] = true;
			}
		}
	}
	
	this.initiateAttack = function() {
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
			
			let immuneEntities = [];
			for (var i = 0; i < Entities.length; i++) {
				if (Entities[i].name == this.name) {
					immuneEntities.push(Entities[i]);
				}
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

	this.deathHandle = function()
	{
		if(this.isDead) 
		{
			var shadowCount = 0;
			for(var i = 0; i < Entities.length; i++) {
				if(Entities[i].name == this.name) {
					shadowCount++;
				}
			}

			// make sure this is the last shadow
			if(shadowCount == 1) {
				// Add boss name to player's boss-list.
				Player.bossesKilled.push(this.name);

				bossIsDefeated = true;
				showBossDefeated = function() {
						// show death message on screen
						deathTextDisplay("SHADOW DEFEATED", 'grey', 'black');

				}
				
			}
		}
		return this.isDead;
	}	
}