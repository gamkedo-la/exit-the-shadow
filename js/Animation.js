function AnimatedSpriteClass(animationSpriteSheet, animationSpriteWidth, animationSpriteHeight, animationStates) {
	let spriteSheet = animationSpriteSheet;
	let spriteWidth = animationSpriteWidth;
	let spriteHeight = animationSpriteHeight;
	
	let states = animationStates;
	let currentState = states[Object.keys(states)[0]];
	
	let frameRow = currentState.startFrame;
	let frameCol = 0;
	let tickCount = 0;
	let ticksPerFrame = Math.round(1 / currentState.animationSpeed);
	
	this.render = function() {
		canvasContext.drawImage(
			spriteSheet,
			frameRow*spriteWidth,
			frameCol*spriteHeight,
			spriteWidth,
			spriteHeight,
			0,
			0,
			spriteWidth,
			spriteHeight
		)
	}
	
	this.update = function() {
		tickCount++;
		
		if (tickCount > ticksPerFrame) {
			tickCount = 0;
			
			if (frameRow < currentState.startFrame) { // catch being out of bounds
				frameRow = currentState.startFrame;
			}
			else if (frameRow < currentState.endFrame) {
				frameRow++;
			}
			else {
				frameRow = currentState.startFrame;
			}
		}
	}
	
	this.changeState = function(stateName) {
		var newState = states[stateName];
		
		if (newState != currentState && newState != null) {
			currentState = newState;
			
			frameRow = currentState.startFrame;
			ticksPerFrame = Math.round(1 / currentState.animationSpeed);
		}
	}
	
	this.setEntityDirection = function(spriteSheetFrameCol) {
		frameCol = spriteSheetFrameCol;
	}
}