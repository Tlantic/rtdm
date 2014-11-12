var map,
	mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(-30.060860, -51.170947),
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	},
	markers = [],
	orders2deliver = [];

function refreshDashboard() {
	console.log("Atualizando dashboard...");
	$.getJSON("/tasks/list/all")
	.done(function(data){
		if (data.ok) {
			$("#fake-gps .btn-success").removeClass("btn-success");
			$.each(data.result, function(i,v){
				if (v.lastUpdate) {
					var newLatLng = new google.maps.LatLng(v.lastUpdate.lat,v.lastUpdate.lon);
					if (markers[v._id]) {
						markers[v._id].setPosition(newLatLng);
					} else {
						markers[v._id] = new google.maps.Marker({
							position: newLatLng,
							icon: "/studio/assets/pins/motorbike.png",
							map: map
						});
					}
					if (v.startedAt && orders2deliver[v._id]) {
						orders2deliver[v._id].setIcon("/studio/assets/pins/home-green.png");
						$("#orders2deliver ticket-label "+vv._id).removeClass("label-info").addClass("label-primary").text("Em rota");;
					} else {
						//
					};
				}
			});
		}
	});
}

init.push(function () {
	map = new google.maps.Map(document.getElementById('delivery-map'), mapOptions);

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
								icon: "/studio/assets/pins/home-blue.png",
								title: vv.address
							});
							// orders2deliver.push({
							// 						task: vv,
							// 						taskLatLng: taskLatLng,
							// 						marker: new google.maps.Marker({
							// 								position: taskLatLng,
							// 								map: map,
							// 								animation: google.maps.Animation.DROP,
							// 								icon: "/studio/assets/pins/home-blue.png",
							// 								title: vv.address
							// 						})
							// 					});
							$t1 = $("<span>").addClass("label label-info ticket-label").text("Expedição");
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

	$("#fake-gps button").click(function(e){
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
}); // init.push
