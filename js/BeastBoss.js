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

	this.width = 64;
	this.height = 64;
	this.collisionBoxHeight = this.height;

	this.moveSpeed = 0.5;
	this.followSpeed = this.moveSpeed;
	this.dashSpeed = 8;
	this.HP = 50;
	this.oldHP = this.HP;
	this.maxHP = this.HP;
	this.weight = 10; // 0-10 (10 means can't be pushed by anything)

	this.name = beastBossName;
	this.isActive = false;
	
	let phase = NOT_IN_BATTLE;
	let behaviour = FOLLOWING;
	let isDashing = false;

	let attackCooldown = 0;
	let Attack = null;
	let attackWidth = 192;
	let attackHeight = 192;
	let isAttacking = false;
	let distBeforeAttacking = 80;

	let enemyIsHit = 0;
	let timeSincePlayerDeath = 0;
	let shieldCooldown = 0;
	let isShielding = false;
	let shield = true;
	let breathingOsc = 0; // oscillator, just advances for pulse effect

	this.prepHair = function () {
		for(var eachHair=0;eachHair<135;eachHair++) {
			this.beastHair[eachHair] = [];
			var bendDownJoint = Math.random() * 6+12;
			for(var i=0;i<20;i++) {
				this.beastHair[eachHair][i] = {len: Math.random() * 7 + 3,
											ang: (Math.random() - 0.5) * 2,
											vel: (Math.random() - 0.5) * 0.005,
											hei: (Math.random()*3+0.7) * (i<bendDownJoint ? 1 : -0.7),
											col: randCol};
			}
			 var r = 70+75*Math.random()|0,
			        g = 20+60*Math.random()|0,
			        b = 5*Math.random()|0;
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
	
	this.initiateAttack = function() {
		if (attackCooldown <= 0 && Attack == null) {
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
			
			let attackOptions = {
				centerX: this.centerX(),
				centerY: this.centerY(),
				width: attackWidth,
				height: attackHeight,
				damage: 1,
				velocityX: velocityX,
				velocityY: velocityY,
				frameLength: 1,
				immuneEntities: [this]
			}
			
			Attack = new ProjectileClass(attackOptions);
			//sfx[ATTACK_SFX].play(); // TODO: add beast boss attack sound
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
		var wiggleMult = 1.0;
		switch(behaviour) {
			case IDLE:
				wiggleMult = 1;
				break;
			case FOLLOWING:
				wiggleMult = 3;
				break;
			case ATTACKING:
				wiggleMult = 10;
				for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
					for(var i=1; i < this.beastHair[eachHair].length; i++) { // skipping root [0]
						this.beastHair[eachHair][i].ang *= 0.8;
					}
					this.beastHair[eachHair][0].ang += (Math.cos(breathingOsc)) * 0.03; // spin whole thing
				}
				break;
			case SHIELDING:
				wiggleMult = 0.03;
				for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
					for(var i=1; i < this.beastHair[eachHair].length; i++) { // skipping root [0]
						this.beastHair[eachHair][i].ang *= 1.01;
					}
				}
				break;
			case DASHING:
				wiggleMult = 5;
				for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
					this.beastHair[eachHair][0].ang += (0.8 + Math.cos(breathingOsc)) * 0.01; // spin whole thing
				}
				break;
		}

		breathingOsc+= 0.1;
		wiggleMult += Math.cos(breathingOsc) * 2;
			
		var currX,currY,rAng;	
		canvasContext.lineWidth = 2;
		canvasContext.globalAlpha = 0.1;
		for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
			currX = this.x + this.width*0.5 - 16;
			currY = this.y + this.height*0.5 + 16;
			rAng = 0;
			canvasContext.beginPath();
			canvasContext.moveTo(currX, currY);
			canvasContext.strokeStyle = "black";
			for(var i=0; i < this.beastHair[eachHair].length; i++) {
				this.beastHair[eachHair][i].ang += 
					this.beastHair[eachHair][i].vel * wiggleMult;

				rAng += this.beastHair[eachHair][i].ang;
				canvasContext.lineTo(currX, currY);
				currX += Math.cos(rAng) * this.beastHair[eachHair][i].len;
				currY += Math.sin(rAng) * this.beastHair[eachHair][i].len;
			}
			canvasContext.stroke();
		}
		canvasContext.globalAlpha = 1.0;

		canvasContext.lineWidth = 1.5;
		for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
			canvasContext.beginPath();
			canvasContext.strokeStyle = this.beastHair[eachHair][0].col;
			currX = this.x + this.width*0.5 - 16;
			currY = this.y + this.height*0.5 + 16;
			rAng = 0;
			var shadowOffsetHeight = 0;
			canvasContext.moveTo(currX, currY);
			for(var i=0; i < this.beastHair[eachHair].length; i++) {
								rAng += this.beastHair[eachHair][i].ang;
				shadowOffsetHeight+=this.beastHair[eachHair][i].hei;
				canvasContext.lineTo(currX+shadowOffsetHeight*0.7, currY-shadowOffsetHeight);
				currX += Math.cos(rAng) * this.beastHair[eachHair][i].len;
				currY += Math.sin(rAng) * this.beastHair[eachHair][i].len;
			}
			canvasContext.stroke();
		}
		canvasContext.lineWidth = 1;
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