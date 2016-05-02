var IDBHandler = function () {
	var dbName = "EventCalendar";

	return {
		init: function () {
			var IDBOpenDBRequest_AdatKapcs = window.indexedDB.open (dbName, 1);

            IDBOpenDBRequest_AdatKapcs.onupgradeneeded = function (evt) {
                console.log ("OnUpgradeNeeded");

                var IDBDatabase_db = evt.currentTarget.result;
                var IDBObjectStore_Events = IDBDatabase_db.createObjectStore ("Events", {keyPath: "Id", autoIncrement: true});
                IDBObjectStore_Events.createIndex ("eventTitleIndex", "title", {unique: false});
                IDBObjectStore_Events.createIndex ("eventIdIndex", "Id", {unique: false});
                IDBObjectStore_Events.createIndex ("eventStartedAtIndex", "startedAt", {unique: false});
            };
		},

		select: function (objStore, index,  data, callback) {
			var IDBOpenDBRequest_DBConnection = window.indexedDB.open (dbName, 1);

            IDBOpenDBRequest_DBConnection.onsuccess = function () {
                var IDBDatabase_db = this.result;
                
                var IDBTransaction_Tr1 = IDBDatabase_db.transaction (objStore, 'readonly');
                IDBTransaction_Tr1.oncomplete = function () {
                    console.log ("The transaction completed");
                    IDBDatabase_db.close ();
                };

                var IDBObjectStore_Tr = IDBTransaction_Tr1.objectStore (objStore);
                var IDBIndex_Index1 = IDBObjectStore_Tr.index (index);
                var IDBRequest_Req1;

                if (index == "eventIdIndex") {
                    IDBRequest_Req1 = IDBObjectStore_Tr.get(data);
                } else if (data !== '') {
                    IDBRequest_Req1 = IDBIndex_Index1.openCursor(IDBKeyRange.only(data));
                } else {
                    IDBRequest_Req1 = IDBIndex_Index1.openCursor ();
                } 

                IDBRequest_Req1.onsuccess = callback;


                IDBRequest_Req1.onerror = function () {
                	console.warn ("Hiba történt a kurzor megnyitásakor :-(");
                };
            };

            IDBOpenDBRequest_DBConnection.onerror = function () {
            	console.warn ("Hiba történt az adatbázis megnyitásakor :-(");
            };
		},

        insert: function(objStore, data, callback) {
            var IDBOpenDBRequest_DBConnection = window.indexedDB.open (dbName, 1);

            IDBOpenDBRequest_DBConnection.onsuccess = function () {
                var IDBDatabase_db = this.result;

                var IDBTransaction_Tr1 = IDBDatabase_db.transaction(objStore, "readwrite");
                IDBTransaction_Tr1.oncomplete = function () {
                    console.log("Sikerrel be lett szúrva az objektum, vége a tranzakciónak :-)");
                    IDBDatabase_db.close();
                };

                var IDBObjectStore_KategoriakTr = IDBTransaction_Tr1.objectStore(objStore);
                var IDBRequest_Breq1 = IDBObjectStore_KategoriakTr.add(data);

                IDBRequest_Breq1.onsuccess = callback;

                IDBRequest_Breq1.onerror = function () {
                    console.log("Sikertelen felvitele :-(");
                };
            };

            IDBOpenDBRequest_DBConnection.onerror = function () {
                console.warn ("Hiba történt az adatbázis megnyitásakor :-(");
            };
        },

        delete: function(objStore, data, callback) {
             var IDBOpenDBRequest_DBConnection = window.indexedDB.open (dbName, 1);

            IDBOpenDBRequest_DBConnection.onsuccess = function () {
                var IDBDatabase_db = this.result;

                var IDBTransaction_Tr1 = IDBDatabase_db.transaction(objStore, "readwrite");
                IDBTransaction_Tr1.oncomplete = function () {
                    console.log("Sikerrel be lett szúrva az objektum, vége a tranzakciónak :-)");
                    IDBDatabase_db.close();
                };

                var IDBObjectStore_Tr = IDBTransaction_Tr1.objectStore(objStore);
                var IDBRequest_Req1 = IDBObjectStore_Tr.delete(data);

                IDBRequest_Req1.onsuccess = callback;

                IDBRequest_Breq1.onerror = function () {
                    console.log("Sikertelen felvitele :-(");
                };
            };

            IDBOpenDBRequest_DBConnection.onerror = function () {
                console.warn ("Hiba történt az adatbázis megnyitásakor :-(");
            };
        }
	};
}();