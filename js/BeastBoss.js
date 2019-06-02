// inherit from EntityClass
BeastBoss.prototype = new EntityClass();
BeastBoss.prototype.constructor = BeastBoss;

function BeastBoss() {
	// PHASES
	const NOT_IN_BATTLE = 0;
	const PHASE_1 = 1;
	const PHASE_2 = 2;
	
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOWING = 1;
	const ATTACKING = 2;
	const SHIELDING = 3;
	const DASHING = 4;
	
	this.width = 96;
	this.height = 128;
	
	this.collisionBoxHeight = this.width;

	this.moveSpeed = 0.5;
	this.followSpeed = this.moveSpeed;
	this.dashSpeed = 8;
	this.HP = 50;
	this.maxHP = this.HP;
	this.weight = 10; // 0-10 (10 means can't be pushed by anything)
	
	this.name = beastBossName;
	this.isActive = false;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1}
	}
	
	let spritePadding = 64;
	this.AnimatedSprite = new AnimatedSpriteClass(beastSheet, this.width, this.height, spritePadding, this.states);

	this.directionFacing = DOWN;

	
	let phase = NOT_IN_BATTLE;
	let behaviour = FOLLOWING;
	let isDashing = false;
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
		if (phase == NOT_IN_BATTLE) {
			if (distanceBetweenEntities(this, Player) < 200) {
				this.progressPhase();
				this.closeArena();
			}
		}
		else if (phase == PHASE_1 || phase == PHASE_2) {
			switch(behaviour) {
			case FOLLOWING:
				this.moveSpeed = this.followSpeed;
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
				break;

			case ATTACKING:
				// BEHAVIOUR GOES HERE
				break;

			case SHIELDING:
				// BEHAVIOUR GOES HERE
				break;

			case DASHING:
				var distFromPlayer = distanceBetweenEntities(this, Player);
				this.moveSpeed = this.dashSpeed;
				if (distFromPlayer < 100){
					isDashing = false;
				}
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
				break;
			}
		}

		this.updateState();
		this.updateBehaviour();
		EntityClass.prototype.move.call(this); // call superclass function
	}
	
	this.updateBehaviour = function() {
		var distFromPlayer = distanceBetweenEntities(this, Player);
		if(isDashing){
			return;
		}else if (distFromPlayer >250 ){
			behaviour = DASHING;
			isDashing = true;
		} else {
				behaviour = FOLLOWING;
		}

	}
	this.updateState = function() {
		// CHANGE ANIMATION STATES HERE
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
	
	this.closeArena = function() {
		tileGrid[98 * TILE_COLS + 165] = 10;
		tileGrid[99 * TILE_COLS + 165] = 10;
		tileGrid[100 * TILE_COLS + 165] = 10;
		tileGrid[101 * TILE_COLS + 165] = 10;
		
		for (var i = 98 * TILE_COLS; i <= 101 * TILE_COLS; i += TILE_COLS) {
			for (var j = 145; j < 165; j++) {
				tileGrid[i + j] = 1;
			}
		}

		generateTileEntities();
	}
	
	this.addHealingStatue = function() {
		SortedArt.push({x: 5760, y: 2592, imgName: "healingStatue2", height: window["healingStatue2"].height});
		
		this.addHealingStatueCollisionData();
		
		generateTileEntities();
		generateFloorTiles();
	}
	
	this.addHealingStatueCollisionData = function() {
		for (var i = 83 * TILE_COLS; i <= 84 * TILE_COLS; i += TILE_COLS) {
			for (var j = 180; j <= 181; j++) {
				tileGrid[i + j] = 64;
			}
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
					deathTextDisplay("BEAST SLAUGHTERED ", 'grey', 'black');

					
			}
			
			this.addHealingStatue();
		}
		return this.isDead;
	}
}