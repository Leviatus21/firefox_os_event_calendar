var save_event = function() {
	var TYPE_PHONE_CALL = 1;
	var TYPE_SMS = 2;
	var TYPE_EMAIL = 3;

	return {
		init: function () {
			var self = this;

			if (document.getElementById('new_event') == null) {
				return;
			}

			document.getElementById('new_event').addEventListener('submit', function (e) {
				e.preventDefault();
				var form_data = {};

				for (var i = 0; i < e.target.elements.length; i++) {
					if (e.target.elements[i].getAttribute('type') == "checkbox") {
						form_data[e.target.elements[i].getAttribute('name')] = e.target.elements[i].checked;
					} else {
						form_data[e.target.elements[i].getAttribute('name')] = e.target.elements[i].value;
					}
				}

				if (form_data.notify != 'none') {
					var timestamp = Math.floor(moment(form_data.startedAt + ' ' + form_data.startedAtTime)) + parseInt(form_data.notify);
					self.createNotify(timestamp, form_data);
				}

				self.saveEvent(form_data);
			});
		},

		createNotify: function (timestamp, form_data) {
			var request = navigator.mozAlarms.add(timestamp, "ignoreTimezone", {
				body: form_data.note,
				title: form_data.title,
				type: form_data.type
			});

			request.onsuccess = function () {
				alarmId = this.result;
				console.log('Created new Alarm: ' + this.result);
			}

			navigator.mozSetMessageHandler('alarm', function (alarm) {
				var notification = new Notification(alarm.data.title, {body: alarm.data.body});
				navigator.mozAlarms.remove(alarm.id);
				
				notification.onclick = function () {
					if (alarm.data.type == TYPE_PHONE_CALL) {
						var call = new MozActivity({
						    name: "dial",
						    data: {
						        number: ""
						    }
						});
					} else if (alarm.data.type == TYPE_SMS) {
						new MozActivity({
							name: "new",
							data: {
								type: "websms/sms",
								number: "+36"
							}
						});
					} else if (alarm.data.type == TYPE_EMAIL) {
						new MozActivity({
							name: "new",
							data: {
								type: "mail"
							}
						});
					}

					notification.close();
				};
			});
		},

		saveEvent: function (form_data) {
			IDBHandler.insert('Events', form_data, function () {
				document.location.href = 'index.html';
				console.log('A feltöltés sikeres!');
			});
		}
	};
}();