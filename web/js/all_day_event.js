var all_day_event = function () {

	var toggleAllDayEvent = function (checked) {
		if (document.getElementById('allday').checked) {
			document.getElementById('startedAt').style.width = '';
			document.getElementById('startedAtTime').style.display = 'none';
			document.getElementById('endedAtTime').style.display = 'none';
		}

		if (!document.getElementById('allday').checked) {
			document.getElementById('startedAt').style.width = '58%';
			document.getElementById('startedAtTime').style.display = '';
			document.getElementById('endedAtTime').style.display = '';
		}
	}

	return {
		init: function () {
			if (document.getElementById('allday') == null) {
				return;
			}

			document.getElementById('allday').addEventListener('change', function () {
				toggleAllDayEvent();
			});
		}
	};
}();