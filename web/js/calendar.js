'use strict'

var calendar = function() {
	var now = moment(),
		today = moment(),
		obj = document.querySelector('.js-calendar')
	;

	return {
		init: function() {
			var self = this;
			
			if (obj == null) {
				return;
			}

			this.writeDate();
			this.loadEvents(today);
			this.addCurrentTimeLine();

			obj.querySelector('.js-calendar__prev').addEventListener('click', function () {
				now.add(-1, 'days');
				self.writeDate();
				self.loadEvents(now);

				if (today.diff(now, 'days') == 0) {
					self.addCurrentTimeLine();
				}
			});

			obj.querySelector('.js-calendar__next').addEventListener('click', function () {
				now.add(1, 'days');
				self.writeDate();
				self.loadEvents(now);

				if (today.diff(now, 'days') == 0) {
					self.addCurrentTimeLine();
				}
			});
		},

		writeDate: function () {
			obj.querySelector('.js-calendar__now').innerHTML = now.format('YYYY MMMM DD');
		},

		loadEvents: function (date) {
			var self = this;
			var events = obj.querySelector('.js-calendar__events');
			events.innerHTML = '';

			IDBHandler.select("Events", 'eventStartedAtIndex', date.format('YYYY-MM-DD'), function(evt) {
				var IDBCursorWithValue_cursor = evt.target.result;

				if (IDBCursorWithValue_cursor) {
					self.createNewEvent(IDBCursorWithValue_cursor.value);
					// console.log(IDBCursorWithValue_cursor.value);
		            IDBCursorWithValue_cursor.continue();
		        } else {
		        	self.setWidthAllEvent();
		        }
			});
		},

		createNewEvent: function (data) {
			var events = obj.querySelector('.js-calendar__events');

			var link = document.createElement('A');
			var html = '<h2>' + data.title + '</h2>';

			link.innerHTML = html;
			link.setAttribute('href', 'event_details.html#' + data.Id);
			link.className = 'days__events';

			if (!data.allday) {
				// Calculate height and position
				var startedAt = moment(data.startedAt + ' ' + data.startedAtTime);
				var endedAt = moment(data.startedAt + ' ' + data.endedAtTime);

				var diffHour = endedAt.diff(startedAt, 'hour');
				var diffMinute = endedAt.diff(startedAt, 'minute') - diffHour * 60;

				link.style.top = startedAt.hours() * 50 + startedAt.minutes() / 60 * 50 + 'px';
				
				var nHeight =  diffHour * 50 + diffMinute / 60 * 50;
				if (nHeight < 21) {
					nHeight = 21;
				}

				link.style.height = nHeight + 'px';

			} else {
				link.style.top = 0;
				link.style.height = 24 * 50 + 'px';
			}

			events.appendChild(link);
		},

		setWidthAllEvent: function () {
			var events = obj.querySelector('.js-calendar__events');
			var links = events.querySelectorAll('a');
			var eventsCountPerHour = [];

			for (var i = 0; i < links.length-1; i++) {
				var column = [];
				column.push(i);
				for (var j = i+1; j < links.length; j++) {
					if (this.splitIfNesserry(links[i], links[j])) {
						column.push(j);
					}
				}
				
				eventsCountPerHour.push(column);
			}

			for (var i = 0; i < eventsCountPerHour.length; i++) {
				var len = eventsCountPerHour[i].length;
				for (var j = 0; j < len; j++) {
					var index = eventsCountPerHour[i];
					if (!links[index[j]].style.width) {
						links[index[j]].style.width = 100/len + '%';
						links[index[j]].style.left = j * (100/len) + '%';
					}
				}
			}

		},

		splitIfNesserry: function (linkOne, linkTwo) {
			var t1 = parseInt(linkOne.style.top);
			var h1 = parseInt(linkOne.style.height);
			var t2 = parseInt(linkTwo.style.top);
			var h2 = parseInt(linkTwo.style.height);

			if (
				(
					t1 <= t2 &&
					(t1 + h1) <= (t2 + h2) &&
					(t1 + h1) >= t2
				) ||
				(
					t2 <= t1 &&
					(t2 + h2) <= (t1 + h1) &&
					(t2 + h2) >= t1
				) || 
				(
					t2 < t1 &&
					(t2 + h2) > (t1 + h1)
				) || 
				(
					t1 < t2 &&
					(t1 + h1) > (t2 + h2)
				)
			) {
				return true;
			}

			return false;
		},

		addCurrentTimeLine: function () {
			var events = obj.querySelector('.js-calendar__events');
			var span = document.createElement('SPAN');
			span.className = 'js-calendar__current-time days__current-time';

			var now = moment();
			span.style.top = now.hours() * 50 + now.minutes() / 60 * 50 + 'px';

			events.appendChild(span);
		}
	};
}();