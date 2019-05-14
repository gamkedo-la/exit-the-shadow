var audioType = undefined;
var audioFormat = ".ogg"; // TODO: Add both ogg and mp3 versions of sfx/music

const TOTAL_SFX = 1;
const TOTAL_BG_MUSIC = 2;

var sfx = new Array(TOTAL_SFX);
var bg_music = new Array(TOTAL_BG_MUSIC);

const ATTACK_SFX = 0;

const AMBIENT_MUSIC = 0;
const FINAL_BOSS = 1;

var currentBackgroundMusic;

//This will help set the correct format type based on browser
var setAudioTypeAndSourceExtension = () => {
	var testMusic = new Audio();
	if (testMusic.canPlayType('audio/ogg;')) {
		audioType = 'audio/ogg';
	} else {
		audioType = 'audio/mpeg';
	}

	if (audioType === 'audio/mpeg') {
		audioFormat = ".mp3";
	} else {
		audioFormat = ".ogg";
	}
};

setAudioTypeAndSourceExtension();

function AudioClass() {
	this.tag = '';

	this.load = function(file) {
		this.altTurn = false;
		this.sound = new Audio(file+audioFormat);
		if (this.tag == 'music') {
			this.sound.loop = true;
		} 
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
	for(var i = 0; i < TOTAL_SFX; i++) {
		sfx[i] = new AudioClass();
		sfx[i].tag = 'sfx';
	}
		
	for(var i = 0; i < TOTAL_BG_MUSIC; i++) {
		bg_music[i] = new AudioClass();
		bg_music[i].tag = 'music';
	}

	console.log("init audio");
}

function loadAudio()
{
	sfx[ATTACK_SFX].load("sfx/attack");

	bg_music[AMBIENT_MUSIC].load("music/ambientBackgroundMusic");
	bg_music[FINAL_BOSS].load("music/finalBossBattleMusicV1");
	
	console.log("load audio");
}

