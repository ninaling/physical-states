self.addEventListener('message', function(e){
	var data = e.data;

	self.postMessage({
		type: 'results',
		data:{
			num: data
		}
	});
})