
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
    var bossesKilled = new Array();
    bossesKilled.push("Beast");
    var save = new SaveData("save1", Player.x, Player.y, Player.HP, bossesKilled, 0, 300);
    var savesArray = new Array();
    savesArray.push(save);
    // savesArray.push(save2);

    localStorage.setItem('exit-the-shadow-saves', JSON.stringify(savesArray));

}

function loadGame() {
    var saveGames = JSON.parse(localStorage.getItem('exit-the-shadow-saves'));

    saveGames.forEach(save => {
        if(save.name == "save1") {
            restoreValues(save);
        }
    });
}

function restoreValues(save) {
    Player.HP = save.health;
    Player.x = save.positionX;
    Player.y = save.positionY;

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
    console.log(JSON.parse(saveGames));
}