function AnimatedSpriteClass(animationSpriteSheet, animationSpriteWidth, animationSpriteHeight, animationSpritePadding, animationStates) {
	let spriteSheet = animationSpriteSheet;
	let spriteWidth = animationSpriteWidth;
	let spriteHeight = animationSpriteHeight;
	let spritePadding = animationSpritePadding;

	let totalWidth = spriteWidth + (spritePadding*2);
	let totalHeight = spriteHeight + (spritePadding*2);
	
	let states = animationStates;
	let currentState = states[Object.keys(states)[0]];
	
	let frameRow = currentState.startFrame;
	let frameCol = 0;
	let tickCount = 0;
	let ticksPerFrame = Math.round(1 / currentState.animationSpeed);
	
	this.render = function() {
		canvasContext.drawImage(
			spriteSheet,
			frameRow*totalWidth,
			frameCol*totalHeight,
			totalWidth,
			totalHeight,
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