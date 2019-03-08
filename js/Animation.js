function AnimatedSpriteClass(spriteSheet, spriteWidth, spriteHeight, states) {
	this.spriteSheet = spriteSheet;
	this.spriteWidth = spriteWidth;
	this.spriteHeight = spriteHeight;
	
	this.states = states;
	this.currentState = states[Object.keys(states)[0]];
	
	this.frameRow = this.currentState.startFrame;
	this.frameCol = 0;
	this.tickCount = 0;
	this.ticksPerFrame = Math.round(1 / this.currentState.animationSpeed);
	
	this.render = function() {
		canvasContext.drawImage(
			this.spriteSheet,
			this.frameRow*this.spriteWidth,
			this.frameCol*this.spriteHeight,
			this.spriteWidth,
			this.spriteHeight,
			0,
			0,
			this.spriteWidth,
			this.spriteHeight
		)
	}
	
	this.update = function() {
		this.tickCount++;
		
		if (this.tickCount > this.ticksPerFrame) {
			this.tickCount = 0;
			
			if (this.frameRow < this.currentState.startFrame) { // catch being out of bounds
				this.frameRow = this.currentState.startFrame;
			}
			else if (this.frameRow < this.currentState.endFrame) {
				this.frameRow++;
			}
			else {
				this.frameRow = this.currentState.startFrame;
			}
		}
	}
	
	this.changeState = function(stateName) {
		var newState = this.states[stateName];
		
		if (newState != this.currentState && newState != null) {
			this.currentState = newState;
			
			this.frameRow = this.currentState.startFrame;
			this.ticksPerFrame = Math.round(1 / this.currentState.animationSpeed);
		}
	}
}