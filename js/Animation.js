function AnimatedSpriteClass(animationSpriteSheet, animationSpriteWidth, animationSpriteHeight, animationSpritePadding, animationStates, name) {

	this.name = name;
	this.opacity = 1;

	let spriteSheet = animationSpriteSheet;
	let spriteWidth = animationSpriteWidth;
	let spriteHeight = animationSpriteHeight;
	let spritePadding = animationSpritePadding;

	let totalWidth = spriteWidth + (spritePadding*2);
	let totalHeight = spriteHeight + (spritePadding*2);

	let states = animationStates;
	let currentState = states[Object.keys(states)[0]];

	let frameCol = currentState.startFrame;
	let frameRow = 0;
	let tickCount = 0;
	let ticksPerFrame = Math.round(1 / currentState.animationSpeed);

	this.render = function() {
		canvasContext.save();
		canvasContext.globalAlpha = this.opacity;
		
		canvasContext.drawImage(
			spriteSheet,
			frameCol*totalWidth,
			frameRow*totalHeight,
			totalWidth,
			totalHeight,
			-spritePadding,
			-spritePadding,
			totalWidth,
			totalHeight
		)
		
		canvasContext.restore();
	}

	this.update = function() {
		tickCount++;

		if (tickCount > ticksPerFrame) {
			tickCount = 0;

			if (frameCol < currentState.startFrame) { // catch being out of bounds
				frameCol = currentState.startFrame;
			}
			else if (frameCol < currentState.endFrame) {
				frameCol++;

			}
			else {
				frameCol = currentState.startFrame;
			}
		}
	}

	this.changeState = function(stateName) {
		var newState = states[stateName];

		if (newState != currentState && newState != null) {
			currentState = newState;

			frameCol = currentState.startFrame;
			ticksPerFrame = Math.round(1 / currentState.animationSpeed);
		}
	}

	this.setEntityDirection = function(spriteSheetFrameCol) {
		frameRow = spriteSheetFrameCol;
	}
}
