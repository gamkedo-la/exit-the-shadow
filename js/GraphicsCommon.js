function drawBitmapCenteredWithRotation(useBitmap, atX, atY, withAng) {
	canvasContext.save();
	canvasContext.translate(atX, atY);
	canvasContext.rotate(withAng);
	canvasContext.drawImage(useBitmap, -useBitmap.width/2, -useBitmap.height/2);
	canvasContext.restore();
}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorTriangle(x1,y1, x2,y2, x3,y3, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.moveTo(x1, y1);
	canvasContext.lineTo(x2, y2);
	canvasContext.lineTo(x3, y3);
	canvasContext.fill();
}

function colorCircle(centerX, centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();
}

function colorText(text, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(text, textX,textY);
}

var savedFont;

function saveFont() {
	savedFont = canvasContext.font;
}

function restoreFont() {
	canvasContext.font = savedFont;
}

function setFont(style, fontSize, font) {
	canvasContext.font = style + " " + fontSize + "px " + font;
}
