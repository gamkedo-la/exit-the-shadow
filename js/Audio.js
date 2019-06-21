const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext(); // safari fix for delayed audio

var audioType = undefined;
var audioFormat = ".ogg"; // TODO: Add both ogg and mp3 versions of sfx/music

const TOTAL_SFX = 3;
const TOTAL_BG_MUSIC = 6;

var sfx = new Array(TOTAL_SFX);
var bg_music = new Array(TOTAL_BG_MUSIC);

const ATTACK_SFX = 0;
const SAVE_SFX = 1;
const GOT_HIT_SFX = 2;

const AMBIENT_MUSIC = 0;
const FINAL_BOSS = 1;
const SHADOW_BOSS = 2;
const MENU_MUSIC = 3;
const BEAST_BOSS = 4;
const AMBIENT_TENSION = 5;

var currentBackgroundMusic;

var musicVolume = 1;

const BOSS_MUSIC_FADE_OUT_RATE = 0.02;
const AMBIENT_MUSIC_FADE_IN_RATE =  0.005;
const AMBIENT_MUSIC_FADE_OUT_RATE = 0.02;
const AMBIENT_TENSION_FADE_IN_RATE =  0.02;
const AMBIENT_TENSION_FADE_OUT_RATE =  0.02;

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
	this.fadingOut = false;
	let fadeOutRate = 0.1;
	
	this.fadingIn = false;
	let fadeInRate = 0.1;

	this.load = function(file) {
		this.sound = new Audio(file+audioFormat);
		if (this.tag == 'music') {
			this.sound.loop = true;
		} 
	}
	
	this.play = function() {
		this.sound.currentTime = 0;
		this.sound.play();
	}
	
	this.stop = function() {
		this.sound.pause();
		this.sound.currentTime = 0;
	}
	
	this.fadeOut = function(fadeOutRate_) {
		fadeOutRate = fadeOutRate_;
	    this.fadingOut = true;
	}
	
	this.fadeIn = function(fadeInRate_) {
		fadeInRate = fadeInRate_;
		this.sound.volume = 0;
		this.play();
	    this.fadingIn = true;
	}
	
	this.isPlaying = function() {
		return !this.sound.paused;
	}
	
	this.update = function() {
		if (this.fadingOut) {
			if (this.sound.volume <= fadeOutRate) {
				this.sound.volume = musicVolume;
				this.stop();
				this.fadingOut = false;
			}
			else {
				this.sound.volume -= fadeOutRate;
			}
		}
		else if (this.fadingIn) {
			if (this.sound.volume >= musicVolume - fadeInRate) {
				this.sound.volume = musicVolume;
				this.fadingIn = false;
			}
			else {
				this.sound.volume += fadeInRate;
			}
		}
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
	sfx[SAVE_SFX].load("sfx/typewriter");
	sfx[GOT_HIT_SFX].load("sfx/got_hit");

	bg_music[AMBIENT_MUSIC].load("music/ambientBackgroundMusic");
	bg_music[FINAL_BOSS].load("music/finalBossBattleMusicV1");
	bg_music[SHADOW_BOSS].load("music/shadowBossBattleMusicV1");
	bg_music[MENU_MUSIC].load("music/titleScreenMusic");
	bg_music[BEAST_BOSS].load("music/beastBossBattleMusicV1"); // TODO: replace with beast boss music path when ready
	bg_music[AMBIENT_TENSION].load("music/ambientTensionMusicV1");
	
	console.log("load audio");
}

function switchMusic(newMusic, fadeOutRate, fadeInRate) {
	for (var i = 0; i < bg_music.length; i++) {
		if (bg_music[i].isPlaying()) {
			bg_music[i].fadeOut(fadeOutRate);
		}
	}
	
	bg_music[newMusic].fadeIn(fadeInRate);
}
