function helpBlock() {
		var textHeight = 40;
		var padPercentSize = 0.05;

		var percentSize = 0.10;
		var leftBorder = canvas.width * percentSize;
		var rightBorder = canvas.width - leftBorder;
		var boxWidth = canvas.width - (leftBorder * 2);
		var topBorder = canvas.height * percentSize;
		var bottomBorder = canvas.height - topBorder;
		//var boxHeight = canvas.height - (topBorder * 2);
		var padTop = (canvas.height * padPercentSize) + textHeight;
		var boxHeight = (textHeight * 10) + (padTop * 1.25);
		colorRect(leftBorder, topBorder, boxWidth, boxHeight, 'rgba(255, 255, 255, 0.4)'); // canvas

		var textColor = 'rgba(255, 0, 0, 1)';
		var textVPosShift = 0;
		var padLeft = leftBorder + (canvas.width * padPercentSize);
		saveFont();
		setFont("bold", 40, "Arial");
		colorText("W - Move Up", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		colorText("A - Move Left", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		colorText("S - Move Right", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		colorText("D - Move Down", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		colorText("Space (while pressing a direction) - Dash", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		colorText("E - Interact", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		colorText("K - Attack facing direction", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		colorText("L - Shield", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		colorText("P - Pause", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		colorText("H - This highly informative help box!", padLeft, padTop + topBorder + textVPosShift, textColor);
		textVPosShift += textHeight;
		restoreFont();
}
