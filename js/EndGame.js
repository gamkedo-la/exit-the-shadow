var endGamePending = false;
var endGameSequenceTime = 0;
var whiteScreenAlpha = 0.0;
var blackScreenAlpha = 0.0;

function endGameUpdate() {
	if (endGameSequenceTime < 100) {
		// nothing
	}
	else if (endGameSequenceTime < 200) {
		whiteScreenAlpha += 0.02;
	}
	else if (endGameSequenceTime < 300) {
		blackScreenAlpha += 0.02;
	}
	endGameSequenceTime++;
}

function endGameDraw() {
	canvasContext.save();
	canvasContext.font = "35px Impact";
	canvasContext.textAlign = "center";
	colorRect(0, 0, canvas.width, canvas.height, "rgba(255, 255, 255, " + whiteScreenAlpha + ")");
	colorRect(0, 0, canvas.width, canvas.height, "rgba(0, 0, 0, " + blackScreenAlpha + ")");
	
	if (endGameSequenceTime > 200) {
		colorText("Play Time: ", canvas.width/2, canvas.height/2 - 225, '#dacdc7');
		colorText("Deaths: ", canvas.width/2, canvas.height/2 - 75, '#dacdc7');
		strokeColorText("Play Time: ", canvas.width/2, canvas.height/2 - 225, '#721b1b', 1.5);
		strokeColorText("Deaths: ", canvas.width/2, canvas.height/2 - 75, '#721b1b', 1.5);
		
		colorText("Best Time: ", canvas.width/2, canvas.height/2 + 75, '#dacdc7');
		colorText("Lowest Deaths: ", canvas.width/2, canvas.height/2 + 225, '#dacdc7');
		strokeColorText("Best Time: ", canvas.width/2, canvas.height/2 + 75, '#1b2082', 1.5);
		strokeColorText("Lowest Deaths: ", canvas.width/2, canvas.height/2 + 225, '#1b2082', 1.5);
		
		canvasContext.save();
		canvasContext.font = "45px Impact";
		colorText(playTimeISOFormat, canvas.width/2, canvas.height/2 - 150, '#dacdc7');
		colorText(totalDeaths, canvas.width/2, canvas.height/2, '#dacdc7');
		canvasContext.restore();
	}
	canvasContext.restore();
}