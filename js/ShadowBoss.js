// inherit from EntityClass
ShadowBoss.prototype = new EntityClass();
ShadowBoss.prototype.constructor = ShadowBoss;

function ShadowBoss() {
	// PHASES
	const NOT_IN_BATTLE = 0;
	const PHASE_1 = 1;
	const PHASE_2 = 2;
	
	// BEHAVIOURS - ALTER AS NEEDED
	const IDLE = 0
	const FOLLOWING = 1;
	const ATTACKING = 2;
	const SHIELDING = 3;
	
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
		
	this.move = function () {
		this.movementDirection = [false, false, false, false]; // up, left, down, right (SET TRUE TO MOVE)
		if (phase == NOT_IN_BATTLE) {
			if (distanceBetweenEntities(this, Player) < 200) {
				this.progressPhaseTogether();
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
	
	this.progressPhaseTogether = function() {
		for (var i = 0; i < Entities.length; i++) {
			if (Entities[i] instanceof ShadowBoss) {
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

	this.deathHandle = function()
	{
		if(this.isDead) 
		{
			var shadowCount = 0;
			for(var i = 0; i < Entities.length; i++) {
				if(Entities[i].name == "Shadow") {
					shadowCount++;
				}
			}

			if(shadowCount == 1) {
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