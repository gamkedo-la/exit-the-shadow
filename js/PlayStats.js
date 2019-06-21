var playTimeSeconds = 0;
var playTimeISOFormat = setPlayTimeDisplayText();
var totalDeaths = 0;

function playTime() {
	if (!gamePaused && gameIsStarted) {
		setPlayTimeDisplayText();
		playTimeSeconds++;
	}
}

function setPlayTimeDisplayText() {
	var playTimeMinutes = 0;
	var playTimeHours = 0;
	var playTimeDate = new Date(null);
	var displayMinutes = 0;
	var displaySeconds = 0;
	var displayHours = 0;

	// Get Minutes
	if(playTimeSeconds >= 60) {
		playTimeMinutes = Math.floor(playTimeSeconds/60);
	}
	
	// Get Hours
	if(playTimeSeconds >= 3600) {
		playTimeHours = Math.floor(playTimeSeconds/3600);
	}
	
	playTimeDate.setSeconds(playTimeSeconds);
	playTimeDate.setMinutes(playTimeMinutes);
	playTimeDate.setHours(playTimeHours);

	displaySeconds = playTimeDate.getSeconds();
	displayMinutes = playTimeDate.getMinutes();
	displayHours =  playTimeDate.getHours();
	
	if (displayHours   < 10) {displayHours   = "0"+displayHours;}
	if (displayMinutes < 10) {displayMinutes = "0"+displayMinutes;}
	if (displaySeconds < 10) {displaySeconds = "0"+displaySeconds;}

	playTimeISOFormat = `${displayHours}:${displayMinutes}:${displaySeconds}`
}

function resetPlayStats() {
	playTimeSeconds = 0;
	totalDeaths = 0;
	setPlayTimeDisplayText();
}