// clear markers from map
function removeMarkers(){
	for(i=0; i<markers.length; i++){
		markers[i].setMap(null);
	}
}
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
	var ref = new Firebase("https://fiery-fire-3549.firebaseio.com/");

	$(document).ready(function() {
		// get title from user input
		$("#title-form").submit(function(evt){
			evt.preventDefault();
			removeMarkers();
			$("#movie-info").empty();
			var title = $("#title").val(); 
			var title2 = toTitleCase(title)// pull in movie title
// street view setup


// The following loops through all movie objects with the specified movie title in firebase
// and makes markers at each lat lon and drops them onto the map
			ref.child("transformed-data3")
				.orderByChild("movieName")
				.equalTo(title2).on("child_added", function(snap) {
					var value = snap.val();
					var lat = value.lat;
					var lon = value.lon;
					console.log(lat + " "+lon)
					var myLatlng = new google.maps.LatLng(lat, lon);
					// var sv = new google.maps.StreetViewService();

							marker = new google.maps.Marker({
							position: myLatlng,
							map: map,
							clickable: true,
							title: lat +" " + lon
					});

					// location name pop up when click on marker

					marker.info = new google.maps.InfoWindow({
						content: value.locationName
					});
					google.maps.event.addListener(marker, 'click', function() {
						this.info.open(map, this);


					});


					// push markers into array so can clear them later
					markers.push(marker);
// add movie info to div...another query outside for loop?
				$("#movie-info").html(
'<div class="row">'
+'<div class="panel" style="background-color:#1a1917; color:white; border:none">'
+		'<h3 style="color:white">'+ title + '</h3>'
+		'<p style="color:white">' + value.year + '</p>'
+		'<p style="color:white">' + value.director + '</p>'
+		'<div><img src="' + value.imgLink + '"></div>'


+	'</div>'
+ '</div>');

					// $("#movie-info").html(title);
					// $("#movie-info").html(value.year);
					// +"</ul><ul>"+value.director+"</ul></li>");
				});

		});

});
