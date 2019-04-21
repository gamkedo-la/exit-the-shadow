function playerLife () {
	var x = 10, y = 8;

	for (var i = 0; i < Player.HP; i++) {
		canvasContext.drawImage(playerLifeIcon, x,y, 50,50);
		x += 50;
	}
}

