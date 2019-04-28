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
	var x = 10, y = 8, iconSize = 50;

	var oldX = x;
	for (var i = 0; i < Player.HP; i++) {
		canvasContext.drawImage(playerLifeIcon, x,y, iconSize,iconSize);
		x += iconSize;
	}
	var padding = 10;
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
	canvasContext.font = "20px Arial";
	
	width = canvas.width - 192;
	height = 18;
	x = canvas.width / 2 - (width / 2);
	y = canvas.height - height - 48;
	y -= (height + 24) * bossNumber;
	canvasContext.drawImage(bossHealthBarOutline, x,y, width, height);
	
	colorText(boss.name, x,y-4, 'black');
	
	healthLeft = width-4;
	healthLeft *= boss.HP / boss.maxHP;
	canvasContext.drawImage(bossHealth, x+2, y+2, healthLeft, height-4);
	
	canvasContext.restore();
}
