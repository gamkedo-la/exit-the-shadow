function AnimatedSpriteClass(animationSpriteSheet, animationSpriteWidth, animationSpriteHeight, animationSpritePadding, animationStates, name) {

	this.name = name;

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
		// console.log("frameCol " + frameCol)
		// if (this.name === "Player" && currentState === Player.states.walk && (frameCol === 4 || frameCol === 6)) {
		// 	playMultiSound(arrayOfFootstepSounds);
		// }
	}

	this.changeState = function(stateName) {
		var newState = states[stateName];
		//if (this.name === "Player"){console.log(newState);};
		//console.log(newState);

		if (newState != currentState && newState != null) {
			currentState = newState;

			frameCol = currentState.startFrame;
			ticksPerFrame = Math.round(1 / currentState.animationSpeed);
		}

		// console.log(stateName);
		 //console.log(this.name);
		 //console.log(newState);
		// if (this.name === "Player" && newState === Player.states.walk) {
		// 	console.log("hello walking conditional check");
		// 	playMultiSound(arrayOfFootstepSounds);
		// }
	}

	this.setEntityDirection = function(spriteSheetFrameCol) {
		frameRow = spriteSheetFrameCol;
	}
}
