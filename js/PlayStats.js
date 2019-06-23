var playTimeSeconds = 0;
var playTimeISOFormat = setPlayTimeDisplayText();
var totalDeaths = 0;

function playTime() {
	if (!gamePaused && gameIsStarted && !endGamePending) {
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

function playTimeSecondsToHHMMSS(playTime) {
	var playTimeMinutes = 0;
	var playTimeHours = 0;
	var playTimeDate = new Date(null);
	var displayMinutes = 0;
	var displaySeconds = 0;
	var displayHours = 0;

	// Get Minutes
	if(playTime >= 60) {
		playTimeMinutes = Math.floor(playTime/60);
	}
	
	// Get Hours
	if(playTime >= 3600) {
		playTimeHours = Math.floor(playTime/3600);
	}
	
	playTimeDate.setSeconds(playTime);
	playTimeDate.setMinutes(playTimeMinutes);
	playTimeDate.setHours(playTimeHours);

	displaySeconds = playTimeDate.getSeconds();
	displayMinutes = playTimeDate.getMinutes();
	displayHours =  playTimeDate.getHours();
	
	if (displayHours   < 10) {displayHours   = "0"+displayHours;}
	if (displayMinutes < 10) {displayMinutes = "0"+displayMinutes;}
	if (displaySeconds < 10) {displaySeconds = "0"+displaySeconds;}

	return `${displayHours}:${displayMinutes}:${displaySeconds}`
}

function resetPlayStats() {
	playTimeSeconds = 0;
	totalDeaths = 0;
	setPlayTimeDisplayText();
}

function updateSavedStats() {
 	var saveStats = JSON.parse(localStorage.getItem('exit-the-shadow-top-scores'));
 
 	if (saveStats == null) {
		saveStatsToLocalStorage(playTimeSeconds, totalDeaths);
 		return null;
 	}
	else {
		let playTime, deaths;
	    if (playTimeSeconds < saveStats.playTimeSeconds) {
	    	saveStats.playTimeSeconds = playTimeSeconds;
		}
		if (totalDeaths < saveStats.totalDeaths) {
			saveStats.totalDeaths = totalDeaths;
		}
		saveStatsToLocalStorage(saveStats.playTimeSeconds, saveStats.totalDeaths);
	}
}

function saveStatsToLocalStorage(playTime, deaths) {
    var save = new SaveStats(playTime, deaths);

    localStorage.setItem('exit-the-shadow-top-scores', JSON.stringify(save));
}

function getSavedPlayTime() {
	var saveStats = JSON.parse(localStorage.getItem('exit-the-shadow-top-scores'));
	return saveStats.playTimeSeconds;
}

function getSavedTotalDeaths() {
	var saveStats = JSON.parse(localStorage.getItem('exit-the-shadow-top-scores'));
	return saveStats.totalDeaths;
}

function SaveStats(playTime, deaths) {
    this.playTimeSeconds = playTime;
    this.totalDeaths = deaths;
}