'use strict'

var exporter = function() {
	var obj = document.querySelector('#export-data');
	var exported = ['Events\n'];
	var TYPES = ['Meeting', 'Phone call', 'SMS', 'E-mail', 'Other'];
	
	return {
		init: function() {
			var self = this;

			if (obj == null) {
				return;
			}

			obj.addEventListener('click', function (e) {
				e.preventDefault();

				IDBHandler.select("Events", 'eventStartedAtIndex', '', function(evt) {
		  			var IDBCursorWithValue_Cursor = evt.target.result;
		            if (IDBCursorWithValue_Cursor) {
		                exported.push(IDBCursorWithValue_Cursor.value.title + "," + TYPES[IDBCursorWithValue_Cursor.value.type] + "," + IDBCursorWithValue_Cursor.value.startedAt + "," + IDBCursorWithValue_Cursor.value.startedAtTime + "," + IDBCursorWithValue_Cursor.value.endedAtTime + "," + IDBCursorWithValue_Cursor.value.allday + "\n");
		                IDBCursorWithValue_Cursor.continue();
		            } else {
		            	
		                var sdcard = navigator.getDeviceStorage("sdcard");
		                var file = new Blob(exported, {type: "text/plain"});

		                var Request_Req = sdcard.addNamed(file, 'events.txt');
		                Request_Req.onsuccess = function () {
		                    console.log("Sikerült hozzáadni a fájlt az sd kártyához :-)");
		                };

		                Request_Req.onerror = function () {
		                    console.log("Nem sikerült hozzáadni a fájlt az sd kártyához :-(");
		                };
		            }
				});

			});
		}
	};
}();