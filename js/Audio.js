const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext(); // safari fix for delayed audio

var audioType = undefined;
var audioFormat = ".ogg";

const TOTAL_SFX = 17;
const TOTAL_BG_MUSIC = 6;

var sfx = new Array(TOTAL_SFX);
var bg_music = new Array(TOTAL_BG_MUSIC);

const ATTACK_SFX = 0;
const SAVE_SFX = 1;
const GOT_HIT_SFX = 2;
const FOOTSTEP1 = 3;
const FOOTSTEP2 = 4;
const FOOTSTEP3 = 5;
const FOOTSTEP4 = 6;
const FOOTSTEP5 = 7;
const FOOTSTEP6 = 8;
const FOOTSTEP7 = 9;
const FOOTSTEP8 = 10;
const FOOTSTEP9 = 11;
const FOOTSTEP10 = 12;
const FOOTSTEP11 = 13;
const FOOTSTEP12 = 14;
const FOOTSTEP13 = 15;
const FOOTSTEP14 = 16;

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

var footstepsPlaying = false;

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
}

function loadAudio()
{
	sfx[ATTACK_SFX].load("sfx/attack");
	sfx[SAVE_SFX].load("sfx/typewriter");
	sfx[GOT_HIT_SFX].load("sfx/got_hit");
	sfx[FOOTSTEP1].load("sfx/footstep1");
	sfx[FOOTSTEP2].load("sfx/footstep2");
	sfx[FOOTSTEP3].load("sfx/footstep3");
	sfx[FOOTSTEP4].load("sfx/footstep4");
	sfx[FOOTSTEP5].load("sfx/footstep5");
	sfx[FOOTSTEP6].load("sfx/footstep6");
	sfx[FOOTSTEP7].load("sfx/footstep7");
	sfx[FOOTSTEP8].load("sfx/footstep1"); // double up footsteps to reduce chance of all being played
	sfx[FOOTSTEP9].load("sfx/footstep2");
	sfx[FOOTSTEP10].load("sfx/footstep3");
	sfx[FOOTSTEP11].load("sfx/footstep4");
	sfx[FOOTSTEP12].load("sfx/footstep5");
	sfx[FOOTSTEP13].load("sfx/footstep6");
	sfx[FOOTSTEP14].load("sfx/footstep7");

	bg_music[AMBIENT_MUSIC].load("music/ambientBackgroundMusic");
	bg_music[FINAL_BOSS].load("music/finalBossBattleMusicV1");
	bg_music[SHADOW_BOSS].load("music/shadowBossBattleMusicV1");
	bg_music[MENU_MUSIC].load("music/titleScreenMusic");
	bg_music[BEAST_BOSS].load("music/beastBossBattleMusicV1");
	bg_music[AMBIENT_TENSION].load("music/ambientTensionMusicV1");
}

function switchMusic(newMusic, fadeOutRate, fadeInRate) {
	for (var i = 0; i < bg_music.length; i++) {
		if (bg_music[i].isPlaying()) {
			bg_music[i].fadeOut(fadeOutRate);
		}
	}

	bg_music[newMusic].fadeIn(fadeInRate);
}

function getRandomInt(min, max) {
  let randomInt = min + Math.floor(Math.random() * (max - min + 1));
  return randomInt;
}

let arrayOfFootstepSounds = [];

function initializeArrayOfFootstepSounds() {
	arrayOfFootstepSounds = [sfx[FOOTSTEP1], sfx[FOOTSTEP2], sfx[FOOTSTEP3], sfx[FOOTSTEP4],sfx[FOOTSTEP5], sfx[FOOTSTEP6], sfx[FOOTSTEP7]];
}

//multisound is the name of the function from FMOD that is intended to add variety to repetitive sounds to help increase
//aural aesthetics and prevent ear fatigue, this is a basic version using pitch shifted audio files based on the original
//sound and volume randomization
function playMultiSound(arrayOfSoundsToVarietize) {
  let arrayLength = arrayOfSoundsToVarietize.length;
  for (let i = 0; i < arrayLength*10; i++) { // TODO: make this more efficient - only needs to run for the length of the array and 'check off' each sound it tries as it goes
	  let randomArrayIndex = getRandomInt(0, arrayLength - 1);
	  let randomSoundFromArray = arrayOfSoundsToVarietize[randomArrayIndex];
	  if (!randomSoundFromArray.isPlaying()) {
			let randomVolume = getRandomInt(5,15);
			randomVolume = randomVolume/100;
		  randomSoundFromArray.sound.volume = randomVolume;
		  randomSoundFromArray.play();
		  break;
	  }
  }
}
