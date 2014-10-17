// Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

window.get_product_list = function() {
	$(".more-btn .btn").click(function() {
		window.get_product_list()
	});

	//prepare translation fix
	messages_trans = {'product list not initialized (no start)':"产品列表未准备好",'No products found':"无产品记录",'Nothing more to show':"没有记录"};
	$.extend(frappe._messages, messages_trans);


	if(window.start==undefined) {
		throw __("product list not initialized (no start)");
	}

	$.ajax({
		method: "GET",
		url: "/",
		dataType: "json",
		data: {
			cmd: "erpnext.templates.pages.product_search.get_product_list",
			start: window.start,
			search: window.search,
			product_group: window.product_group
		},
		dataType: "json",
		success: function(data) {
			window.render_product_list(data.message);
		}
	})
}

window.render_product_list = function(data) {
	if(data.length) {
		var table = $("#search-list .table");
		if(!table.length)
			var table = $("<table class='table'>").appendTo("#search-list");

		$.each(data, function(i, d) {
			$(d).appendTo(table);
		});
	}
	if(data.length < 10) {
		if(!table) {
			$(".more-btn")
				.replaceWith("<div class='alert alert-warning'>" + __("No products found") + ".</div>");
		} else {
			$(".more-btn")
				.replaceWith("<div class='text-muted'>" + __("Nothing more to show") + ".</div>");
		}
	} else {
		$(".more-btn").toggle(true)
	}
	window.start += (data.length || 0);
}
