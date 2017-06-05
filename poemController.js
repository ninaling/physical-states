var timestamps = {
	3000: "iron",
	6000: "water",
	9000: "mdma"
};

class Controller{
	constructor(){
		this.timer = 0;
	}

	start(){
		var start = new Date().getTime();
		for (var time in timestamps) {
			doSetTimeout(time, timestamps[time]);
			console.log("set timeout for "+timestamps[time]+" at "+time.toString());
		}
	}
}

function doSetTimeout(time, mode) {
	setTimeout(function(){
		distortTitleBackground();//need to change function to distort any background, not just title
		World.titleIconObjects[mode].spinWildly();
		setTimeout(function(){
			World.changeScene(mode);
		}, 1000);
	}, time);
}

var controller = new Controller();
controller.start();