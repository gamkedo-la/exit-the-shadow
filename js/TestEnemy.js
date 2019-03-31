// inherit from EntityClass
TestEnemyClass.prototype = new EntityClass();
TestEnemyClass.prototype.constructor = TestEnemyClass;

function TestEnemyClass() {
	// public
	this.width = 25;
	this.height = 50;
	
	this.collisionBoxHeight = this.width;
	
	this.moveSpeed = 5;
	
	this.states = {
		idle: {startFrame: 0, endFrame: 3, animationSpeed: 0.1},
		walk: {startFrame: 4, endFrame: 7, animationSpeed: 0.25}
	}
	
	this.AnimatedSprite = new AnimatedSpriteClass(playerSheet, this.width, this.height, this.states);
		
	this.move = function () {

		this.movementDirection = [false, false, false, false]; // up, left, down, right
		if (this.keyHeld_Up && !isDashing) {
			this.movementDirection[UP] = true;
		}
		
		if (this.keyHeld_Down && !isDashing) {
			this.movementDirection[DOWN] = true;
		}
		
		if (this.keyHeld_Right && !isDashing) {
			this.movementDirection[RIGHT] = true;
		}

		if (this.keyHeld_Left && !isDashing) {
			this.movementDirection[LEFT] = true;
		}

		this.updateState();
		EntityClass.prototype.move.call(this); // call superclass function
	}
	
	this.updateState = function() {
		if (this.movementDirection[UP] || this.movementDirection[LEFT] || this.movementDirection[DOWN] || this.movementDirection[RIGHT]) {
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