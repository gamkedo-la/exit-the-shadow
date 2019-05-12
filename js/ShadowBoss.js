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
	
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOW = 1;
	const ATTACK = 2;
	
	this.id = id;
	
	this.width = 48;
	this.height = 128;
	
	this.collisionBoxHeight = this.width;
	this.moveSpeed = 2;
	this.HP = 20;
	this.maxHP = this.HP;
	this.weight = 7; // 0-10 (10 means can't be pushed by anything)
	
	this.name = "Shadow";
	this.isActive = false;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1}
	}
	
	let spritePadding = 64;
	this.AnimatedSprite = new AnimatedSpriteClass(shadowSheet, this.width, this.height, spritePadding, this.states);

	this.directionFacing = DOWN;

	let behaviour = IDLE;
	let phase = NOT_IN_BATTLE;
	
	let spaceBetweenPlayer = 150;
		
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
				playerX = Player.x;
				playerY = Player.y;
				
				switch(this.id) {
				case LEFT_SHADOW:
					playerX -= spaceBetweenPlayer;
					playerY += spaceBetweenPlayer;
					break;
					
				case MIDDLE_SHADOW:
					playerY -= spaceBetweenPlayer;
					break;
					
				case RIGHT_SHADOW:
					playerX += spaceBetweenPlayer;
					playerY += spaceBetweenPlayer;
					break;
				}
				
				if (Math.abs(playerY - this.y) > 2) {
					if (playerY < this.y) {
						this.movementDirection[UP] = true;
					}
		
					if (playerY > this.y) {
						this.movementDirection[DOWN] = true;
					}
				}
		
				if (Math.abs(playerX - this.x) > 2) {
					if (playerX > this.x) {
						this.movementDirection[RIGHT] = true;
					}

					if (playerX < this.x) {
						this.movementDirection[LEFT] = true;
					}
				}
				break;

			case ATTACK:
				// BEHAVIOUR GOES HERE
				break;
			}
			
			if (this.HP <= this.maxHP / 2) {
				this.progressPhase();
			}
		}
		
		this.updateBehaviour();
		this.updateState();
		EntityClass.prototype.move.call(this); // call superclass function
	}
	
	this.updateState = function() {
		// CHANGE ANIMATION STATES HERE
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
			phase = phase_2;
		}
	}
	
	this.updateBehaviour = function() {
		var distFromPlayer = distanceBetweenEntities(this, Player);
		
		if (distFromPlayer > 5) {
			behaviour = FOLLOW;
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