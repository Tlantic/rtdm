var map,
	mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(-30.060860, -51.170947),
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	},
	markers = [],
	orders2deliver = [];
	// Cor 5BC0DE expedição
	// Azul Panvel 1C2574

function refreshDashboard() {
	$("#map-refresh-status").text("Atualizando...").removeClass("badge-default").addClass("badge-warning");
	$.getJSON("/tasks/list/all")
	.done(function(data){
		if (data.ok) {
			$("#fake-gps .btn-success").removeClass("btn-success");
			$("#reset-tasks").removeClass("btn-success");
			$.each(data.result, function(i,v){
				if (v.lastUpdate) {
					var newLatLng = new google.maps.LatLng(v.lastUpdate.lat,v.lastUpdate.lon);

					if (markers[v._id]) {
						markers[v._id].setPosition(newLatLng);
					} else {
						markers[v._id] = new google.maps.Marker({
							position: newLatLng,
							icon: "/backoffice/assets/pins/motorbike-default.png",
							map: map
						});
					}
					if (v.startedAt && orders2deliver[v._id]) {
						orders2deliver[v._id].setIcon("/backoffice/assets/pins/home-green.png");
						$("#orders2deliver ."+v._id).find("span.ticket-label").removeClass("label-default").addClass("label-success").text("Em rota");;
					} else {
						orders2deliver[v._id].setIcon("/backoffice/assets/pins/home-blue.png");
					}
				}
			});
			$("#map-refresh-status").text("Atualizado").removeClass("badge-warning").addClass("badge-success");
		}
	});
}

init.push(function () {
	map = new google.maps.Map(document.getElementById('delivery-map'), mapOptions);
	new google.maps.Marker({
			position: new google.maps.LatLng(-30.102255, -51.231373), // Av. Otto Niemeyer, 2955 ... -30.102255, -51.231373
			map: map,
			icon: "/backoffice/assets/pins/panvel.png"
	});
	new google.maps.Marker({
			position: new google.maps.LatLng(-30.026863, -51.190117), // R. Anita Garibaldi, 600 ... -30.026863, -51.190117
			map: map,
			icon: "/backoffice/assets/pins/panvel.png"
	});

	$.getJSON("/users/list/all")
	.done(function(data){
		if (data.ok) {
			$.each(data.result, function(i,v){
				$.getJSON("/tasksByOwner/"+v._id)
				.done(function(data){
					if (data.ok) {
						$.each(data.result, function(ii,vv){
							var taskLatLng = new google.maps.LatLng(vv.coords.lat,vv.coords.lon);
							orders2deliver[vv._id] = new google.maps.Marker({
								position: taskLatLng,
								map: map,
								animation: google.maps.Animation.DROP,
								icon: "/backoffice/assets/pins/home-blue.png"
							});

							var $content = $("<div>")
								.append( $("<div>").append($("<strong>").text(vv.description)) )
								.append( $("<div>").text(vv.address) )
								.append( $("<div>").html('EST: <span class="label label-success" title="Estimativa de entrega">HH:MM</span><br>LIM: <span class="label label-primary" title="Horário limite">HH:MM</span>') );
							var infowindow = new google.maps.InfoWindow({
								content: $content.html(),
								maxWidth: 300
							});

							google.maps.event.addListener(orders2deliver[vv._id], 'click', function() {
								infowindow.open(map,orders2deliver[vv._id]);
							});

							$t1 = $("<span>").addClass("label label-default ticket-label").text("Expedido");
							$t2 = $("<a>").addClass("ticket-title").attr("href","#").text(vv.address).click(function(){
								map.panTo(taskLatLng);
								return false;
							})
							.append( $("<span>").text("[Pedido #"+ii+"]") );
							$t3 = $("<span>").addClass("ticket-info").html('Cliente <a href="#">'+vv.description+'</a>');
							$("<div>")
							.addClass("ticket")
							.addClass(vv._id)
							.append($t1)
							.append($t2)
							.append($t3)
							.appendTo("#orders2deliver");
						});
					} else {
						console.log("NOK GET /tasksByOwner", v._id);
					}
				});
			})
		} else {
			console.log("NOK GET /users/list/all");
		}
	});

	setInterval(refreshDashboard, 5000);

	$("#fake-gps a.fake-coord").click(function(e){
		var $t = $(e.target);
		$t.removeClass("btn-success").removeClass("btn-danger").addClass("btn-warning");
		var data = {
				lastCoords: {
					lat: $t.data("lat"),
					lon: $t.data("lng")
				}
			};

		$.post("/tasks/"+$t.data("taskid"), data)
		.done(function(){
			$t.removeClass("btn-warning").addClass("btn-success");
		})
		.fail(function(){
			$t.removeClass("btn-warning").addClass("btn-danger");
		});
	});

	$("#reset-tasks").click(function(e){
		var $t = $(e.target);
		$t.removeClass("btn-success").removeClass("btn-danger").addClass("btn-warning");

		$.getJSON("/tasks/reset/all")
		.done(function(){
			$t.removeClass("btn-warning").addClass("btn-success");
			$("#orders2deliver span.ticket-label").addClass("label-default").removeClass("label-success").text("Expedido");
			$.each(orders2deliver, function(i,v){
				v.setIcon("/backoffice/assets/pins/home-blue.png");
			});
		})
		.fail(function(){
			$t.removeClass("btn-warning").addClass("btn-danger");
		});
	});

}); // init.push
