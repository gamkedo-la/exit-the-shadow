// inherit from EntityClass
BeastBoss.prototype = new EntityClass();
BeastBoss.prototype.constructor = BeastBoss;

function BeastBoss() {
	// PHASES
	const NOT_IN_BATTLE = 0;
	const PHASE_1 = 1;
	const PHASE_2 = 2;
	const PLAYER_DEAD = 3;
	
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOWING = 1;
	const ATTACKING = 2;
	const SHIELDING = 3;
	const DASHING = 4;
	
	this.beastHair = [];

	this.width = 96;
	this.height = 128;
	
	this.collisionBoxHeight = this.width;

	this.moveSpeed = 0.5;
	this.followSpeed = this.moveSpeed;
	this.dashSpeed = 8;
	this.HP = 50;
	this.oldHP = this.HP;
	this.maxHP = this.HP;
	this.weight = 10; // 0-10 (10 means can't be pushed by anything)
	
	this.name = beastBossName;
	this.isActive = false;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.1},
		run: {startFrame: 4, endFrame: 7, animationSpeed: 0.5},
		attack: {startFrame: 8, endFrame: 11, animationSpeed: 0.1},
		shield: {startFrame: 12, endFrame: 12, animationSpeed: 0.1}
	}
	
	let spritePadding = 64;
	this.AnimatedSprite = new AnimatedSpriteClass(beastSheet, this.width, this.height, spritePadding, this.states);

	this.directionFacing = DOWN;

	
	let phase = NOT_IN_BATTLE;
	let behaviour = FOLLOWING;
	let isDashing = false;

	let attackCooldown = 0;
	let Attack = null;
	let attackWidth = 96;
	let attackHeight = 96;
	let isAttacking = false;
	let distBeforeAttacking = 80;

	let enemyIsHit = 0;
	let timeSincePlayerDeath = 0;
	let shieldCooldown = 0;
	let isShielding = false;
	let shield = true;

	this.prepHair = function () {
		for(var eachHair=0;eachHair<135;eachHair++) {
			this.beastHair[eachHair] = [];
			for(var i=0;i<20;i++) {
				this.beastHair[eachHair][i] = {len: Math.random() * 7 + 3,
											ang: (Math.random() - 0.5) * 2,
											vel: (Math.random() - 0.5) * 0.005,
											col: randCol};
			}
			 var r = 200+55*Math.random()|0,
			        g = 150*Math.random()|0,
			        b = 35*Math.random()|0;
			var randCol = 'rgb(' + r + ',' + g + ',' + b + ')';
			this.beastHair[eachHair][0].col = randCol;
			this.beastHair[eachHair][0].ang = Math.random() * Math.PI * 2.0;
		}
	}

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
				if (Math.abs(Player.centerY() - this.centerY()) >= this.width/2) {
					if (Player.centerY() < this.centerY()) {
						this.movementDirection[UP] = true;
					}
		
					if (Player.centerY() > this.centerY()) {
						this.movementDirection[DOWN] = true;
					}
				}
		
				if (Math.abs(Player.centerX() - this.centerX()) >= this.width/2) {
					if (Player.centerX() > this.centerX()) {
						this.movementDirection[RIGHT] = true;
					}

					if (Player.centerX() < this.centerX()) {
						this.movementDirection[LEFT] = true;
					}
				}
				break;

			case ATTACKING:
				this.initiateAttack();
				break;

			case SHIELDING:
				this.initiateShield();
				break;

			case DASHING:
				var distFromPlayer = distanceBetweenEntities(this, Player);
				this.moveSpeed = this.dashSpeed;
				if (distFromPlayer < distBeforeAttacking){
					isDashing = false;
				}
				if (Math.abs(Player.centerY() - this.centerY()) > 10) {
					if (Player.centerY() < this.centerY()) {
						this.movementDirection[UP] = true;
					}
		
					if (Player.centerY() > this.centerY()) {
						this.movementDirection[DOWN] = true;
					}
				}
		
				if (Math.abs(Player.centerX() - this.centerX()) > 10) {
					if (Player.centerX() > this.centerX()) {
						this.movementDirection[RIGHT] = true;
					}

					if (Player.centerX() < this.centerX()) {
						this.movementDirection[LEFT] = true;
					}
				}
				break;
			}
			this.updateAttack();
			this.updateShield();
			this.oldHP = this.HP;
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
		this.updateState();
		this.updateBehaviour();
		EntityClass.prototype.move.call(this); // call superclass function
	}
	
	this.updateBehaviour = function() {
		var distFromPlayer = distanceBetweenEntities(this, Player);
		if(isDashing || isShielding){
			return;
		}
		else if (distFromPlayer > 250){
			behaviour = DASHING;
			isDashing = true;
		}
		else if (distFromPlayer < distBeforeAttacking){
			behaviour = ATTACKING;
			
		}
		else if (shield && !isShielding) {
			shield = false;
			behaviour = SHIELDING;
		}
		else {
				behaviour = FOLLOWING;
		}

	}
	this.updateState = function() {
		if (isAttacking) {
			this.AnimatedSprite.changeState("attack");
		}
		else if (isShielding) {
			this.AnimatedSprite.changeState("shield");
		}
		else if (isDashing) {
			this.AnimatedSprite.changeState("run");
		}
		else if (this.movementDirection[UP] || this.movementDirection[LEFT] || this.movementDirection[DOWN] || this.movementDirection[RIGHT]) {
			this.AnimatedSprite.changeState("walk");
		}
		else {
			this.AnimatedSprite.changeState("idle");
		}
	}
	
	this.initiateAttack = function() {
		if (attackCooldown <= 0 && Attack == null) {
			let centerX = this.centerX(), centerY = this.centerY();
			let velocityX = 0, velocityY = 0;
			
			switch(this.directionFacing) {
			case UP:
				centerY -= (this.collisionBoxHeight / 2) + (attackHeight / 2);
				velocityY = -10;
				break;
			case DOWN:
				centerY += (this.collisionBoxHeight / 2) + (attackHeight / 2);
				velocityY = 10;
				break;
			case LEFT:
				centerX -= ((this.width / 2) + (attackWidth / 2));
				velocityX = -10;
				break;
			case RIGHT:
				centerX += ((this.width / 2) + (attackWidth / 2));
				velocityX = 10;
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
			shieldCooldown = 50;
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
		else {
			if(this.HP < this.oldHP){
				enemyIsHit++;
			}
			if (enemyIsHit >= 3){
				shield = true;
			 	enemyIsHit = 0; 
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
			this.moveSpeed = this.followSpeed;
			timeSincePlayerDeath = 0;
		}
	}

	this.draw = function() {
		for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
			var currX = this.x + this.width*0.5;
			var currY = this.y + this.height*0.5;
			var rAng = 0;
			canvasContext.beginPath();
			canvasContext.strokeStyle = this.beastHair[eachHair][0].col;
			for(var i=0; i < this.beastHair[eachHair].length; i++) {
				this.beastHair[eachHair][i].ang += 
					this.beastHair[eachHair][i].vel;

				//this.beastHair[eachHair][i].vel += (Math.random()-0.5) * 0.01;

				rAng += this.beastHair[eachHair][i].ang;
				currX += Math.cos(rAng) * this.beastHair[eachHair][i].len;
				currY += Math.sin(rAng) * this.beastHair[eachHair][i].len;
				canvasContext.lineTo(currX, currY);
			}
			canvasContext.stroke();
		}

		// EntityClass.prototype.draw.call(this);
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
		let xPos = 5760, yPos = 2592;
		SortedArt.push({x: xPos, y: yPos, imgName: "beastHealingStatue", height: window["beastHealingStatue"].height});
		
		OverlayingArt.push({x: xPos + 19, y: yPos + 32, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255});
		
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