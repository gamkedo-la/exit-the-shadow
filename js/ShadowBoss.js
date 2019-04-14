// inherit from EntityClass
ShadowBoss.prototype = new EntityClass();
ShadowBoss.prototype.constructor = ShadowBoss;

function ShadowBoss() {
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOWING = 1;
	const ATTACKING = 2;
	const SHIELDING = 3;
	
	this.width = 48;
	this.height = 128;
	
	this.collisionBoxHeight = this.width;
	
	this.moveSpeed = 2;
	this.HP = 30;
	this.weight = 7; // 0-10 (10 means can't be pushed by anything)
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1}
	}
	
	let spritePadding = 64;
	this.AnimatedSprite = new AnimatedSpriteClass(shadowSheet, this.width, this.height, spritePadding, this.states);

	this.directionFacing = DOWN;

	let enemyBehaviour = IDLE;
		
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)

		switch(enemyBehaviour) {
		case FOLLOWING:
			// BEHAVIOUR GOES HERE
			break;

		case ATTACKING:
			// BEHAVIOUR GOES HERE
			break;

		case SHIELDING:
			// BEHAVIOUR GOES HERE
			break;
		}

		this.updateState();
		EntityClass.prototype.move.call(this); // call superclass function
	}
	
	this.updateState = function() {
		// CHANGE ANIMATION STATES HERE
	}
	
	this.draw = function() {
		EntityClass.prototype.draw.call(this);
	}
}