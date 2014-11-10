var map;
var markers = [];

init.push(function () {
	map = new google.maps.Map(document.getElementById('delivery-map'), {
		zoom: 16,
		center: new google.maps.LatLng(-30.060860, -51.170947),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	$.getJSON("/users/list/all")
	.done(function(data){
		if (data.ok) {
			$.each(data.result, function(i,v){
				$.getJSON("/tasksByOwner/"+v._id)
				.done(function(data){
					if (data.ok) {
						$.each(data.result, function(ii,vv){
							$t1 = $("<span>").addClass("label label-info ticket-label").text("Em rota");
							$t2 = $("<a>").addClass("ticket-title").attr("href","#").html(vv.address+"<span>[Pedido #NNN]</span>").click(function(){
								//
								console.debug("Click ticket-title");
								return false;
							});
							$t3 = $("<span>").addClass("ticket-info").html('Cliente <a href="#">Nome Cliente</a>');
							$("<div>")
							.addClass("ticket")
							.append($t1)
							.append($t2)
							.append($t3)
							.appendTo("#orders2deliver");
						});
						console.debug(data);
					} else {
						console.log("NOK GET /tasksByOwner", v._id);
					}
				});
			})
		} else {
			console.log("NOK GET /users/list/all");
		}
	});
})
