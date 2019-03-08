// This is an abstract class so shouldn't be instantiated, and instead only inherited from

// moveDirection
const NO_DIRECTION = -1;
const DOWN = 0;
const LEFT = 1;
const UP = 2;
const RIGHT = 3;
const UP_LEFT = 4;
const DOWN_LEFT = 5;
const DOWN_RIGHT = 6;
const UP_RIGHT = 7;

// add new variables in here
function EntityClass() {
	this.x;
	this.y;
	this.nextX;
	this.nextY;
	this.width = 25;
	this.height = 50;
	
	this.collisionBoxHeight = this.width;
	
	this.currentSpeedX;
	this.currentSpeedY;
	
	this.moveSpeed = 5;
	this.movementDirection = [false, false, false, false]; // up, left, down, right
	
	this.states;
	this.AnimatedSprite;
}

// add new functions in here
EntityClass.prototype = {
	initialisePosition: function(x, y) {
		this.x = this.nextX = x;
		this.y = this.nextY = y;
	},
	// call this at the end of the move function for your specific entity - will handle collisions and movement
	move: function () {
		if (this.movementDirection[UP]) {
			this.nextY -= this.moveSpeed;
		}
		if (this.movementDirection[DOWN]) {
			this.nextY += this.moveSpeed;
		}
		if (this.movementDirection[RIGHT]) {
			this.nextX += this.moveSpeed;
		}
		if (this.movementDirection[LEFT]) {
			this.nextX -= this.moveSpeed;
		}

		handleWorldCollisions(this);
		
		// currently only used to calculate camera position for player
		// but left in here as it may be useful for any entity
		this.currentSpeedX = Math.abs(this.nextX - this.x);
		this.currentSpeedY = Math.abs(this.nextY - this.y);
		
		// move entity
		this.x = this.nextX;
		this.y = this.nextY;
	},
	
	// relative to entire map
	draw: function() {
		canvasContext.save();
		canvasContext.translate(this.x, this.y);
		
		if (this.movementDirection[UP]) {
			this.AnimatedSprite.frameCol = UP;
		}
		else if (this.movementDirection[DOWN]) {
			this.AnimatedSprite.frameCol = DOWN;
		}
		if (!(this.movementDirection[RIGHT] && this.movementDirection[LEFT])) {
			if (this.movementDirection[LEFT]) {
				this.AnimatedSprite.frameCol = LEFT;
			}
			else if (this.movementDirection[RIGHT]) {
				this.AnimatedSprite.frameCol = RIGHT;
			}
		}
		
		this.AnimatedSprite.render();
		canvasContext.restore();
	},
	
	animate: function() {
		this.AnimatedSprite.update();
	}
}