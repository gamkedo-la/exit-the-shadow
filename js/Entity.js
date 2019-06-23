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
	this.startX;
	this.startY;
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
	this.AnimatedSprite = null;
	
	this.HP = 30;
	this.directionFacing = UP;
	
	this.isInvulnerable = false;
	this.isDead = false;

	this.weight = 0; // 0-10 (10 means can't be pushed by anything)
	this.forceX = 0;
	this.forceY = 0;
	
	this.collisionsOn = true;
}

// add new functions in here
EntityClass.prototype = {
	initialisePosition: function(x, y) {
		this.x = this.nextX = this.startX = x - this.width/2;
		this.y = this.nextY = this.startY = y - this.height/2;
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
		
		if (this.movementDirection[UP]) {
			this.directionFacing = UP;
			if (this.AnimatedSprite != null) {
				this.AnimatedSprite.setEntityDirection(UP);
			}
		}
		else if (this.movementDirection[DOWN]) {
			this.directionFacing = DOWN;
			if (this.AnimatedSprite != null) {
				this.AnimatedSprite.setEntityDirection(DOWN);
			}
		}
		if (!(this.movementDirection[RIGHT] && this.movementDirection[LEFT])) {
			if (this.movementDirection[LEFT]) {
				this.directionFacing = LEFT;
				if (this.AnimatedSprite != null) {
					this.AnimatedSprite.setEntityDirection(LEFT);
				}
			}
			else if (this.movementDirection[RIGHT]) {
				this.directionFacing = RIGHT;
				if (this.AnimatedSprite != null) {
					this.AnimatedSprite.setEntityDirection(RIGHT);
				}
			}
		}

		// the heavier the entity, the less it gets pushed by a force
		this.nextX += this.forceX * (10 - this.weight);
		this.nextY += this.forceY * (10 - this.weight);

		this.forceX = 0;
		this.forceY = 0;

		if (this.collisionsOn) {
			handleEntityCollisions(this);
			handleWorldCollisions(this);
		}
		
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
		
		switch(this.directionFacing) {
		case UP:
			this.AnimatedSprite.setEntityDirection(UP);
			break;
		case DOWN:
			this.AnimatedSprite.setEntityDirection(DOWN);
			break;
		case LEFT:
			this.AnimatedSprite.setEntityDirection(LEFT);
			break;
		case RIGHT:
			this.AnimatedSprite.setEntityDirection(RIGHT);
			break;
		}
		
		// draw a shadow on the floor - now built into the sprite_sheet 
		// if (this.shadow) canvasContext.drawImage(this.shadow,-14,48);

		// draw the sprite over top of the shadow
		this.AnimatedSprite.render();

		canvasContext.restore();
	},
	
	animate: function() {
		if (this.AnimatedSprite != null) {
			this.AnimatedSprite.update();
		}
	},

	takeDamage: function(damage) {
		if (!this.isInvulnerable) {
			this.HP -= damage;

			if (this.HP <= 0) {
				this.isDead = true;
			}
			return true;
		}
		return false;
	},

	deathHandle: function ()
	{
		return this.isDead;
	},
	
	centerX: function () {
		return this.x + this.width / 2;
	},
	
	centerY: function () {
		return collisionBoxY(this) + this.collisionBoxHeight / 2;
	},
}