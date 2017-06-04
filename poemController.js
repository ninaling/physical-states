class Controller{
	constructor(){
		this.timer = 0;
	}

	start(){
		var start = new Date().getTime();
		setInterval(function() {
		    var now = new Date().getTime();
		    console.log(now-start);
		}, 40);
	}
}

var controller = new Controller();
// controller.start();