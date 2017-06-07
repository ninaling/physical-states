var timestamps = {
	5640: "iron",
	17660: "salt",
	28030: "metal",
	39240: "diamond",
	53820: "iron",
	59030: "carbon_lattice",
	74660: "carbon",
	96840: "mdma",
	103190: "water",
	115500: "title"
};

class Controller{
	constructor(){
		this.timer = 0;
		this.audio = document.getElementsByTagName('audio')[0];
	}

	start(){
		this.audio.src = 'assets/sounds/legion.mp3';
		this.audio.loop = false;
		this.audio.autoplay = false;
		this.audio.volume = 1;

		this.audio.play();
		var start = new Date().getTime();
		for (var time in timestamps) {
			doSetTimeout(time, timestamps[time]);
			console.log("set timeout for "+timestamps[time]+" at "+time.toString());
		}
	}

	mute() {
		// this.audio.pause();
		this.audio.volume = 0;
		document.getElementById("controls__sound").classList.remove('unmuted');
	}

	unmute() {
		// this.audio.play();
		this.audio.volume = 1;
		document.getElementById("controls__sound").classList.add('unmuted');
	}

}

function doSetTimeout(time, mode) {
	setTimeout(function(){
		if (mode == 'title'){
			World.changeScene(mode);
			setTimeout(function(){
				audio.src = 'assets/sounds/rumbling.mp3';
				audio.loop = true;
				audio.autoplay = true;
				audio.volume = .5;
				started = false;
			}, 1000);
			return;
		}
		distortTitleBackground();//need to change function to distort any background, not just title
		World.titleIconObjects[mode].spinWildly();
		setTimeout(function(){
			World.changeScene(mode);
		}, 1000);
	}, time);
}

var controller = new Controller();
var muted = 0;
var started = false;

console.log(document.getElementById("controls__sound"));
document.getElementById("controls__sound").onclick = function(){
	if(!muted) {
		controller.mute();
		muted = 1;
	} else {
		controller.unmute();
		muted = 0;
	}
};

document.getElementById("controls__play").onclick = function(){
	if(!started) {
		started = true;
		controller.start();
		document.getElementById("controls__play").classList.add('playing');
	}
};
// controller.play();