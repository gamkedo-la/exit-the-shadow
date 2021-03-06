var selectedOption = 2;

var saveIndWidth = 20;
var saveIndHeight = 20;
var saveIndAng = 0;


function saveMenuDisplay() {
    var textHeight = 30;
    var lines = 3;
    var linePadding = 5;
    var leftRightPadding = 30;
    var bottomPadding = 20;

    var boxWidth = 200;
    var boxHeight = ((textHeight + linePadding) * lines) + bottomPadding;

    var boxPosX = 200;
    var boxPosY = canvas.height / 2;

    colorRect(boxPosX,boxPosY, boxWidth,boxHeight, 'white');
    saveFont();
    setFont('bold', textHeight, 'Arial');
    
    saveMenuOptions = ['Save', 'Load', 'Back']
    for(var i=0; i< saveMenuOptions.length; i++) {
        if (selectedOption == i) {
            colorRect(boxPosX + leftRightPadding, boxPosY + ((textHeight + linePadding) * i + textHeight / 4), boxWidth - leftRightPadding, textHeight, 'grey');
        }
        colorText(saveMenuOptions[i], boxPosX + leftRightPadding, boxPosY + ((textHeight + linePadding) * i+textHeight), 'black');
    }
    restoreFont();
    
}

function showSavingIndicator() {
    var saveIndX = canvas.width - saveIndWidth * 2;
    var saveIndY = canvas.height - saveIndHeight * 2;
    saveIndAng += 0.04;

    // main indicator
    canvasContext.save();
    canvasContext.translate(saveIndX, saveIndY);
    canvasContext.rotate(saveIndAng);
    canvasContext.fillStyle = 'white';
	canvasContext.fillRect(-saveIndWidth/2, -saveIndHeight/2, saveIndWidth, saveIndHeight);
    canvasContext.restore();

    // mini indicators
    var miniIndWidth = saveIndWidth / 6;
    var miniIndHeight = saveIndHeight / 6;
    canvasContext.save();
    canvasContext.translate(saveIndX, saveIndY);
    canvasContext.rotate(-saveIndAng);

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(saveIndWidth - miniIndWidth/2, saveIndHeight - miniIndHeight / 2, miniIndWidth, miniIndHeight);
    
    canvasContext.fillRect(-saveIndWidth - miniIndWidth/2, saveIndHeight - miniIndHeight / 2, miniIndWidth, miniIndHeight);

    canvasContext.fillRect(-saveIndWidth - miniIndWidth/2, -saveIndHeight - miniIndHeight / 2, miniIndWidth, miniIndHeight);
    
    canvasContext.fillRect(saveIndWidth - miniIndWidth/2, -saveIndHeight - miniIndHeight / 2, miniIndWidth, miniIndHeight);
    
    canvasContext.restore();
}

function SaveData(name, positionX, positionY, health, bossesKilled, heartsAcquired, deaths, timePlayed) {
    this.name = name;
    this.positionX = positionX;
    this.positionY = positionY;
    this.health = health;
    this.bossesKilled = bossesKilled;
	this.heartsAcquired = heartsAcquired;
    this.deaths = deaths;
    this.timePlayed = timePlayed;
}

function saveGame() {
    sfx[SAVE_SFX].play();
    var save = new SaveData("save1", Player.x + Player.width / 2, Player.y + Player.height / 2, Player.HP, Player.bossesKilled, Player.heartsAcquired, totalDeaths, playTimeSeconds);
    var savesArray = new Array();
    savesArray.push(save);

    localStorage.setItem('exit-the-shadow-saves', JSON.stringify(savesArray));
}

function loadGame() {
    if(listSaves == null) {
        // No saves available
        return;
    }
    
    var saveGames = JSON.parse(localStorage.getItem('exit-the-shadow-saves'));

    saveGames.forEach(save => {
        if(save.name == "save1") {
            restoreValues(save);
        }
    });
	
	// do this as art changes depending on what bosses have been defeated
	loadArt();
	loadArtAndCollisionForBossDefeatedRooms();
}

function restoreValues(save) {

    // Set player position and health
    Player.HP = save.health;
	Player.initialisePosition(save.positionX, save.positionY);
	Player.regainHealthMeter = 0; // should probably be reset on load
	moveCamToPlayer();

    // Restore bossesKilled so that we don't 'loose' progress next save
    Player.bossesKilled = save.bossesKilled;
	
	Player.heartsAcquired = save.heartsAcquired;
	Player.updateMaxHP();
	Player.updateDamage();
	
	totalDeaths = save.deaths;
	playTimeSeconds = save.timePlayed;
	setPlayTimeDisplayText();

    removeDefeatedBosses();
}

function listSaves() {
    // get array of serialized save game data
    var saveGames = localStorage.getItem('exit-the-shadow-saves');
    return saveGames;
}

