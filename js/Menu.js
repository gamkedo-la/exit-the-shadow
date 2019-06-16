const Menu = new (function() {
	const MENU_PAGE = 0;
	const SETTINGS_PAGE = 1;
	const HELP_PAGE = 2;
	const CREDITS_PAGE = 3;
	let menuTorches = [];
	let twinkle = 0;
	
	let itemsX = null;
	let topItemY = null;
	let itemsWidth = 250;
	let rowHeight = 60;
	
	this.cursor1 = 0;
	let cursorPos;
	let currentPage = 0;
	
	let textFontFace = "32px Impact";
	let textFontFaceCredits = "28px Impact";
	let textColour = "#dacdc7"; // same as logo
	
	let classListMenu = ["New Game", "Continue", "Settings" , "Help", "Credits"];
	let classListSettings = ["Screen Shake", "Back"];
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

	this.resizingCanvas = function() {
		if(logoPic.width > 0) {
			itemsX = null;//forces recalculation of xPos for menu items

			menuTorches = [];
			menuTorches.push({x:cursorPos.x, y:canvas.height - cursorPos.y, imgName: 'torchPic', range:500, r:1, g:252/255, b:206/255});
			menuTorches.push({x:(canvas.width/2)-(logoPic.width/2), y:canvas.height - 64, imgName: 'torchPic', range:100, r:1, g:252/255, b:206/255});
			menuTorches.push({x:(canvas.width/2)+(logoPic.width/2), y:canvas.height - 64 - logoPic.height, imgName: 'torchPic', range:100, r:1, g:252/255, b:206/255});
			menuTorches.push({x:canvas.width - 100, y:100, imgName: 'torchPic', range:100, r:1, g:25/255, b:20/255});
			menuTorches.push({x:100, y:100, imgName: 'torchPic', range:100, r:1/255, g:25/255, b:206/255});
		}
	}
	
	this.changeMenuStateOnClick = function() {
		if (gameIsStarted) { 
			return;
		}
	
		switch(menuPageText[currentPage][Menu.cursor1]) {
	
		// MAIN PAGE
		case "New Game":
		    gameIsStarted = true;
		    switchMusic(AMBIENT_MUSIC, 1, AMBIENT_MUSIC_FADE_IN_RATE);
		    this.cursor1 = 0;
		    break;
		case "Continue":
			if (listSaves() == undefined || listSaves() == null) {
				console.log("no save games found");
		    	return;
	        }
	        gameIsStarted = true;
		    switchMusic(AMBIENT_MUSIC, 1, AMBIENT_MUSIC_FADE_IN_RATE);
		    loadGame();
		    Menu.cursor1 = 0;
		    break;
		case "Settings":
		    Menu.cursor1 = 0;
		    currentPage = SETTINGS_PAGE;
		    break;
		case "Help":
		    Menu.cursor1 = 0;
		    currentPage  = HELP_PAGE;
		    break;
		case "Credits":
		    Menu.cursor1 = 0;
		    currentPage  = CREDITS_PAGE;
		    break;
			
		// SETTINGS
		case "Screen Shake":
			camShakeOn = !camShakeOn;
			break;
			
		// UNIVERSAL
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
			var text = menuPageText[currentPage][i];
			
			// update text to show current setting
			if (text == "Screen Shake") {
				if (camShakeOn) {
					text += ": On";
				}
				else {
					text += ": Off";
				}
			}
			
			strokeColorText(text, itemsX, topItemY + rowHeight * i, 'black', 7)
	        colorText(text, itemsX, topItemY + rowHeight * i, textColour);

			if (menuPageText[currentPage][Menu.cursor1] == menuPageText[currentPage][i]) {
				//Draw cursor
				var textWidth = canvasContext.measureText(text).width;
				cursorPos = {x: itemsX - textWidth / 2 - 30, y: topItemY + (this.cursor1 * rowHeight) - 25};
				canvasContext.drawImage(arrowPic, cursorPos.x, cursorPos.y);
			
				if(menuTorches.length > 0) {
					menuTorches[0].x = cursorPos.x;
					menuTorches[0].y = canvas.height - cursorPos.y;	
				}
			}
	    }
		canvasContext.restore();

		if(menuTorches.length == 0) {
			this.resizingCanvas();
		}

		//lights, colors, ranges, darks, darkRanges
		const menuLights = [-1000, -1000];//no player => fake data
		const menuColors = [];
		const menuRanges = [];//no player => fake data
		const menuDarks = [];
		const menuDarkRanges = [];
		
		
		for (let i = 0; i < maxLights; i++) {
			if(i < menuTorches.length) {
				let slowCounter = 0;
				twinkle = Math.random();
				if(twinkle < 0.25) {
					slowCounter = 8 * Math.PI * twinkle;
					twinkle = menuTorches[i].range / 500;
				}
				
				menuLights.push(menuTorches[i].x + 10 * twinkle * (Math.sin(slowCounter)));
				menuLights.push(menuTorches[i].y + 10 * twinkle * (Math.sin(slowCounter)));
				menuColors.push(menuTorches[i].r);
				menuColors.push(menuTorches[i].g);
				menuColors.push(menuTorches[i].b);
				menuRanges.push(menuTorches[i].range + (Math.sin(slowCounter)));
			} else {
				menuLights.push(-1000);
				menuLights.push(-1000);
				menuColors.push(0);
				menuColors.push(0);
				menuColors.push(0);
				menuRanges.push(0);
			}

			menuDarks.push(0);
			menuDarks.push(0);
			menuDarkRanges.push(0);
		} 
		const shadowOverlay = illuminator.getShadowOverlay(menuLights, menuColors, menuRanges, menuDarks, menuDarkRanges);
		canvasContext.drawImage(shadowOverlay, 0, 0);
	}
})();