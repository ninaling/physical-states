var timestamps = {
	5640: "iron",
	17660: "salt",
	28030: "metal",
	39240: "diamond",
	53820: "iron",
	59030: "metal",
	74660: "ice",
	106270: "mdma",
	112520: "water",
	124840: "title"
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

		this.audio.play();
		var start = new Date().getTime();
		for (var time in timestamps) {
			doSetTimeout(time, timestamps[time]);
			console.log("set timeout for "+timestamps[time]+" at "+time.toString());
		}
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
// controller.start();