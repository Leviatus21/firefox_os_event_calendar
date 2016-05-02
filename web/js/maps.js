var maps = function() {
	return {
		init: function () {
			if (document.getElementById('type-select') == null) {
				return;
			}

			document.getElementById('type-select').addEventListener('change', function (e) {
				var whereWrapper = document.getElementById('type-select-where-wrapper');

				if (e.target.value == 0) {
					whereWrapper.style.display = '';
				} else {
					whereWrapper.style.display = 'none';
				}
			});

			if (
				typeof google === 'object' &&
				typeof google.maps === 'object'
			) {

				document.getElementById('where_show_map').addEventListener('click', function () {
					var location = document.getElementById('where').value;

					var request = new XMLHttpRequest();
					request.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location, true);
					request.onload = function() {
						if (request.status >= 200 && request.status < 400) {
							// Success!
							var response = JSON.parse(request.responseText);
							var loc = response.results[0].geometry.location;
							var map = document.getElementById('map');
							map.style.height = '250px';

							var googlemap = new google.maps.Map(map, {
								center: {lat: loc.lat, lng: loc.lng},
								zoom: 11
							});

							var beachMarker = new google.maps.Marker({
								position: {lat: loc.lat, lng: loc.lng},
								map: googlemap
							});
						}
					};

					request.onerror = function(e) {
						console.warn(e);
					};

					request.send();
				});
			} else {
				document.getElementById('where_show_map').style.display = 'none';
				document.getElementById('where').style.width = "100%";
			}
		},
	};
}();