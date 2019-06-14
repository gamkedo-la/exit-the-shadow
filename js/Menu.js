const Menu = new (function() {
	const MENU_PAGE = 0;
	const SETTINGS_PAGE = 1;
	const HELP_PAGE = 2;
	const CREDITS_PAGE = 3;
	
	let itemsX = null;
	let topItemY = null;
	let itemsWidth = 250;
	let rowHeight = 60;
	
	this.cursor1 = null;
	let currentPage = 0;
	
	let textFontFace = "32px Impact";
	let textFontFaceCredits = "28px Impact";
	let textColour = "#dacdc7"; // same as logo
	
	let classListMenu = ["New Game", "Continue", "Settings" , "Help", "Credits"];
	let classListSettings = ["Volume", "Back"];
	let classListHelp = ["Controls","Back"];
	let classListCredits = ["Back"];
	
	let menuPageText = [classListMenu, classListSettings, classListHelp, classListCredits];
	
	let menuMusicStarted = false;
	
	this.menuMouse = function(){
	    for (let i=0; i<menuPageText[currentPage].length; i++){
	        if(mouseX > itemsX - (itemsWidth / 2) && mouseX < itemsX + (itemsWidth / 2) && mouseY > topItemY + (i*rowHeight) - (rowHeight / 2) &&
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
		if (!menuMusicStarted) {
			menuMusicStarted = true;
			setTimeout(function() {
				switchMusic(MENU_MUSIC, 1, AMBIENT_MUSIC_FADE_IN_RATE);
			}, 200);
		}
		
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
		    switchMusic(AMBIENT_MUSIC, 1, AMBIENT_MUSIC_FADE_IN_RATE);
		    this.cursor1 = null;
		    break;
		case "Continue":
			if (listSaves() == undefined || listSaves() == null) {
				console.log("no save games found");
		    	return;
	        }
	        gameIsStarted = true;
		    switchMusic(AMBIENT_MUSIC, 1, AMBIENT_MUSIC_FADE_IN_RATE);
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
		canvasContext.drawImage(logoPic, (canvas.width/2)-(logoPic.width/2),64);
		
		if (itemsX == null) {
			itemsX = canvas.width / 2;
		}
		if (topItemY == null) {
			topItemY = 64 + logoPic.height + 64;
		}
		
        canvasContext.save();
        canvasContext.font = textFontFace;
		canvasContext.textAlign = "center";
	    for (let i = 0; i<menuPageText[currentPage].length; i++)
	    {
			strokeColorText(menuPageText[currentPage][i], itemsX, topItemY + rowHeight * i, 'black', 7)
	        colorText(menuPageText[currentPage][i], itemsX, topItemY + rowHeight * i, textColour);

	        //Draw cursor
	        canvasContext.drawImage(arrowPic, itemsX - 100, topItemY + (this.cursor1 * rowHeight) - 25);
	    }
		canvasContext.restore();
	}	
})();