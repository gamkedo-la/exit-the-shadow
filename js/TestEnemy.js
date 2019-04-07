// inherit from EntityClass
TestEnemyClass.prototype = new EntityClass();
TestEnemyClass.prototype.constructor = TestEnemyClass;

const FOLLOWING = 0;
const ATTACKING = 1;
const SHIELDING = 2;

function TestEnemyClass(testEnemyBehaviour) {
	this.width = 25;
	this.height = 50;
	
	this.collisionBoxHeight = this.width;
	
	this.moveSpeed = 2;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.25},
		dash: {startFrame: 8, endFrame: 9, animationSpeed: 1},
		attack: {startFrame: 10, endFrame: 10, animationSpeed: 1},
		shield: {startFrame: 11, endFrame: 11, animationSpeed: 1}
	}
	
	this.AnimatedSprite = new AnimatedSpriteClass(playerSheet, this.width, this.height, 0, this.states);

	this.directionFacing = DOWN;

	let enemyBehaviour = testEnemyBehaviour;
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