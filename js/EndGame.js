var endGamePending = false;
var endGameSequenceTime = 0;
var whiteScreenAlpha = 0.0;
var blackScreenAlpha = 0.0;

const EndGame = new (function() {
	let endGameTorches = [];
	let endGamePlayer = null;
	let endGameEvilPlayer = null;
	let currentStatsXOffset = -350;
	let topStatsXOffset = 350;
	let currentStatsTorchX = 1;
	let topStatsTorchX = 1;
	let mainTorchX = 1;
	let playerAbsorbTorchX = 1;
	let playerAbsorbTorchRange = 1;
	
	this.resizingCanvas = function() {
		this.initialiseLights();
	}
	
	this.initialiseLights = function() {
		endGameTorches = [];
		endGameTorches.push({x:mainTorchX, y:canvas.height/2, imgName: 'torchPic', range:200, r:1/255, g:1/255, b:1/255});
		endGameTorches.push({x:currentStatsTorchX, y:canvas.height/2, imgName: 'torchPic', range:250, r:1, g:25/255, b:20/255});
		endGameTorches.push({x:topStatsTorchX, y:canvas.height/2, imgName: 'torchPic', range:250, r:70/255, g:1/255, b:130/255});
		endGameTorches.push({x:playerAbsorbTorchX, y:canvas.height/2, imgName: 'torchPic', range:playerAbsorbTorchRange, r:1, g:252/255, b:206/255});
	}
	
	this.resetVariables = function() {
		endGameTorches = [];
		endGamePlayer = null;
		endGameEvilPlayer = null;
		whiteScreenAlpha = 0.0;
		blackScreenAlpha = 0.0;
	}
	
	this.update = function() {
		if (endGameSequenceTime < 100) {
			if (endGameSequenceTime == 0) {
				Player.cancelDash();
				this.resetVariables();
				mainTorchX = canvas.width/2;
				currentStatsTorchX = -10000;
				topStatsTorchX = -10000;
				playerAbsorbTorchX = -10000;
				playerAbsorbTorchRange = 1;
				this.initialiseLights();
			}
		}
		else if (endGameSequenceTime < 200) {
			whiteScreenAlpha += 0.02;
		}
		else if (endGameSequenceTime < 300) {
			blackScreenAlpha += 0.02;
		}
		else if (endGameSequenceTime < 880) {
			if (endGameSequenceTime > 550) {
				currentStatsTorchX = canvas.width/2 + currentStatsXOffset;
			}
			if (endGameSequenceTime > 610) {
				topStatsTorchX = canvas.width/2 + topStatsXOffset;
			}
			this.initialiseLights();
		}
		else if (endGameSequenceTime < 1000) {
			if (endGameEvilPlayer != null) {
				endGameEvilPlayer.AnimatedSprite.opacity -= 0.02;
				if (endGameEvilPlayer.AnimatedSprite.opacity < 0.05) {
					endGameEvilPlayer.AnimatedSprite.opacity = 0;
					endGameEvilPlayer = null;
				}
				playerAbsorbTorchRange += 1.2;
				playerAbsorbTorchX = canvas.width/2;
				this.initialiseLights();
				if (endGameSequenceTime == 880) {
					sfx[ABSORB].play();
				}
			}
		}
		else if (endGameSequenceTime < 1100){
			if (endGameSequenceTime > 1000) {
				currentStatsTorchX = -10000;
			}
			if (endGameSequenceTime > 1025) {
				topStatsTorchX = -10000;
			}
			if (endGameSequenceTime > 1040) {
				mainTorchX = -10000;
				playerAbsorbTorchX = -10000;
			}
			this.initialiseLights();
		}
		else {
			this.resetVariables();
			endGameSequenceTime = 0;
			endGamePending = false;
			quitToMenu();
			menuFadeInAlpha = 1;
			return;
		}
		
		if (endGameSequenceTime == 300) {
			endGamePlayer = new PlayerClass();
			endGamePlayer.initialisePosition(canvas.width / 2, canvas.height / 2 + 300);
			endGamePlayer.phase = PHASE_END_GAME;
			endGamePlayer.cameraShouldFollow = false;
			endGamePlayer.collisionsOn = false;
		}
		
		if (endGameSequenceTime == 657) { // time this so player and evil player idle animations sync up
			endGameEvilPlayer = new EvilPlayerBoss();
			endGameEvilPlayer.initialisePosition(canvas.width / 2, canvas.height / 2 + 300);
			endGameEvilPlayer.phase = PHASE_END_GAME;
			endGameEvilPlayer.collisionsOn = false;
		}
		
		if (endGamePlayer != null) {
			endGamePlayer.move();
			endGamePlayer.animate();
		}
		
		if (endGameEvilPlayer != null) {
			endGameEvilPlayer.move();
			endGameEvilPlayer.animate();
		}
		
		endGameSequenceTime++;
	}
	
	this.draw = function() {
		if (endGameSequenceTime < 300) {
			colorRect(0, 0, canvas.width, canvas.height, "rgba(255, 255, 255, " + whiteScreenAlpha + ")");
			colorRect(0, 0, canvas.width, canvas.height, "rgba(0, 0, 0, " + blackScreenAlpha + ")");
		}
		if (endGameSequenceTime >= 300) {			
			canvasContext.drawImage(titlePic, 0,0);
			canvasContext.drawImage(typewriterPlatform, canvas.width/2 - typewriterPlatform.width/2, canvas.height/2 - typewriterPlatform.height/2);
			
			if (endGamePlayer != null) {
				endGamePlayer.draw();
			}
			if (endGameEvilPlayer != null) {
				endGameEvilPlayer.draw();
			}
			
			this.drawStats();
			this.drawEndLights();
		}
	}
	
	this.drawStats = function() {
		let ySpaceBetween = 60;
		
		canvasContext.save();
		canvasContext.font = "30px Impact";
		canvasContext.textAlign = "center";
		colorText("Play Time: ", canvas.width/2 + currentStatsXOffset, canvas.height/2 + (ySpaceBetween*-1.5), '#dacdc7');
		colorText("Deaths: ", canvas.width/2 + currentStatsXOffset, canvas.height/2 + (ySpaceBetween*0.5), '#dacdc7');
		strokeColorText("Play Time: ", canvas.width/2 + currentStatsXOffset, canvas.height/2 + (ySpaceBetween*-1.5), 'black', 1.5);
		strokeColorText("Deaths: ", canvas.width/2 + currentStatsXOffset, canvas.height/2 + (ySpaceBetween*0.5), 'black', 1.5);
		
		colorText("Best Time: ", canvas.width/2 + topStatsXOffset, canvas.height/2 + (ySpaceBetween*-1.5), '#dacdc7');
		colorText("Lowest Deaths: ", canvas.width/2 + topStatsXOffset, canvas.height/2 + (ySpaceBetween*0.5), '#dacdc7');
		strokeColorText("Best Time: ", canvas.width/2 + topStatsXOffset, canvas.height/2 + (ySpaceBetween*-1.5), 'black', 1.5);
		strokeColorText("Lowest Deaths: ", canvas.width/2 + topStatsXOffset, canvas.height/2 + (ySpaceBetween*0.5), 'black', 1.5);
		
		updateSavedStats();
		let bestPlayTime = playTimeSecondsToHHMMSS(getSavedPlayTime());
		let lowestDeaths = getSavedTotalDeaths();
		
		setPlayTimeDisplayText();
		canvasContext.save();
		canvasContext.font = "40px Impact";
		colorText(playTimeISOFormat, canvas.width/2 + currentStatsXOffset, canvas.height/2 + (ySpaceBetween*-0.5), '#dacdc7');
		colorText(totalDeaths, canvas.width/2 + currentStatsXOffset, canvas.height/2 + (ySpaceBetween*1.5), '#dacdc7');
		strokeColorText(playTimeISOFormat, canvas.width/2 + currentStatsXOffset, canvas.height/2 + (ySpaceBetween*-0.5), 'black', 2);
		strokeColorText(totalDeaths, canvas.width/2 + currentStatsXOffset, canvas.height/2 + (ySpaceBetween*1.5), 'black', 2);
		
		colorText(bestPlayTime, canvas.width/2 + topStatsXOffset, canvas.height/2 + (ySpaceBetween*-0.5), '#dacdc7');
		colorText(lowestDeaths, canvas.width/2 + topStatsXOffset, canvas.height/2 + (ySpaceBetween*1.5), '#dacdc7');
		strokeColorText(bestPlayTime, canvas.width/2 + topStatsXOffset, canvas.height/2 + (ySpaceBetween*-0.5), 'black', 2);
		strokeColorText(lowestDeaths, canvas.width/2 + topStatsXOffset, canvas.height/2 + (ySpaceBetween*1.5), 'black', 2);
		canvasContext.restore();
		canvasContext.restore();
	}
	
	this.drawEndLights = function() {
		mainLightRange = 0;// turn off main light range
		//lights, colors, ranges, darks, darkRanges
		const endGameLights = [canvas.width/2, canvas.height/2];
		const endGameColors = [];
		const endGameRanges = [];
		const endGameDarks = [];
		const endGameDarkRanges = [];
		
		
		for (let i = 0; i < maxLights; i++) {
			if(i < endGameTorches.length) {
				let slowCounter = 0;
				twinkle = Math.random();
				if(twinkle < 0.25) {
					slowCounter = 8 * Math.PI * twinkle;
					twinkle = endGameTorches[i].range / 500;
				}
				
				endGameLights.push(endGameTorches[i].x + 10 * twinkle * (Math.sin(slowCounter)));
				endGameLights.push(endGameTorches[i].y + 10 * twinkle * (Math.sin(slowCounter)));
				endGameColors.push(endGameTorches[i].r);
				endGameColors.push(endGameTorches[i].g);
				endGameColors.push(endGameTorches[i].b);
				endGameRanges.push(endGameTorches[i].range + (Math.sin(slowCounter)));
			} else {
				endGameLights.push(0);
				endGameLights.push(0);
				endGameColors.push(0);
				endGameColors.push(0);
				endGameColors.push(0);
				endGameRanges.push(0);
			}
	
			endGameDarks.push(0);
			endGameDarks.push(0);
			endGameDarkRanges.push(0);
		} 
	
		const shadowOverlay = illuminator.getShadowOverlay(endGameLights, endGameColors, endGameRanges, endGameDarks, endGameDarkRanges);
		canvasContext.drawImage(shadowOverlay, 0, 0);
	}
})();