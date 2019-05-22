var selectedOption = 2;

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
        console.log(saveMenuOptions[i] + ', green, ' + boxPosX + ', ' + boxPosY);
        if (selectedOption == i) {
            colorRect(boxPosX + leftRightPadding, boxPosY + ((textHeight + linePadding) * i + textHeight / 4), boxWidth - leftRightPadding, textHeight, 'grey');
        }
        colorText(saveMenuOptions[i], boxPosX + leftRightPadding, boxPosY + ((textHeight + linePadding) * i+textHeight), 'black');
    }
    restoreFont();
    
}



function SaveData(name, positionX, positionY, health, bossesKilled, deaths, timePlayed) {
    this.name = name;
    this.positionX = positionX;
    this.positionY = positionY;
    this.health = health;
    this.bossesKilled = bossesKilled;
    this.deaths = deaths;
    this.timePlayed = timePlayed;
    this.dateTimeSaved = Date.now();
}

function saveGame() {
    var save = new SaveData("save1", Player.x, Player.y, Player.HP, Player.bossesKilled, 0, 300);
    var savesArray = new Array();
    savesArray.push(save);

    localStorage.setItem('exit-the-shadow-saves', JSON.stringify(savesArray));

    // debug
    console.log("Saving");
    console.log(save);
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
}

function restoreValues(save) {

    // Set player position and health
    Player.HP = save.health;
	Player.initialisePosition(save.positionX, save.positionY);
	Player.regainHealthMeter = 0; // should probably be reset on load
	moveCamToPlayer();

    // Restore bossesKilled so that we don't 'loose' progress next save
    Player.bossesKilled = save.bossesKilled;

    // Kill off bosses already defeated.
    for(var i=0; i<Entities.length;i++) {
        var entity = Entities[i];
        
        save.bossesKilled.forEach(boss => {
            if(entity.name == boss) {
                Entities.splice(i, 1);
            }
        });
    }
}

function listSaves() {
    // get array of serialized save game data
    var saveGames = localStorage.getItem('exit-the-shadow-saves');
    return saveGames;
}