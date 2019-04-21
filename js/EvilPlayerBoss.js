// inherit from EntityClass
EvilPlayerBoss.prototype = new EntityClass();
EvilPlayerBoss.prototype.constructor = EvilPlayerBoss;

function EvilPlayerBoss() {
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOWING = 1;
	const ATTACKING = 2;
	const SHIELDING = 3;
	
	this.width = 25;
	this.height = 50;
	
	this.collisionBoxHeight = this.width;
	
	this.moveSpeed = 2;
	this.HP = 50;
	this.maxHP = this.HP;
	this.weight = 2; // 0-10 (10 means can't be pushed by anything)
	
	this.name = "Self";
	this.isActive = true;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.1},
		dash: {startFrame: 8, endFrame: 9, animationSpeed: 1},
		attack: {startFrame: 10, endFrame: 10, animationSpeed: 1},
		shield: {startFrame: 11, endFrame: 11, animationSpeed: 1}
	}
	
	let spritePadding = 50;
	this.AnimatedSprite = new AnimatedSpriteClass(evilPlayerSheet, this.width, this.height, spritePadding, this.states);

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