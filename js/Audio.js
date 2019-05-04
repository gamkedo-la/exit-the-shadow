//test commit. Will delete this comment.
const audioFormat = ".ogg";

const TOTAL_SFX = 1;
const TOTAL_BG_MUSIC = 0;

var sfx = new Array(TOTAL_SFX);
var bg_music = new Array(TOTAL_BG_MUSIC);

const ATTACK_SFX = 0;

function AudioClass() {
	this.load = function(file) {
		this.altTurn = false;
		this.sound = new Audio(file+audioFormat);
		this.altSound = new Audio(file+audioFormat);
	}
	
	this.play = function() {
		if(this.altTurn) {
			this.altSound.currentTime = 0;
			this.altSound.play();
		}
		else {
			this.sound.currentTime = 0;
			this.sound.play();
		}
		
		this.altTurn = !this.altTurn;
	}
}

function initAudio()
{
	for(var i = 0; i < TOTAL_SFX; i++)
		sfx[i] = new AudioClass();
	for(var i = 0; i < TOTAL_BG_MUSIC; i++)
		bg_music[i] = new AudioClass();
	
	console.log("init audio");
}

function loadAudio()
{
	sfx[ATTACK_SFX].load("sfx/attack");
	
	console.log("load audio");
}

