// inherit from EntityClass
EvilPlayerBoss.prototype = new EntityClass();
EvilPlayerBoss.prototype.constructor = EvilPlayerBoss;

function EvilPlayerBoss() {
	// PHASES
	const NOT_IN_BATTLE = 0;
	const PHASE_1 = 1;
	const PHASE_2 = 2;
	
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
	this.isActive = false;
	
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

	let phase = NOT_IN_BATTLE;
	let behaviour = IDLE;
		
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
		if (phase == NOT_IN_BATTLE) {
			if (distanceBetweenEntities(this, Player) < 150) {
				this.progressPhase();
			}
		}
		else if (phase == PHASE_1 || phase == PHASE_2) {
			switch(behaviour) {
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
	
	this.progressPhase = function() {
		if (phase == NOT_IN_BATTLE) {
			phase = PHASE_1;
			this.isActive = true;
		}
		else if (phase == PHASE_1) {
			phase = phase_2;
		}
	}
}