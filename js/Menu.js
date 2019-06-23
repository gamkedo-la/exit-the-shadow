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
	let textFontFaceCredits = "14px Impact";
	let textColour = "#dacdc7"; // same as logo
	
	let classListMenu = ["New Game", "Continue", "Settings" , "Controls", "Credits"];
	let classListSettings = ["Screen Shake", "Back"];
	let classListHelp = ["Back"];
	let classListCredits = ["Back"];
	
	let creditsList = [
"• Praneil Kamat: Project lead, main gameplay code, base enemy and attack functionality, shielding, map layout, push attacks,",
"  camera shake toggle, final boss variant of player sprite, healthbar hookups, healthy recovery, additional art integration,",
"  many bug fixes, shadow boss and final boss behavior, player harmed sounds, Safari sound fixes",
"• H Trayford: Floor tile implementation (based on Ygor art), webGL dynamic colored lighting, camera clamping, collision",
"  improvements, improved depth sorting support, platform support, shadow boss sprites, gamepad improvements, menu key support",
"• Ygor Dimas: Art direction, platform sprite, environment tiles, healing statue, typewriter, typewriter room and platform,",
"  ruins, cage, moth lamp, skeleton, tree",
"• Alan Zaring: All music (ambient, final boss, beast boss, shadow boss, title screen) and ambient tension",
"• Bilal A. Cheema: Player sprite and all animations, attack sound, vignette effect, player shield graphics",
"• Christer \"McFunkypants\" Kaitila: Canvas resizing, gamepad support, motion blur dash trail, tile sorting optimization,",
"  light glow effects, early player shadows, wall torch sprite, debris adaptation (based on Ygor art) and debris placement,",
"  webGL lighting adjustments, game logo",
"• Vaan Hope Khani: Font integration, main menu code, beast boss behavior code",
"• Lukas: Save and load functionality, save menu (not in final game), boss death text, last boss death check, typewriter sound",
"• Simon J Hoffiz: Screen shake functionality, player UI for lives",
"• Bryan Pope: Help screen plus transitions, death text, respawn",
"• Terrence McDonnell: Additional menu codeetup, music loop support, dash and trail tuning",
"• Vince McKeown: Help screen improvements, game pauses if not in focus",
"• Ryan Malm: Collision velocity resolution code",
"• Chris DeLeon: Beast Boss procedrual hair",
"• Ryan Gaillard: Play timer functionality",
"• Matt Piwowarczyk: Pause functionality",
"Special thanks: Randy Tan Shaoxian and Brian Nielsen. Game made in Gamkedo Club!"
	];

	let menuPageText = [classListMenu, classListSettings, classListHelp, classListCredits];
	
	let menuMusicStarted = false;
	
	var displayControls = false;
	
	this.menuMouse = function(){
	    for (let i=0; i<menuPageText[currentPage].length; i++){
	        if(mouseX > itemsX - (itemsWidth / 2) && mouseX < itemsX + (itemsWidth / 2) && mouseY > topItemY + (i*rowHeight) - (rowHeight / 2) &&
	         mouseY < topItemY + (i+1) * rowHeight - (rowHeight / 2)){
//	            this.cursor1 = i;
				this.setCursorIndex(i);
	        } 
	    }
	}

	this.setCursorIndex = function(index) {
		this.cursor1 = index;

		if (this.cursor1 < 0){
	        this.cursor1 = menuPageText[currentPage].length -1;
	    }
	
	    if (this.cursor1 >= menuPageText[currentPage].length){
	        this.cursor1 = 0;
	    }
	}
	
	this.update = function(){
		if (!menuMusicStarted) {
			menuMusicStarted = true;
			setTimeout(function() {
				switchMusic(MENU_MUSIC, AMBIENT_MUSIC_FADE_OUT_RATE, AMBIENT_MUSIC_FADE_IN_RATE);
			}, 200);
		}

	    this.draw();
	}

	this.resizingCanvas = function() {
		if(logoPic.width > 0) {
			itemsX = null;//forces recalculation of xPos for menu items
			topItemY = null;

			menuTorches = [];
			menuTorches.push({x:100 + (canvas.width/2)-(logoPic.width/2), y:canvas.height - 64, imgName: 'torchPic', range:200, r:1/255, g:252/255, b:20/255});
			menuTorches.push({x:(canvas.width/2)+(logoPic.width/2), y:canvas.height - 64 - logoPic.height, imgName: 'torchPic', range:200, r:1, g:252/255, b:206/255});
			menuTorches.push({x:canvas.width - 100, y:100, imgName: 'torchPic', range:200, r:1, g:25/255, b:20/255});
			menuTorches.push({x:100, y:100, imgName: 'torchPic', range:200, r:1/255, g:25/255, b:206/255});
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
			restartGame(true);
			loadHelpScreen();
			startTutorial();
			Player.HP = 1;
			menuFadeInAlpha = 0;
		    this.cursor1 = 0;
		    break;
		case "Continue":
			if (listSaves() == undefined || listSaves() == null) {
				console.log("no save games found");
		    	return;
	        }
	        gameIsStarted = true;
			loadGame();
			restartGame(true);
			loadGame(); // need to do this before and after restart game - not ideal but works for now
			disableTutorial();
			menuFadeInAlpha = 0;
		    Menu.cursor1 = 0;
		    break;
		case "Settings":
		    Menu.cursor1 = 0;
		    currentPage = SETTINGS_PAGE;
		    break;
		case "Controls":
		    Menu.cursor1 = 0;
		    currentPage  = HELP_PAGE;
			displayControls = true;
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
		    Menu.cursor1 = 0;
		    currentPage  = MENU_PAGE;
			displayControls = false;
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
		canvasContext.drawImage(logoPic, (canvas.width/2)-(logoPic.width/2),canvas.height/2 - 280);
		
		if (itemsX == null) {
			itemsX = canvas.width / 2;
		}
		if (topItemY == null) {
			topItemY = canvas.height/2 - 280 + logoPic.height + 64;
		}
		
        canvasContext.save();

        if(currentPage == CREDITS_PAGE) {
	        canvasContext.font = textFontFaceCredits;
			canvasContext.textAlign = "center";
			var yOffset = topItemY -15;
			var cursorOffset = topItemY -15;

			for (let i = 0; i<creditsList.length; i++)
		    {
		    	var line = creditsList[i];
		    	var lineX = canvas.width/2;
		    	strokeColorText(line, lineX, yOffset, 'black', 3)
		        colorText(line, lineX, yOffset, textColour);
				yOffset += 14;
		    }
		}

		canvasContext.font = textFontFace;
		canvasContext.textAlign = "center";
		yOffset = topItemY;
		cursorOffset = topItemY - 27;

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
			
			if (displayControls) {
				var xOffset = 120;
				for (var j = 0; j < controlsText.length; j++) {
					strokeColorText(controlsText[j], itemsX - xOffset, yOffset, 'black', 3);
					colorText(controlsText[j], itemsX - xOffset, yOffset, textColour);
					j++;
					if (j == controlsText.length) {
						break;
					}
					strokeColorText(controlsText[j], itemsX + xOffset, yOffset, 'black', 3);
					colorText(controlsText[j], itemsX + xOffset, yOffset, textColour);
					yOffset += rowHeight;
					cursorOffset += rowHeight;
				}
				strokeColorText("Gamepad Supported", itemsX, yOffset, 'black', 4);
				colorText("Gamepad Supported", itemsX, yOffset, textColour);
				yOffset += rowHeight;
				cursorOffset += rowHeight;
			}
			if (currentPage == CREDITS_PAGE) {
				yOffset += (rowHeight * 6);
				cursorOffset += (rowHeight * 6);
			}
			
			strokeColorText(text, itemsX, yOffset, 'black', 6)
	        colorText(text, itemsX, yOffset, textColour);
			yOffset += rowHeight;

			if (menuPageText[currentPage][Menu.cursor1] == menuPageText[currentPage][i]) {
				//Draw cursor
				var textWidth = canvasContext.measureText(text).width;
				cursorPos = {x: itemsX - textWidth / 2 - 30, y: (this.cursor1 * rowHeight) + cursorOffset};
				canvasContext.drawImage(arrowPic, cursorPos.x, cursorPos.y);
			}
	    }
		canvasContext.restore();

		if(menuTorches.length == 0) {
			this.resizingCanvas();
		}

		//lights, colors, ranges, darks, darkRanges
		let menuLights;
		if (displayControls || currentPage == CREDITS_PAGE) {
			menuLights = [canvas.width / 2 + ILLUM_OFFSET_X, canvas.height / 2 - ILLUM_OFFSET_Y];
		}
		else {
			menuLights = [cursorPos.x + ILLUM_OFFSET_X, canvas.height - cursorPos.y - ILLUM_OFFSET_Y];
		}
		const menuColors = [];
		const menuRanges = [];
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
				menuLights.push(0);
				menuLights.push(0);
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
		
		colorRect(0,0, canvas.width,canvas.height, "rgba(0, 0, 0, " + menuFadeInAlpha + ")");
	}
})();