// inherit from EntityClass
BeastBoss.prototype = new EntityClass();
BeastBoss.prototype.constructor = BeastBoss;

function BeastBoss(name) {
	// PHASES
	const NOT_IN_BATTLE = 0;
	const PHASE_1 = 1;
	const PHASE_2 = 2;
	const PLAYER_DEAD = 3;
	
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOWING = 1;
	const ATTACKING = 2;
	const STUNNED = 3;
	const DASHING = 4;
	
	this.beastHair = [];

	this.width = 64;
	this.height = 64;
	this.collisionBoxHeight = this.height;

	this.moveSpeed = 0.5;
	this.followSpeed = this.moveSpeed;
	this.dashSpeed = 8;
	this.HP = 40;
	this.oldHP = this.HP;
	this.maxHP = this.HP;
	this.weight = 10; // 0-10 (10 means can't be pushed by anything)

	this.name = name;
	this.isActive = false;
	
	let phase = NOT_IN_BATTLE;
	let behaviour = IDLE;
	
	let isDashing = false;
	let distBeforeDashing = 250;

	let attackCooldown = 0;
	let Attack = null;
	let attackWidth = 192;
	let attackHeight = 192;
	let isAttacking = false;
	let distBeforeAttacking = 80;
	let minTimeBetweenAttacks = 40;
	let timeSinceLastAttack = minTimeBetweenAttacks;
	
	let attackTime = 0;
	let timeForAttackInFrames = 8;
	let attackChargeTime = 0;

	let enemyIsHit = 0;
	let timeSincePlayerDeath = 0;
	let stunnedCooldown = 0;
	let isStunned = false;
	let stunned = false;
	let stunTime = 100;
	let stunThreshold;
	let breathingOsc = 0; // oscillator, just advances for pulse effect
	
	let minTimesHitBeforeGettingStunned = 2;
	let maxTimesHitBeforeGettingStunned = 5;
	
	let amountToChangeHairColor = 30;
	let changeHairColor = amountToChangeHairColor;

	this.prepHair = function () {
		let numberOfHairs, maxLength;
		if (this.name == beastBossName) {
			numberOfHairs = 70;
			maxLength = 10;
		}
		else {
			numberOfHairs = 30;
			maxLength = 6;
		}
		for(var eachHair=0;eachHair<numberOfHairs;eachHair++) {
			this.beastHair[eachHair] = [];
			var bendDownJoint = Math.random() * 6+12;
			for(var i=0;i<20;i++) {
				this.beastHair[eachHair][i] = {len: Math.random() * (maxLength*0.7) + (maxLength*0.3),
											ang: (Math.random() - 0.5) * 2,
											vel: (Math.random() - 0.5) * 0.005,
											hei: (Math.random()*3+0.7) * (i<bendDownJoint ? 1 : -0.7),
											r: r,
											g: g,
											b: b};
			}
			
	 	   	var r = 70+75*Math.random()|0,
	       	    g = 20+60*Math.random()|0,
	       		b = 5*Math.random()|0;

			this.beastHair[eachHair][0].r = r;
			this.beastHair[eachHair][0].g = g;
			this.beastHair[eachHair][0].b = b;
			this.beastHair[eachHair][0].ang = Math.random() * Math.PI * 2.0;
		}
	}

	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
		if (phase == NOT_IN_BATTLE) {
			if (distanceBetweenEntities(this, Player) < 200 && this.name == beastBossName) {
				switchMusic(BEAST_BOSS, 1, 1);
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
				attackTime++;
				if (attackTime < timeForAttackInFrames * 0.75) {
					attackChargeTime++;
				}
				else if (attackTime < timeForAttackInFrames) {
					if (attackTime == timeForAttackInFrames * 0.75) {
						attackChargeTime = 0;
						attackTime = 0;
						this.initiateAttack();
						timeSinceLastAttack = 0;
					}
				}
				break;

			case STUNNED:
				this.initiateStunned();
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
			this.updateStunned();
			this.oldHP = this.HP;
			
			this.updateBehaviour();
			EntityClass.prototype.move.call(this); // call superclass function
			
			if (this.HP <= this.maxHP / 2 && phase == PHASE_1) {
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
			}
		}
	}
	
	this.updateBehaviour = function() {
		var distFromPlayer = distanceBetweenEntities(this, Player);
		if(isDashing || isStunned){
			return;
		}
		else if (distFromPlayer > distBeforeDashing){
			behaviour = DASHING;
			isDashing = true;
		}
		else if (timeSinceLastAttack > minTimeBetweenAttacks && distFromPlayer < distBeforeAttacking){
			behaviour = ATTACKING;
			
		}
		else if (stunned && !isStunned) {
			stunned = false;
			behaviour = STUNNED;
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
		timeSinceLastAttack++;
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

	this.initiateStunned = function() {
		if (stunnedCooldown <= 0) {
			isStunned = true;
			stunnedCooldown = stunTime;
		}
	}
	
	this.updateStunned = function() {
		if (enemyIsHit == 0) {
			stunThreshold = Math.random() * (maxTimesHitBeforeGettingStunned - minTimesHitBeforeGettingStunned) + minTimesHitBeforeGettingStunned;
		}
		
		if (stunnedCooldown > 0) {
			if (stunnedCooldown <= 10) {
				this.isInvulnerable = false;
				isStunned = false;
			}
			stunnedCooldown--;
		}
		else {
			if(this.HP < this.oldHP){
				enemyIsHit++;
			}
			if (enemyIsHit >= stunThreshold){
				stunned = true;
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
						this.beastHair[eachHair][i].ang *= 0.7;
					}
					this.beastHair[eachHair][0].ang += (Math.cos(breathingOsc)) * 0.03; // spin whole thing
				}
				break;
			case STUNNED:
				wiggleMult = 0.03;
				for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
					for(var i=1; i < this.beastHair[eachHair].length; i++) { // skipping root [0]
						this.beastHair[eachHair][i].ang *= 1.03;
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
		// canvasContext.globalAlpha = 0.1;
		for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
			currX = this.x + this.width*0.5;
			currY = this.y + this.height*0.5;
			rAng = 0;
			canvasContext.beginPath();
			canvasContext.moveTo(currX, currY);
			canvasContext.strokeStyle = "#666666";
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
		//canvasContext.globalAlpha = 1.0;

		canvasContext.lineWidth = 1.5;
		for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
			canvasContext.beginPath();
			canvasContext.strokeStyle = 'rgb(' + this.beastHair[eachHair][0].r + ',' + this.beastHair[eachHair][0].g + ',' + this.beastHair[eachHair][0].b + ')';
			currX = this.x + this.width*0.5;
			currY = this.y + this.height*0.5;
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
		
		if (changeHairColor < amountToChangeHairColor) {
			for(var eachHair=0; eachHair < this.beastHair.length; eachHair++) {
				this.beastHair[eachHair][0].r -= 0.2;
				this.beastHair[eachHair][0].g -= 1;
				this.beastHair[eachHair][0].b -= 1;
			}
			changeHairColor++;
		}
	}
	
	this.progressPhase = function() {
		if (phase == NOT_IN_BATTLE) {
			phase = PHASE_1;
			this.isActive = true;
		}
		else if (phase == PHASE_1) {
			phase = PHASE_2;
			this.followSpeed *= 2;
			minTimesHitBeforeGettingStunned++;
			maxTimesHitBeforeGettingStunned++;
			stunTime /= 1.5;
			distBeforeDashing /= 1.5;
			changeHairColor = 0;
			//isDashing = true;
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
		let xCollisionStart = 180, xCollisionEnd = 181, yCollisionStart = 83, yCollisionEnd = 84;
		if ((Player.x + Player.width) < (xCollisionStart * TILE_W) || Player.x > (xCollisionEnd * TILE_W + TILE_W) ||
			(Player.y + Player.height) < (yCollisionStart * TILE_H) || Player.y - (Player.collisionBoxHeight - Player.height) > (yCollisionEnd * TILE_H + TILE_H)) {
				SortedArt.push({x: xPos, y: yPos, imgName: "beastHealingStatue", height: window["beastHealingStatue"].height});
		
				OverlayingArt.push({x: xPos + 19, y: yPos + 32, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255});
		
				addHealingStatueCollisionData(xCollisionStart, xCollisionEnd, yCollisionStart, yCollisionEnd);
		
				generateTileEntities();
				generateFloorTiles();
			}
		else {
			let beastBoss = new BeastBoss();
			setTimeout(beastBoss.addHealingStatue, 100);
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
					textDisplay("BEAST SLAUGHTERED ", textDisplayTextColour, bossDefeatedTextBackgroundColour);

					
			}
			
			this.addHealingStatue();
			switchMusic(AMBIENT_MUSIC, BOSS_MUSIC_FADE_OUT_RATE, AMBIENT_MUSIC_FADE_IN_RATE);
		}
		return this.isDead;
	}

}