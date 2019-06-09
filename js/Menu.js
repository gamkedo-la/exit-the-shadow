const Menu = new (function() {
	const MENU_PAGE = 0;
	const SETTINGS_PAGE = 1;
	const HELP_PAGE = 2;
	const CREDITS_PAGE = 3;
	
	let itemsX = 250;
	let topItemY = 300;
	let itemsWidth = 650;
	let rowHeight = 80;
	
	this.cursor1 = null;
	let currentPage = 0;
	
	let textFontFace = "32px Satisfy";
	let textFontFaceCredits = "28px Satisfy";
	let textColour = "white";
	
	let classListMenu = ["New Game", "Continue", "Settings" , "Help", "Credits"];
	let classListSettings = ["Volume", "Back"];
	let classListHelp = ["Controls","Back"];
	let classListCredits = ["Back"];
	
	let menuPageText = [classListMenu, classListSettings, classListHelp, classListCredits];
	
	this.menuMouse = function(){
	    for (let i=0; i<menuPageText[currentPage].length; i++){
	        if(mouseX > itemsX && mouseX < itemsX + itemsWidth && mouseY > topItemY + (i*rowHeight) - (rowHeight / 2) &&
	         mouseY < topItemY + (i+1) * rowHeight - (rowHeight / 2)){
	            this.cursor1 = i;
	        } 
	    }
		
	    if (this.cursor1 < 0){
	        this.cursor1 = menuPageText[currentPage].length -1;
	    }
	
	    if (this.cursor1 > menuPageText[currentPage].length){
	        this.cursor1 = 0;
	    }
	}
	
	this.update = function(){
	    this.menuMouse();
	    this.draw();
	}
	
	this.changeMenuStateOnClick = function() {
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
			if (listSaves() == undefined || listSaves() == null) {
				console.log("no save games found");
		    	return;
	        }
	        gameIsStarted = true;
		    currentBackgroundMusic = AMBIENT_MUSIC;
		    bg_music[currentBackgroundMusic].play();
		    loadGame();
		    Menu.cursor1 = null;
		    break;
		case "Settings":
		    Menu.cursor1 = null;
		    currentPage = SETTINGS_PAGE;
		    break;
		case "Help":
		    Menu.cursor1 = null;
		    currentPage  = HELP_PAGE;
		    break;
		case "Credits":
		    Menu.cursor1 = null;
		    currentPage  = CREDITS_PAGE;
		    break;
		case "Back":
		    Menu.cursor1 = null;
		    currentPage  = MENU_PAGE;
		    break;
		}
	}
	
	this.redraw = function(){ 
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	this.draw = function(){
	    if(gameIsStarted) {
	    	return;
	    }
	
	    this.redraw();
	
	    canvasContext.drawImage(titlePic, 0,0);
	    if(currentPage != CREDITS_PAGE && currentPage != HELP_PAGE) {
	        canvasContext.drawImage(logoPic, canvas.width/2,30, 300,300);
	    }
		
	    for (let i = 0; i<menuPageText[currentPage].length; i++)
	    {
	        canvasContext.save();
	        canvasContext.font = textFontFace;
	        colorText(menuPageText[currentPage][i],itemsX - (currentPage == CREDITS_PAGE ? 275 : 0),topItemY + rowHeight * i - (currentPage == CREDITS_PAGE ? 325 : 0),
	        (currentPage == CREDITS_PAGE ? "yellow" : textColour), (currentPage == CREDITS_PAGE ? textFontFace : textColour), 'left', 'top');

	        //Draw cursor
	        canvasContext.drawImage(arrowPic, itemsX - 30, topItemY + (this.cursor1 * rowHeight) - 25);
			
			canvasContext.restore();
	    }
	}	
})();