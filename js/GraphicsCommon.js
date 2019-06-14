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

function colorText(text, textX, textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(text, textX,textY);
}

function strokeColorText(text, textX, textY, strokeColor, lineWidth) {
	canvasContext.strokeStyle = strokeColor;
	canvasContext.lineWidth = lineWidth;
	canvasContext.strokeText(text, textX,textY);
}

function textWidth(_text) {
	return canvasContext.measureText(_text).width;
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

function deathTextDisplay(textToDisplay = "no more are you", 
							textColor = "rgba(255, 255, 255, " + 0.3 + ")",
							bgColor = "rgba(128, 30, 30," + 0.7 + ")")
{
	saveFont();
	var txtHeight = 40;
	setFont("bold", txtHeight, "Arial");

	var percentSize = 0.2;
	var txtWidth = textWidth(textToDisplay);
	var boxWidth = txtWidth * (1 + percentSize);
	var boxHeight = txtHeight * (1 + percentSize);
	var halfWidthCanvas = (canvas.width * 0.5);
	var halfHeightCanvas = (canvas.height * 0.5);
	var boxXPos = halfWidthCanvas - (boxWidth * 0.5);
	var boxYPos = halfHeightCanvas - (boxHeight * 0.5);
	var txtXPos = halfWidthCanvas - (txtWidth * 0.5);
	var txtYPos = halfHeightCanvas;
	var bLine = canvasContext.textBaseline;

	colorRect(boxXPos, boxYPos, boxWidth, boxHeight, bgColor);
	canvasContext.textBaseline = "middle";
	colorText(textToDisplay, txtXPos, txtYPos, textColor);
	canvasContext.textBaseline = bLine;

	restoreFont();
}
