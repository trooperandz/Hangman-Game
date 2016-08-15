/* CODE FOR TIMER.  STILL GETTING IT TO WORK */

var timer = {
	// Create a new Date object
	var newDate: new Date(),
	// Set the time to 22 minutes from now (game play time)
	var endTime: this.newDate.setTime(inDate.getTime() + inMinutes * 60000),

	initializeClock: function(id, endTime) {
		var clock = document.getElementById(id);
		var minutesSpan = clock.querySelector('.minutes');
		var secondsSpan = clock.querySelector('.seconds');

		function updateClock() {
			var t = getTimeRemaining(endTime);
    			minutesSpan.innerHTML = t.minutes;
    			secondsSpan.innerHTML = t.seconds;
			if(t.total <= 0) {
				clearInterval(timeInterval);
			}
		}

		updateClock();

		var timeInterval = setInterval(updateClock, 1000);

		var timeInterval = setInterval(function() {
			var t = getTimeRemaining(endTime);
			clock.innerHTML = 'minutes: ' + t.minutes + '<br>' +
							  'seconds: ' + t.seconds;
			if(t.total <= 0) {
				clearInterval(timeInterval);
			}
		}, 1000);
	},

	getTimeRemaining: function(endTime) {
		var t = Date.parse(endTime) - Date.parse(new Date());
		var seconds = Math.floor((t/1000) % 60);
		var minutes = Math.floor((t/1000/60) % 60);

		return {
			'total': t,
			'minutes' : minutes,
			'seconds' : seconds
		};
	}
}

			initializeClock('timer', timer.endTime);