var pager = function() {
	var _paging = function (id) {
		var pages = document.querySelectorAll('.js-page');
		for (var i = 0; i < pages.length; i++) {
			if (pages[i].getAttribute('id') == id) {
				pages[i].style.display = "";
				continue;
			}

			pages[i].style.display = "none";

		}
	};

	return {
		init: function () {
			var self = this;

			_paging('index');

			Array.prototype.forEach.call(
				document.querySelectorAll('.js-pager'),
				function (el) {
					el.addEventListener('click', function (e) {
						e.preventDefault();
						var id = e.currentTarget.getAttribute('data-href');
						_paging(id);
					});
				}
			);
		},

		pageing: function (id) {
			_paging(id);
		}
	};
}();