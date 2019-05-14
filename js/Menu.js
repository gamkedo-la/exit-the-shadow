const Menu = new (function() {
const MENU_PAGE = 0;
const SETTINGS_PAGE = 1;
const HELP_PAGE = 2;
const CREDITS_PAGE = 3;
//const RESUME_PAGE = 1;
//const PAUSED_PAGE = 2;


let itemsX = 310;
let topItemY = 390;
let itemsWidth = 650;
let rowHeight = 35;

this.cursor1 = null;
let currentPage = 0;

let textFontFace = "";
let textFontFaceCredits = "";
let textColour = "" ;

let classListMenu = ["New Game", "Continue", "Settings" , "Help", "Credits"];
let classListSettings = ["volume", "controls", "Back"];
let classListHelp= ["gameplay","gamepad","Back"];
let classListPaused= ['save' , 'audio',  'Back'];
let classListCredits= ["Back"];

let menuPageText = [classListMenu, classListSettings, classListHelp, classListCredits, classListPaused];

this.menuMouse = function(){
    for (let i=0; i<menuPageText[currentPage].length; i++){
        if(mouseX > itemsX && mouseX < itemsX + itemsWidth && mouseY > topItemY + (i*rowHeight)-20 &&
         mouseY < topItemY + (i+1) * rowHeight - 20){
            this.cursor1= i;
        } 
    }
}

this.update = function(){
    if (this.cursor1 < 0){
        this.cursor1 = menuPageText[currentPage].length -1;
    }

    if (this.cursor1 > menuPageText[currentPage].length){
        this.cursor1 = 0;
    }

    this.menuMouse();
    this.draw();
}

this.checkState = function(){
    if(currentPage == HELP_PAGE){
        currentPage = MENU_PAGE;
        this.cursor = 0;
        return;
    }  
}

this.changeMenuStateOnClick = function() {
	//console.log(mouseX + " , " + mouseY + " , " +  Menu.cursor1);
	if (gameIsStarted) { 
		return;
	}

	switch(menuPageText[currentPage][Menu.cursor1]) {

	//MENU PAGE
	case "New Game":
	    gameIsStarted = true;
	    currentBackgroundMusic = AMBIENT_MUSIC;
	    bg_music[currentBackgroundMusic].play();
	    this.cursor1 = null;
	    break;
	case "Continue":
		if (saveGames == undefined || saveGames == null) {
			console.log("No save games found");
	    	return;
		}
	    loadGame();
	    this.cursor1 = null;
	    break;
	case "Settings":
	    this.cursor1 = null;
	    currentPage = SETTINGS_PAGE;
	    break;
	case "Help":
	    this.cursor1 = null;
	    currentPage  = HELP_PAGE;
	    break;
	case "Credits":
	    this.cursor1 = null;
	    currentPage  = CREDITS_PAGE;
	    break;
	case "Back":
	    this.cursor1 = null;
	    currentPage  = MENU_PAGE;
	    break;
	}
}

this.redraw = function(){ 
 	//canvasContext.save;
	// canvasContext.setTransform(1, 0, 0, 0, 1, 0, 0, 0);
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	//canvasContext.restore;
}

this.draw = function(){
    if(gameIsStarted === false)
    {
        // if(currentPage == PAUSED_PAGE)
        // {
        //   currentPage = MENU_PAGE;
        // }

        this.redraw();

        canvasContext.drawImage(titlePic, 0,0);
        if(currentPage != CREDITS_PAGE && currentPage != HELP_PAGE) {
            canvasContext.drawImage(logoPic, canvas.width/2,30, 300,300);
        }
    }
    
    else {return;};


    for (let i = 0; i<menuPageText[currentPage].length; i++)
    {
        colorText((menuPageText[currentPage][i]), itemsX - (currentPage== HELP_PAGE ? 275 : 0), topItemY+rowHeight*i - (currentPage ==HELP_PAGE ? 325 : 0),
        (currentPage== HELP_PAGE ? "purple" : textColour), (currentPage == HELP_PAGE ? "25px" : textFontFace), 'left', 'top');

        //Draw cursor
        if (currentPage !=HELP_PAGE){
            canvasContext.drawImage(arrowPic, itemsX, topItemY + (this.cursor1 * rowHeight));
        }

    }
}


if(!gameIsRunning){
    console.log("Menu is running");
}
if(!gameIsStarted){
    console.log("Menu is started");
}


})();