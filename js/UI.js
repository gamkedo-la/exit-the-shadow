function drawUI() {
	playerLife();
	
	var bossNumber = 0;
	for (var i = 0; i < Entities.length; i++) {
		if (Entities[i] == Player) {
			continue;
		}
		if (Entities[i].isActive) {
			bossHealthBar(Entities[i], bossNumber);
			bossNumber++; // for when multiple bosses are on the screen
		}
	}
}

function playerLife() {
	var x = 10, y = 8, iconSize = 50, padding = 5;

	var oldX = x;
	for (var i = 0; i < Player.maxHP; i++) {
		canvasContext.drawImage(playerLifeIconBackground, x,y, iconSize,iconSize);
		x += iconSize;
	}
	x = oldX;
	for (i = 0; i < Player.HP; i++) {
		canvasContext.drawImage(playerLifeIcon, x+padding,y+padding, iconSize-padding*2,iconSize-padding*2);
		x += iconSize;
	}
	padding = 10;
	x = oldX + padding;
	y += iconSize;
	
	var regainHealthBarWidth = iconSize*5 - padding*2;
	canvasContext.drawImage(bossHealthBarOutline, x,y, regainHealthBarWidth, 15);
	
	x += 2;
	var regainHealthMeterWidth = regainHealthBarWidth - 4;
	regainHealthMeterWidth *= Player.regainHealthMeter / Player.regainHealthThreshold;
	canvasContext.drawImage(bossHealth, x, y, regainHealthMeterWidth, 15);
}

function bossHealthBar(boss, bossNumber) {
	canvasContext.save();
	canvasContext.font = "20px Impact";
	
	width = canvas.width - 192;
	height = 18;
	x = canvas.width / 2 - (width / 2);
	y = canvas.height - height - 48;
	y -= (height + 24) * bossNumber;
	canvasContext.drawImage(bossHealthBarOutline, x,y, width, height);
	
	colorText(boss.name, x+6,y-4, "#d0d0d0");
	strokeColorText(boss.name, x+6,y-4, "black", 1);
	
	healthLeft = width-4;
	healthLeft *= boss.HP / boss.maxHP;
	canvasContext.drawImage(bossHealth, x+2, y+2, healthLeft, height-4);
	
	canvasContext.restore();
}
