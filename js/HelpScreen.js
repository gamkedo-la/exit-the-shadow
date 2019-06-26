var m_backgroundTransitionTime = 0.25;
var m_textTransitionTime = 0.3;
var m_transitioningOutTime = 0.5;
var m_helpScreenTrasitioningOut = false;

const helpScreenTransitions = {
	BACKGROUND_START: { name: "Background Start", time: 0.0 },
	BACKGROUND_TRANSITIONING: { name: "Background Transitioning", time: m_backgroundTransitionTime },
	TEXT_START: { name: "Text Start", time: 0.0 },
	TEXT_TRANSITIONING: { name: "Text Transitioning", time: m_textTransitionTime },
	TRANSITION_DONE: { name: "Transition Done", time: 0	},
	TRANSITIONING_OUT: { name: "Transitioning Out", time: m_transitioningOutTime },
	TRANSITION_OUT_DONE: { name: "Transition Out Done", time: 0 }
}
var currHelpScreenTransition;
var helpScreenTransitionTime;
var helpScreenElapsedTime;
var dt = new Date();
var helpScreenLastTime = dt.getTime() / 1000.0;

var controlsText = [
	"W - Move Up",
	"A - Move Left",
	"S - Move Down",
	"D - Move Right",
	"E - Interact",
	"Space - Dash",
	"K - Attack",
	"L - Shield",
	"P - Pause",
	"H - Help",
]

function loadHelpScreen() {
	mainGameState = false;
	m_helpScreenTrasitioningOut = false;
	helpScreen = true;
	currHelpScreenTransition = helpScreenTransitions.BACKGROUND_START;
}

function exitHelpScreen() {
	mainGameState = true;
	gamePaused = false;
	helpScreen = false;
	m_helpScreenTrasitioningOut = true;
	currHelpScreenTransition = helpScreenTransitions.TRANSITIONING_OUT;
}

function helpTextDisplay(_textAlpha, _leftBorder, _topBorder, _padPercentSize, _textHeight, _padTop)
{
	var textColor = "rgba(217, 87, 99, " + _textAlpha + ")";
	var textVPosShift = 0;
	//var padLeft = _leftBorder + (canvas.width * _padPercentSize);
	var padLeft = canvas.width / 2;

	saveFont();
	setFont("bold", 35, "Impact");
	canvasContext.save();
	canvasContext.textAlign = "center";
	for (var i = 0; i < controlsText.length; i++) {
		var text = controlsText[i];

		if (text == "H - Help") {
			text = "H - Show / Hide Help Box";
			textVPosShift += _textHeight;
		}

		colorText(text, padLeft, _padTop + _topBorder + textVPosShift, textColor);
		strokeColorText(text, padLeft, _padTop + _topBorder + textVPosShift, "rgba(0, 0, 0, " + _textAlpha + ")", 1.5);
		textVPosShift += _textHeight;
	}

	restoreFont();
	canvasContext.restore();
}

function helpBlock()
{
	var textHeight = 35;
	var padPercentSize = 0.05;
	var maxBackgroundRectAlpha = 0.25;
	var maxTextAlpha = 0.8;

	var percentSize = 0.08;
	var leftBorder = canvas.width * percentSize;
	var rightBorder = canvas.width - leftBorder;
	var boxWidth = canvas.width - (leftBorder * 2);
	var topBorder = canvas.height * percentSize;
	var bottomBorder = canvas.height - topBorder;
	//var boxHeight = canvas.height - (topBorder * 2);
	var padTop = (canvas.height * padPercentSize) + textHeight + 20;
	var boxHeight = (textHeight * 11) + (padTop * 1.25);

	var d = new Date();
	var currTime = d.getTime() / 1000.0;
	var helpScreenElapsedTime = currTime - helpScreenLastTime;

	switch (currHelpScreenTransition)
	{
		case helpScreenTransitions.BACKGROUND_START:
			helpScreenTransitionTime = 0;
			currHelpScreenTransition = helpScreenTransitions.BACKGROUND_TRANSITIONING;
			break;
		case helpScreenTransitions.BACKGROUND_TRANSITIONING:
			helpScreenTransitionTime += helpScreenElapsedTime;
			if (helpScreenTransitionTime >= helpScreenTransitions.BACKGROUND_TRANSITIONING.time)
			{
				currHelpScreenTransition = helpScreenTransitions.TRANSITION_DONE;
			}
			var lerpVal = clamp01(helpScreenTransitionTime / m_backgroundTransitionTime);
			var alphaRectVal = lerp(0.0, maxBackgroundRectAlpha, lerpVal);
			colorRect(leftBorder, topBorder, boxWidth, boxHeight, "rgba(255, 255, 255," + alphaRectVal + ")");
			lerpVal = clamp01(helpScreenTransitionTime / m_backgroundTransitionTime);
			var alphaTextVal = lerp(0.0, maxTextAlpha, lerpVal);
			helpTextDisplay(alphaTextVal, leftBorder, topBorder, padPercentSize, textHeight, padTop);
			break;
		//case helpScreenTransitions.TEXT_START:
		//	helpScreenTransitionTime = 0;
		//	currHelpScreenTransition = helpScreenTransitions.TEXT_TRANSITIONING;
		//	colorRect(leftBorder, topBorder, boxWidth, boxHeight, "rgba(255, 255, 255," + maxBackgroundRectAlpha + ")");
		//	break;
		//case helpScreenTransitions.TEXT_TRANSITIONING:
		//	helpScreenTransitionTime += helpScreenElapsedTime;
		//	if (helpScreenTransitionTime >= helpScreenTransitions.BACKGROUND_TRANSITIONING.time)
		//	{
		//		currHelpScreenTransition = helpScreenTransitions.TRANSITION_DONE;
		//	}
		//	var lerpVal = clamp01(helpScreenTransitionTime / m_textTransitionTime);
		//	var alphaTextVal = lerp(0.0, maxTextAlpha, lerpVal);
		//	colorRect(leftBorder, topBorder, boxWidth, boxHeight, "rgba(255, 255, 255," + maxBackgroundRectAlpha + ")");
		//	helpTextDisplay(alphaTextVal, leftBorder, topBorder, padPercentSize, textHeight, padTop);
		//	break;
		case helpScreenTransitions.TRANSITION_DONE:
			colorRect(leftBorder, topBorder, boxWidth, boxHeight, "rgba(255, 255, 255," + maxBackgroundRectAlpha + ")");
			helpTextDisplay(maxTextAlpha, leftBorder, topBorder, padPercentSize, textHeight, padTop);
			break;
		case helpScreenTransitions.TRANSITIONING_OUT:
			helpScreenTransitionTime += helpScreenElapsedTime;
			if (helpScreenTransitionTime >= helpScreenTransitions.TRANSITIONING_OUT.time)
			{
				currHelpScreenTransition = helpScreenTransitions.TRANSITION_OUT_DONE;
			}
			var lerpVal = clamp01(helpScreenTransitionTime / m_transitioningOutTime);
			var alphaRectVal = lerp(maxBackgroundRectAlpha, 0.0, lerpVal);
			colorRect(leftBorder, topBorder, boxWidth, boxHeight, "rgba(255, 255, 255," + alphaRectVal + ")");
			lerpVal = clamp01(helpScreenTransitionTime / m_transitioningOutTime);
			var alphaTextVal = lerp(maxTextAlpha, 0.0, lerpVal);
			helpTextDisplay(alphaTextVal, leftBorder, topBorder, padPercentSize, textHeight, padTop);
			break;
		case helpScreenTransitions.TRANSITION_OUT_DONE:
			m_helpScreenTrasitioningOut = false;
			//colorRect(leftBorder, topBorder, boxWidth, boxHeight, "rgba(255, 255, 255," + maxBackgroundRectAlpha + ")");
			//helpTextDisplay(maxTextAlpha, leftBorder, topBorder, padPercentSize, textHeight, padTop);
			break;
	}

	helpScreenLastTime = currTime;
}
