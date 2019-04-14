// inherit from EntityClass
BeastBoss.prototype = new EntityClass();
BeastBoss.prototype.constructor = BeastBoss;

function BeastBoss() {
	// behaviours
	const IDLE = 0
	const FOLLOWING = 1;
	const ATTACKING = 2;
	const SHIELDING = 3;
	
	this.width = 96;
	this.height = 128;
	
	this.collisionBoxHeight = this.width;
	
	this.moveSpeed = 2;
	this.HP = 30;
	this.weight = 10; // 0-10 (10 means can't be pushed by anything)
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1}
	}
	
	let spritePadding = 64;
	this.AnimatedSprite = new AnimatedSpriteClass(beastSheet, this.width, this.height, spritePadding, this.states);

	this.directionFacing = DOWN;

	let enemyBehaviour = IDLE;
	let attackCooldown = 0;
	let Attack;
	let isAttacking = false;

	let shieldCooldown = 0;
	let isShielding = false;
		
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right

		switch(enemyBehaviour) {
		case FOLLOWING:
			if (Math.abs(Player.y - this.y) > 75) {
				if (Player.y < this.y) {
					this.movementDirection[UP] = true;
				}
		
				if (Player.y > this.y) {
					this.movementDirection[DOWN] = true;
				}
			}
		
			if (Math.abs(Player.x - this.x) > 50) {
				if (Player.x > this.x) {
					this.movementDirection[RIGHT] = true;
				}

				if (Player.x < this.x) {
					this.movementDirection[LEFT] = true;
				}
			}
			break;

		case ATTACKING:
			if (attackCooldown <= 0) {
				let centerX = this.x + this.width / 2, centerY = this.y + this.height / 2;
				centerY += ((this.collisionBoxHeight / 2) + 20 + (this.collisionBoxHeight / 2));

				let attackOptions = {
					centerX: centerX,
					centerY: centerY,
					width: 40,
					height: 40,
					damage: 1,
					velocityX: 0,
					velocityY: 1,
					frameLength: 1,
					immuneEntities: [this]
				}
				
				Attack = new ProjectileClass(attackOptions);
				sfx[ATTACK_SFX].play();
				attackCooldown = 50;
				isAttacking = true;
			}
			else {
				if (Attack.attackFinished) {
					isAttacking = false;
				}
				attackCooldown--;
				Attack.update();
			}
			break;

		case SHIELDING:
			if (shieldCooldown <= 0) {
				this.isInvulnerable = true;
				isShielding = true;
				shieldCooldown = 50;
			}
			else {
				if (shieldCooldown <= 10) {
					this.isInvulnerable = false;
					isShielding = false;
				}
				shieldCooldown--;
			}
			break;
		}

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
}