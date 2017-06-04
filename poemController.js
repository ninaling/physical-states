var timestamps = {
	5000: 'water',
	10000: 'ice',
	15000: 'mdma'
};

class Controller{
	constructor(){
		this.timer = 0;
	}

	start(){
		var start = new Date().getTime();
		// setInterval(function() {
		//     var now = new Date().getTime();
		// }, 100);
		for (var time in timestamps) {
			setTimeout(function(){
				World.changeScene(timestamps[time]);
			}, time);
		}
	}
}

var controller = new Controller();
controller.start();
