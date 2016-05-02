'use strict'

var details = function() {
	var obj = document.querySelector('.js-details');
	var TYPES = ['Meeting', 'Phone call', 'SMS', 'E-mail', 'Other'];
	
	return {
		init: function() {
			var self = this;
			
			if (obj == null) {
				return;
			}

			var id = parseInt(document.location.hash.substring(1));
			IDBHandler.select("Events", 'eventIdIndex', id, function(evt) {
				var IDBValue = evt.target.result;
				self.showData(IDBValue);
			});

			document.addEventListener('click', function (e) {
				if (e.target == document.querySelector('#delete')) {
					e.preventDefault();
					if (confirm("Are you sure you want to delete?")) {
						IDBHandler.delete('Events', id, function () {
							window.location.href = 'index.html';
						});
					}
				}
			});
		},

		showData: function(data) {
			var title = obj.querySelector('.js-details__title');
			var body = obj.querySelector('.js-details__body');
			
			title.innerHTML = data.title;

			var bodyContent = '<div> <b>Type:</b> ' + TYPES[data.type] + '</div>';
			
			if (data.where != '') {
				bodyContent += '<div> <b>Where:</b> ' + data.where + '</div>';
			}

			if (!data.allday) {
				bodyContent += '<h3>Event start: </h3> ' + moment(data.startedAt + ' ' + data.startedAtTime).format('YYYY-MM-DD HH:mm:ss');
				bodyContent += '<h3>Event end: </h3> ' + moment(data.startedAt + ' ' + data.endedAtTime).format('YYYY-MM-DD HH:mm:ss');
			} else {
				bodyContent += '<h3>Event start: </h3> ' + moment(data.startedAt).format('YYYY-MM-DD');
			}
			
			bodyContent += '<h3>Note: </h3>';
			bodyContent += '<p>' + data.note + '</p>';
			bodyContent += '<button id="delete" type="button" class="danger">Delete</button>';

			body.innerHTML = bodyContent;
		}
	};
}();