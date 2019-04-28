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

function helpTextDisplay(_textAlpha, _leftBorder, _topBorder, _padPercentSize, _textHeight, _padTop)
{
	var textColor = "rgba(255, 0, 0, " + _textAlpha + ")";
	var textVPosShift = 0;
	var padLeft = _leftBorder + (canvas.width * _padPercentSize);

	saveFont();
	setFont("bold", 40, "Arial");
	colorText("W - Move Up", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	colorText("A - Move Left", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	colorText("S - Move Right", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	colorText("D - Move Down", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	colorText("Space (while pressing a direction) - Dash", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	colorText("E - Interact", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	colorText("K - Attack facing direction", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	colorText("L - Shield", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	colorText("P - Pause", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	colorText("H - This highly informative help box!", padLeft, _padTop + _topBorder + textVPosShift, textColor);
	textVPosShift += _textHeight;
	restoreFont();
}

function helpBlock()
{
	var textHeight = 40;
	var padPercentSize = 0.05;
	var maxBackgroundRectAlpha = 0.4;
	var maxTextAlpha = 1.0;

	var percentSize = 0.10;
	var leftBorder = canvas.width * percentSize;
	var rightBorder = canvas.width - leftBorder;
	var boxWidth = canvas.width - (leftBorder * 2);
	var topBorder = canvas.height * percentSize;
	var bottomBorder = canvas.height - topBorder;
	//var boxHeight = canvas.height - (topBorder * 2);
	var padTop = (canvas.height * padPercentSize) + textHeight;
	var boxHeight = (textHeight * 10) + (padTop * 1.25);

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
