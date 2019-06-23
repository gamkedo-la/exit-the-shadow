var endGamePending = false;
var endGameSequenceTime = 0;
var whiteScreenAlpha = 0.0;
var blackScreenAlpha = 0.0;

const EndGame = new (function() {
	let endGameTorches = [];
	
	this.resizingCanvas = function() {
		endGameTorches = [];
		endGameTorches.push({x:canvas.width/2, y:canvas.height/2, imgName: 'torchPic', range:0, r:1/255, g:1/255, b:1/255});
		//endGameTorches.push({x:100 + (canvas.width/2)-(logoPic.width/2), y:canvas.height - 64, imgName: 'torchPic', range:200, r:1/255, g:252/255, b:20/255});
		//endGameTorches.push({x:(canvas.width/2)+(logoPic.width/2), y:canvas.height - 64 - logoPic.height, imgName: 'torchPic', range:200, r:1, g:252/255, b:206/255});
		//endGameTorches.push({x:canvas.width - 100, y:100, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255});
		//endGameTorches.push({x:100, y:100, imgName: 'torchPic', range:200, r:1/255, g:25/255, b:206/255});
	}
	
	this.update = function() {
		if (endGameSequenceTime < 100) {
			// nothing
		}
		else if (endGameSequenceTime < 200) {
			whiteScreenAlpha += 0.02;
		}
		else if (endGameSequenceTime < 300) {
			blackScreenAlpha += 0.02;
			//whiteScreenAlpha -= 0.02;
		}
		endGameSequenceTime++;
	}
	
	this.draw = function() {
		canvasContext.save();
		canvasContext.font = "30px Impact";
		canvasContext.textAlign = "center";
		
		if (endGameSequenceTime < 300) {
			colorRect(0, 0, canvas.width, canvas.height, "rgba(255, 255, 255, " + whiteScreenAlpha + ")");
			colorRect(0, 0, canvas.width, canvas.height, "rgba(0, 0, 0, " + blackScreenAlpha + ")");
		}
		if (endGameSequenceTime >= 300) {
			canvasContext.drawImage(titlePic, 0,0);
			
			colorText("Play Time: ", canvas.width/2, canvas.height/2 - 275, '#dacdc7');
			colorText("Deaths: ", canvas.width/2, canvas.height/2 - 125, '#dacdc7');
			strokeColorText("Play Time: ", canvas.width/2, canvas.height/2 - 275, '#black', 1.5);
			strokeColorText("Deaths: ", canvas.width/2, canvas.height/2 - 125, '#black', 1.5);
			
			colorText("Best Time: ", canvas.width/2, canvas.height/2 + 25, '#dacdc7');
			colorText("Lowest Deaths: ", canvas.width/2, canvas.height/2 + 175, '#dacdc7');
			strokeColorText("Best Time: ", canvas.width/2, canvas.height/2 + 25, '#black', 1.5);
			strokeColorText("Lowest Deaths: ", canvas.width/2, canvas.height/2 + 175, '#black', 1.5);
			
			updateSavedStats();
			let bestPlayTime = playTimeSecondsToHHMMSS(getSavedPlayTime());
			let lowestDeaths = getSavedTotalDeaths();
			
			setPlayTimeDisplayText();
			canvasContext.save();
			canvasContext.font = "40px Impact";
			colorText(playTimeISOFormat, canvas.width/2, canvas.height/2 - 200, '#dacdc7');
			colorText(totalDeaths, canvas.width/2, canvas.height/2 - 50, '#dacdc7');
			colorText(bestPlayTime, canvas.width/2, canvas.height/2 + 100, '#dacdc7');
			colorText(lowestDeaths, canvas.width/2, canvas.height/2 + 250, '#dacdc7');
			canvasContext.restore();
			
			endGameTorches[0].range += 2;
			this.drawEndLights();
		}
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